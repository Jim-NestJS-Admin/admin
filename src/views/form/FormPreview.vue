<script setup lang="ts">
import { onBeforeUnmount, ref, shallowRef, watch } from "vue";
import { useI18n } from "vue-i18n";
import formCreate, {
  type Api,
  type Options,
  type Rule as FcRule
} from "@form-create/element-ui";
import { api } from "@/api/client";
import { permission } from "@/platform/system/resources";
import {
  cleanPreviewValues,
  copy,
  fingerprint,
  formIssueLabel,
  issuesFrom,
  previewRules,
  type Designer,
  type Field,
  type FieldIssue
} from "./model";
import { requestText } from "./useFormWorkspace";
const props = defineProps<{
  designer: Designer;
  fields: Field[];
  definitionId?: string;
}>();
const { t } = useI18n();
const FormCreate = formCreate.$form();
const formApi = shallowRef<Api>();
const values = ref<Record<string, unknown>>({}),
  rules = ref<FcRule[]>([]);
const options: Options = {
  ...(copy(props.designer.option ?? {}) as Options),
  submitBtn: false,
  resetBtn: false
};
const issues = ref<FieldIssue[]>([]),
  error = ref(""),
  valid = ref(false),
  busy = ref(false);
let request: AbortController | undefined,
  lastEffects = "";
watch(
  () => props.designer,
  () => {
    request?.abort();
    values.value = {};
    issues.value = [];
    error.value = "";
    valid.value = false;
    busy.value = false;
    lastEffects = "";
    rules.value = copy(
      previewRules(props.designer, props.fields, {}).rules
    ) as FcRule[];
  },
  { immediate: true }
);
function applyEffects() {
  if (!formApi.value) return;
  const effective = previewRules(props.designer, props.fields, values.value);
  const safe = cleanPreviewValues(effective.fields, values.value);
  for (const field of props.fields)
    if (
      values.value[field.field] !== null &&
      values.value[field.field] !== undefined &&
      !Object.hasOwn(safe, field.field)
    )
      formApi.value.setValue(field.field, null);
  const signature = fingerprint(
    effective.fields.map(field => ({
      field: field.field,
      visible: field.visible,
      required: field.required,
      options: field.options
    }))
  );
  if (signature !== lastEffects) {
    lastEffects = signature;
    const apply = (items: typeof effective.rules) => {
      for (const rule of items) {
        if (Array.isArray(rule.children)) apply(rule.children as typeof items);
        if (rule.field)
          formApi.value?.updateRule(String(rule.field), rule as FcRule);
      }
    };
    apply(effective.rules);
  }
}
watch(
  values,
  () => {
    valid.value = false;
    applyEffects();
  },
  { deep: true }
);
watch(formApi, applyEffects);
async function validate() {
  if (!props.definitionId || busy.value) return;
  request?.abort();
  const current = (request = new AbortController());
  busy.value = true;
  error.value = "";
  issues.value = [];
  valid.value = false;
  try {
    const effective = previewRules(props.designer, props.fields, values.value);
    await api.formDefinitionValidate(
      {
        body: {
          definitionId: props.definitionId,
          data: cleanPreviewValues(effective.fields, values.value)
        }
      },
      { signal: current.signal }
    );
    if (!current.signal.aborted) valid.value = true;
  } catch (reason) {
    if (!current.signal.aborted) {
      error.value = requestText(reason);
      issues.value = issuesFrom(reason);
    }
  } finally {
    if (!current.signal.aborted) {
      busy.value = false;
      for (const field of props.fields)
        formApi.value?.updateRule(field.field, {
          wrap: {
            error: issues.value
              .filter(issue => issue.field === `data.${field.field}`)
              .flatMap(issue => issue.messages)
              .join("；")
          }
        });
    }
  }
}
onBeforeUnmount(() => request?.abort());
</script>
<template>
  <section class="form-preview">
    <el-alert
      :title="t(definitionId ? 'forms.testHint' : 'forms.unsavedPreview')"
      type="info"
      :closable="false"
    />
    <el-alert v-if="error" :title="t(error)" type="error" :closable="false">
      <ul>
        <li v-for="issue in issues" :key="issue.field">
          {{
            fields.find(field => `data.${field.field}` === issue.field)
              ?.title ?? formIssueLabel(issue.field, t)
          }}：{{ issue.messages.join("；") }}
        </li>
      </ul>
    </el-alert>
    <el-alert
      v-if="valid"
      :title="t('forms.valid')"
      type="success"
      :closable="false"
      role="status"
    />
    <div :inert="busy" class="preview-paper">
      <FormCreate
        v-if="rules.length"
        v-model="values"
        v-model:api="formApi"
        :rule="rules"
        :option="options"
      />
    </div>
    <div v-if="definitionId" class="preview-actions">
      <el-button
        v-perm="permission('formDefinitionValidate')"
        type="primary"
        :loading="busy"
        @click="validate"
        >{{ t("forms.validateValues") }}</el-button
      >
    </div>
  </section>
</template>
<style scoped>
.form-preview {
  display: grid;
  gap: 16px;
  width: 100%;
  min-width: 0;
  max-width: 760px;
}

.preview-paper {
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  padding: 20px;
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 6px;
}

.preview-paper :deep(.el-date-editor.el-input),
.preview-paper :deep(.el-input-number),
.preview-paper :deep(.el-select) {
  width: 100%;
  min-width: 0;
  max-width: 100%;
}

.preview-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

@media (width <= 600px) {
  .preview-paper {
    padding: 12px;
  }
}
</style>
