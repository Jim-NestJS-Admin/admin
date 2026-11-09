<script setup lang="ts">
import {
  computed,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
  watch
} from "vue";
import { useI18n } from "vue-i18n";
import { ElMessage } from "element-plus";
import type { TreeInstance } from "element-plus";
import CrudPage from "@/components/Crud/CrudPage.vue";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import SearchIcon from "~icons/ri/search-line";
import AddIcon from "~icons/ri/add-circle-line";
import KeyIcon from "~icons/ri/key-2-line";
import AllIcon from "~icons/ri/apps-line";
import TreeRefreshIcon from "~icons/ri/refresh-line";
import { defaultCell } from "@/components/Crud/model.mjs";
import type { CrudCell, CrudRecord } from "@/components/Crud/types";
import { api, type OperationBody } from "@/api/client";
import { PERMISSIONS, ENUMS } from "@/api/constants";
import {
  resources,
  permission,
  type SystemResource
} from "@/platform/system/resources";
import { useUserStoreHook } from "@/store/modules/user";
import { onSessionReset } from "@/platform/lifecycle";
import { RequestFailure } from "@/utils/http";
import { failureView } from "@/platform/failure-view.mjs";

const props = defineProps<{ resource: SystemResource }>();
const { t } = useI18n();
const user = useUserStoreHook();
const definition = computed(() => resources[props.resource]);
type Option = {
  id: string;
  label: string;
  disabled?: boolean;
  version?: number;
  parentId?: string | null;
};
const users = ref<Option[]>([]),
  roles = ref<Option[]>([]),
  orgs = ref<Option[]>([]),
  menus = ref<Option[]>([]),
  dictionaries = ref<Option[]>([]);
const loadError = ref("");
const treeSearch = ref("");
const treeRef = ref<TreeInstance>();
/** 左侧树当前选中的节点；空表示全部 */
const treeSelected = ref("");
const treeFields: Partial<Record<SystemResource, string>> = {
  user: "defaultOrgId",
  "user-role": "scopeOrgId",
  "dict-item": "typeId"
};
const treeField = computed(() => treeFields[props.resource] ?? "");
type TreeNode = { id: string; label: string; children: TreeNode[] };
const treeNodes = computed(() => {
  const items =
    props.resource === "menu"
      ? menus.value
      : props.resource === "dict-item"
        ? dictionaries.value
        : orgs.value;
  const map = new Map(
    items.map(item => [
      item.id,
      { id: item.id, label: item.label, children: [] as TreeNode[] }
    ])
  );
  const roots: TreeNode[] = [];
  for (const item of items) {
    const node = map.get(item.id)!;
    const parent = item.parentId ? map.get(item.parentId) : undefined;
    if (parent && parent !== node) parent.children.push(node);
    else roots.push(node);
  }
  return roots;
});
watch(treeSearch, value => treeRef.value?.filter(value));
const dialog = ref<"create" | "reset" | "">("");
const busy = ref(false),
  error = ref("");
const form = reactive<OperationBody<"systemUserCreate">>({
  username: "",
  nickname: "",
  password: "",
  enabled: true,
  defaultOrgId: null
});
const reset = reactive({ id: "", password: "" });
let reloadList: (() => Promise<void>) | undefined;
const requests = new Set<AbortController>();
const can = (code: string) => !!code && user.permissions.includes(code);
const permissionOptions = computed(() =>
  PERMISSIONS.filter(code => user.permissions.includes(code))
);
const scopeOptions =
  ENUMS["components.schemas.SystemRoleAddData.properties.dataScope"];
const menuTypes = ENUMS["components.schemas.SystemMenuAddData.properties.type"];
const options = (rows: CrudRecord[], fields: string[]): Option[] =>
  rows.flatMap(row =>
    typeof row.id !== "string"
      ? []
      : [
          {
            id: row.id,
            label:
              fields
                .map(field => row[field])
                .filter(value => typeof value === "string" && value)
                .join(" · ") || row.id,
            disabled: row.enabled === false,
            version: typeof row.version === "number" ? row.version : undefined,
            parentId: typeof row.parentId === "string" ? row.parentId : null
          }
        ]
  );
