<script setup lang="ts">
import { computed, onBeforeUnmount, reactive, ref, watch } from "vue";
import { useMediaQuery } from "@vueuse/core";
import { useI18n } from "vue-i18n";
import Sortable from "sortablejs";
import {
  ElDialog,
  ElDrawer,
  ElMessage,
  ElMessageBox,
  ElSplitter,
  ElSplitterPanel,
  type TableInstance,
  type TreeInstance
} from "element-plus";
import { api, type OperationBody, type OperationResponse } from "@/api/client";
import { ENUMS } from "@/api/constants";
import { generatedCrud } from "@/platform/generated-crud";
import { navigationViews } from "@/platform/navigation";
import { permission } from "@/platform/system/resources";
import { onSessionReset } from "@/platform/lifecycle";
import { notifyPageConfigChanged } from "@/platform/page-config-events";
import { useUserStoreHook } from "@/store/modules/user";
import { RequestFailure } from "@/utils/http";
import { useFillHeight } from "@/components/Crud/useFillHeight";
import { useHeadStyle } from "@/components/Crud/useHeadStyle";
import type { CrudSchema, CrudTableMode } from "@/components/Crud/types";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import RefreshIcon from "~icons/ri/refresh-line";
import SearchIcon from "~icons/ri/search-line";
import DragIcon from "~icons/ri/draggable";
import PreviewIcon from "~icons/ri/eye-line";
import FieldPermissions from "./FieldPermissions.vue";
import {
  DEFAULT_FORM_MODE,
  DEFAULT_PAGE_SIZE,
  minimalPageConfig
} from "./page-config-diff.mjs";

const { t } = useI18n();
const user = useUserStoreHook();
const pageEl = ref<HTMLElement>();
const fillHeight = useFillHeight(pageEl);
const headStyle = useHeadStyle();
const mobile = useMediaQuery("(max-width: 760px)");
const modulePaneSize = computed(() => (mobile.value ? "32%" : "260px"));
const tableModes =
  ENUMS["components.schemas.CrudSchema.properties.defaultTableMode"];
type ModuleNode =
  OperationResponse<"systemPageConfigCatalog">["data"]["menus"][number];
const moduleTree = ref<TreeInstance>();
const moduleNodes = ref<ModuleNode[]>([]);
const moduleSearch = ref("");
const moduleTreeProps = {
  label: "title",
  disabled: (node: ModuleNode) => Boolean(node.resource && !node.selectable)
};
const fieldEditor = ref<InstanceType<typeof FieldPermissions>>();
const selectedModule = ref<{ id: string; title: string; resource: string }>();
const selected = computed(() => selectedModule.value?.resource ?? "");
const tab = ref("list"),
  schema = ref<CrudSchema>(),
  version = ref(0),
  error = ref(""),
  busy = ref(false),
  loading = ref(false),
  catalogLoading = ref(false),
  catalogError = ref("");
// 这些是编辑器视图状态；提交仍经正式生成客户端，由后端检查显示白名单。
const columns = ref<
  {
    field: string;
    label: string;
    /** 空着表示按字段类型自动 */
    width?: number | null;
    hidden: boolean;
    fixed: string;
    align: string;
    headerAlign: string;
  }[]
>([]);
const items = ref<
  {
    field: string;
    label: string;
    group: string;
    span: number;
    placeholder: string;
  }[]
>([]);
const options = reactive({
  pageSize: 20,
  tableMode: "normal" as CrudTableMode,
  tree: true,
  mode: DEFAULT_FORM_MODE as string,
  keyWords: [] as string[],
  filterable: [] as string[],
  sorting: [] as { field: string; order: string }[]
});
const histories = ref<
    { key: string; version: number; date: string; user: string }[]
  >([]),
  historyOpen = ref(false),
  historyPage = ref(1),
  historyTotal = ref(0),
  historyPreview = ref("");
const baseline = ref("");
let confirmingSwitch = false,
  serial = 0;
const columnTable = ref<TableInstance>();
const formTable = ref<TableInstance>();
let sortable: Sortable | undefined;
const requests = new Set<AbortController>();
let intent: { fingerprint: string; key: string } | undefined;
const record = (value: unknown): Record<string, unknown> =>
  value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
// 只保存和代码默认不同的部分；默认取自原始页面描述（schema 本身不含任何配置）
const config = () =>
  schema.value
    ? minimalPageConfig(
        { columns: columns.value, items: items.value, options },
        {
          columns: schema.value.columns,
          items: schema.value.form,
          keyWords: schema.value.actions.page?.keyWords ?? [],
          filterable: schema.value.actions.page?.filterable ?? [],
          sorting: schema.value.defaultSort,
          defaultTableMode: schema.value.defaultTableMode
        }
      )
    : {};
