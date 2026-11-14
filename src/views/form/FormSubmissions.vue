<script setup lang="ts">
import { useI18n } from "vue-i18n";
import CrudPage from "@/components/Crud/CrudPage.vue";
import { generatedCrud } from "@/platform/generated-crud";
import type { CrudPort, CrudRecord } from "@/components/Crud/types";
const props = defineProps<{ definitionId?: string }>();
const { t } = useI18n();
const generated = generatedCrud("formSubmission");
const port: CrudPort = {
  describe: generated.port.describe,
  detail: generated.port.detail,
  preferences: generated.port.preferences,
  list: (query, signal) =>
    generated.port.list(
      {
        ...query,
        equality: {
          ...query.equality,
          ...(props.definitionId ? { definitionId: props.definitionId } : {})
        }
      },
      signal
    )
};
function pairs(value: unknown): [string, unknown][] {
  return value && typeof value === "object" && !Array.isArray(value)
    ? Object.entries(value)
    : [];
}
function title(record: CrudRecord, key: string) {
  return pairs(record.fieldTitles).find(([field]) => field === key)?.[1] ?? key;
}
function text(value: unknown) {
  if (value === null || value === undefined || value === "") return "—";
  return typeof value === "object" ? JSON.stringify(value) : String(value);
}
</script>
<template>
  <CrudPage
    :port="port"
    :permissions="generated.permissions"
    page-key="form:submission"
    :fill="!definitionId"
    hide-detail-footer
  >
    <template #cell-revision="{ value }"
      ><el-tag size="small">v{{ value }}</el-tag></template
    >
    <template #cell-codes="{ value }">
      <el-space wrap
        ><el-tag
          v-for="[key, code] in pairs(value)"
          :key="key"
          size="small"
          effect="plain"
          >{{ code }}</el-tag
        ><span v-if="!pairs(value).length">—</span></el-space
      >
    </template>
    <template #detail-values="{ record }">
      <el-descriptions
        v-if="pairs(record.values).length"
        :column="1"
        border
        :title="t('autoCodes.values')"
      >
        <el-descriptions-item
          v-for="[key, value] in pairs(record.values)"
          :key="key"
          :label="String(title(record, key))"
          >{{ text(value) }}</el-descriptions-item
        >
      </el-descriptions>
      <span v-else>{{ text(record.values) }}</span>
    </template>
    <template #detail-codes="{ record }">
      <el-space wrap
        ><el-tag
          v-for="[key, code] in pairs(record.codes)"
          :key="key"
          effect="plain"
          >{{ title(record, key) }}：{{ code }}</el-tag
        ><span v-if="!pairs(record.codes).length">{{
          text(record.codes)
        }}</span></el-space
      >
    </template>
  </CrudPage>
</template>
