<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import CrudPage from "@/components/Crud/CrudPage.vue";
import { generatedCrud } from "@/platform/generated-crud";
import { permission } from "@/platform/system/resources";
import SegmentEditor from "./code-rule/SegmentEditor.vue";
import RuleTools from "./code-rule/RuleTools.vue";
import UsageBindings from "./code-rule/UsageBindings.vue";
import TimeZoneSelect from "./code-rule/TimeZoneSelect.vue";
defineOptions({ name: "SystemCodeRule" });
const { t } = useI18n();
const tab = ref("rules");
const draftTools = ref<InstanceType<typeof RuleTools>>();
const rules = generatedCrud("systemCodeRule"),
  sequences = generatedCrud("systemCodeSequence");
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
  <div>
    <el-tabs v-model="tab">
      <el-tab-pane :label="t('codeRules.rules')" name="rules">
        <CrudPage
          v-if="tab === 'rules'"
          :port="rules.port"
          page-key="system:code-rule"
          :permissions="rules.permissions"
          :add-defaults="defaults"
        >
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
              :model-value="
                Array.isArray(values.segments) ? values.segments : []
              "
              :disabled="disabled"
              @update:model-value="values.segments = $event"
          /></template>
          <template #form-extra="{ values }">
            <el-form-item>
              <RuleTools
                ref="draftTools"
                :draft="values"
                :show-actions="false"
              />
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
          <template #editor-related="{ record }"
            ><RuleTools
              :key="String(record.id) + String(record.version)"
              :rule-id="String(record.id)"
          /></template>
        </CrudPage>
      </el-tab-pane>
      <el-tab-pane :label="t('codeRules.bindings')" name="bindings"
        ><UsageBindings v-if="tab === 'bindings'"
      /></el-tab-pane>
      <el-tab-pane :label="t('codeRules.sequences')" name="sequences"
        ><CrudPage
          v-if="tab === 'sequences'"
          :port="sequences.port"
          page-key="system:code-sequence"
          :permissions="sequences.permissions"
      /></el-tab-pane>
    </el-tabs>
  </div>
</template>
<style scoped>
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