const dirty = computed(
  () => !!schema.value && JSON.stringify(config()) !== baseline.value
);
const hasUnsavedChanges = computed(
  () => dirty.value || fieldEditor.value?.hasUnsavedChanges
);
const previewColumns = computed(() => {
  const centeredFields = new Set(
    schema.value?.columns
      .filter(column =>
        ["boolean", "datetime", "date", "number"].includes(column.type)
      )
      .map(column => column.field)
  );
  return columns.value
    .filter(column => !column.hidden)
    .map(column => ({
      ...column,
      headerAlign:
        column.headerAlign === "center" ||
        (!column.headerAlign && centeredFields.has(column.field))
          ? ("center" as const)
          : ("left" as const)
    }));
});
const pageSizeError = ref("");
const formPreviewOpen = ref(false);
const pageSizes = computed(() =>
  [...new Set([10, 20, 30, 50, options.pageSize])]
    .filter(size => size <= (schema.value?.maxSize ?? 0))
    .sort((a, b) => a - b)
);
function setPageSize(value: string | number) {
  const size = Number(value);
  const max = schema.value?.maxSize ?? 0;
  if (
    !/^\d+$/.test(String(value).trim()) ||
    !Number.isSafeInteger(size) ||
    size < 1 ||
    size > max
  ) {
    pageSizeError.value = t("pageConfig.pageSizeRange", { max });
    return;
  }
  pageSizeError.value = "";
  options.pageSize = size;
}
function crudOperationPrefix(resource: string) {
  return resource.replace(/[:-]([a-z0-9])/g, (_, char: string) =>
    char.toUpperCase()
  );
}
function fail(reason: unknown, target = error) {
  target.value =
    reason instanceof RequestFailure
      ? reason.failure.message
      : t("crud.requestFailed");
}
function fill(value: unknown) {
  pageSizeError.value = "";
  const data = record(value),
    list = record(data.list),
    form = record(data.form);
  const order = Array.isArray(list.columns) ? list.columns.map(record) : [];
  const baseColumns = schema.value.columns;
  const names = [
    ...new Set([
      ...order.map(item => String(item.field)),
      ...baseColumns.map(item => item.field)
    ])
  ];
  columns.value = names.flatMap(field => {
    const original = baseColumns.find(item => item.field === field);
    if (!original) return [];
    const saved = order.find(item => item.field === field) ?? {};
    return [
      {
        field,
        label: original.label,
        width: typeof saved.width === "number" ? saved.width : original.width,
        // 没配置过的列沿用代码默认（系统字段默认隐藏）
        hidden:
          typeof saved.hidden === "boolean"
            ? saved.hidden
            : original.hidden === true,
        fixed: ["left", "right"].includes(String(saved.fixed))
          ? String(saved.fixed)
          : "",
        align:
          saved.align === "left" || saved.align === "center" ? saved.align : "",
        headerAlign:
          saved.headerAlign === "left" || saved.headerAlign === "center"
            ? saved.headerAlign
            : ""
      }
    ];
  });
  const savedItems = Array.isArray(form.items) ? form.items.map(record) : [];
  const writable = new Set([
    ...(schema.value.actions.add?.writable ?? []),
    ...(schema.value.actions.update?.writable ?? [])
  ]);
  const itemNames = [
    ...new Set([
      ...savedItems.map(item => String(item.field)),
      ...schema.value.form.map(item => item.field)
    ])
  ];
  items.value = itemNames.flatMap(field => {
    const original = schema.value.form.find(item => item.field === field);
    if (!original || !writable.has(field)) return [];
    const saved = savedItems.find(item => item.field === field) ?? {};
    return [
      {
        field,
        label: original.label,
        group: typeof saved.group === "string" ? saved.group : "",
        span: saved.span === 12 ? 12 : 24,
        placeholder:
          typeof saved.placeholder === "string"
            ? saved.placeholder
            : (original.placeholder ?? "")
      }
    ];
  });
  options.pageSize =
    typeof list.pageSize === "number" ? list.pageSize : DEFAULT_PAGE_SIZE;
  options.tableMode =
    tableModes.find(mode => mode === list.tableMode) ??
    schema.value.defaultTableMode ??
    "normal";
  options.tree = list.tree !== false;
  options.mode =
    form.mode === "dialog" || form.mode === "drawer"
      ? form.mode
      : DEFAULT_FORM_MODE;
  options.keyWords = Array.isArray(list.keyWords)
    ? list.keyWords.filter(
        (value): value is string => typeof value === "string"
      )
    : [...(schema.value.actions.page?.keyWords ?? [])];
  options.filterable = Array.isArray(list.filterable)
    ? list.filterable.filter(
        (value): value is string => typeof value === "string"
      )
    : [...(schema.value.actions.page?.filterable ?? [])];
  options.sorting = Array.isArray(list.defaultSort)
    ? list.defaultSort
        .map(record)
        .map(item => ({ field: String(item.field), order: String(item.order) }))
    : schema.value.defaultSort.map(item => ({ ...item }));
}
function resetSession() {
  formPreviewOpen.value = false;
  intent = undefined;
  serial++;
  requests.forEach(request => request.abort());
  requests.clear();
  moduleNodes.value = [];
  moduleSearch.value = "";
  catalogLoading.value = false;
  catalogError.value = "";
  loading.value = false;
  busy.value = false;
  error.value = "";
  schema.value = undefined;
  selectedModule.value = undefined;
  tab.value = "list";
  columns.value = [];
  items.value = [];
  histories.value = [];
  historyOpen.value = false;
  historyPreview.value = "";
  baseline.value = "";
}
const stop = onSessionReset(resetSession);
onBeforeUnmount(() => {
  sortable?.destroy();
  stop();
  resetSession();
});
function supportedNodes(nodes: ModuleNode[]): ModuleNode[] {
  return nodes.flatMap(node => {
    if (node.resource) {
      return navigationViews.has(node.resource.replaceAll(":", "/")) &&
        Object.hasOwn(api, `${crudOperationPrefix(node.resource)}Schema`)
        ? [node]
        : [];
    }
    const children = supportedNodes(node.children ?? []);
    return children.length ? [{ ...node, children }] : [];
  });
}
async function loadCatalog() {
  if (catalogLoading.value) return;
  const request = new AbortController();
  requests.add(request);
  catalogLoading.value = true;
  catalogError.value = "";
  try {
    const { data } = await api.systemPageConfigCatalog(
      {},
      { signal: request.signal }
    );
    if (request.signal.aborted) return;
    moduleNodes.value = supportedNodes(data.menus);
  } catch (reason) {
    if (!request.signal.aborted) fail(reason, catalogError);
  } finally {
    requests.delete(request);
    if (!request.signal.aborted) catalogLoading.value = false;
  }
}
watch(
  [() => user.epoch, () => user.transitioning],
  () => {
    if (
      !user.transitioning &&
      user.isAuthenticated &&
      user.permissions.includes(permission("systemPageConfigCatalog"))
    )
      void loadCatalog();
  },
  { immediate: true }
);
watch(
  [moduleSearch, moduleNodes],
  ([search]) => moduleTree.value?.filter(search.trim().toLocaleLowerCase()),
  { flush: "post" }
);
async function switchModule(node: ModuleNode) {
  // 树组件在事件前更新高亮，先还原，等确认后才切换当前项。
  moduleTree.value?.setCurrentKey(selectedModule.value?.id ?? null, false);
  const { id, title, resource, selectable } = node;
  if (
    !resource ||
    !selectable ||
    resource === selected.value ||
    busy.value ||
    loading.value ||
    fieldEditor.value?.busy ||
    confirmingSwitch
  )
    return;
  const epoch = user.epoch;
  if (hasUnsavedChanges.value) {
    confirmingSwitch = true;
    try {
      await ElMessageBox.confirm(
        t("pageConfig.unsavedSwitch"),
        t("pageConfig.title"),
        {
          type: "warning",
          confirmButtonText: t("pageConfig.discardAndSwitch"),
          cancelButtonText: t("crud.cancel")
        }
      );
    } catch {
      return;
    } finally {
      confirmingSwitch = false;
    }
  }
  if (epoch !== user.epoch) return;
  selectedModule.value = { id, title, resource };
  schema.value = undefined;
  baseline.value = "";
  intent = undefined;
  tab.value = "list";
  historyOpen.value = false;
  historyPage.value = 1;
  histories.value = [];
  historyTotal.value = 0;
  historyPreview.value = "";
  await load();
}
async function load() {
  if (!selected.value || busy.value) return;
  const turn = ++serial,
    request = new AbortController();
  requests.add(request);
  loading.value = true;
  error.value = "";
  try {
    const prefix = crudOperationPrefix(selected.value);
    const [description, response] = await Promise.all([
      generatedCrud(prefix).port.describe(request.signal),
      api.systemPageConfigInfo(
        { query: { resource: selected.value } },
        { signal: request.signal }
      )
    ]);
    if (request.signal.aborted || turn !== serial) return;
    const data = record(response.data);
    if (!Number.isSafeInteger(data.version)) throw Error("invalid version");
    schema.value = description;
    version.value = data.version as number;
    fill(data.config);
    baseline.value = JSON.stringify(config());
  } catch (reason) {
    if (!request.signal.aborted && turn === serial) {
      schema.value = undefined;
      fail(reason);
    }
  } finally {
    requests.delete(request);
    if (turn === serial) loading.value = false;
  }
}
function move(rows: unknown[], index: number, target: number) {
  if (
    busy.value ||
    loading.value ||
    index === target ||
    index < 0 ||
    index >= rows.length ||
    target < 0 ||
    target >= rows.length
  )
    return;
  const [row] = rows.splice(index, 1);
  rows.splice(target, 0, row);
}
watch(
  [tab, columnTable, formTable],
  () => {
    sortable?.destroy();
    sortable = undefined;
    if (tab.value !== "list" && tab.value !== "form") return;
    const list = tab.value === "list";
    const table = list ? columnTable.value : formTable.value;
    const root: HTMLElement | undefined = table?.$el;
    const body = root?.querySelector<HTMLElement>(
      ".el-table__body-wrapper tbody"
    );
    if (!body) return;
    sortable = Sortable.create(body, {
      handle: ".config-drag-handle",
      draggable: ".el-table__row",
      animation: 150,
      disabled: busy.value || loading.value,
      onEnd: ({ from, item, oldIndex, newIndex }) => {
        if (oldIndex == null || newIndex == null || oldIndex === newIndex)
          return;
        // 先还原插件移动的 DOM，再交给 Vue 按字段键渲染新顺序。
        item.remove();
        from.insertBefore(item, from.children[oldIndex] ?? null);
        move(list ? columns.value : items.value, oldIndex, newIndex);
      }
    });
  },
  { flush: "post" }
);
watch([busy, loading], ([saving, reading]) =>
  sortable?.option("disabled", saving || reading)
);
async function mutation(
  action: "save" | "reset" | "restore",
  historyId?: string
) {
  if (busy.value || !schema.value) return;
  const resource = selected.value;
  const epoch = user.epoch;
  if (action !== "save") {
    try {
      await ElMessageBox.confirm(
        t("pageConfig.confirmChange"),
        t("pageConfig.title")
      );
    } catch {
      return;
    }
  }
  if (resource !== selected.value || epoch !== user.epoch) return;
  const request = new AbortController();
  requests.add(request);
  busy.value = true;
  error.value = "";
  const fingerprint = JSON.stringify([
    action,
    selected.value,
    version.value,
    historyId,
    config()
  ]);
  if (intent?.fingerprint !== fingerprint)
    intent = { fingerprint, key: crypto.randomUUID() };
  const context = {
    signal: request.signal,
    headers: { "Idempotency-Key": intent.key }
  };
  try {
    if (action === "save")
      await api.systemPageConfigSave(
        {
          body: {
            resource: selected.value,
            version: version.value,
            config: config()
          } as unknown as OperationBody<"systemPageConfigSave">
        },
        context
      );
    else if (action === "reset")
      await api.systemPageConfigReset(
        { body: { resource: selected.value, version: version.value } },
        context
      );
    else
      await api.systemPageConfigRestore(
        {
          body: { resource: selected.value, version: version.value, historyId }
        },
        context
      );
    if (!request.signal.aborted) {
      intent = undefined;
      notifyPageConfigChanged(selected.value);
      ElMessage.success(t("system.saved"));
      busy.value = false;
      await load();
      if (historyOpen.value) await loadHistory();
    }
  } catch (reason) {
    if (!request.signal.aborted) fail(reason);
  } finally {
    requests.delete(request);
    if (!request.signal.aborted) busy.value = false;
  }
}
async function loadHistory() {
  const turn = serial;
  const request = new AbortController();
  requests.add(request);
  try {
    const result = record(
      (
        await api.systemPageConfigHistory(
          {
            body: {
              resource: selected.value,
              page: historyPage.value,
              size: 20
            }
          },
          { signal: request.signal }
        )
      ).data
    );
    if (request.signal.aborted || turn !== serial) return;
    histories.value = Array.isArray(result.list)
      ? result.list.map(record).map(item => ({
          key: String(item.id),
          version: Number(item.configVersion),
          user: String(item.createdBy ?? "—"),
          date: String(item.createdAt ?? "")
        }))
      : [];
    historyTotal.value = Number(result.total) || 0;
  } catch (reason) {
    if (!request.signal.aborted) fail(reason);
  } finally {
    requests.delete(request);
  }
}
async function previewHistory(id: string) {
  const turn = serial;
  const request = new AbortController();
  requests.add(request);
  try {
    const result = await api.systemPageConfigHistoryInfo(
      { body: { resource: selected.value, historyId: id } },
      { signal: request.signal }
    );
    if (!request.signal.aborted && turn === serial)
      historyPreview.value = JSON.stringify(result.data, null, 2);
  } catch (reason) {
    if (!request.signal.aborted) fail(reason);
  } finally {
    requests.delete(request);
  }
}
</script>
<template>
  <section
    ref="pageEl"
    class="page-config"
    :style="[headStyle, { height: `${fillHeight}px` }]"
  >
    <el-splitter
      class="page-splitter"
      :style="{ '--page-splitter-side-size': modulePaneSize }"
      :layout="mobile ? 'vertical' : 'horizontal'"
      lazy
    >
      <el-splitter-panel
        :size="modulePaneSize"
        :min="mobile ? '106px' : '200px'"
        :max="mobile ? '250px' : '420px'"
        collapsible
      >
        <aside class="module-nav" :aria-label="t('fieldPerm.module')">
          <header class="module-nav-header">
            <h2>{{ t("fieldPerm.module") }}</h2>
            <el-tooltip :content="t('system.refreshTree')" placement="top">
              <el-button
                link
                type="primary"
                :icon="useRenderIcon(RefreshIcon)"
                :loading="catalogLoading"
                :aria-label="t('system.refreshTree')"
                @click="loadCatalog"
              />
            </el-tooltip>
          </header>
          <div class="module-search">
            <el-input
              v-model="moduleSearch"
              clearable
              :prefix-icon="useRenderIcon(SearchIcon)"
              :aria-label="t('pageConfig.searchModules')"
              :placeholder="t('pageConfig.searchModules')"
            />
          </div>
          <el-alert
            v-if="catalogError"
            class="module-error"
            :title="catalogError"
            type="error"
            :closable="false"
          />
          <el-scrollbar v-loading="catalogLoading" class="module-scroll">
            <el-tree
              ref="moduleTree"
              :data="moduleNodes"
              :props="moduleTreeProps"
              :current-node-key="selectedModule?.id"
              :aria-label="t('fieldPerm.module')"
              :empty-text="t('pageConfig.noModules')"
              :filter-node-method="
                (search, node) =>
                  node.title.toLocaleLowerCase().includes(search)
              "
              node-key="id"
              default-expand-all
              highlight-current
              @node-click="switchModule"
            >
              <template #default="{ data }">
                <span
                  class="module-node-label"
                  :title="
                    data.resource && !data.selectable
                      ? t('pageConfig.noReadPermission')
                      : data.title
                  "
                  >{{ data.title }}</span
                >
              </template>
            </el-tree>
          </el-scrollbar>
        </aside>
      </el-splitter-panel>
      <el-splitter-panel>
        <section v-loading="loading" class="config-content">
          <header class="config-header">
            <div class="config-title">
              <h2>{{ selectedModule?.title ?? t("pageConfig.title") }}</h2>
              <el-tag v-if="schema" type="info" effect="plain">{{
                t("pageConfig.version", { version })
              }}</el-tag>
            </div>
            <div class="config-actions">
              <el-button
                :disabled="!selected || busy || loading"
                @click="load"
                >{{ t("crud.reload") }}</el-button
              >
              <el-button
                v-perm="permission('systemPageConfigHistory')"
                :disabled="!schema || busy || loading"
                @click="
                  historyOpen = true;
                  loadHistory();
                "
                >{{ t("pageConfig.history") }}</el-button
              >
              <el-button
                v-perm="permission('systemPageConfigReset')"
                :disabled="!schema || busy || loading"
                @click="mutation('reset')"
                >{{ t("crud.reset") }}</el-button
              >
              <el-button
                v-perm="permission('systemPageConfigSave')"
                type="primary"
                :disabled="!dirty || loading || !!pageSizeError"
                :loading="busy"
                @click="mutation('save')"
                >{{ t("crud.save") }}</el-button
              >
            </div>
          </header>
          <el-alert
            v-if="error"
            class="config-error"
            :title="error"
            type="error"
            :closable="false"
          />
          <el-empty
            v-if="!selected && !error"
            class="config-empty"
            :description="t('pageConfig.selectModule')"
          />
          <el-tabs v-if="schema" v-model="tab" class="config-tabs">
            <el-tab-pane
              name="fields"
              :label="t('fieldPerm.title')"
              class="config-tab-pane"
              lazy
            >
              <el-scrollbar view-class="config-tab-view" :tabindex="0">
                <FieldPermissions
                  ref="fieldEditor"
                  :key="selected"
                  mode="default"
                  :resource-filter="selected"
                />
              </el-scrollbar>
            </el-tab-pane>
            <el-tab-pane
              name="list"
              :label="t('pageConfig.list')"
              class="config-tab-pane"
            >
              <el-scrollbar view-class="config-tab-view" :tabindex="0">
                <el-form
                  class="list-options"
                  label-position="top"
                  @submit.prevent
                >
                  <div class="list-settings-grid">
                    <el-form-item :label="t('pageConfig.tableMode')">
                      <el-radio-group
                        v-model="options.tableMode"
                        :disabled="busy"
                        :aria-label="t('pageConfig.tableMode')"
                      >
                        <el-radio-button
                          v-for="mode in tableModes"
                          :key="mode"
                          :value="mode"
                        >
                          {{
                            t(
                              mode === "normal"
                                ? "pageConfig.tableNormal"
                                : "pageConfig.tableVirtual"
                            )
                          }}
                        </el-radio-button>
                      </el-radio-group>
                      <small class="config-help">{{
                        t("pageConfig.tableModeHelp")
                      }}</small>
                    </el-form-item>
                    <el-form-item
                      :label="t('pageConfig.pageSize')"
                      :error="pageSizeError"
                    >
                      <el-select
                        :model-value="options.pageSize"
                        :disabled="busy"
                        :aria-label="t('pageConfig.pageSize')"
                        filterable
                        allow-create
                        default-first-option
                        :reserve-keyword="false"
                        @update:model-value="setPageSize"
                      >
                        <el-option
                          v-for="size in pageSizes"
                          :key="size"
                          :label="String(size)"
                          :value="size"
                        />
                      </el-select>
                      <small class="config-help">{{
                        t("pageConfig.pageSizeHelp")
                      }}</small>
                    </el-form-item>
                    <el-form-item
                      v-if="schema.tree"
                      :label="t('pageConfig.tree')"
                    >
                      <el-switch v-model="options.tree" :disabled="busy" />
                      <small class="config-help">{{
                        t("pageConfig.treeHelp")
                      }}</small>
                    </el-form-item>
                    <el-form-item :label="t('pageConfig.keyWords')"
                      ><el-select
                        v-model="options.keyWords"
                        multiple
                        collapse-tags
                        collapse-tags-tooltip
                        :disabled="busy"
                        ><el-option
                          v-for="field in schema.actions.page?.keyWords ?? []"
                          :key="field"
                          :value="field"
                          :label="
                            schema.columns.find(item => item.field === field)
                              ?.label ?? field
                          "
                      /></el-select>
                      <small class="config-help">{{
                        t("pageConfig.keyWordsHelp")
                      }}</small>
                    </el-form-item>
                    <el-form-item :label="t('pageConfig.filterable')"
                      ><el-select
                        v-model="options.filterable"
                        multiple
                        collapse-tags
                        collapse-tags-tooltip
                        :disabled="busy"
                        ><el-option
                          v-for="field in schema.query"
                          :key="field.field"
                          :value="field.field"
                          :label="field.label"
                      /></el-select>
                      <small class="config-help">{{
                        t("pageConfig.filterableHelp")
                      }}</small>
                    </el-form-item>
                  </div>
                  <el-form-item :label="t('pageConfig.defaultSort')">
                    <div class="sort-settings">
                      <small class="config-help">{{
                        t("pageConfig.sortHelp")
                      }}</small>
                      <div
                        v-for="(sort, index) in options.sorting"
                        :key="index"
                        class="sort-row"
                      >
                        <el-select
                          v-model="sort.field"
                          :aria-label="t('pageConfig.sort')"
                          :disabled="busy"
                          ><el-option
                            v-for="field in schema.actions.page?.sortable ?? []"
                            :key="field"
                            :value="field"
                            :label="
                              schema.columns.find(
                                column => column.field === field
                              )?.label ?? field
                            " /></el-select
                        ><el-select
                          v-model="sort.order"
                          :aria-label="t('pageConfig.order')"
                          :disabled="busy"
                          ><el-option
                            value="asc"
                            :label="t('pageConfig.asc')" /><el-option
                            value="desc"
                            :label="t('pageConfig.desc')" /></el-select
                        ><el-button
                          type="danger"
                          :disabled="busy"
                          @click="options.sorting.splice(index, 1)"
                          >{{ t("crud.remove") }}</el-button
                        >
                      </div>
                      <el-button
                        :disabled="busy || options.sorting.length >= 5"
                        @click="
                          options.sorting.push({
                            field: schema.actions.page?.sortable[0] ?? 'id',
                            order: 'asc'
                          })
                        "
                        >{{ t("pageConfig.addSort") }}</el-button
                      >
                    </div>
                  </el-form-item>
                </el-form>
                <el-table
                  ref="columnTable"
                  :data="columns"
                  row-key="field"
                  border
                >
                  <el-table-column
                    :label="t('pageConfig.reorder')"
                    width="64"
                    align="center"
                  >
                    <template #default="{ row, $index }">
                      <button
                        type="button"
                        class="config-drag-handle"
                        :aria-label="
                          t('pageConfig.dragField', { field: row.label })
                        "
                        :title="t('pageConfig.dragHint')"
                        :disabled="busy || loading || columns.length < 2"
                        @keydown.alt.up.prevent="
                          move(columns, $index, $index - 1)
                        "
                        @keydown.alt.down.prevent="
                          move(columns, $index, $index + 1)
                        "
                      >
                        <component :is="DragIcon" aria-hidden="true" />
                      </button>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="label"
                    :label="t('fieldPerm.field')"
                    min-width="140"
                  />
                  <el-table-column :label="t('crud.width')" min-width="180"
                    ><template #default="{ row }"
                      ><el-input-number
                        v-model="row.width"
                        :min="40"
                        :max="800"
                        :value-on-clear="null"
                        :placeholder="t('crud.widthAuto')"
                        controls-position="right"
                        :disabled="busy"
                      >
                        <template #suffix><span>px</span></template>
                      </el-input-number></template
                    ></el-table-column
                  >
                  <el-table-column :label="t('pageConfig.hidden')" width="95"
                    ><template #default="{ row }"
                      ><el-switch
                        v-model="row.hidden"
                        :disabled="busy" /></template
                  ></el-table-column>
                  <el-table-column :label="t('crud.fixed')" min-width="160"
                    ><template #default="{ row }"
                      ><el-select
                        v-model="row.fixed"
                        :disabled="busy"
                        :empty-values="[null, undefined]"
                        ><el-option
                          value=""
                          :label="t('crud.unfixed')" /><el-option
                          value="left"
                          :label="t('crud.left')" /><el-option
                          value="right"
                          :label="t('crud.right')" /></el-select></template
                  ></el-table-column>
                  <el-table-column
                    v-for="part in ['align', 'headerAlign'] as const"
                    :key="part"
                    :label="t(`pageConfig.${part}`)"
                    min-width="128"
                  >
                    <template #default="{ row }">
                      <el-select
                        v-model="row[part]"
                        :disabled="busy"
                        :empty-values="[null, undefined]"
                        :aria-label="t(`pageConfig.${part}`)"
                      >
                        <el-option
                          value=""
                          :label="t('pageConfig.defaultAlignment')"
                        />
                        <el-option value="left" :label="t('crud.left')" />
                        <el-option
                          value="center"
                          :label="t('pageConfig.center')"
                        />
                      </el-select>
                    </template>
                  </el-table-column>
                </el-table>
                <p class="config-table-help">
                  {{ t("pageConfig.columnsHelp") }}
                </p>
                <section
                  class="config-preview"
                  :aria-label="t('pageConfig.listPreview')"
                >
                  <header class="config-preview-header">
                    {{ t("pageConfig.listPreview") }}
                  </header>
                  <el-table
                    v-if="previewColumns.length"
                    class="list-preview-table"
                    :data="[]"
                    border
                    ><el-table-column
                      v-for="column in previewColumns"
                      :key="column.field"
                      :label="column.label"
                      :header-align="column.headerAlign"
                      :width="column.width"
                  /></el-table>
                  <p v-else class="config-preview-empty">
                    {{ t("pageConfig.noPreviewColumns") }}
                  </p>
                </section>
              </el-scrollbar>
            </el-tab-pane>
            <el-tab-pane
              name="form"
              :label="t('pageConfig.form')"
              class="config-tab-pane"
            >
              <el-scrollbar view-class="config-tab-view" :tabindex="0">
                <div class="form-preview-toolbar">
                  <el-radio-group
                    v-model="options.mode"
                    :aria-label="t('pageConfig.formOpenMode')"
                    :disabled="busy"
                  >
                    <el-radio value="dialog">{{
                      t("pageConfig.dialog")
                    }}</el-radio>
                    <el-radio value="drawer">{{
                      t("pageConfig.drawer")
                    }}</el-radio>
                  </el-radio-group>
                  <el-button
                    type="primary"
                    plain
                    :icon="useRenderIcon(PreviewIcon)"
                    @click="formPreviewOpen = true"
                  >
                    {{ t("pageConfig.formPreview") }}
                  </el-button>
                </div>
                <p class="config-table-help">
                  {{ t("pageConfig.formPreviewHelp") }}
                </p>
                <el-table ref="formTable" :data="items" row-key="field" border>
                  <el-table-column
                    :label="t('pageConfig.reorder')"
                    width="64"
                    align="center"
                  >
                    <template #default="{ row, $index }">
                      <button
                        type="button"
                        class="config-drag-handle"
                        :aria-label="
                          t('pageConfig.dragField', { field: row.label })
                        "
                        :title="t('pageConfig.dragHint')"
                        :disabled="busy || loading || items.length < 2"
                        @keydown.alt.up.prevent="
                          move(items, $index, $index - 1)
                        "
                        @keydown.alt.down.prevent="
                          move(items, $index, $index + 1)
                        "
                      >
                        <component :is="DragIcon" aria-hidden="true" />
                      </button>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="label"
                    :label="t('fieldPerm.field')"
                    min-width="140"
                  />
                  <el-table-column :label="t('pageConfig.group')"
                    ><template #default="{ row }"
                      ><el-input
                        v-model="row.group"
                        :disabled="busy"
                        maxlength="100" /></template
                  ></el-table-column>
                  <el-table-column :label="t('pageConfig.span')"
                    ><template #default="{ row }"
                      ><el-select v-model="row.span" :disabled="busy"
                        ><el-option
                          :value="12"
                          :label="t('pageConfig.half')" /><el-option
                          :value="24"
                          :label="t('pageConfig.full')" /></el-select></template
                  ></el-table-column>
                  <el-table-column :label="t('pageConfig.placeholder')"
                    ><template #default="{ row }"
                      ><el-input
                        v-model="row.placeholder"
                        :disabled="busy"
                        maxlength="200" /></template
                  ></el-table-column>
                </el-table>
              </el-scrollbar>
            </el-tab-pane>
          </el-tabs>
        </section>
      </el-splitter-panel>
    </el-splitter>
    <component
      :is="options.mode === 'drawer' ? ElDrawer : ElDialog"
      v-model="formPreviewOpen"
      v-bind="
        options.mode === 'drawer'
          ? { size: 'min(680px, 100vw)' }
          : { width: 'min(620px, 96vw)' }
      "
      :title="t('pageConfig.formPreview')"
      append-to-body
    >
      <el-row :gutter="16"
        ><el-col
          v-for="item in items"
          :key="item.field"
          :span="item.span"
          :xs="24"
          ><el-form label-position="top"
            ><el-form-item
              :label="item.group ? `${item.group} / ${item.label}` : item.label"
              ><el-input
                :placeholder="item.placeholder"
                disabled /></el-form-item></el-form></el-col
      ></el-row>
    </component>
    <el-drawer
      v-model="historyOpen"
      :title="t('pageConfig.history')"
      size="min(800px, 100vw)"
      ><el-table :data="histories"
        ><el-table-column
          prop="version"
          :label="t('pageConfig.versionLabel')"
        /><el-table-column
          prop="user"
          :label="t('pageConfig.changedBy')"
        /><el-table-column
          prop="date"
          :label="t('pageConfig.date')"
        /><el-table-column :label="t('crud.actions')"
          ><template #default="{ row }"
            ><el-button link @click="previewHistory(row.key)">{{
              t("pageConfig.preview")
            }}</el-button
            ><el-button
              v-perm="permission('systemPageConfigRestore')"
              link
              :disabled="busy"
              @click="mutation('restore', row.key)"
              >{{ t("crud.restore") }}</el-button
            ></template
          ></el-table-column
        ></el-table
      ><el-pagination
        v-model:current-page="historyPage"
        :page-size="20"
        :total="historyTotal"
        @current-change="loadHistory"
      />
      <pre>{{ historyPreview }}</pre>
    </el-drawer>
  </section>
