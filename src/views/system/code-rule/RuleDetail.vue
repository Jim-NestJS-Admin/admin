<script setup lang="ts">
import { computed } from "vue";
import { useMediaQuery } from "@vueuse/core";
import { useI18n } from "vue-i18n";
import type { CrudRecord } from "@/components/Crud/types";
import type { components } from "@/api/schema";
import { defaultCell } from "@/components/Crud/model.mjs";
import TimeZoneText from "./TimeZoneText.vue";
import RuleTools from "./RuleTools.vue";
import { useRuleHistoryView } from "./rule-history";
interface DetailItem {
  field: string;
  label: string;
  dict?: string;
  type?: string;
  wide: boolean;
}
const props = defineProps<{
  record: CrudRecord;
  items: DetailItem[];
  display: (record: CrudRecord, item: DetailItem) => unknown;
}>();
const { t } = useI18n();
const detailItems = computed(() =>
  props.items.filter(item => item.field !== "version")
);
const mobile = useMediaQuery("(max-width: 760px)");
const {
  selected,
  record: displayed,
  select
} = useRuleHistoryView(() => props.record);
const segments = computed(() => {
  const cell = defaultCell(displayed.value, "segments");
  return cell.state !== "hidden" &&
    cell.state !== "masked" &&
    Array.isArray(cell.display)
    ? (cell.display as components["schemas"]["SystemCodeRuleAddData"]["segments"])
    : undefined;
});
</script>
<template>
  <div class="rule-detail">
    <section class="rule-detail-main">
      <div class="version-heading">
        <el-tag :type="selected ? 'warning' : 'primary'"
          >v{{ displayed.revision }}</el-tag
        >
        <span class="version-kind">{{
          t(
            selected
              ? "codeRules.historicalVersion"
              : "codeRules.currentVersion"
          )
        }}</span>
      </div>
      <el-descriptions
        class="crud-info"
        :column="mobile ? 1 : 2"
        :label-width="mobile ? 92 : 112"
        border
      >
        <el-descriptions-item
          v-for="item in detailItems"
          :key="item.field"
          :width="mobile ? 'calc(100% - 92px)' : 'calc(50% - 112px)'"
          :label="
            item.field === 'revision'
              ? t('codeRules.businessVersion')
              : item.label
          "
          :span="(item.wide || item.field === 'segments') && !mobile ? 2 : 1"
          label-class-name="crud-info-label"
        >
          <TimeZoneText
            v-if="
              item.field === 'timezone' &&
              ['visible', 'readonly'].includes(
                defaultCell(displayed, item.field).state
              )
            "
            :value="defaultCell(displayed, item.field).display"
          />
          <template v-else-if="item.field === 'revision'"
            >v{{ displayed.revision }}</template
          >
          <el-tag v-else-if="selected && item.field === 'status'" type="info">{{
            t("codeRules.historicalInactive")
          }}</el-tag>
          <el-space v-else-if="item.field === 'segments' && segments" wrap>
            <el-tag
              v-for="(segment, index) in segments"
              :key="index"
              effect="plain"
            >
              {{
                segment.type === "literal"
                  ? t("codeRules.literal") + "：" + segment.value
                  : segment.type === "date"
                    ? t("codeRules.date") + "：" + segment.format
                    : segment.type === "timestamp"
                      ? t(
                          segment.unit === "seconds"
                            ? "codeRules.seconds"
                            : "codeRules.milliseconds"
                        )
                      : t("codeRules.sequence") +
                        "：" +
                        segment.width +
                        " " +
                        t("codeRules.digits")
              }}
            </el-tag>
          </el-space>
          <span
            v-else-if="selected && !Object.hasOwn(displayed, item.field)"
            class="version-kind"
            >{{ t("codeRules.historyNotRecorded") }}</span
          >
          <template v-else>{{ display(displayed, item) }}</template>
        </el-descriptions-item>
      </el-descriptions>
      <RuleTools
        v-if="!selected"
        :key="String(record.id) + ':' + String(record.version)"
        :rule-id="String(record.id)"
      />
    </section>
    <aside class="rule-detail-history">
      <RuleTools
        :rule-id="String(record.id)"
        :active-revision="Number(displayed.revision)"
        history-only
        @select="select"
      />
    </aside>
  </div>
</template>
<style scoped>
.rule-detail {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 280px;
  gap: 24px;
}

.crud-info :deep(.el-descriptions__table) {
  width: 100%;
  table-layout: fixed;
}

.crud-info :deep(.el-descriptions__content) {
  overflow-wrap: anywhere;
}

.rule-detail-main {
  min-width: 0;
}

.version-heading {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  margin-bottom: 16px;
}

.version-kind {
  color: var(--el-text-color-secondary);
}

.rule-detail-history {
  min-width: 0;
  padding-left: 20px;
  border-left: 1px solid var(--el-border-color-lighter);
}

@media (width <= 760px) {
  .rule-detail {
    grid-template-columns: minmax(0, 1fr);
  }

  .rule-detail-history {
    padding: 20px 0 0;
    border-top: 1px solid var(--el-border-color-lighter);
    border-left: 0;
  }
}
</style>
