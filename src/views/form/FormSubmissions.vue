<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { useMediaQuery } from "@vueuse/core";
import CrudPage from "@/components/Crud/CrudPage.vue";
import { generatedCrud } from "@/platform/generated-crud";
import type { CrudPort, CrudRecord } from "@/components/Crud/types";
const props = defineProps<{ definitionId?: string }>();
const { t } = useI18n();
const compact = useMediaQuery("(max-width: 760px)");
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
  if (typeof value !== "object") return String(value);
  const serialized = JSON.stringify(value);
  return serialized === "{}" ? "—" : serialized;
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
    <template #detail-content="{ record, items, display }">
      <section class="submission-section">
        <el-descriptions :column="compact ? 1 : 2" border>
          <el-descriptions-item
            v-for="item in items.filter(item => item.field !== 'values')"
            :key="item.field"
            :label="item.label"
            :span="item.wide && !compact ? 2 : 1"
          >
            <el-space
              v-if="item.field === 'codes' && pairs(record.codes).length"
              wrap
            >
              <el-tag
                v-for="[key, code] in pairs(record.codes)"
                :key="key"
                effect="plain"
                >{{ title(record, key) }}：{{ code }}</el-tag
              >
            </el-space>
            <span
              v-else-if="
                item.field === 'codes' && display(record, item) === '{}'
              "
              >—</span
            >
            <span v-else>{{ display(record, item) }}</span>
          </el-descriptions-item>
        </el-descriptions>
      </section>
      <section
        v-if="items.some(item => item.field === 'values')"
        class="submission-section"
      >
        <h3>{{ t("autoCodes.values") }}</h3>
        <dl v-if="pairs(record.values).length" class="submission-values">
          <template v-for="[key, value] in pairs(record.values)" :key="key">
            <dt>{{ title(record, key) }}</dt>
            <dd>{{ text(value) }}</dd>
          </template>
        </dl>
        <p v-else class="submission-value-empty">
          {{ text(record.values) }}
        </p>
      </section>
    </template>
  </CrudPage>
</template>

<style scoped>
.submission-section + .submission-section {
  margin-top: 20px;
}

.submission-section h3 {
  margin: 0 0 12px;
  font-size: var(--el-font-size-base);
  font-weight: 600;
}

.submission-values {
  display: grid;
  grid-template-columns: clamp(88px, 25%, 180px) minmax(0, 1fr);
  margin: 0;
  border: 1px solid var(--el-border-color-lighter);
  border-bottom: 0;
}

.submission-values dt,
.submission-values dd {
  padding: 10px 12px;
  margin: 0;
  overflow-wrap: anywhere;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.submission-values dt {
  font-weight: 600;
  color: var(--el-text-color-regular);
  background: var(--el-fill-color-light);
  border-inline-end: 1px solid var(--el-border-color-lighter);
}

.submission-values dd {
  white-space: pre-wrap;
}

.submission-value-empty {
  margin: 0;
  color: var(--el-text-color-secondary);
}
</style>