</template>
<style scoped>
.page-config {
  min-width: 0;
  min-height: 0;
  overflow: hidden;
}

.page-config :deep(.el-splitter-panel) {
  overflow: hidden;
}

.page-config :deep(.el-splitter__horizontal > .el-splitter-bar) {
  width: 8px !important;
}

.page-config :deep(.el-splitter__vertical > .el-splitter-bar) {
  height: 8px !important;
}

.module-nav,
.config-content {
  display: flex;
  flex-direction: column;
  min-width: 0;
  height: 100%;
  min-height: 0;
  overflow: hidden;
  background: var(--el-bg-color);
  border-radius: 4px;
}

.module-nav-header {
  display: flex;
  flex-shrink: 0;
  gap: 8px;
  align-items: center;
  justify-content: space-between;
  height: var(--crud-head-height, 49px);
  padding: 0 10px;
  border-bottom: 1px solid var(--el-border-color-extra-light);
}

.module-nav-header h2,
.config-title h2 {
  margin: 0;
  font-size: var(--el-font-size-base);
  font-weight: 500;
  color: var(--el-text-color-primary);
}

.module-search {
  flex-shrink: 0;
  padding: 10px;
  border-bottom: 1px solid var(--el-border-color-extra-light);
}

.module-error {
  flex-shrink: 0;
  width: auto;
  margin: 10px 10px 0;
}

