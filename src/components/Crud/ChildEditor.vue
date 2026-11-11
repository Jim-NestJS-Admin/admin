<script setup lang="ts">
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import {
  canReorder,
  childValue,
  childWritable,
  insertChild,
  removeChild,
  reorderChild
} from "./children.mjs";
import { cellText, defaultCell } from "./model.mjs";
import type {
  CrudChild,
  CrudChildDraft,
  CrudCell,
  CrudRecord,
  CrudRowIssue,
  CrudSchema
} from "./types";
const props = defineProps<{
  child: CrudChild;
  draft: CrudChildDraft;
  dictionaries: CrudSchema["dictionaries"];
  disabled: boolean;
  /** 详情查看：只显示文字，不显示增行、排序和行操作 */
  readonly?: boolean;
  issues: CrudRowIssue[];
  cell?: (row: CrudRecord, field: string) => CrudCell;
}>();
const { t } = useI18n();
const dragKey = ref("");
const cell = (row: CrudRecord, field: string) =>
  (props.cell ?? defaultCell)(row, field);
/** 子表编辑只显示业务列；编号、创建人等系统列后端标了 hidden，和主表列表一样默认不显示 */
const columns = computed<{ field: string; label: string; width?: number }[]>(
  () => {
    const shownColumns = props.child.columns.filter(column => !column.hidden);
    return [
      ...shownColumns,
      ...props.child.form.filter(
        item => !shownColumns.some(column => column.field === item.field)
      )
    ];
  }
);
const sortable = computed(() => canReorder(props.child, props.draft, cell));
function item(field: string) {
  return props.child.form.find(item => item.field === field);
}
function dateKind(field: string): "date" | "datetime" {
  return item(field)?.component === "date" ? "date" : "datetime";
}
function writable(row, field: string) {
  return !props.disabled && childWritable(props.child, row, field, cell);
}
function shown(row, field: string) {
  return row.original
    ? cell(row.original, field)
    : { state: "visible", display: row.values[field] };
}
function text(row, field: string) {
  const state = shown(row, field);
  return cellText(state, props.dictionaries[item(field)?.dict]);
}
function messages(row, field: string) {
  return props.issues
    .filter(
      issue =>
        issue.group === props.child.resource &&
        issue.key === row.key &&
        issue.field === field
    )
    .map(issue => t(issue.message))
    .join("；");
}
function rowClass({ row }) {
  return props.issues.some(
    issue => issue.group === props.child.resource && issue.key === row.key
  )
    ? "crud-child-error"
    : "";
}
function drop(key: string) {
  if (!props.disabled && dragKey.value)
    reorderChild(
      props.child,
      props.draft,
      dragKey.value,
      props.draft.rows.findIndex(row => row.key === key),
      cell
    );
  dragKey.value = "";
}
</script>
<template>
  <section :aria-label="child.label" class="crud-child">
    <el-alert
      v-if="!draft.loaded"
      :title="t('crud.childrenNotLoaded')"
      type="info"
      :closable="false"
    />
    <template v-else>
      <div v-if="!readonly" class="crud-child-toolbar">
        <el-button
          :disabled="
            disabled ||
            draft.rows.length >= child.max ||
            !child.add.writable.length
          "
          @click="insertChild(child, draft, undefined, cell)"
          >{{ t("crud.addRow") }}</el-button
        ><span>{{
          t("crud.rowCount", {
            count: draft.rows.length,
            min: child.min,
            max: child.max
          })
        }}</span>
      </div>
      <el-alert
        v-for="(issue, index) in issues.filter(
          issue => issue.group === child.resource && !issue.key
        )"
        :key="index"
        :title="t(issue.message)"
        type="error"
        :closable="false"
      />
      <el-table
        :data="draft.rows"
        row-key="key"
        :row-class-name="rowClass"
        max-height="360"
        border
      >
        <el-table-column
          v-if="sortable && !readonly"
          :label="t('crud.rowOrder')"
          width="120"
          fixed="left"
        >
          <template #default="{ row, $index }"
            ><div
              class="crud-drag"
              @dragover.prevent
              @drop.prevent="drop(row.key)"
            >
              <span
                :draggable="!disabled"
                :aria-label="t('crud.dragRow')"
                @dragstart="
                  event => {
                    dragKey = row.key;
                    event.dataTransfer?.setData('text/plain', row.key);
                  }
                "
                @dragend="dragKey = ''"
                >⋮⋮</span
              ><el-button
                link
                :disabled="disabled || $index === 0"
                :aria-label="t('crud.up')"
                @click="reorderChild(child, draft, row.key, $index - 1, cell)"
                >↑</el-button
              ><el-button
                link
                :disabled="disabled || $index === draft.rows.length - 1"
                :aria-label="t('crud.down')"
                @click="reorderChild(child, draft, row.key, $index + 1, cell)"
                >↓</el-button
              >
            </div></template
          >
        </el-table-column>
        <el-table-column
          v-for="column in columns"
          :key="column.field"
          :label="column.label"
          :min-width="Math.max(column.width ?? 160, 150)"
        >
          <template #default="{ row }">
            <template
              v-if="!readonly && childWritable(child, row, column.field, cell)"
            >
              <el-input-number
                v-if="item(column.field)?.component === 'number'"
                :model-value="childValue(row, column.field, cell) as number"
                :disabled="!writable(row, column.field)"
                :aria-label="column.label"
                @update:model-value="row.values[column.field] = $event"
              />
              <el-switch
                v-else-if="item(column.field)?.component === 'switch'"
                :model-value="childValue(row, column.field, cell) as boolean"
                :disabled="!writable(row, column.field)"
                :aria-label="column.label"
                @update:model-value="row.values[column.field] = $event"
              />
              <el-select
                v-else-if="item(column.field)?.component === 'select'"
                :model-value="childValue(row, column.field, cell)"
                :disabled="!writable(row, column.field)"
                :aria-label="column.label"
                @update:model-value="row.values[column.field] = $event"
                ><el-option
                  v-for="option in dictionaries[item(column.field).dict] ?? []"
                  :key="String(option.value)"
                  :label="option.label"
                  :value="option.value"
              /></el-select>
              <el-date-picker
                v-else-if="
                  ['date', 'datetime'].includes(item(column.field)?.component)
                "
                :model-value="childValue(row, column.field, cell) as string"
                :type="dateKind(column.field)"
                :value-format="
                  item(column.field).component === 'date'
                    ? 'YYYY-MM-DD'
                    : 'YYYY-MM-DDTHH:mm:ssZ'
                "
                :disabled="!writable(row, column.field)"
                :aria-label="column.label"
                @update:model-value="row.values[column.field] = $event"
              />
              <el-input
                v-else
                :model-value="childValue(row, column.field, cell) as string"
                :type="
                  item(column.field)?.component === 'textarea'
                    ? 'textarea'
                    : 'text'
                "
                :disabled="!writable(row, column.field)"
                :aria-label="column.label"
                @update:model-value="row.values[column.field] = $event"
              />
            </template>
            <span v-else>{{ text(row, column.field) }}</span>
            <div
              v-if="messages(row, column.field)"
              class="crud-child-message"
              role="alert"
            >
              {{ messages(row, column.field) }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          v-if="!readonly"
          :label="t('crud.actions')"
          fixed="right"
          width="130"
          ><template #default="{ row }"
            ><el-button
              link
              :disabled="
                disabled ||
                draft.rows.length >= child.max ||
                !child.add.writable.length
              "
              @click="insertChild(child, draft, row, cell)"
              >{{ t("crud.copyRow") }}</el-button
            ><el-button
              link
              type="danger"
              :disabled="disabled"
              @click="removeChild(draft, row.key)"
              >{{ t("crud.remove") }}</el-button
            ></template
          ></el-table-column
        >
      </el-table>
    </template>
  </section>
</template>
<style scoped lang="scss">
.crud-child {
  min-width: 0;
}

.crud-child-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  margin-bottom: 12px;
}

.crud-child-toolbar span {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.crud-drag {
  display: flex;
  gap: 8px;
  align-items: center;
}

.crud-drag span {
  padding: 6px;
  cursor: grab;
}

.crud-child-message {
  font-size: 12px;
  color: var(--el-color-danger);
}

.crud-child :deep(.crud-child-error) {
  --el-table-tr-bg-color: var(--el-color-danger-light-9);
}

.crud-child :deep(.el-input-number),
.crud-child :deep(.el-date-editor) {
  width: 100%;
}
</style>
