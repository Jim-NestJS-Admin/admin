<script setup lang="ts">
import {
  computed,
  onBeforeUnmount,
  onMounted,
  ref,
  useSlots,
  watch
} from "vue";
import { useI18n } from "vue-i18n";
import { useElementSize, useMediaQuery, useNow } from "@vueuse/core";
import { onSessionReset } from "@/platform/lifecycle";
import {
  ElMessageBox,
  ElDrawer,
  ElDialog,
  ElSplitter,
  ElSplitterPanel
} from "element-plus";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import SearchIcon from "~icons/ri/search-line";
import AddIcon from "~icons/ri/add-circle-line";
import DeleteIcon from "~icons/ri/delete-bin-line";
import DownloadIcon from "~icons/ri/download-2-line";
import RecycleIcon from "~icons/ri/recycle-line";
import BackIcon from "~icons/ri/arrow-go-back-line";
import ViewIcon from "~icons/ri/eye-line";
import EditIcon from "~icons/ri/edit-line";
import FilterIcon from "~icons/ri/filter-3-line";
import RefreshIcon from "@/assets/table-bar/refresh.svg?component";
import { useFillHeight } from "./useFillHeight";
import { useHeadStyle } from "./useHeadStyle";
import ChildEditor from "./ChildEditor.vue";
import AdvancedQuery from "./AdvancedQuery.vue";
import ColumnSettings from "./ColumnSettings.vue";
import ClearIcon from "~icons/ri/close-circle-line";
import ArrowDownIcon from "~icons/ri/arrow-down-s-line";
import {
  cellText,
  columnChoices,
  defaultCell,
  formatValue,
  formPresentation
} from "./model.mjs";
import { useCrud } from "./useCrud";
import type {
  CrudPort,
  CrudCell,
  CrudRecord,
  CrudChoices,
  CrudExportFormat
} from "./types";
const props = withDefaults(
  defineProps<{
    port: CrudPort;
    pageKey: string;
    permissions?: {
      create?: string;
      info?: string;
      update?: string;
      remove?: string;
      recycle?: string;
      restore?: string;
      purge?: string;
      export?: string;
    };
    cell?: (row: CrudRecord, field: string) => CrudCell;
    childCell?: (resource: string, row: CrudRecord, field: string) => CrudCell;
    /** 撑满内容区（默认）：只有表格内部滚动，整页不滚动 */
    fill?: boolean;
  }>(),
  { fill: true }
);
const { t } = useI18n();
const slots = useSlots();
const fill = computed(() => props.fill);
const pageEl = ref<HTMLElement>();
const fillHeight = useFillHeight(pageEl);
const headStyle = useHeadStyle();
const mobile = useMediaQuery("(max-width: 760px)");
/** 平板及更窄时左侧树收进「分类筛选」抽屉，让表格占满宽度 */
const treeInDrawer = useMediaQuery("(max-width: 1024px)");
/** 列表区本身变窄（窗口窄、左侧面板拉宽）时按紧凑排版：搜索整行、分页精简 */
const mainEl = ref<HTMLElement>();
const { width: mainWidth } = useElementSize(mainEl);
const compact = computed(
  () => mobile.value || (mainWidth.value > 0 && mainWidth.value < 640)
);
const treeOpen = ref(false);
const activeChild = ref("");
const stopReset = onSessionReset(() => {
  treeOpen.value = false;
});
onBeforeUnmount(stopReset);
const view = useCrud(
  props.port,
  props.pageKey,
  (row, field) => (props.cell ?? defaultCell)(row, field),
  (resource, row, field) =>
    props.childCell
      ? props.childCell(resource, row, field)
      : defaultCell(row, field)
);
const {
  schema,
  rows,
  selected,
  total,
  loading,
  saving,
  error,
  fields,
  rowIssues,
  recycledView,
  choices,
  baselineChoices,
  query,
  editor,
  visibleColumns,
  retryUntil
} = view;
const exporting = ref(false);
let exportRequest: AbortController | undefined;
const stopExport = onSessionReset(() => exportRequest?.abort());
onBeforeUnmount(() => {
  stopExport();
  exportRequest?.abort();
});
/** 按当前查询条件和可见列（显示顺序）导出；文件名用「页面名_年月日_时分」 */
async function exportRows(format: CrudExportFormat) {
  if (!props.port.export || exporting.value) return;
  exportRequest = new AbortController();
  const request = exportRequest;
  exporting.value = true;
  try {
    const file = await props.port.export(
      JSON.parse(JSON.stringify(query)),
      request.signal,
      {
        format,
        columns: visibleColumns.value
          .map(column => column.field)
          .filter((field): field is string => typeof field === "string")
      }
    );
    if (request.signal.aborted) return;
    const url = URL.createObjectURL(file),
      link = document.createElement("a");
    link.href = url;
    const title = (schema.value.label || schema.value.resource).replace(
      /[\\/:*?"<>|\s]+/g,
      "-"
    );
    const now = new Date(),
      pad = (value: number) => String(value).padStart(2, "0");
    const stamp = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}`;
    link.download = `${title}_${stamp}.${format}`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  } catch (reason) {
    if (!request.signal.aborted)
      error.value =
        reason instanceof Error ? reason.message : "crud.requestFailed";
  } finally {
    exporting.value = false;
  }
}
watch(
  () => editor.open,
  open => {
    activeChild.value = open
      ? (schema.value?.children?.[0]?.resource ?? "")
      : "";
  }
);
watch(rowIssues, issues => {
  const group = issues.find(issue =>
    schema.value?.children?.some(child => child.resource === issue.group)
  )?.group;
  if (group) activeChild.value = group;
});
const now = useNow({ interval: 1000 });
const retrySeconds = computed(() =>
  Math.max(0, Math.ceil((retryUntil.value - now.value.getTime()) / 1000))
);
const formItems = computed(
  () =>
    schema.value?.form.filter(item =>
      editor.mode === "add"
        ? item.edit !== "none"
        : editor.record &&
          readCell(editor.record, item.field).state !== "hidden"
    ) ?? []
);
/**
 * 详情：表单里的字段 + 列表里有、表单里没有的字段（如创建时间），
 * 类型取列表列的类型（没有列时按表单组件推断），和列表显示一致。
 */
const infoItems = computed(() => {
  const record = editor.record,
    current = schema.value;
  if (!editor.readOnly || !record || !current) return [];
  const typeOf = (field: string, component?: string) =>
    current.columns.find(column => column.field === field)?.type ??
    (component === "switch"
      ? "boolean"
      : component === "date" || component === "datetime"
        ? component
        : undefined);
  const items: {
    field: string;
    label: string;
    dict?: string;
    type?: string;
    wide: boolean;
  }[] = [];
  const seen = new Set<string>();
  for (const item of current.form) {
    if (readCell(record, item.field).state === "hidden") continue;
    seen.add(item.field);
    items.push({
      field: item.field,
      label: item.label,
      dict: item.dict,
      type: typeOf(item.field, item.component),
      wide: item.component === "textarea"
    });
  }
  for (const column of current.columns)
    if (
      !seen.has(column.field) &&
      readCell(record, column.field).state !== "hidden"
    )
      items.push({
        field: column.field,
        label: column.label,
        dict: column.dict,
        type: column.type,
        wide: false
      });
  return items;
});
/** 头像等图片地址在详情里直接显示图片 */
function imageUrl(value: unknown) {
  return typeof value === "string" &&
    /^(https?:\/\/|\/|data:image\/)/.test(value) &&
    /(^data:image\/|\.(png|jpe?g|gif|webp|svg)(\?.*)?$)/i.test(value)
    ? value
    : "";
}
function readCell(row: CrudRecord, field: string) {
  return (props.cell ?? defaultCell)(row, field);
}
function writable(item) {
  return (
    !editor.readOnly &&
    schema.value?.actions[editor.mode]?.writable.includes(item.field) &&
    (item.edit === "both" || (item.edit === "add" && editor.mode === "add")) &&
    (!editor.record || readCell(editor.record, item.field).state === "visible")
  );
}
function display(row: CrudRecord, column) {
  const cell = readCell(row, column.field);
  if (
    column.type === "boolean" &&
    cell.state === "visible" &&
    typeof cell.display === "boolean"
  )
    return t(cell.display ? "crud.booleanYes" : "crud.booleanNo");
  return cellText(
    readCell(row, column.field),
    schema.value?.dictionaries[column.dict],
    column.type
  );
}
/** 关键字搜索的提示：列出能搜的字段名 */
const keywordHint = computed(() => {
  const words = schema.value?.actions.page?.keyWords ?? [];
  const labels = words.map(
    field =>
      schema.value?.columns.find(column => column.field === field)?.label ??
      field
  );
  return labels.length
    ? t("crud.keywordHint", { fields: labels.join(" / ") })
    : t("crud.search");
});
function columnAlign(column) {
  return ["boolean", "datetime", "date", "number"].includes(column.type)
    ? "center"
    : "left";
}
/** 没设列宽时的最小宽度：按类型给一个够用的值，表格有空余时再按比例撑开 */
const TYPE_WIDTH = {
  boolean: 80,
  number: 90,
  date: 110,
  datetime: 160,
  reference: 140,
  json: 160
};
function autoWidth(column) {
  const base = TYPE_WIDTH[column.type] ?? 100;
  const title =
    [...String(column.label ?? "")].length * 14 + (column.sortable ? 52 : 32);
  return Math.max(base, title);
}
/** 操作列宽度：按实际会出现的按钮数 */
const actionWidth = computed(() => {
  const count =
    (props.permissions?.info && schema.value?.api.includes("info") ? 1 : 0) +
    (props.port.update && schema.value?.api.includes("update") ? 1 : 0) +
    (props.port.remove && schema.value?.api.includes("delete") ? 1 : 0);
  return Math.max(90, count * 66 + 14);
});
async function confirmRemove(ids: string[]) {
  const description = schema.value;
  try {
    await ElMessageBox.confirm(
      t("crud.confirmRemove", { count: ids.length }),
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
  // 确认框打开期间发生组织切换时，旧选择已清除，不能提交旧上下文的删除。
  if (
    !schema.value ||
    schema.value !== description ||
    !ids.every(id => rows.value.some(row => row.id === id))
  )
    return;
  await view.remove(ids);
}
onMounted(view.initialize);
async function confirmRecycle(action: "restore" | "purge") {
  const description = schema.value;
  const records = rows.value
    .filter(row => selected.value.includes(String(row.id)))
    .map(row => ({ id: row.id, version: row.version }));
  if (!records.length) return;
  try {
    await ElMessageBox.confirm(
      t(action === "purge" ? "crud.confirmPurge" : "crud.confirmRestore", {
        count: records.length
      }),
      t(`crud.${action}`),
      {
        type: "warning",
        confirmButtonText: t("crud.confirm"),
        cancelButtonText: t("crud.cancel")
      }
    );
  } catch {
    return;
  }
  if (
    schema.value !== description ||
    !recycledView.value ||
    !records.every(record =>
      rows.value.some(
        row => row.id === record.id && row.version === record.version
      )
    )
  )
    return;
  await view.recycleAction(action, records);
}
defineExpose({ reload: view.initialize });
</script>

<template>
  <section
    ref="pageEl"
    class="crud-page"
    :style="[headStyle, fill ? { height: `${fillHeight}px` } : {}]"
    :aria-label="schema?.label ?? t('crud.title')"
  >
    <el-splitter v-if="schema" class="crud-splitter" lazy>
      <el-splitter-panel
        v-if="slots.tree && !treeInDrawer && !recycledView"
        size="220px"
        min="180px"
        max="400px"
        collapsible
      >
        <aside class="crud-card crud-tree">
          <slot name="tree" :filter="view.filter" />
        </aside>
      </el-splitter-panel>
      <el-splitter-panel>
        <div
          ref="mainEl"
          class="crud-main crud-card"
          :class="{ 'is-compact': compact }"
        >
          <!-- 工具栏（cool 结构）：左边操作按钮，右边关键字搜索、高级搜索、列设置 -->
          <div class="crud-toolbar">
            <div class="crud-actions">
              <el-button
                v-if="slots.tree && treeInDrawer && !recycledView"
                :icon="useRenderIcon(FilterIcon)"
                @click="treeOpen = true"
                >{{ t("crud.filter") }}</el-button
              >
              <el-button
                v-if="
                  port.create && schema.api.includes('add') && !recycledView
                "
                v-perm="permissions?.create ?? []"
                type="primary"
                :icon="useRenderIcon(AddIcon)"
                :disabled="saving"
                @click="view.edit()"
                >{{ t("crud.add") }}</el-button
              >
              <slot name="toolbar" :query="query" :reload="view.load" />
              <el-button
                v-if="
                  port.remove && schema.api.includes('delete') && !recycledView
                "
                v-perm="permissions?.remove ?? []"
                type="danger"
                :icon="useRenderIcon(DeleteIcon)"
                :disabled="saving || !selected.length"
                @click="confirmRemove([...selected])"
                >{{ t("crud.remove") }}</el-button
              >
              <el-button
                v-if="
                  recycledView && port.restore && schema.api.includes('restore')
                "
                v-perm="permissions?.restore ?? []"
                type="primary"
                :disabled="saving || !selected.length || retrySeconds > 0"
                @click="confirmRecycle('restore')"
                >{{ t("crud.restore") }}</el-button
              >
              <el-button
                v-if="
                  recycledView && port.purge && schema.api.includes('purge')
                "
                v-perm="permissions?.purge ?? []"
                type="danger"
                :disabled="saving || !selected.length || retrySeconds > 0"
                @click="confirmRecycle('purge')"
                >{{ t("crud.purge") }}</el-button
              >
              <el-dropdown
                v-if="port.export && !recycledView"
                v-perm="permissions?.export ?? []"
                trigger="click"
                :disabled="exporting"
                @command="exportRows"
              >
                <el-button
                  :icon="useRenderIcon(DownloadIcon)"
                  :loading="exporting"
                  >{{ t("query.export")
                  }}<component :is="ArrowDownIcon" class="crud-caret"
                /></el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item command="xlsx">{{
                      t("query.exportExcel")
                    }}</el-dropdown-item>
                    <el-dropdown-item command="csv">{{
                      t("query.exportCsv")
                    }}</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
              <el-button
                v-if="
                  port.recycled &&
                  schema.deleteMode === 'soft' &&
                  schema.api.includes('recycle')
                "
                v-perm="permissions?.recycle ?? []"
                :icon="useRenderIcon(recycledView ? BackIcon : RecycleIcon)"
                :disabled="saving"
                @click="view.showRecycled(!recycledView)"
                >{{
                  t(recycledView ? "crud.activeList" : "crud.recycle")
                }}</el-button
              >
              <el-tag v-if="recycledView" type="warning" effect="plain">{{
                t("crud.recycle")
              }}</el-tag>
            </div>
            <div class="crud-flex1" />
            <!-- 右侧（参考 xinliwei）：关键字搜索 + 刷新、高级查询、列设置，拼成一组 -->
            <form class="crud-search" @submit.prevent="view.search">
              <el-input
                v-if="schema.actions.page?.keyWords.length"
                v-model="query.search"
                :aria-label="t('crud.search')"
                :placeholder="keywordHint"
                class="crud-keyword"
              >
                <template #suffix>
                  <button
                    v-if="query.search"
                    type="button"
                    class="crud-input-btn is-clear"
                    :aria-label="t('crud.clear')"
                    @click="
                      () => {
                        query.search = '';
                        view.search();
                      }
                    "
                  >
                    <component :is="ClearIcon" />
                  </button>
                  <button
                    type="submit"
                    class="crud-input-btn"
                    :aria-label="t('crud.search')"
                    :title="t('crud.search')"
                  >
                    <component :is="SearchIcon" />
                  </button>
                </template>
              </el-input>
              <div class="crud-addons">
                <el-tooltip :content="t('crud.refresh')" placement="top">
                  <button
                    type="button"
                    class="crud-addon"
                    :class="{ 'is-loading': loading }"
                    :disabled="loading"
                    :aria-label="t('crud.refresh')"
                    @click="view.load"
                  >
                    <component :is="RefreshIcon" class="crud-addon-icon" />
                  </button>
                </el-tooltip>
                <slot
                  v-if="!recycledView"
                  name="advanced"
                  :apply="
                    (value: unknown) => {
                      query.advanced = value;
                      view.search();
                    }
                  "
                >
                  <AdvancedQuery
                    :schema="schema"
                    @apply="
                      value => {
                        query.advanced = value;
                        view.search();
                      }
                    "
                  />
                </slot>
                <ColumnSettings
                  :schema="schema"
                  :choices="choices"
                  :baseline="baselineChoices"
                  :disabled="saving"
                  @save="value => view.saveChoices(value)"
                />
              </div>
            </form>
          </div>
          <el-alert
            v-if="error"
            :title="t(error)"
            type="error"
            show-icon
            :closable="false"
            class="crud-error"
          />
          <div class="crud-table">
            <el-table
              v-loading="loading"
              :data="rows"
              row-key="id"
              :default-expand-all="!!schema.tree"
              :tree-props="{
                children: '__crudTreeChildren',
                hasChildren: '__crudTreeHasChildren'
              }"
              height="100%"
              :size="
                choices.density === 'default' ? undefined : choices.density
              "
              :header-cell-style="{
                background: 'var(--el-fill-color-light)',
                color: 'var(--el-text-color-primary)'
              }"
              @selection-change="selected = $event.map(row => String(row.id))"
              @sort-change="view.sort($event.prop, $event.order)"
            >
              <el-table-column
                v-if="
                  recycledView
                    ? (port.restore && permissions?.restore) ||
                      (port.purge && permissions?.purge)
                    : port.remove && permissions?.remove
                "
                type="selection"
                width="48"
                align="center"
                fixed="left"
              />
              <el-table-column
                v-for="column in visibleColumns"
                :key="column.field"
                :prop="column.field"
                :label="column.label"
                :min-width="column.width ?? autoWidth(column)"
                :fixed="column.fixed"
                :align="columnAlign(column)"
                show-overflow-tooltip
                :sortable="
                  !recycledView &&
                  column.sortable &&
                  schema.actions.page?.sortable.includes(column.field)
                    ? 'custom'
                    : false
                "
              >
                <template #default="{ row }">
                  <slot
                    v-if="readCell(row, column.field).state === 'visible'"
                    :name="`cell-${column.field}`"
                    :value="readCell(row, column.field).display"
                    :text="display(row, column)"
                    ><el-tag
                      v-if="
                        column.type === 'boolean' &&
                        typeof readCell(row, column.field).display === 'boolean'
                      "
                      size="small"
                      :type="
                        readCell(row, column.field).display ? 'success' : 'info'
                      "
                      effect="light"
                      >{{ display(row, column) }}</el-tag
                    ><template v-else>{{
                      display(row, column)
                    }}</template></slot
                  >
                  <span v-else class="crud-muted">{{
                    display(row, column)
                  }}</span>
                </template>
              </el-table-column>
              <el-table-column
                v-if="recycledView"
                prop="deletedAt"
                :label="t('crud.deletedAt')"
                min-width="170"
                align="center"
              >
                <template #default="{ row }">{{
                  formatValue(row.deletedAt, "datetime")
                }}</template>
              </el-table-column>
              <el-table-column
                v-if="
                  (port.update || port.remove || permissions?.info) &&
                  !recycledView
                "
                :label="t('crud.actions')"
                fixed="right"
                :width="actionWidth"
                align="center"
              >
                <template #default="{ row }"
                  ><el-button
                    v-if="permissions?.info && schema.api.includes('info')"
                    v-perm="permissions.info"
                    link
                    type="primary"
                    :icon="useRenderIcon(ViewIcon)"
                    :disabled="saving"
                    @click="view.edit(row, true)"
                    >{{ t("crud.info") }}</el-button
                  ><el-button
                    v-if="port.update && schema.api.includes('update')"
                    v-perm="permissions?.update ?? []"
                    link
                    type="primary"
                    :icon="useRenderIcon(EditIcon)"
                    :disabled="saving"
                    @click="view.edit(row)"
                    >{{ t("crud.edit") }}</el-button
                  ><el-button
                    v-if="port.remove && schema.api.includes('delete')"
                    v-perm="permissions?.remove ?? []"
                    link
                    type="danger"
                    :icon="useRenderIcon(DeleteIcon)"
                    :disabled="saving"
                    @click="confirmRemove([String(row.id)])"
                    >{{ t("crud.remove") }}</el-button
                  ></template
                >
              </el-table-column>
            </el-table>
          </div>
          <footer class="crud-pagination">
            <el-pagination
              v-if="
                !schema.tree ||
                recycledView ||
                query.search ||
                query.advanced ||
                Object.keys(query.equality).length
              "
              v-model:current-page="query.pageNumber"
              v-model:page-size="query.pageSize"
              background
              :page-sizes="
                [...new Set([10, 20, 50, 100, query.pageSize])]
                  .filter(size => size <= schema.maxSize)
                  .sort((a, b) => a - b)
              "
              :total="total"
              :size="choices.density === 'small' ? 'small' : 'default'"
              :layout="
                mobile
                  ? 'prev, pager, next'
                  : compact
                    ? 'total, prev, pager, next'
                    : 'total, sizes, prev, pager, next, jumper'
              "
              @size-change="view.search"
              @current-change="view.load"
            />
          </footer>
        </div>
      </el-splitter-panel>
    </el-splitter>
    <div v-else class="crud-unavailable">
      <el-alert
        v-if="error"
        :title="t(error)"
        type="error"
        :closable="false"
      /><el-button :loading="loading" @click="view.initialize">{{
        t("crud.reload")
      }}</el-button>
    </div>
    <el-drawer
      v-model="treeOpen"
      :title="t('crud.filter')"
      direction="ltr"
      :size="mobile ? '85%' : '320px'"
      ><slot name="tree" :filter="view.filter"
    /></el-drawer>
    <component
      :is="formPresentation(schema).mode === 'dialog' ? ElDialog : ElDrawer"
      :model-value="editor.open"
      :width="
        schema?.children?.length || slots['editor-related']
          ? 'min(1080px, 96vw)'
          : 'min(720px, 96vw)'
      "
      class="crud-editor"
      :title="
        t(
          editor.readOnly
            ? 'crud.infoOf'
            : editor.mode === 'add'
              ? 'crud.addOf'
              : 'crud.editOf',
          { name: schema?.label ?? '' }
        )
      "
      :size="
        mobile
          ? '100%'
          : schema?.children?.length || slots['editor-related']
            ? 'min(1080px, 92vw)'
            : '560px'
      "
      :close-on-click-modal="!saving"
      :close-on-press-escape="!saving"
      :show-close="!saving"
      :before-close="
        done => {
          if (!saving) {
            view.closeEditor();
            done();
          }
        }
      "
    >
      <el-alert v-if="error" :title="t(error)" type="error" :closable="false" />
      <el-alert
        v-if="retrySeconds"
        :title="t('admin.retryAfter', { seconds: retrySeconds })"
        type="warning"
        :closable="false"
      />
      <!-- 详情：两列描述列表（Pure / Element 的 Descriptions），值和列表显示一致 -->
      <el-descriptions
        v-if="editor.readOnly && editor.record"
        class="crud-info"
        :column="mobile ? 1 : 2"
        border
      >
        <el-descriptions-item
          v-for="item in infoItems"
          :key="item.field"
          :label="item.label"
          :span="item.wide && !mobile ? 2 : 1"
          label-class-name="crud-info-label"
        >
          <slot
            v-if="slots[`detail-${item.field}`]"
            :name="`detail-${item.field}`"
            :record="editor.record"
            :field="item.field"
          />
          <el-tag
            v-else-if="
              item.type === 'boolean' &&
              readCell(editor.record, item.field).state === 'visible' &&
              typeof readCell(editor.record, item.field).display === 'boolean'
            "
            size="small"
            effect="light"
            :type="
              readCell(editor.record, item.field).display ? 'success' : 'info'
            "
            >{{ display(editor.record, item) }}</el-tag
          >
          <el-avatar
            v-else-if="imageUrl(readCell(editor.record, item.field).display)"
            :size="40"
            :src="imageUrl(readCell(editor.record, item.field).display)"
          />
          <span
            v-else
            :class="{
              'crud-muted':
                readCell(editor.record, item.field).state !== 'visible'
            }"
            >{{ display(editor.record, item) }}</span
          >
        </el-descriptions-item>
      </el-descriptions>
      <el-form
        v-else
        class="crud-editor-form"
        :label-position="mobile ? 'top' : 'right'"
        label-width="110px"
        @submit.prevent="view.save"
      >
        <el-form-item
          v-for="item in formItems"
          :key="item.field"
          :label="
            formPresentation(schema, item.field).group
              ? `${formPresentation(schema, item.field).group} / ${item.label}`
              : item.label
          "
          :class="{
            'half-field': formPresentation(schema, item.field).span === 12
          }"
          :required="item.required && writable(item)"
          :error="fields[item.field]?.map(message => t(message)).join('；')"
        >
          <template v-if="!writable(item)"
            ><span>{{
              editor.record
                ? cellText(
                    readCell(editor.record, item.field),
                    schema.dictionaries[item.dict]
                  )
                : "—"
            }}</span></template
          >
          <slot
            v-else
            :name="`form-${item.field}`"
            :values="editor.values"
            :field="item.field"
            :disabled="saving"
          >
            <el-tree-select
              v-if="item.component === 'tree-select' && schema.tree"
              v-model="editor.values[item.field]"
              :data="
                view.treeOptions.value.map(row => ({
                  value: row.id,
                  label: String(row[schema.tree.nameField] ?? row.id),
                  disabled: row.id === editor.record?.id
                }))
              "
              :aria-label="item.label"
              :disabled="saving"
              clearable
              filterable
              check-strictly
            />
            <el-input-number
              v-else-if="item.component === 'number'"
              v-model="editor.values[item.field] as number"
              :aria-label="item.label"
              :disabled="saving"
            />
            <el-switch
              v-else-if="item.component === 'switch'"
              v-model="editor.values[item.field] as boolean"
              :aria-label="item.label"
              :disabled="saving"
            />
            <el-select
              v-else-if="item.component === 'select'"
              v-model="editor.values[item.field]"
              :aria-label="item.label"
              :disabled="saving"
              clearable
              ><el-option
                v-for="option in schema.dictionaries[item.dict] ?? []"
                :key="String(option.value)"
                :label="option.label"
                :value="option.value"
            /></el-select>
            <el-date-picker
              v-else-if="
                item.component === 'date' || item.component === 'datetime'
              "
              v-model="editor.values[item.field] as string"
              :type="item.component"
              :value-format="
                item.component === 'date'
                  ? 'YYYY-MM-DD'
                  : 'YYYY-MM-DDTHH:mm:ssZ'
              "
              :aria-label="item.label"
              :disabled="saving"
            />
            <el-input
              v-else
              v-model="editor.values[item.field] as string"
              :type="item.component === 'textarea' ? 'textarea' : 'text'"
              :aria-label="item.label"
              :placeholder="item.placeholder"
              :disabled="saving"
            />
          </slot>
        </el-form-item>
        <!-- 不在实体上的额外输入（例如新建租户时的管理员账号），由页面自己提交 -->
        <slot
          name="form-extra"
          :mode="editor.mode"
          :values="editor.values"
          :errors="fields"
          :disabled="saving"
        />
      </el-form>
      <el-tabs
        v-if="schema?.children?.length"
        v-model="activeChild"
        class="crud-children-tabs"
      >
        <el-tab-pane
          v-for="child in schema.children"
          :key="child.resource"
          :label="child.label"
          :name="child.resource"
        >
          <ChildEditor
            v-if="
              editor.related.find(group => group.resource === child.resource)
            "
            :child="child"
            :draft="
              editor.related.find(group => group.resource === child.resource)
            "
            :dictionaries="schema.dictionaries"
            :disabled="saving || editor.readOnly"
            :readonly="editor.readOnly"
            :issues="rowIssues"
            :cell="
              (row, field) =>
                childCell
                  ? childCell(child.resource, row, field)
                  : defaultCell(row, field)
            "
          />
        </el-tab-pane>
      </el-tabs>
      <slot
        v-if="editor.open && editor.record"
        name="editor-related"
        :record="editor.record"
      />
      <template #footer
        ><el-button :disabled="saving" @click="view.closeEditor">{{
          t(editor.readOnly ? "crud.close" : "crud.cancel")
        }}</el-button
        ><el-button
          v-if="!editor.readOnly"
          type="primary"
          :loading="saving"
          :disabled="retrySeconds > 0"
          @click="view.save"
          >{{ t("crud.save") }}</el-button
        ></template
      >
    </component>
  </section>
</template>

<style scoped lang="scss">
@keyframes crud-spin {
  to {
    transform: rotate(360deg);
  }
}

@media (width <= 760px) {
  .crud-editor-form :deep(.el-form-item.half-field) {
    grid-column: 1 / -1;
  }
}

@media (width <= 760px) {
  .crud-main {
    padding: 12px;
  }

  .crud-search {
    width: 100%;
  }

  .crud-keyword {
    flex: 1;
    width: auto;
  }
}

/* 详情：标签列固定宽度、浅灰底，值列铺满；下面的页签（关联数据）留出间距 */
.crud-info {
  margin-bottom: 20px;
}

.crud-info :deep(.crud-info-label) {
  width: 120px;
  font-weight: normal;
  color: var(--el-text-color-secondary);
  white-space: nowrap;
}

.crud-info :deep(.el-descriptions__content) {
  word-break: break-all;
}

.crud-editor-form {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0 16px;
  padding: 8px 8px 0 0;
}

.crud-editor-form :deep(.el-select),
.crud-editor-form :deep(.el-input-number),
.crud-editor-form :deep(.el-date-editor) {
  width: 100%;
}

.crud-editor-form :deep(.el-form-item) {
  grid-column: 1 / -1;
}

.crud-editor-form :deep(.el-form-item.half-field) {
  grid-column: auto;
}

/* 整体：撑满内容区，只有表格内部滚动（cool 结构：左侧树卡片 + 右侧一张卡片） */
.crud-page {
  min-height: 0;
  overflow: hidden;
}

.crud-splitter {
  height: 100%;
}

/* 面板内容不整体横向滚动：表格自己有横向滚动条 */
.crud-splitter :deep(.el-splitter-panel) {
  overflow: hidden;
}

/* 紧凑排版：搜索组独占一行并撑满，输入框随宽度伸缩 */
.crud-main.is-compact .crud-search {
  width: 100%;
}

.crud-main.is-compact .crud-keyword {
  flex: 1;
  width: auto;
  min-width: 0;
}

.crud-splitter :deep(.el-splitter-bar) {
  width: 8px !important;
}

.crud-card {
  background: var(--el-bg-color);
  border-radius: 4px;
}

.crud-tree {
  height: 100%;
  overflow: hidden;
}

.crud-main {
  display: flex;
  flex-direction: column;
  min-width: 0;
  height: 100%;
  min-height: 0;
  padding: 0 16px 12px;
}

/* 工具栏：左按钮、中间撑开、右搜索，一行放下，放不下时右侧整体换行。
   高度和底边线与左侧树的标题栏一致（--crud-head-height） */
.crud-toolbar {
  display: flex;
  flex-shrink: 0;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  min-height: var(--crud-head-height, 49px);
  padding: 8px 16px;
  margin: 0 -16px 12px;
  border-bottom: 1px solid var(--el-border-color-extra-light);
}

.crud-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

/* 搜索框和右侧按钮拼成一组：两边都用 1px 内阴影画边框、同一个高度，边线才不会错位 */
.crud-search {
  display: flex;
  align-items: stretch;
  height: var(--crud-control-height, 32px);
}

.crud-flex1 {
  flex: 1;
}

.crud-actions :deep(.el-button + .el-button) {
  margin-left: 0;
}

/* 导出按钮右侧的下拉箭头 */
.crud-caret {
  width: 14px;
  height: 14px;
  margin-left: 4px;
}

.crud-keyword {
  width: 220px;
  height: 100%;
}

.crud-keyword :deep(.el-input__wrapper) {
  padding-right: 4px;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

/* 获得焦点或悬停时输入框的边框盖在按钮组左边线上面 */
.crud-keyword :deep(.el-input__wrapper.is-focus),
.crud-keyword :deep(.el-input__wrapper:hover) {
  position: relative;
  z-index: 1;
}

/* 输入框里的清空、搜索小按钮 */
.crud-input-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  padding: 0;
  margin-left: 2px;
  font-size: 14px;
  color: var(--el-text-color-secondary);
  cursor: pointer;
  background: transparent;
  border: none;
  border-radius: 4px;
}

.crud-input-btn:hover {
  color: var(--el-color-primary);
  background: var(--el-color-primary-light-9);
}

.crud-input-btn.is-clear {
  color: var(--el-text-color-placeholder);
}

/* 刷新、高级查询、列设置：一组图标按钮，有搜索框时接在它右边。
   外框画在 ::after 上并盖住按钮，悬停底色不会把边线遮掉 */
.crud-addons {
  position: relative;
  display: flex;
  height: 100%;
  overflow: hidden;
  background: var(--el-fill-color-blank);
  border-radius: var(--el-border-radius-base);
}

.crud-addons::after {
  position: absolute;
  inset: 0;
  pointer-events: none;
  content: "";
  border-radius: inherit;
  box-shadow: 0 0 0 1px var(--el-border-color) inset;
}

.crud-keyword + .crud-addons {
  margin-left: -1px;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}

.crud-addons :deep(.crud-addon) {
  display: inline-flex;
  gap: 4px;
  align-items: center;
  justify-content: center;
  min-width: 36px;
  height: 100%;
  padding: 0 10px;
  font-size: 14px;
  color: var(--el-text-color-regular);
  cursor: pointer;
  background: transparent;
  border: none;
}

.crud-addons :deep(.crud-addon:not(:first-child)) {
  border-left: 1px solid var(--el-border-color);
}

.crud-addons :deep(.crud-addon:disabled) {
  cursor: default;
}

.crud-addons :deep(.crud-addon.is-loading .crud-addon-icon) {
  animation: crud-spin 1s linear infinite;
}

.crud-addons :deep(.crud-addon:hover) {
  color: var(--el-color-primary);
  background: var(--el-fill-color-light);
}

.crud-addons :deep(.crud-addon.is-active) {
  color: var(--el-color-primary);
  background: var(--el-color-primary-light-9);
}

.crud-addons :deep(.crud-addon-icon) {
  width: 15px;
  height: 15px;
}

.crud-addons :deep(.crud-addon-count) {
  font-size: 12px;
  font-weight: 600;
}

.crud-density-active {
  color: var(--el-color-primary);
}

.crud-error {
  flex-shrink: 0;
  margin-bottom: 8px;
}

.crud-table {
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.crud-muted {
  color: var(--el-text-color-placeholder);
}

.crud-pagination {
  display: flex;
  flex-shrink: 0;
  justify-content: flex-end;
  padding-top: 12px;
  overflow-x: auto;
}

.crud-unavailable {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: flex-start;
  padding: 16px;
  background: var(--el-bg-color);
}
</style>