async function lookup(
  load: (signal: AbortSignal) => Promise<CrudRecord[]>,
  target: typeof users,
  fields: string[]
) {
  const controller = new AbortController();
  requests.add(controller);
  const epoch = user.epoch;
  try {
    const rows = await load(controller.signal);
    if (!controller.signal.aborted && epoch === user.epoch)
      target.value = options(rows, fields);
  } catch {
    if (!controller.signal.aborted) loadError.value = t("system.lookupFailed");
  } finally {
    requests.delete(controller);
  }
}
async function allRecords(
  resource: SystemResource,
  signal: AbortSignal
): Promise<CrudRecord[]> {
  const rows: CrudRecord[] = [];
  for (let page = 1; page <= 20; page++) {
    const result = await resources[resource].port.list(
      {
        pageNumber: page,
        pageSize: 500,
        search: "",
        sorting: [],
        equality: {}
      },
      signal
    );
    rows.push(...result.rows);
    if (rows.length >= result.totalRows) return rows;
    if (!result.rows.length) break;
  }
  throw new Error("关联选项过多或分页不完整");
}
async function loadOptions() {
  loadError.value = "";
  const tasks: Promise<void>[] = [];
  if (
    can(permission("systemUserPage")) &&
    ["user", "user-role", "user-supervisor"].includes(props.resource)
  )
    tasks.push(
      lookup(signal => allRecords("user", signal), users, [
        "nickname",
        "username"
      ])
    );
  if (can(permission("systemRolePage")) && props.resource === "user-role")
    tasks.push(lookup(signal => allRecords("role", signal), roles, ["name"]));
  if (
    can(permission("systemOrgPage")) &&
    ["user", "org", "role", "user-role"].includes(props.resource)
  )
    tasks.push(lookup(signal => allRecords("org", signal), orgs, ["name"]));
  else
    orgs.value = user.organizations.map(org => ({
      id: org.id,
      label: org.path.join(" / ") || org.name
    }));
  if (can(permission("systemMenuPage")) && props.resource === "menu")
    tasks.push(lookup(signal => allRecords("menu", signal), menus, ["title"]));
  if (can(permission("systemDictTypePage")) && props.resource === "dict-item")
    tasks.push(
      lookup(signal => allRecords("dict-type", signal), dictionaries, [
        "name",
        "code"
      ])
    );
  await Promise.all(tasks);
}
const stop = onSessionReset(() => {
  requests.forEach(request => request.abort());
  requests.clear();
  users.value = [];
  roles.value = [];
  orgs.value = [];
  menus.value = [];
  dictionaries.value = [];
  dialog.value = "";
  form.password = "";
  reset.password = "";
});
onBeforeUnmount(() => {
  stop();
  requests.forEach(request => request.abort());
  form.password = "";
  reset.password = "";
});
onMounted(loadOptions);
function openDialog(mode: "create" | "reset", reload: () => Promise<void>) {
  reloadList = reload;
  error.value = "";
  dialog.value = mode;
  Object.assign(form, {
    username: "",
    nickname: "",
    password: "",
    enabled: true,
    defaultOrgId: user.organizationId || null
  });
  Object.assign(reset, { id: "", password: "" });
  void loadOptions();
}
async function submit() {
  if (busy.value) return;
  const controller = new AbortController();
  requests.add(controller);
  const epoch = user.epoch;
  busy.value = true;
  error.value = "";
  try {
    if (dialog.value === "create")
      await api.systemUserCreate(
        { body: { ...form } },
        {
          signal: controller.signal,
          headers: { "Idempotency-Key": crypto.randomUUID() }
        }
      );
    else {
      const selected = users.value.find(item => item.id === reset.id);
      if (!selected?.version) {
        error.value = t("system.chooseUser");
        return;
      }
      await api.systemUserResetPassword(
        {
          body: {
            id: selected.id,
            version: selected.version,
            password: reset.password
          }
        },
        {
          signal: controller.signal,
          headers: { "Idempotency-Key": crypto.randomUUID() }
        }
      );
    }
    if (controller.signal.aborted || epoch !== user.epoch) return;
    dialog.value = "";
    form.password = "";
    reset.password = "";
    ElMessage.success(t("system.saved"));
    await reloadList?.();
    await loadOptions();
  } catch (reason) {
    if (!controller.signal.aborted && epoch === user.epoch) {
      const view = failureView(
        reason instanceof RequestFailure ? reason.failure : null
      );
      error.value = view.message.startsWith("admin.")
        ? t(view.message)
        : view.message;
    }
  } finally {
    requests.delete(controller);
    busy.value = false;
  }
}
function selection(field: string): Option[] {
  if (field === "userId" || field === "supervisorId") return users.value;
  if (field === "roleId") return roles.value;
  if (field === "typeId") return dictionaries.value;
  if (field === "parentId" && props.resource === "menu") return menus.value;
  return orgs.value;
}
const referenceFields = [
  "parentId",
  "defaultOrgId",
  "scopeOrgId",
  "userId",
  "roleId",
  "supervisorId",
  "typeId"
];
function fieldValue(values: CrudRecord, field: string): string | undefined {
  if (field === "scopeOrgId")
    return values[field] === null
      ? "__global__"
      : ((values[field] as string | undefined) ?? user.organizationId);
  return values[field] as string | undefined;
}
function changeReference(values: CrudRecord, field: string, value: unknown) {
  values[field] =
    value === "__global__" || value === "" || value === undefined
      ? null
      : value;
}
function cell(row: CrudRecord, field: string): CrudCell {
  const value = defaultCell(row, field);
  if (value.state !== "visible") return value;
  if (referenceFields.includes(field)) {
    if (field === "scopeOrgId" && row[field] === null)
      return { ...value, display: t("system.globalScope") };
    const item = selection(field).find(item => item.id === row[field]);
    if (item) return { ...value, display: item.label };
  }
  return value;
}
</script>
<template>
  <div class="system-resource">
    <el-alert
      v-if="loadError"
      :title="loadError"
      type="warning"
      :closable="false"
    />
    <CrudPage
      :key="resource"
      :port="definition.port"
      :page-key="`system/${resource}`"
      :permissions="definition.permissions"
      :cell="cell"
    >
      <template v-if="treeField" #tree="{ filter }">
        <!-- 左侧树（参考 xinliwei）：标题 + 全部 / 刷新，搜索框，树 -->
        <aside class="side">
          <div class="side-header">
            <span class="side-title">{{
              t(
                resource === "user"
                  ? "system.filterDefaultOrg"
                  : resource === "user-role"
                    ? "system.filterScope"
                    : resource === "dict-item"
                      ? "system.filterDictionary"
                      : "system.filterChildren"
              )
            }}</span>
            <div class="side-actions">
              <el-tooltip :content="t('system.showAll')" placement="top">
                <el-button
                  link
                  :type="treeSelected ? 'default' : 'primary'"
                  :icon="useRenderIcon(AllIcon)"
                  :aria-label="t('system.showAll')"
                  @click="
                    () => {
                      treeSelected = '';
                      treeRef?.setCurrentKey(undefined);
                      filter(treeField, undefined);
                    }
                  "
                />
              </el-tooltip>
              <el-tooltip :content="t('system.refreshTree')" placement="top">
                <el-button
                  link
                  type="primary"
                  :icon="useRenderIcon(TreeRefreshIcon)"
                  :aria-label="t('system.refreshTree')"
                  @click="loadOptions"
                />
              </el-tooltip>
            </div>
          </div>
          <div class="side-search">
            <el-input
              v-model="treeSearch"
              :placeholder="t('crud.search')"
              :prefix-icon="useRenderIcon(SearchIcon)"
              clearable
            />
          </div>
          <el-scrollbar class="side-tree">
            <el-tree
              ref="treeRef"
              :data="treeNodes"
              node-key="id"
              default-expand-all
              highlight-current
              :filter-node-method="
                (value, node) =>
                  node.label.toLowerCase().includes(String(value).toLowerCase())
              "
              :expand-on-click-node="false"
              @node-click="
                node => {
                  treeSelected = node.id;
                  filter(treeField, node.id);
                }
              "
            />
          </el-scrollbar>
        </aside>
      </template>
      <template #toolbar="{ reload }">
        <template v-if="resource === 'user'">
          <el-button
            v-perm="permission('systemUserCreate')"
            type="primary"
            :icon="useRenderIcon(AddIcon)"
            @click="openDialog('create', reload)"
            >{{ t("crud.add") }}</el-button
          >
          <el-button
            v-perm="permission('systemUserResetPassword')"
            :icon="useRenderIcon(KeyIcon)"
            @click="openDialog('reset', reload)"
            >{{ t("system.resetPassword") }}</el-button
          >
        </template>
      </template>
      <template
        v-for="field in referenceFields"
        :key="field"
        #[`form-${field}`]="{ values, disabled }"
      >
        <el-select
          :model-value="fieldValue(values, field)"
          :aria-label="field"
          filterable
          clearable
          :disabled="disabled"
          @update:model-value="changeReference(values, field, $event)"
        >
          <el-option
            v-if="field === 'scopeOrgId'"
            value="__global__"
            :label="t('system.globalScope')"
          />
          <el-option
            v-for="option in selection(field)"
            :key="option.id"
            :value="option.id"
            :label="option.label"
            :disabled="option.disabled"
          />
        </el-select>
      </template>
      <template #form-permissions="{ values, disabled }">
        <el-select
          :model-value="(values.permissions ?? []) as string[]"
          multiple
          filterable
          :disabled="disabled"
          :aria-label="t('system.permissions')"
          @update:model-value="values.permissions = $event"
        >
          <el-option
            v-for="code in permissionOptions"
            :key="code"
            :value="code"
            :label="code"
          />
        </el-select>
      </template>
      <template #form-customOrgIds="{ values, disabled }">
        <el-select
          :model-value="(values.customOrgIds ?? []) as string[]"
          multiple
          filterable
          :disabled="disabled"
          :aria-label="t('system.organizations')"
          @update:model-value="values.customOrgIds = $event"
        >
          <el-option
            v-for="option in orgs"
            :key="option.id"
            :value="option.id"
            :label="option.label"
            :disabled="option.disabled"
          />
        </el-select>
      </template>
      <template #form-dataScope="{ values, disabled }">
        <el-select
          :model-value="(values.dataScope ?? 'org') as string"
          :disabled="disabled"
          :aria-label="t('system.dataScope')"
          @update:model-value="values.dataScope = $event"
        >
          <el-option
            v-for="scope in scopeOptions"
            :key="scope"
            :value="scope"
            :label="t(`system.scopes.${scope}`)"
          />
        </el-select>
      </template>
      <template #form-type="{ values, disabled }">
        <el-select
          :model-value="(values.type ?? 'page') as string"
          :disabled="disabled"
          :aria-label="t('system.menuType')"
          @update:model-value="values.type = $event"
        >
          <el-option
            v-for="type in menuTypes"
            :key="type"
            :value="type"
            :label="t(`system.menuTypes.${type}`)"
          />
        </el-select>
      </template>
      <template #form-enabled="{ values, disabled }"
        ><el-switch
          :model-value="
            values.enabled === undefined ? true : (values.enabled as boolean)
          "
          :disabled="disabled"
          :aria-label="t('system.enabled')"
          @update:model-value="values.enabled = $event"
      /></template>
      <template #form-locale="{ values, disabled }"
        ><el-select
          :model-value="(values.locale ?? 'zh-CN') as string"
          :disabled="disabled"
          aria-label="Language"
          @update:model-value="values.locale = $event"
          ><el-option label="简体中文" value="zh-CN" /><el-option
            label="English"
            value="en" /></el-select
      ></template>
    </CrudPage>
    <el-dialog
      :model-value="!!dialog"
      :title="
        t(dialog === 'create' ? 'system.createUser' : 'system.resetPassword')
      "
      width="min(520px, 94vw)"
      :close-on-click-modal="!busy"
      :close-on-press-escape="!busy"
      :show-close="!busy"
      @close="
        dialog = '';
        form.password = '';
        reset.password = '';
      "
    >
      <el-alert v-if="error" :title="error" type="error" :closable="false" />
      <el-form
        label-position="right"
        label-width="100px"
        @submit.prevent="submit"
      >
        <template v-if="dialog === 'create'">
          <el-form-item :label="t('admin.account')" required
            ><el-input
              v-model="form.username"
              maxlength="64"
              autocomplete="off"
              :disabled="busy"
          /></el-form-item>
          <el-form-item :label="t('system.name')" required
            ><el-input v-model="form.nickname" maxlength="100" :disabled="busy"
          /></el-form-item>
          <el-form-item :label="t('admin.password')" required
            ><el-input
              v-model="form.password"
              type="password"
              show-password
              autocomplete="new-password"
              :disabled="busy"
          /></el-form-item>
          <el-form-item :label="t('system.organizations')"
            ><el-select
              v-model="form.defaultOrgId"
              clearable
              filterable
              :disabled="busy"
              ><el-option
                v-for="org in orgs"
                :key="org.id"
                :label="org.label"
                :value="org.id"
                :disabled="org.disabled" /></el-select
          ></el-form-item>
        </template>
        <template v-else>
          <el-form-item :label="t('system.chooseUser')" required
            ><el-select v-model="reset.id" filterable :disabled="busy"
              ><el-option
                v-for="option in users"
                :key="option.id"
                :label="option.label"
                :value="option.id" /></el-select
          ></el-form-item>
          <el-form-item :label="t('admin.password')" required
            ><el-input
              v-model="reset.password"
              type="password"
              show-password
              autocomplete="new-password"
              :disabled="busy"
          /></el-form-item>
        </template>
      </el-form>
      <template #footer
        ><el-button
          :disabled="busy"
          @click="
            dialog = '';
            form.password = '';
            reset.password = '';
          "
          >{{ t("crud.cancel") }}</el-button
        ><el-button type="primary" :loading="busy" @click="submit">{{
          t("crud.save")
        }}</el-button></template
      >
    </el-dialog>
  </div>
</template>
<style scoped lang="scss">
.system-resource {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-height: 0;
}

.side {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
}

.side-header {
  display: flex;
  flex-shrink: 0;
  gap: 8px;
  align-items: center;
  justify-content: space-between;
  height: 48px;
  padding: 0 10px;
  border-bottom: 1px solid var(--el-border-color-extra-light);
}

.side-title {
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.side-actions {
  display: flex;
  align-items: center;
}

.side-actions :deep(.el-button + .el-button) {
  margin-left: 0;
}

.side-search {
  flex-shrink: 0;
  padding: 10px;
  border-bottom: 1px solid var(--el-border-color-extra-light);
}

.side-tree {
  flex: 1;
  min-height: 0;
  padding: 6px 5px 10px;
}

.side-tree :deep(.el-tree-node__content) {
  height: 36px;
  border-radius: 6px;
}

.system-resource :deep(.el-dialog .el-select),
.system-resource :deep(.el-drawer .el-select) {
  width: 100%;
}
</style>
