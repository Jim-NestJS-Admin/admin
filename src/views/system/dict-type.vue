<script setup lang="ts">
/**
 * 字典管理（参考 cool-admin / 若依）：左边字典列表，右边选中字典的字典项。
 * 字典分系统字典（内置，builtin）和业务字典：超级管理员左上角显示「系统字典 / 业务字典」页签，
 * 其他人只看业务字典、不显示页签。后端仍按身份独立鉴权。
 * 字典本身只有标识、名称、启用三个字段，在左边用小对话框增改；字典项用通用列表页，
 * 固定归属当前字典（字典类型列、表单项、查询项都不再显示）。
 */
import { computed, onBeforeUnmount, onMounted, reactive, ref } from "vue";
import { useI18n } from "vue-i18n";
import {
  ElMessage,
  ElMessageBox,
  ElSplitter,
  ElSplitterPanel
} from "element-plus";
import SystemPage from "./SystemPage.vue";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { useFillHeight } from "@/components/Crud/useFillHeight";
import { useHeadStyle } from "@/components/Crud/useHeadStyle";
import type { CrudRecord } from "@/components/Crud/types";
import { resources, permission } from "@/platform/system/resources";
import { useUserStoreHook } from "@/store/modules/user";
import { onSessionReset } from "@/platform/lifecycle";
import { RequestFailure } from "@/utils/http";
import { failureView } from "@/platform/failure-view.mjs";
import SearchIcon from "~icons/ri/search-line";
import AddIcon from "~icons/ri/add-line";
import RefreshIcon from "~icons/ri/refresh-line";
import EditIcon from "~icons/ri/edit-line";
import DeleteIcon from "~icons/ri/delete-bin-line";

type Dictionary = {
  id: string;
  version: number;
  code: string;
  name: string;
  enabled: boolean;
  builtin: boolean;
};
type Kind = "system" | "business";

const { t } = useI18n();
const user = useUserStoreHook();
const port = resources["dict-type"].port;
const can = (code: Parameters<typeof permission>[0]) =>
  user.permissions.includes(permission(code));

const pageEl = ref<HTMLElement>();
const fillHeight = useFillHeight(pageEl);
const headStyle = useHeadStyle();

/** 只有超级管理员能看到系统字典页签；其他人固定在业务字典 */
const kind = ref<Kind>("business");
const activeKind = computed<Kind>(() =>
  user.superAdmin ? kind.value : "business"
);
const list = ref<Dictionary[]>([]),
  loading = ref(false),
  loadError = ref(""),
  keyword = ref(""),
  selectedId = ref("");
const selected = computed(() =>
  list.value.find(item => item.id === selectedId.value)
);
const ofKind = computed(() =>
  list.value.filter(item => item.builtin === (activeKind.value === "system"))
);
const shown = computed(() => {
  const word = keyword.value.trim().toLowerCase();
  return word
    ? ofKind.value.filter(
        item =>
          item.name.toLowerCase().includes(word) ||
          item.code.toLowerCase().includes(word)
      )
    : ofKind.value;
});
function switchKind(next: Kind) {
  if (kind.value === next) return;
  kind.value = next;
  keyword.value = "";
  selectedId.value = ofKind.value[0]?.id ?? "";
}
/** 字典项列表固定归属当前字典；对象要稳定，否则右侧列表会反复重建 */
const fixed = computed(() =>
  selectedId.value ? { typeId: selectedId.value } : undefined
);

const requests = new Set<AbortController>();
function track() {
  const controller = new AbortController();
  requests.add(controller);
  return controller;
}
function message(reason: unknown) {
  if (!(reason instanceof RequestFailure))
    return reason instanceof Error ? reason.message : t("crud.requestFailed");
  const text = failureView(reason.failure).message;
  return text.startsWith("admin.") || text.startsWith("crud.") ? t(text) : text;
}
function toDictionary(row: CrudRecord): Dictionary[] {
  return typeof row.id === "string"
    ? [
        {
          id: row.id,
          version: typeof row.version === "number" ? row.version : 0,
          code: String(row.code ?? ""),
          name: String(row.name ?? row.code ?? row.id),
          enabled: row.enabled !== false,
          builtin: row.builtin === true
        }
      ]
    : [];
}

