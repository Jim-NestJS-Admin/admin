<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from "vue";
import type { CrudPort, CrudRecord } from "@/components/Crud/types";
import { onSessionReset } from "@/platform/lifecycle";
import { scopedSequencePort, copyRuleDraft } from "./code-rule/rule-page";
import { ruleError } from "./code-rule/messages";
import { useI18n } from "vue-i18n";
import ArrowDownIcon from "~icons/ri/arrow-down-s-line";
import CrudPage from "@/components/Crud/CrudPage.vue";
import { generatedCrud } from "@/platform/generated-crud";
import { permission } from "@/platform/system/resources";
import SegmentEditor from "./code-rule/SegmentEditor.vue";
import RuleDetail from "./code-rule/RuleDetail.vue";
import RuleTools from "./code-rule/RuleTools.vue";
import UsageBindings from "./code-rule/UsageBindings.vue";
import { provideTimeZoneDirectory } from "./code-rule/time-zone-directory";
import TimeZoneText from "./code-rule/TimeZoneText.vue";
import TimeZoneSelect from "./code-rule/TimeZoneSelect.vue";
defineOptions({ name: "SystemCodeRule" });
const { t } = useI18n();
provideTimeZoneDirectory();
const page = ref<InstanceType<typeof CrudPage>>();
const panel = ref<"bindings" | "sequences" | "">("");
const active = ref<CrudRecord>();
const error = ref("");
const copying = ref(false);
let pending: AbortController | undefined;
function openPanel(kind: "bindings" | "sequences", row?: CrudRecord) {
  active.value = row;
  panel.value = kind;
}
async function copy(row: CrudRecord) {
  if (copying.value) return;
  pending?.abort();
  const request = (pending = new AbortController());
  copying.value = true;
  error.value = "";
  try {
    const record = await rules.port.detail(String(row.id), request.signal);
    if (!request.signal.aborted)
      await page.value?.create(copyRuleDraft(record));
  } catch (reason) {
    if (!request.signal.aborted) error.value = ruleError(reason);
  } finally {
    if (!request.signal.aborted) copying.value = false;
  }
}
function resetPanels() {
  pending?.abort();
  panel.value = "";
  active.value = undefined;
  copying.value = false;
  error.value = "";
}
const stop = onSessionReset(resetPanels);
onBeforeUnmount(() => {
  stop();
  resetPanels();
});
const draftTools = ref<InstanceType<typeof RuleTools>>();
const rules = generatedCrud("systemCodeRule"),
  sequences = generatedCrud("systemCodeSequence");
