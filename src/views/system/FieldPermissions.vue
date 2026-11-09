<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { ElMessage } from "element-plus";
import { api, type OperationBody, type OperationResponse } from "@/api/client";
import { ENUMS } from "@/api/constants";
import { permission } from "@/platform/system/resources";
import { useUserStoreHook } from "@/store/modules/user";
import { onSessionReset } from "@/platform/lifecycle";
import { RequestFailure } from "@/utils/http";
import { failureView } from "@/platform/failure-view.mjs";

const props = defineProps<{
  mode: "role" | "default";
  resourceFilter?: string;
}>();
const { t } = useI18n();
const user = useUserStoreHook();
type Entry = OperationResponse<"systemFieldOverview">["data"]["fields"][number];
type Role = OperationResponse<"systemRolePage">["data"]["list"][number];
type Change = OperationBody<"systemFieldSave">["changes"][number];
const rows = ref<Entry[]>([]),
  roles = ref<Role[]>([]);
const roleId = ref(""),
  copyRoleId = ref(""),
  resource = ref(""),
  search = ref("");
const bulkState = ref<Entry["state"] | "__default__">("__default__");
const busy = ref(false),
  loading = ref(false),
  error = ref("");
let baseline = new Map<string, string>();
let serial = 0;
const requests = new Set<AbortController>();
const states =
  ENUMS["components.schemas.FieldConfigurationEntry.properties.codeDefault"];
const masks = ENUMS[
  "components.schemas.FieldConfigurationEntry.properties.codeMask"
].filter(value => value !== null);
const key = (row: Entry) => `${row.resource}/${row.field}`;
const stateValue = (row: Entry) =>
  JSON.stringify([
    row.state,
    row.state === null ? null : row.mask,
    row.state === null ? null : row.delegable
  ]);
