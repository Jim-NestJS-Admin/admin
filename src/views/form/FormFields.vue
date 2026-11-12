<script setup lang="ts">
import { useI18n } from "vue-i18n";
import type { Field } from "./model";
defineProps<{ fields: Field[] }>();
const { t } = useI18n();
</script>
<template>
  <el-table :data="fields" row-key="field" :empty-text="t('forms.checkFirst')">
    <el-table-column
      prop="title"
      :label="t('forms.fieldTitle')"
      min-width="140"
    />
    <el-table-column
      prop="field"
      :label="t('forms.fieldKey')"
      min-width="160"
    />
    <el-table-column :label="t('forms.component')" min-width="110"
      ><template #default="{ row }">{{
        t(`forms.components.${row.component}`)
      }}</template></el-table-column
    >
    <el-table-column :label="t('forms.required')" width="90"
      ><template #default="{ row }">{{
        t(row.required ? "forms.yes" : "forms.no")
      }}</template></el-table-column
    >
    <el-table-column :label="t('forms.options')" min-width="180"
      ><template #default="{ row }">{{
        row.options.map(option => option.label).join("、") || "—"
      }}</template></el-table-column
    >
    <el-table-column :label="t('forms.constraints')" min-width="180"
      ><template #default="{ row }"
        ><span v-if="row.validation.min !== undefined"
          >{{ t("forms.min") }} {{ row.validation.min }} </span
        ><span v-if="row.validation.max !== undefined"
          >{{ t("forms.max") }} {{ row.validation.max }} </span
        ><span v-if="row.validation.precision !== undefined"
          >{{ t("forms.precision") }} {{ row.validation.precision }}</span
        ><span v-if="row.validation.format">{{
          row.validation.format
        }}</span></template
      ></el-table-column
    >
  </el-table>
</template>
