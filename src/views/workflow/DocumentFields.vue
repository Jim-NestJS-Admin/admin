<script setup lang="ts">
import { computed, ref } from "vue";
import type { FormInstance } from "element-plus";
import { useI18n } from "vue-i18n";
import { type Document, text } from "./model";
const props = defineProps<{
  form: Document["form"];
  modelValue: Record<string, unknown>;
  disabled?: boolean;
}>();
const emit = defineEmits<{
  "update:modelValue": [values: Record<string, unknown>];
}>();
const { t } = useI18n();
const formRef = ref<FormInstance>();
function set(field: string, value: unknown) {
  emit("update:modelValue", { ...props.modelValue, [field]: value ?? null });
}
const editable = computed(() =>
  props.form.fields.some(f => props.form.fieldStates[f.field] === "editable")
);
defineExpose({
  editable,
  validate: () => formRef.value?.validate().catch(() => false)
});
</script>
<template>
  <el-form
    ref="formRef"
    :model="modelValue"
    label-position="top"
    :disabled="disabled"
    class="document-fields"
    ><el-form-item
      v-for="field in form.fields"
      :key="field.field"
      :prop="field.field"
      :label="field.title"
      :rules="
        form.fieldStates[field.field] === 'editable'
          ? [
              {
                required: field.required,
                message: t('workflow.requiredField', { field: field.title }),
                trigger: 'blur'
              }
            ]
          : []
      "
      :required="field.required && form.fieldStates[field.field] === 'editable'"
    >
      <template v-if="form.fieldStates[field.field] !== 'editable'"
        ><div class="readonly-value">
          <span>{{ text(modelValue[field.field]) }}</span
          ><el-tag
            v-if="form.fieldStates[field.field] === 'masked'"
            type="info"
            size="small"
            >{{ t("workflow.fields.masked") }}</el-tag
          >
        </div></template
      >
      <el-select
        v-else-if="field.options.length"
        :model-value="modelValue[field.field]"
        :multiple="field.type === 'array'"
        clearable
        @update:model-value="set(field.field, $event)"
        ><el-option
          v-for="o in field.options"
          :key="String(o.value)"
          :label="o.label"
          :value="o.value"
      /></el-select>
      <el-input-number
        v-else-if="field.type === 'number'"
        :model-value="modelValue[field.field] as number"
        :min="field.validation.min"
        :max="field.validation.max"
        :precision="field.validation.precision"
        @update:model-value="set(field.field, $event)"
      />
      <el-switch
        v-else-if="field.type === 'boolean'"
        :model-value="Boolean(modelValue[field.field])"
        @update:model-value="set(field.field, $event)"
      />
      <el-date-picker
        v-else-if="field.type === 'date'"
        :model-value="modelValue[field.field] as string"
        type="date"
        value-format="YYYY-MM-DD"
        @update:model-value="set(field.field, $event)"
      />
      <el-input
        v-else
        :model-value="String(modelValue[field.field] ?? '')"
        type="text"
        :maxlength="field.validation.max"
        :minlength="field.validation.min"
        :show-word-limit="Boolean(field.validation.max)"
        @update:model-value="set(field.field, $event)"
      /> </el-form-item
    ><el-empty
      v-if="!form.fields.length"
      :description="t('workflow.noVisibleFields')"
      :image-size="60"
  /></el-form>
</template>
<style scoped>
.document-fields {
  min-width: 0;
}

.document-fields :deep(.el-select),
.document-fields :deep(.el-input-number),
.document-fields :deep(.el-date-editor) {
  width: 100%;
  min-width: 0;
}

.readonly-value {
  display: flex;
  gap: 8px;
  align-items: center;
  min-height: 32px;
  overflow-wrap: anywhere;
  white-space: pre-wrap;
}
</style>