.module-scroll {
  flex: 1;
  min-height: 0;
  padding: 6px 5px 10px;
}

.module-scroll :deep(.el-tree-node__content) {
  height: 36px;
  border-radius: 6px;
}

.module-scroll :deep([aria-disabled="true"] > .el-tree-node__content) {
  color: var(--el-text-color-disabled);
  cursor: not-allowed;
}

.module-node-label {
  padding-right: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.config-content {
  padding: 0 16px 12px;
}

.config-header,
.config-title,
.config-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.config-header {
  flex-shrink: 0;
  justify-content: space-between;
  min-height: var(--crud-head-height, 49px);
  padding: 8px 16px;
  margin: 0 -16px 8px;
  border-bottom: 1px solid var(--el-border-color-extra-light);
}

.config-actions :deep(.el-button + .el-button) {
  margin-left: 0;
}

.config-error {
  flex-shrink: 0;
}

.config-empty,
.config-tabs {
  flex: 1;
  min-height: 0;
}

.config-tabs {
  display: flex;
  flex-direction: column;
}

.config-tabs > :deep(.el-tabs__content) {
  flex: 1;
  min-height: 0;
}

.config-tab-pane {
  height: 100%;
}

.config-tab-pane :deep(.config-tab-view) {
  padding: 0 12px 8px 0;
}

.list-options {
  width: 100%;
  padding: 12px 0 0;
  margin-bottom: 16px;
}

.list-settings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 224px), 1fr));
  gap: 0 24px;
}

