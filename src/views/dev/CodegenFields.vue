<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { newColumn, type ColumnDraft } from "./codegen-draft";
const rows = defineModel<ColumnDraft[]>({ required: true });
defineProps<{ disabled: boolean }>();
const { t } = useI18n();
let dragged = -1;
function move(index: number, target: number) {
  if (
    index < 0 ||
    index >= rows.value.length ||
    target < 0 ||
    target >= rows.value.length
  )
    return;
  const [row] = rows.value.splice(index, 1);
  rows.value.splice(target, 0, row);
}
</script>
<template>
  <el-button
    :disabled="disabled || rows.length >= 200"
    @click="rows.push(newColumn())"
    >{{ t("codegen.addField") }}</el-button
  >
  <el-table :data="rows" row-key="key" border max-height="520">
    <el-table-column :label="t('codegen.order')" width="150" fixed
      ><template #default="{ $index }"
        ><span
          :draggable="!disabled"
          @dragstart="dragged = $index"
          @dragover.prevent
          @drop.prevent="move(dragged, $index)"
          >☰</span
        ><el-button
          :disabled="disabled || !$index"
          @click="move($index, $index - 1)"
          >↑</el-button
        ><el-button
          :disabled="disabled || $index === rows.length - 1"
          @click="move($index, $index + 1)"
          >↓</el-button
        ></template
      ></el-table-column
    >
    <el-table-column
      v-for="field in [
        'property',
        'column',
        'label',
        'kind',
        'widget',
        'query',
        'dictionary',
        'security'
      ]"
      :key="field"
      :label="t(`codegen.${field}`)"
      min-width="160"
      ><template #default="{ row }"
        ><el-input
          v-model="row[field]"
          :disabled="disabled"
          :aria-label="t(`codegen.${field}`)"
          :placeholder="field === 'security' ? '{}' : ''" /></template
    ></el-table-column>
    <el-table-column :label="t('codegen.size')" width="150"
      ><template #default="{ row }"
        ><el-input-number
          v-model="row.size"
          :min="1"
          :max="65535"
          :disabled="disabled" /></template
    ></el-table-column>
    <el-table-column
      v-for="field in ['optional', 'listed', 'editable', 'required', 'unique']"
      :key="field"
      :label="t(`codegen.${field}`)"
      width="95"
      ><template #default="{ row }"
        ><el-checkbox
          v-model="row[field]"
          :disabled="disabled"
          :aria-label="t(`codegen.${field}`)" /></template
    ></el-table-column>
    <el-table-column :label="t('crud.actions')" width="90" fixed="right"
      ><template #default="{ $index }"
        ><el-button link :disabled="disabled" @click="rows.splice($index, 1)">{{
          t("crud.remove")
        }}</el-button></template
      ></el-table-column
    >
  </el-table>
</template>