const dirty = computed(() =>
  rows.value.filter(row => stateValue(row) !== baseline.get(key(row)))
);
const resources = computed(() => [
  ...new Map(rows.value.map(row => [row.resource, row.resourceLabel])).entries()
]);
const visible = computed(() =>
  rows.value.filter(
    row =>
      (!resource.value || row.resource === resource.value) &&
      `${row.resourceLabel} ${row.label} ${row.field}`
        .toLowerCase()
        .includes(search.value.toLowerCase())
  )
);
const canSave = computed(() =>
  user.permissions.includes(
    permission(
      props.mode === "role" ? "systemRoleFieldSave" : "systemFieldSave"
    )
  )
);
const allowedRoles = computed(() =>
  roles.value.filter(role => !role.allPermissions)
);
const ready = computed(() => props.mode === "default" || !!roleId.value);
function showError(reason: unknown) {
  const view = failureView(
    reason instanceof RequestFailure ? reason.failure : null
  );
  error.value = view.message.startsWith("admin.")
    ? t(view.message)
    : view.message;
}
function reset() {
  serial++;
  requests.forEach(request => request.abort());
  requests.clear();
  rows.value = [];
  roles.value = [];
  baseline.clear();
  roleId.value = "";
  copyRoleId.value = "";
  error.value = "";
  busy.value = false;
  loading.value = false;
}
const stop = onSessionReset(reset);
onBeforeUnmount(() => {
  stop();
  reset();
});
async function loadRoles() {
  const request = new AbortController();
  requests.add(request);
  try {
    const all: Role[] = [];
    for (let page = 1; page <= 20; page++) {
      const result = await api.systemRolePage(
        { body: { page, size: 500 } },
        { signal: request.signal }
      );
      all.push(...result.data.list);
      if (all.length >= result.data.total) {
        if (!request.signal.aborted) roles.value = all;
        return;
      }
      if (!result.data.list.length) break;
    }
    throw new Error("角色列表过多，请缩小管理范围");
  } catch (reason) {
    if (!request.signal.aborted) showError(reason);
  } finally {
    requests.delete(request);
  }
}
async function load() {
  if (!ready.value || busy.value) return;
  const turn = ++serial;
  const request = new AbortController();
  requests.add(request);
  loading.value = true;
  error.value = "";
  try {
    const result =
      props.mode === "role"
        ? await api.systemRoleFieldOverview(
            { query: { roleId: roleId.value } },
            { signal: request.signal }
          )
        : await api.systemFieldOverview({}, { signal: request.signal });
    if (request.signal.aborted || turn !== serial) return;
    rows.value = result.data.fields.filter(
      row => !props.resourceFilter || row.resource === props.resourceFilter
    );
    baseline = new Map(rows.value.map(row => [key(row), stateValue(row)]));
  } catch (reason) {
    if (!request.signal.aborted && turn === serial) showError(reason);
  } finally {
    requests.delete(request);
    if (turn === serial) loading.value = false;
  }
}
function updateState(row: Entry, state: Entry["state"] | "__default__") {
  row.state = state === "__default__" ? null : state;
  if (row.state === null) {
    row.mask = null;
    row.delegable = null;
  }
  if (row.state === "masked" && !row.mask)
    row.mask = row.defaultMask ?? row.codeMask ?? "all";
}
function applyBulk() {
  if (!resource.value) return;
  // 整模块设置不受搜索词截断，避免只改屏幕上命中的少数字段。
  rows.value
    .filter(row => row.resource === resource.value)
    .forEach(row => updateState(row, bulkState.value));
}
async function copy() {
  if (!copyRoleId.value || !roleId.value || busy.value) return;
  const turn = serial,
    target = roleId.value;
  const request = new AbortController();
  requests.add(request);
  busy.value = true;
  error.value = "";
  try {
    const result = await api.systemRoleFieldOverview(
      { query: { roleId: copyRoleId.value } },
      { signal: request.signal }
    );
    if (request.signal.aborted || turn !== serial || target !== roleId.value)
      return;
    const source = new Map(result.data.fields.map(row => [key(row), row]));
    for (const row of rows.value) {
      if (resource.value && row.resource !== resource.value) continue;
      const original = source.get(key(row));
      if (original) {
        updateState(row, original.state);
        row.mask = original.mask;
      }
    }
  } catch (reason) {
    if (!request.signal.aborted) showError(reason);
  } finally {
    requests.delete(request);
    busy.value = false;
  }
}
async function save() {
  if (!ready.value || !canSave.value || busy.value || !dirty.value.length)
    return;
  if (dirty.value.length > 500) {
    error.value = t("fieldPerm.batchLimit");
    return;
  }
  const request = new AbortController();
  requests.add(request);
  busy.value = true;
  error.value = "";
  const changes: Change[] = dirty.value.map(row => ({
    resource: row.resource,
    field: row.field,
    state: row.state,
    mask: row.state === null ? null : row.mask,
    version: row.version,
    ...(props.mode === "default"
      ? { delegable: row.state === null ? null : row.delegable }
      : {})
  }));
  try {
    const config = {
      signal: request.signal,
      headers: { "Idempotency-Key": crypto.randomUUID() }
    };
    if (props.mode === "role")
      await api.systemRoleFieldSave(
        { body: { roleId: roleId.value, changes } },
        config
      );
    else await api.systemFieldSave({ body: { changes } }, config);
    if (request.signal.aborted) return;
    ElMessage.success(t("system.saved"));
    busy.value = false;
    await user.ensureFreshSession(true);
    if (!request.signal.aborted) await load();
  } catch (reason) {
    if (!request.signal.aborted) showError(reason);
  } finally {
    requests.delete(request);
    busy.value = false;
  }
}
onMounted(async () => {
  if (props.mode === "role") await loadRoles();
  else await load();
});
</script>
<template>
  <section class="field-permissions">
    <el-alert
      :title="t('fieldPerm.explanation')"
      type="info"
      :closable="false"
    />
    <el-alert v-if="error" :title="error" type="error" :closable="false" />
    <div class="field-toolbar">
      <el-select
        v-if="mode === 'role'"
        v-model="roleId"
        filterable
        :placeholder="t('fieldPerm.chooseRole')"
        :aria-label="t('fieldPerm.chooseRole')"
        :disabled="busy || loading || !!dirty.length"
        @change="load"
      >
        <el-option
          v-for="role in allowedRoles"
          :key="role.id"
          :value="role.id"
          :label="role.name"
        />
      </el-select>
      <el-select
        v-model="resource"
        clearable
        :aria-label="t('fieldPerm.module')"
        :placeholder="t('fieldPerm.module')"
        :disabled="busy"
        ><el-option
          v-for="[value, label] in resources"
          :key="value"
          :value="value"
          :label="label"
      /></el-select>
      <el-input
        v-model="search"
        clearable
        :placeholder="t('fieldPerm.search')"
        :aria-label="t('fieldPerm.search')"
      />
      <el-button :disabled="!ready || busy" :loading="loading" @click="load">{{
        t("crud.reload")
      }}</el-button>
      <el-button
        v-perm="
          permission(
            mode === 'role' ? 'systemRoleFieldSave' : 'systemFieldSave'
          )
        "
        type="primary"
        :disabled="!ready || !dirty.length || loading"
        :loading="busy"
        @click="save"
        >{{ t("fieldPerm.saveCount", { count: dirty.length }) }}</el-button
      >
    </div>
    <div v-if="canSave" class="field-toolbar">
      <el-select
        v-model="bulkState"
        :aria-label="t('fieldPerm.bulkState')"
        :disabled="busy || loading"
        ><el-option
          value="__default__"
          :label="t('fieldPerm.followDefault')" /><el-option
          v-for="state in states"
          :key="state"
          :value="state"
          :label="t(`fieldPerm.states.${state}`)"
      /></el-select>
      <el-button
        :disabled="!resource || !ready || busy || loading"
        @click="applyBulk"
        >{{ t("fieldPerm.applyModule") }}</el-button
      >
      <template v-if="mode === 'role'">
        <el-select
          v-model="copyRoleId"
          filterable
          :aria-label="t('fieldPerm.copyRole')"
          :placeholder="t('fieldPerm.copyRole')"
          :disabled="busy || loading"
          ><el-option
            v-for="role in allowedRoles.filter(item => item.id !== roleId)"
            :key="role.id"
            :value="role.id"
            :label="role.name"
        /></el-select>
        <el-button
          :disabled="!roleId || !copyRoleId || busy || loading"
          @click="copy"
          >{{ t("fieldPerm.copy") }}</el-button
        >
      </template>
    </div>
    <el-table
      v-loading="loading"
      :data="visible"
      :row-key="key"
      border
      max-height="650"
    >
      <el-table-column
        prop="resourceLabel"
        :label="t('fieldPerm.module')"
        min-width="130"
      />
      <el-table-column
        prop="label"
        :label="t('fieldPerm.field')"
        min-width="150"
        ><template #default="{ row }"
          ><div>{{ row.label }}</div>
          <small>{{ row.field }}</small></template
        ></el-table-column
      >
      <el-table-column :label="t('fieldPerm.defaultState')" min-width="130"
        ><template #default="{ row }">{{
          t(
            `fieldPerm.states.${mode === "role" ? row.defaultState : row.codeDefault}`
          )
        }}</template></el-table-column
      >
      <el-table-column :label="t('fieldPerm.setting')" min-width="175"
        ><template #default="{ row, $index }"
          ><el-select
            :model-value="row.state ?? '__default__'"
            :disabled="!canSave || busy || loading"
            :aria-label="row.label"
            @update:model-value="updateState(visible[$index], $event)"
            ><el-option
              value="__default__"
              :label="t('fieldPerm.followDefault')" /><el-option
              v-for="state in states"
              :key="state"
              :value="state"
              :label="t(`fieldPerm.states.${state}`)" /></el-select></template
      ></el-table-column>
      <el-table-column :label="t('fieldPerm.mask')" min-width="150"
        ><template #default="{ row }"
          ><el-select
            v-model="row.mask"
            clearable
            :disabled="row.state !== 'masked' || !canSave || busy || loading"
            :aria-label="t('fieldPerm.mask')"
            ><el-option
              v-for="mask in masks"
              :key="mask"
              :value="mask"
              :label="t(`fieldPerm.masks.${mask}`)" /></el-select></template
      ></el-table-column>
      <el-table-column
        v-if="mode === 'default'"
        :label="t('fieldPerm.delegable')"
        min-width="165"
        ><template #default="{ row }"
          ><el-select
            v-model="row.delegable"
            clearable
            :disabled="
              !row.codeDelegable ||
              row.state === null ||
              !canSave ||
              busy ||
              loading
            "
            :aria-label="t('fieldPerm.delegable')"
            ><el-option
              v-for="state in states"
              :key="state"
              :value="state"
              :label="t(`fieldPerm.states.${state}`)" /></el-select></template
      ></el-table-column>
    </el-table>
  </section>
</template>
<style scoped>
.field-permissions {
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
}

/* 单独作为页面（字段权限菜单）时是一张卡片；嵌在模块配置的页签里时不加 */
.field-permissions.main-content {
  padding: 16px 20px;
  background: var(--el-bg-color);
  border-radius: 4px;
}

.field-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.field-toolbar :deep(.el-select),
.field-toolbar :deep(.el-input) {
  width: 210px;
}
</style>