async function load() {
  const controller = track();
  const epoch = user.epoch;
  loading.value = true;
  loadError.value = "";
  try {
    const rows: CrudRecord[] = [];
    for (let page = 1; page <= 20; page++) {
      const result = await port.list(
        {
          pageNumber: page,
          pageSize: 500,
          search: "",
          sorting: [],
          equality: {}
        },
        controller.signal
      );
      rows.push(...result.rows);
      if (rows.length >= result.totalRows || !result.rows.length) break;
    }
    if (controller.signal.aborted || epoch !== user.epoch) return;
    list.value = rows.flatMap(toDictionary);
    if (!ofKind.value.some(item => item.id === selectedId.value))
      selectedId.value = ofKind.value[0]?.id ?? "";
  } catch (reason) {
    if (!controller.signal.aborted) loadError.value = message(reason);
  } finally {
    requests.delete(controller);
    loading.value = false;
  }
}

/* 新增 / 编辑字典的小对话框 */
const dialog = reactive({
  open: false,
  busy: false,
  error: "",
  editing: undefined as Dictionary | undefined,
  code: "",
  name: "",
  enabled: true
});
function openDialog(item?: Dictionary) {
  Object.assign(dialog, {
    open: true,
    busy: false,
    error: "",
    editing: item,
    code: item?.code ?? "",
    name: item?.name ?? "",
    enabled: item?.enabled ?? true
  });
}
async function submit() {
  if (dialog.busy) return;
  const code = dialog.code.trim(),
    name = dialog.name.trim();
  if (!dialog.editing && !/^[a-z][a-z0-9_.-]{1,63}$/.test(code)) {
    dialog.error = t("system.dictCodeHint");
    return;
  }
  if (!name) {
    dialog.error = t("system.dictName");
    return;
  }
  const controller = track();
  const epoch = user.epoch;
  dialog.busy = true;
  dialog.error = "";
  try {
    const context = {
      signal: controller.signal,
      idempotencyKey: crypto.randomUUID()
    };
    const saved = dialog.editing
      ? await port.update!(
          { id: dialog.editing.id, version: dialog.editing.version },
          { name, enabled: dialog.enabled },
          context
        )
      : await port.create!(
          {
            code,
            name,
            enabled: dialog.enabled,
            // 只在系统字典页签下新增时带上，后端只允许超级管理员这样做
            ...(activeKind.value === "system" ? { builtin: true } : {})
          },
          context
        );
    if (controller.signal.aborted || epoch !== user.epoch) return;
    dialog.open = false;
    ElMessage.success(t("system.saved"));
    if (typeof saved?.id === "string") selectedId.value = saved.id;
    await load();
  } catch (reason) {
    if (!controller.signal.aborted) dialog.error = message(reason);
  } finally {
    requests.delete(controller);
    dialog.busy = false;
  }
}

async function remove(item: Dictionary) {
  try {
    await ElMessageBox.confirm(
      t("system.confirmRemoveDictionary", { name: item.name }),
      t("crud.remove"),
      {
        confirmButtonText: t("crud.confirm"),
        cancelButtonText: t("crud.cancel"),
        type: "warning"
      }
    );
  } catch {
    return;
  }
  const controller = track();
  try {
    await port.remove!([item.id], {
      signal: controller.signal,
      idempotencyKey: crypto.randomUUID()
    });
    if (controller.signal.aborted) return;
    ElMessage.success(t("system.saved"));
    if (selectedId.value === item.id) selectedId.value = "";
    await load();
  } catch (reason) {
    if (!controller.signal.aborted) ElMessage.error(message(reason));
  } finally {
    requests.delete(controller);
  }
}

const stop = onSessionReset(() => {
  requests.forEach(request => request.abort());
  requests.clear();
  list.value = [];
  selectedId.value = "";
  dialog.open = false;
});
onBeforeUnmount(() => {
  stop();
  requests.forEach(request => request.abort());
});
onMounted(load);
</script>

