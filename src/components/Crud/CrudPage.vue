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
import { useMediaQuery, useNow } from "@vueuse/core";
import { onSessionReset } from "@/platform/lifecycle";
import {
  ElMessageBox,
  ElDrawer,
  ElDialog,
  ElSplitter,
  ElSplitterPanel
} from "element-plus";
import ChildEditor from "./ChildEditor.vue";
import AdvancedQuery from "./AdvancedQuery.vue";
import {
  cellText,
  columnChoices,
  defaultCell,
  formPresentation
} from "./model.mjs";
import { useCrud } from "./useCrud";
import type { CrudPort, CrudCell, CrudRecord, CrudChoices } from "./types";
const props = defineProps<{
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
}>();
const { t } = useI18n();
const slots = useSlots();
const mobile = useMediaQuery("(max-width: 760px)");
const treeOpen = ref(false),
  settingsOpen = ref(false);
const draft = ref<CrudChoices>({ columns: [], density: "default" });
const activeChild = ref("");
const stopReset = onSessionReset(() => {
  treeOpen.value = false;
  settingsOpen.value = false;
  draft.value = { columns: [], density: "default" };
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
async function exportRows() {
  if (!props.port.export || exporting.value) return;
  exportRequest = new AbortController();
  const request = exportRequest;
  exporting.value = true;
  try {
    const file = await props.port.export(
      JSON.parse(JSON.stringify(query)),
      request.signal
    );
    if (request.signal.aborted) return;
    const url = URL.createObjectURL(file),
      link = document.createElement("a");
    link.href = url;
    link.download = `${schema.value.resource.replaceAll("/", "-")}.csv`;
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
  return cellText(
    readCell(row, column.field),
    schema.value?.dictionaries[column.dict]
  );
}
function openSettings() {
  draft.value = columnChoices(schema.value, choices.value);
  settingsOpen.value = true;
}
function move(index: number, delta: number) {
  const target = index + delta;
  if (target < 0 || target >= draft.value.columns.length) return;
  [draft.value.columns[index], draft.value.columns[target]] = [
    draft.value.columns[target],
    draft.value.columns[index]
  ];
}
async function applySettings() {
  if (await view.saveChoices(draft.value)) settingsOpen.value = false;
}
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
  <section class="crud-page" :aria-label="schema?.label ?? t('crud.title')">
    <el-splitter v-if="schema" class="crud-splitter">
      <el-splitter-panel
        v-if="slots.tree && !mobile && !recycledView"
        size="220px"
        min="160px"
        max="360px"
        collapsible
      >
        <aside class="crud-tree">
          <slot name="tree" :filter="view.filter" />
        </aside>
      </el-splitter-panel>
      <el-splitter-panel>
        <div class="crud-main">
          <header class="crud-toolbar">
            <div class="crud-actions">
              <el-button
                v-if="slots.tree && mobile && !recycledView"
                @click="treeOpen = true"
                >{{ t("crud.filter") }}</el-button
              >
              <el-button
                v-if="
                  port.create && schema.api.includes('add') && !recycledView
                "
                v-perm="permissions?.create ?? []"
                type="primary"
                :disabled="saving"
                @click="view.edit()"
                >{{ t("crud.add") }}</el-button
              >
              <el-button
                v-if="
                  port.remove && schema.api.includes('delete') && !recycledView
                "
                v-perm="permissions?.remove ?? []"
                :disabled="saving || !selected.length"
                @click="confirmRemove([...selected])"
                >{{ t("crud.batchRemove") }}</el-button
              >
              <slot name="toolbar" :query="query" :reload="view.load" />
              <el-button
                v-if="
                  port.recycled &&
                  schema.deleteMode === 'soft' &&
                  schema.api.includes('recycle')
                "
                v-perm="permissions?.recycle ?? []"
                :disabled="saving"
                @click="view.showRecycled(!recycledView)"
                >{{
                  t(recycledView ? "crud.activeList" : "crud.recycle")
                }}</el-button
              >
              <el-button
                v-if="
                  recycledView && port.restore && schema.api.includes('restore')
                "
                v-perm="permissions?.restore ?? []"
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
            </div>
            <form class="crud-search" @submit.prevent="view.search">
              <el-input
                v-if="schema.actions.page?.keyWords.length"
                v-model="query.search"
                clearable
                :aria-label="t('crud.search')"
                :placeholder="t('crud.search')"
              />
              <el-button
                v-if="schema.actions.page?.keyWords.length"
                native-type="submit"
                >{{ t("crud.search") }}</el-button
              >
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
              <el-button @click="openSettings">{{
                t("crud.columns")
              }}</el-button>
              <el-button
                v-if="port.export && !recycledView"
                v-perm="permissions?.export ?? []"
                :loading="exporting"
                @click="exportRows"
                >{{ t("query.export") }}</el-button
              >
            </form>
          </header>
          <el-alert
            v-if="error"
            :title="t(error)"
            type="error"
            show-icon
            :closable="false"
          />
          <div class="crud-table">
            <el-table
              v-loading="loading"
              :data="rows"
              row-key="id"
              :tree-props="{
                children: '__crudTreeChildren',
                hasChildren: '__crudTreeHasChildren'
              }"
              height="100%"
              :size="choices.density"
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
              />
              <el-table-column
                v-for="column in visibleColumns"
                :key="column.field"
                :prop="column.field"
                :label="column.label"
                :width="column.width"
                :fixed="column.fixed"
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
                    >{{ display(row, column) }}</slot
                  >
                  <span v-else>{{ display(row, column) }}</span>
                </template>
              </el-table-column>
              <el-table-column
                v-if="(port.update || permissions?.info) && !recycledView"
                :label="t('crud.actions')"
                fixed="right"
                width="160"
              >
                <template #default="{ row }"
                  ><el-button
                    v-if="permissions?.info && schema.api.includes('info')"
                    v-perm="permissions.info"
                    link
                    :disabled="saving"
                    @click="view.edit(row, true)"
                    >{{ t("crud.info") }}</el-button
                  ><el-button
                    v-if="port.update && schema.api.includes('update')"
                    v-perm="permissions?.update ?? []"
                    link
                    type="primary"
                    :disabled="saving"
                    @click="view.edit(row)"
                    >{{ t("crud.edit") }}</el-button
                  ></template
                >
              </el-table-column>
              <el-table-column
                v-if="recycledView"
                prop="deletedAt"
                :label="t('crud.deletedAt')"
                width="190"
              />
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
              :page-sizes="
                [10, 20, 50, 100].filter(size => size <= schema.maxSize)
              "
              :total="total"
              :layout="
                mobile ? 'prev, pager, next' : 'total, sizes, prev, pager, next'
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
      size="85%"
      ><slot name="tree" :filter="view.filter"
    /></el-drawer>
    <el-drawer
      v-model="settingsOpen"
      :title="t('crud.columns')"
      :size="mobile ? '100%' : '520px'"
    >
      <div class="crud-settings">
        <label
          >{{ t("crud.density")
          }}<el-select v-model="draft.density"
            ><el-option
              v-for="density in ['small', 'default', 'large']"
              :key="density"
              :label="t(`crud.${density}`)"
              :value="density" /></el-select
        ></label>
        <div
          v-for="(column, index) in draft.columns"
          :key="column.field"
          class="crud-choice"
        >
          <el-checkbox v-model="column.visible">{{
            schema?.columns.find(item => item.field === column.field)?.label
          }}</el-checkbox>
          <el-input-number
            v-model="column.width"
            :aria-label="t('crud.width')"
            :min="80"
            :max="600"
            controls-position="right"
          />
          <el-select v-model="column.fixed" :aria-label="t('crud.fixed')"
            ><el-option :value="false" :label="t('crud.unfixed')" /><el-option
              value="left"
              :label="t('crud.left')" /><el-option
              value="right"
              :label="t('crud.right')"
          /></el-select>
          <el-button
            :aria-label="t('crud.up')"
            :disabled="index === 0"
            @click="move(index, -1)"
            >↑</el-button
          ><el-button
            :aria-label="t('crud.down')"
            :disabled="index === draft.columns.length - 1"
            @click="move(index, 1)"
            >↓</el-button
          >
        </div>
      </div>
      <template #footer
        ><el-button @click="draft = columnChoices(schema)">{{
          t("crud.reset")
        }}</el-button
        ><el-button type="primary" @click="applySettings">{{
          t("crud.apply")
        }}</el-button></template
      >
    </el-drawer>
    <component
      :is="formPresentation(schema).mode === 'dialog' ? ElDialog : ElDrawer"
      :model-value="editor.open"
      width="min(820px, 100vw)"
      :title="
        t(
          editor.readOnly
            ? 'crud.info'
            : editor.mode === 'add'
              ? 'crud.add'
              : 'crud.edit'
        )
      "
      :size="
        mobile
          ? '100%'
          : schema?.children?.length
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
      <el-form
        class="crud-editor-form"
        label-position="top"
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
      <template #footer
        ><el-button :disabled="saving" @click="view.closeEditor">{{
          t("crud.cancel")
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
.crud-editor-form {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0 16px;
}

.crud-editor-form :deep(.el-form-item) {
  grid-column: 1 / -1;
}

.crud-editor-form :deep(.el-form-item.half-field) {
  grid-column: auto;
}

@media (width <= 760px) {
  .crud-editor-form :deep(.el-form-item.half-field) {
    grid-column: 1 / -1;
  }
}

.crud-page {
  height: 100%;
  min-height: 0;
  overflow: hidden;
  background: var(--el-bg-color);
}

.crud-splitter {
  height: 100%;
}

.crud-tree {
  height: 100%;
  padding: 16px;
  overflow: auto;
}

.crud-main {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 0;
  height: 100%;
  min-height: 0;
  padding: 16px;
}

.crud-toolbar,
.crud-actions,
.crud-search {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.crud-toolbar {
  justify-content: space-between;
}

.crud-search .el-input {
  width: 200px;
}

.crud-actions :deep(.el-button + .el-button),
.crud-choice :deep(.el-button + .el-button) {
  margin-left: 0;
}

.crud-table {
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.crud-pagination {
  display: flex;
  justify-content: flex-end;
  overflow-x: auto;
}

.crud-settings {
  display: grid;
  gap: 16px;
}

.crud-choice {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--el-border-color);
}

.crud-choice .el-checkbox {
  width: 100%;
}

.crud-choice .el-select {
  width: 110px;
}

.crud-unavailable {
  padding: 16px;
}

@media (width <= 760px) {
  .crud-main {
    padding: 12px;
  }

  .crud-search {
    width: 100%;
  }

  .crud-search .el-input {
    flex: 1;
    width: 0;
    min-width: 100px;
  }
}
</style>
