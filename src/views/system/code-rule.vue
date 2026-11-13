<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import CrudPage from "@/components/Crud/CrudPage.vue";
import { generatedCrud } from "@/platform/generated-crud";
import SegmentEditor from "./code-rule/SegmentEditor.vue";
import RuleTools from "./code-rule/RuleTools.vue";
import UsageBindings from "./code-rule/UsageBindings.vue";
defineOptions({ name: "SystemCodeRule" });
const { t } = useI18n();
const tab = ref("rules");
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
          <template #form-segments="{ values, disabled }"
            ><SegmentEditor
              :model-value="
                Array.isArray(values.segments) ? values.segments : []
              "
              :disabled="disabled"
              @update:model-value="values.segments = $event"
          /></template>
          <template #form-extra="{ values }"
            ><RuleTools :draft="values"
          /></template>
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