<template>
  <div
    ref="pageEl"
    class="dict-page"
    :style="[headStyle, { height: `${fillHeight}px` }]"
  >
    <el-splitter lazy>
      <el-splitter-panel size="260px" min="200px" max="420px" collapsible>
        <aside class="dict-card dict-side">
          <div class="side-header">
            <div
              v-if="user.superAdmin"
              class="side-tabs"
              role="tablist"
              :aria-label="t('system.dictionaries')"
            >
              <button
                v-for="item in ['system', 'business'] as Kind[]"
                :key="item"
                type="button"
                role="tab"
                class="side-tab"
                :class="{ 'is-active': activeKind === item }"
                :aria-selected="activeKind === item"
                @click="switchKind(item)"
              >
                {{ t(`system.dictKinds.${item}`) }}
              </button>
            </div>
            <span v-else class="side-title">{{
              t("system.dictKinds.business")
            }}</span>
            <div class="side-actions">
              <el-tooltip
                v-if="can('systemDictTypeAdd')"
                :content="t('system.addDictionary')"
                placement="top"
              >
                <el-button
                  link
                  type="primary"
                  :icon="useRenderIcon(AddIcon)"
                  :aria-label="t('system.addDictionary')"
                  @click="openDialog()"
                />
              </el-tooltip>
              <el-tooltip :content="t('system.refreshTree')" placement="top">
                <el-button
                  link
                  type="primary"
                  :icon="useRenderIcon(RefreshIcon)"
                  :loading="loading"
                  :aria-label="t('system.refreshTree')"
                  @click="load"
                />
              </el-tooltip>
            </div>
          </div>
          <div class="side-search">
            <el-input
              v-model="keyword"
              :placeholder="t('crud.search')"
              :prefix-icon="useRenderIcon(SearchIcon)"
              clearable
            />
          </div>
          <el-alert
            v-if="loadError"
            :title="loadError"
            type="error"
            :closable="false"
            class="side-error"
          />
          <el-scrollbar class="side-list">
            <p v-if="!loading && !shown.length" class="side-empty">
              {{ t("system.noDictionary") }}
            </p>
            <div
              v-for="item in shown"
              :key="item.id"
              class="dict-row"
              :class="{ 'is-active': item.id === selectedId }"
              role="button"
              tabindex="0"
              @click="selectedId = item.id"
              @keydown.enter="selectedId = item.id"
            >
              <div class="dict-row-text">
                <span class="dict-row-name">{{ item.name }}</span>
                <span class="dict-row-code">{{ item.code }}</span>
              </div>
              <el-tag
                v-if="!item.enabled"
                size="small"
                type="info"
                effect="plain"
                >{{ t("system.disabled") }}</el-tag
              >
              <div class="dict-row-actions" @click.stop>
                <el-button
                  v-if="can('systemDictTypeUpdate')"
                  link
                  type="primary"
                  :icon="useRenderIcon(EditIcon)"
                  :aria-label="t('system.editDictionary')"
                  @click="openDialog(item)"
                />
                <el-button
                  v-if="can('systemDictTypeDelete')"
                  link
                  type="danger"
                  :icon="useRenderIcon(DeleteIcon)"
                  :aria-label="t('crud.remove')"
                  @click="remove(item)"
                />
              </div>
            </div>
          </el-scrollbar>
        </aside>
      </el-splitter-panel>
      <el-splitter-panel>
        <SystemPage
          v-if="fixed && can('systemDictItemPage')"
          :key="selectedId"
          resource="dict-item"
          :fixed="fixed"
        />
        <div v-else class="dict-card dict-blank">
          <el-empty
            :description="
              t(
                !can('systemDictItemPage')
                  ? 'system.noItemPermission'
                  : 'system.pickDictionary'
              )
            "
          />
        </div>
      </el-splitter-panel>
    </el-splitter>

    <el-dialog
      v-model="dialog.open"
      :title="
        t(dialog.editing ? 'system.editDictionary' : 'system.addDictionary')
      "
      width="min(480px, 96vw)"
      :close-on-click-modal="false"
    >
      <el-alert
        v-if="dialog.error"
        :title="dialog.error"
        type="error"
        :closable="false"
        class="dialog-error"
      />
      <el-form label-width="84px" @submit.prevent="submit">
        <el-form-item :label="t('system.dictCode')" required>
          <el-input
            v-model="dialog.code"
            maxlength="64"
            :disabled="!!dialog.editing || dialog.busy"
            :placeholder="t('system.dictCodeHint')"
          />
        </el-form-item>
        <el-form-item :label="t('system.dictName')" required>
          <el-input
            v-model="dialog.name"
            maxlength="100"
            :disabled="dialog.busy"
          />
        </el-form-item>
        <el-form-item :label="t('system.enabled')">
          <el-switch v-model="dialog.enabled" :disabled="dialog.busy" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button :disabled="dialog.busy" @click="dialog.open = false">{{
          t("crud.cancel")
        }}</el-button>
        <el-button type="primary" :loading="dialog.busy" @click="submit">{{
          t("crud.save")
        }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.dict-page {
  min-height: 0;
  overflow: hidden;
}

.dict-page :deep(.el-splitter-bar) {
  width: 8px !important;
}

.dict-card {
  height: 100%;
  background: var(--el-bg-color);
  border-radius: 4px;
}

.dict-side {
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
}

/* 和其他页面左侧树的标题栏一致（SystemPage .side-header） */
.side-header {
  display: flex;
  flex-shrink: 0;
  gap: 8px;
  align-items: center;
  justify-content: space-between;
  height: var(--crud-head-height, 49px);
  padding: 0 10px;
  border-bottom: 1px solid var(--el-border-color-extra-light);
}

/* 页签：文字 + 底部 2px 指示条，指示条压在标题栏底边线上 */
.side-tabs {
  display: flex;
  gap: 16px;
  align-self: stretch;
  margin-bottom: -1px;
}

.side-tab {
  padding: 0 2px;
  font-size: var(--el-font-size-base);
  color: var(--el-text-color-regular);
  cursor: pointer;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
}

.side-tab:hover {
  color: var(--el-color-primary);
}

.side-tab.is-active {
  color: var(--el-color-primary);
  border-bottom-color: var(--el-color-primary);
}

.side-title {
  font-size: var(--el-font-size-base);
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

.side-error {
  flex-shrink: 0;
  width: auto;
  margin: 10px 10px 0;
}

.side-list {
  flex: 1;
  min-height: 0;
  padding: 6px 5px 10px;
}

.side-empty {
  margin: 24px 0;
  font-size: var(--el-font-size-small);
  color: var(--el-text-color-placeholder);
  text-align: center;
}

/* 字典行：名称 + 标识两行，悬停或选中时右侧出现编辑 / 删除 */
.dict-row {
  display: flex;
  gap: 6px;
  align-items: center;
  min-height: 48px;
  padding: 6px 10px;
  cursor: pointer;
  outline: none;
  border-radius: 6px;
}

.dict-row:hover,
.dict-row:focus-visible {
  background: var(--el-fill-color-light);
}

.dict-row.is-active {
  background: var(--el-color-primary-light-9);
}

.dict-row-text {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
  line-height: 18px;
}

.dict-row-name,
.dict-row-code {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dict-row-name {
  font-size: var(--el-font-size-base);
  color: var(--el-text-color-primary);
}

.dict-row.is-active .dict-row-name {
  color: var(--el-color-primary);
}

.dict-row-code {
  font-size: var(--el-font-size-extra-small);
  color: var(--el-text-color-secondary);
}

.dict-row-actions {
  display: none;
  flex-shrink: 0;
  align-items: center;
}

.dict-row-actions :deep(.el-button + .el-button) {
  margin-left: 4px;
}

.dict-row:hover .dict-row-actions,
.dict-row.is-active .dict-row-actions,
.dict-row:focus-within .dict-row-actions {
  display: flex;
}

.dict-blank {
  display: flex;
  align-items: center;
  justify-content: center;
}

.dialog-error {
  margin-bottom: 16px;
}
</style>