const rulePort: CrudPort = {
  ...rules.port,
  async describe(signal) {
    const schema = await rules.port.describe(signal);
    return {
      ...schema,
      columns: schema.columns.map(column =>
        column.field === "revision"
          ? { ...column, label: t("codeRules.businessVersion") }
          : column
      )
    };
  }
};
const sequencePort = computed(() =>
  scopedSequencePort(sequences.port, String(active.value?.id ?? ""))
);
const defaults = {
  description: "",
  timezone: "Asia/Shanghai",
  resetPeriod: "never",
  start: "1",
  status: "enabled",
  segments: [
    { type: "literal", value: "form_" },
    { type: "sequence", width: 6 }
  ]
};
</script>
<template>
  <div class="code-rule-page">
    <el-alert v-if="error" :title="t(error)" type="error" :closable="false" />
    <CrudPage
      ref="page"
      hide-detail-footer
      :row-actions-width="310"
      :port="rulePort"
      page-key="system:code-rule"
      :permissions="rules.permissions"
      :add-defaults="defaults"
    >
      <template #cell-revision="{ value }"
        ><el-tag effect="plain">v{{ value }}</el-tag></template
      >
      <template #cell-timezone="{ value }"
        ><TimeZoneText :value="value"
      /></template>
      <template #toolbar>
        <el-button
          v-perm="permission('codeRuleUsageList')"
          @click="openPanel('bindings')"
          >{{ t("codeRules.usageConfig") }}</el-button
        >
      </template>
      <template #row-actions-extra="{ row, disabled }">
        <el-dropdown
          class="rule-more"
          trigger="click"
          :disabled="disabled || copying"
        >
          <el-button link type="primary" :disabled="disabled || copying">
            {{ t("codeRules.more") }}<ArrowDownIcon class="more-arrow" />
          </el-button>
          <template #dropdown
            ><el-dropdown-menu>
              <el-dropdown-item
                v-perm="rules.permissions.create"
                @click="copy(row)"
                >{{ t("codeRules.copy") }}</el-dropdown-item
              >
              <el-dropdown-item
                v-perm="permission('codeRuleBindingSet')"
                @click="openPanel('bindings', row)"
                >{{ t("codeRules.bindings") }}</el-dropdown-item
              >
              <el-dropdown-item
                v-perm="permission('systemCodeSequencePage')"
                @click="openPanel('sequences', row)"
                >{{ t("codeRules.sequenceRecords") }}</el-dropdown-item
              >
            </el-dropdown-menu></template
          >
        </el-dropdown>
      </template>
      <template #form-code="{ values, disabled }">
        <div class="code-field">
          <el-input
            v-model="values.code as string"
            :formatter="(value: string) => value.toLowerCase()"
            :parser="(value: string) => value.toLowerCase()"
            :disabled="disabled"
            maxlength="64"
            :placeholder="t('codeRules.codeExample')"
            aria-describedby="code-rule-code-hint"
          />
          <span id="code-rule-code-hint" class="code-hint">{{
            t("codeRules.codeHint")
          }}</span>
        </div>
      </template>
      <template #form-timezone="{ values, disabled }">
        <TimeZoneSelect
          v-model="values.timezone as string"
          :disabled="disabled"
        />
      </template>
      <template #form-segments="{ values, disabled }"
        ><SegmentEditor
          :model-value="Array.isArray(values.segments) ? values.segments : []"
          :disabled="disabled"
          @update:model-value="values.segments = $event"
      /></template>
      <template #form-extra="{ values }">
        <el-form-item>
          <RuleTools ref="draftTools" :draft="values" :show-actions="false" />
        </el-form-item>
      </template>
      <template #form-status="{ values, disabled }">
        <el-switch
          v-model="values.status as string"
          active-value="enabled"
          inactive-value="disabled"
          :active-text="t('codeRules.enabled')"
          :inactive-text="t('codeRules.disabled')"
          :disabled="disabled"
        />
      </template>
      <template #editor-footer="{ readonly, disabled }">
        <el-button
          v-if="!readonly"
          v-perm="permission('codeRuleValidate')"
          :disabled="disabled"
          :loading="draftTools?.busy"
          @click="draftTools?.preview()"
          >{{ t("codeRules.configPreview") }}</el-button
        >
      </template>
      <template #detail-content="{ record, items, display }">
        <RuleDetail
          :key="String(record.id) + ':' + String(record.version)"
          :record="record"
          :items="items"
          :display="display"
        />
      </template>
    </CrudPage>
    <el-drawer
      :model-value="Boolean(panel)"
      :title="
        panel === 'sequences'
          ? t('codeRules.sequenceRecords')
          : t('codeRules.usageConfig')
      "
      size="min(1000px, 96vw)"
      destroy-on-close
      @update:model-value="panel = ''"
    >
      <template v-if="panel">
        <el-alert
          v-if="active"
          :title="String(active.name) + ' (' + String(active.code) + ')'"
          type="info"
          :closable="false"
        />
        <UsageBindings
          v-if="panel === 'bindings'"
          :rule-id="active ? String(active.id) : undefined"
          :rule-name="active ? String(active.name) : undefined"
        />
        <CrudPage
          v-else-if="active"
          :key="String(active.id)"
          class="sequence-list"
          :port="sequencePort"
          :fill="false"
          :page-key="'system:code-sequence:' + String(active.id)"
          :permissions="sequences.permissions"
        />
      </template>
    </el-drawer>
  </div>
</template>
<style scoped>
.code-rule-page {
  min-width: 0;
}

.sequence-list {
  height: calc(100dvh - 190px);
  min-height: 320px;
}

.rule-more {
  margin-left: 12px;
  vertical-align: middle;
}

.more-arrow {
  width: 12px;
  height: 12px;
  margin-left: 4px;
}

.code-field {
  width: 100%;
}

.code-hint {
  display: block;
  margin-top: 6px;
  font-size: 12px;
  line-height: 1.5;
  color: var(--el-text-color-secondary);
}
</style>