.list-options :deep(.el-select) {
  width: 100%;
  min-width: 0;
}

.list-options :deep(.el-form-item__content) {
  display: grid;
  gap: 4px;
  place-items: start start;
}

.sort-settings {
  display: grid;
  flex: 1;
  gap: 8px;
  justify-items: start;
  min-width: 0;
}

.sort-row {
  display: grid;
  grid-template-columns: minmax(0, 204px) minmax(0, 96px) auto;
  gap: 8px;
  width: 100%;
  max-width: 388px;
}

.config-help,
.config-table-help,
.config-preview-header,
.config-preview-empty {
  font-size: var(--el-font-size-small);
  line-height: 1.5;
  color: var(--el-text-color-secondary);
}

.config-table-help {
  margin: 8px 0 12px;
}

.form-preview-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  justify-content: space-between;
}

.config-preview {
  margin-top: 16px;
  overflow: hidden;
  border: 1px solid var(--el-border-color-light);
  border-radius: 4px;
}

.config-preview-header {
  padding: 6px 12px;
  background: var(--el-fill-color-light);
}

.config-preview-empty {
  padding: 12px;
  margin: 0;
}

.list-preview-table :deep(.el-table__empty-block) {
  display: none;
}

.config-drag-handle {
  display: inline-grid;
  place-items: center;
  width: 28px;
  height: 28px;
  padding: 0;
  font-size: 16px;
  color: var(--el-text-color-secondary);
  touch-action: none;
  cursor: grab;
  background: transparent;
  border: 0;
  border-radius: 4px;
}

.config-drag-handle:hover:not(:disabled),
.config-drag-handle:focus-visible {
  color: var(--el-color-primary);
  background: var(--el-fill-color-light);
}

.config-drag-handle:disabled {
  color: var(--el-text-color-disabled);
  cursor: not-allowed;
}

pre {
  overflow: auto;
  white-space: pre-wrap;
}
</style>
