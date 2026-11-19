<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useElementSize } from "@vueuse/core";
import { useI18n } from "vue-i18n";
import {
  ElTableV2,
  TableV2Alignment,
  TableV2FixedDir,
  TableV2SortOrder,
  useLocale,
  type Column,
  type ColumnSortParams,
  type TableV2Instance
} from "element-plus";
import { treeSelection, walkTreeRows } from "./tree.mjs";
import type {
  CrudChoices,
  CrudColumn,
  CrudColumnChoice,
  CrudRecord
} from "./types";

const props = defineProps<{
  rows: CrudRecord[];
  columns: (CrudColumn & {
    width: number;
    fixed: CrudColumnChoice["fixed"];
    extra?: boolean;
  })[];
  nameField?: string;
  density: CrudChoices["density"];
  loading: boolean;
  selectable: boolean;
  actionWidth: number;
  expandAll?: boolean;
  sort?: { field: string; direction: "asc" | "desc" };
}>();
const selected = defineModel<string[]>("selected", { required: true });
const emit = defineEmits<{
  sort: [field: string, order: "ascending" | "descending" | null];
}>();
const { t } = useI18n();
const { t: elementText } = useLocale();
const host = ref<HTMLElement>();
const table = ref<TableV2Instance>();
const { width, height } = useElementSize(host);
const densityHeight = { small: 36, default: 44, large: 52 };
const scrollbarSize = 8;
const selectionKey = "__selection";
const actionsKey = "__actions";
const treeKey = "__tree";

function withChildren(rows: CrudRecord[]): CrudRecord[] {
  return rows.map(row => ({
    ...row,
    children: withChildren((row.__crudTreeChildren ?? []) as CrudRecord[])
  }));
}
const data = computed(() =>
  props.nameField ? withChildren(props.rows) : props.rows
);
const allIds = computed(() =>
  Array.from(props.nameField ? walkTreeRows(props.rows) : props.rows, row =>
    String(row.id)
  )
);
const expandedKeys = ref<string[]>([]);
watch(
  () => props.rows,
  rows => {
    expandedKeys.value =
      props.nameField && props.expandAll
        ? Array.from(walkTreeRows(rows))
            .filter(row => row.__crudTreeChildren?.length)
            .map(row => String(row.id))
        : [];
    table.value?.scrollToTop(0);
  },
  { immediate: true }
);

const selectedIds = computed(() => new Set(selected.value));
const selection = computed(() =>
  props.nameField ? treeSelection(props.rows, selectedIds.value) : undefined
);
const allSelected = computed(
  () =>
    allIds.value.length > 0 &&
    allIds.value.every(id => selectedIds.value.has(id))
);
function selectBranch(row: CrudRecord, checked: boolean) {
  const ids = new Set(selected.value);
  for (const item of props.nameField ? walkTreeRows([row]) : [row]) {
    if (checked) ids.add(String(item.id));
    else ids.delete(String(item.id));
  }
  const states = props.nameField ? treeSelection(props.rows, ids) : undefined;
  selected.value = allIds.value.filter(
    id => states?.get(id)?.checked ?? ids.has(id)
  );
}
function selectAll(checked: boolean) {
  selected.value = checked ? allIds.value : [];
}

const expandColumn = computed(() => {
  if (!props.nameField) return undefined;
  return (
    (props.columns.some(column => column.field === props.nameField)
      ? props.nameField
      : props.columns[0]?.field) ?? treeKey
  );
});
const centeredTypes = new Set(["boolean", "datetime", "date", "number"]);
const fixedDirections = {
  left: TableV2FixedDir.LEFT,
  right: TableV2FixedDir.RIGHT
};
const tableColumns = computed(() => {
  const columns: Column[] = props.columns.map(column => ({
    key: column.field,
    dataKey: column.field,
    title: column.label,
    width: column.width,
    fixed: column.fixed ? fixedDirections[column.fixed] : undefined,
    align:
      (column.align ?? (centeredTypes.has(column.type) ? "center" : "left")) ===
      "center"
        ? TableV2Alignment.CENTER
        : TableV2Alignment.LEFT,
    headerClass: `crud-virtual-header-${column.headerAlign ?? (centeredTypes.has(column.type) ? "center" : "left")}`,
    sortable: column.sortable,
    source: column
  }));
  if (!columns.length) columns.push({ key: treeKey, width: 64 });
  if (props.selectable)
    columns.unshift({
      key: selectionKey,
      width: 48,
      fixed: TableV2FixedDir.LEFT,
      align: TableV2Alignment.CENTER
    });
  if (props.actionWidth)
    columns.push({
      key: actionsKey,
      title: t("crud.actions"),
      width: props.actionWidth,
      fixed: width.value >= 520 ? TableV2FixedDir.RIGHT : undefined,
      align: TableV2Alignment.CENTER
    });
  const total = columns.reduce((sum, column) => sum + column.width, 0);
  const flexible =
    columns.find(column => !column.fixed && column.source) ??
    columns.find(column => column.key === treeKey);
  if (flexible)
    flexible.width += Math.max(
      0,
      Math.floor(width.value) - scrollbarSize - total
    );
  return columns;
});

