<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from "vue";
import type { CrudPort, CrudRecord } from "@/components/Crud/types";
import { onSessionReset } from "@/platform/lifecycle";
import { validateRuleDraft } from "./code-rule/validate-rule";
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
  validate: (values, context) => {
    const draft = { ...context.record, ...values };
    // 被字段权限隐藏/脱敏的依赖不能在浏览器补猜，交由服务端基于原记录校验。
    if (
      context.mode === "update" &&
      ["segments", "start", "timezone", "resetPeriod"].some(
        field =>
          !Object.hasOwn(draft, field) ||
          ["hidden", "masked"].includes(
            (
              context.record?._fieldState as Record<string, string> | undefined
            )?.[field] ?? ""
          )
      )
    )
      return {};
    return validateRuleDraft(
      draft,
      (key, params) => t(key, params ?? {}),
      true
    );
  },
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
function previewDraft() {
  if (page.value?.validate()) void draftTools.value?.preview();
}
const defaults = {
  description: "",
  timezone: "Asia/Shanghai",
  resetPeriod: "never",
  start: "1",
  status: "1",
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
      <template #form-status="{ values, disabled, options }">
        <el-switch
          v-model="values.status as string"
          active-value="1"
          inactive-value="0"
          :active-text="
            options.find(item => item.value === '1')?.label ??
            t('codeRules.enabled')
          "
          :inactive-text="
            options.find(item => item.value === '0')?.label ??
            t('codeRules.disabled')
          "
          :disabled="disabled"
        />
      </template>
      <template #editor-footer="{ readonly, disabled }">
        <el-button
          v-if="!readonly"
          v-perm="permission('codeRuleValidate')"
          :disabled="disabled"
          :loading="draftTools?.busy"
          @click="previewDraft"
          >{{ t("codeRules.configPreview") }}</el-button
        >
      </template>
      <template #detail-content="{ record, items, display, dictionaries }">
        <RuleDetail
          :key="String(record.id) + ':' + String(record.version)"
          :record="record"
          :items="items"
          :dictionaries="dictionaries"
          :display="display"
        />
      </template>
    </CrudPage>
    <el-dialog
      :model-value="panel === 'bindings'"
      :title="t('codeRules.usageConfig')"
      width="min(920px, 96vw)"
      destroy-on-close
      @update:model-value="panel = ''"
    >
      <template #header>
        <div class="panel-heading">
          <span>{{ t("codeRules.usageConfig") }}</span
          ><el-tag v-if="active" effect="plain"
            >{{ active.name }} ({{ active.code }})</el-tag
          >
        </div>
      </template>
      <UsageBindings
        v-if="panel === 'bindings'"
        :rule-id="active ? String(active.id) : undefined"
        :rule-name="active ? String(active.name) : undefined"
        :rule-unavailable="
          Boolean(
            active && (active.status !== '1' || active.firstBoundAt !== null)
          )
        "
      />
    </el-dialog>
    <el-drawer
      :model-value="panel === 'sequences'"
      :title="t('codeRules.sequenceRecords')"
      size="min(1000px, 96vw)"
      body-class="code-sequence-drawer-body"
      destroy-on-close
      @update:model-value="panel = ''"
    >
      <template #header>
        <div class="panel-heading">
          <span>{{ t("codeRules.sequenceRecords") }}</span
          ><el-tag v-if="active" effect="plain"
            >{{ active.name }} ({{ active.code }})</el-tag
          >
        </div>
      </template>
      <CrudPage
        v-if="panel === 'sequences' && active"
        :key="String(active.id)"
        class="sequence-list"
        :port="sequencePort"
        :fill="false"
        :page-key="'system:code-sequence:' + String(active.id)"
        :permissions="sequences.permissions"
      />
    </el-drawer>
  </div>
</template>
<style scoped>
.code-rule-page {
  min-width: 0;
}

.panel-heading {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  padding-right: 24px;
}

:global(.code-sequence-drawer-body) {
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
}

.sequence-list {
  flex: 1;
  min-height: 0;
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