const sortBy = computed(() => ({
  key: props.sort?.field ?? "",
  order:
    props.sort?.direction === "desc"
      ? TableV2SortOrder.DESC
      : TableV2SortOrder.ASC
}));
function sortColumn({ key }: ColumnSortParams<unknown>) {
  const field = String(key);
  const direction =
    props.sort?.field === field ? props.sort.direction : undefined;
  emit(
    "sort",
    field,
    direction === "desc"
      ? null
      : direction === "asc"
        ? "descending"
        : "ascending"
  );
}
function headerCellProps({ column }: { column: Column }) {
  if (!column.sortable) return {};
  return {
    tabindex: 0,
    onKeydown(event: KeyboardEvent) {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      (event.currentTarget as HTMLElement).click();
    }
  };
}
</script>

<template>
  <div ref="host" v-loading="loading" class="crud-virtual-table">
    <el-table-v2
      v-if="width > 0 && height > densityHeight[density]"
      ref="table"
      fixed
      row-key="id"
      :columns="tableColumns"
      :data="data"
      :width="Math.floor(width)"
      :height="Math.floor(height)"
      :header-height="densityHeight[density]"
      :row-height="densityHeight[density]"
      :h-scrollbar-size="scrollbarSize"
      :v-scrollbar-size="scrollbarSize"
      :expand-column-key="expandColumn"
      :default-expanded-row-keys="expandedKeys"
      :expanded-row-keys="expandedKeys"
      :sort-by="sortBy"
      :header-cell-props="headerCellProps"
      @expanded-rows-change="keys => (expandedKeys = keys.map(String))"
      @column-sort="sortColumn"
    >
      <template #header-cell="{ column }">
        <el-checkbox
          v-if="column.key === selectionKey"
          :model-value="allSelected"
          :indeterminate="!allSelected && selected.length > 0"
          :disabled="loading || !allIds.length"
          :aria-label="t('crud.selectAllRows')"
          @change="selectAll(!!$event)"
        />
        <span
          v-else
          class="el-table-v2__header-cell-text"
          :title="column.title"
        >
          {{ column.title }}
        </span>
      </template>
      <template #cell="{ column, rowData }">
        <el-checkbox
          v-if="column.key === selectionKey"
          :model-value="
            selection?.get(String(rowData.id))?.checked ??
            selectedIds.has(String(rowData.id))
          "
          :indeterminate="selection?.get(String(rowData.id))?.indeterminate"
          :disabled="loading"
          :aria-label="t('crud.selectRow', { id: rowData.id })"
          @change="selectBranch(rowData, !!$event)"
        />
        <slot
          v-else-if="column.key === actionsKey"
          name="actions"
          :row="rowData"
        />
        <slot
          v-else-if="column.source"
          name="cell"
          :row="rowData"
          :column="column.source"
        />
      </template>
      <template #empty>
        <span class="crud-tree-empty">{{
          elementText("el.table.emptyText")
        }}</span>
      </template>
    </el-table-v2>
  </div>
</template>

<style scoped>
.crud-virtual-table {
  width: 100%;
  height: 100%;
  min-height: 0;
}

.crud-virtual-table :deep(.el-table-v2) {
  --el-table-header-bg-color: var(--el-fill-color-light);
  --el-table-header-text-color: var(--el-text-color-primary);

  color: var(--el-table-text-color);
}

.crud-tree-empty {
  color: var(--el-text-color-secondary);
}

:deep(.el-table-v2__header-cell.crud-virtual-header-left) {
  justify-content: flex-start;
}

:deep(.el-table-v2__header-cell.crud-virtual-header-center) {
  justify-content: center;
}
</style>
