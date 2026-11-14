<script setup lang="ts">
import { useI18n } from "vue-i18n";
import type { components } from "@/api/schema";
type Option = components["schemas"]["FormOptionDto"];
const props = defineProps<{ modelValue?: Option[] }>();
const emit = defineEmits<{ "update:modelValue": [options: Option[]] }>();
const { t } = useI18n();
function update(index: number, key: keyof Option, value: unknown) {
  emit(
    "update:modelValue",
    (props.modelValue ?? []).map((item, i) =>
      i === index ? { ...item, [key]: value } : { ...item }
    )
  );
}
function add() {
  const list = props.modelValue ?? [];
  const kind = typeof list[0]?.value;
  emit("update:modelValue", [
    ...list.map(item => ({ ...item })),
    {
      label: "",
      value: kind === "number" ? 0 : kind === "boolean" ? false : ""
    }
  ]);
}
</script>
<template>
  <div class="static-options">
    <div
      v-for="(option, index) in modelValue ?? []"
      :key="index"
      class="option-row"
    >
      <el-input
        :model-value="option.label"
        :aria-label="t('forms.optionLabel')"
        :placeholder="t('forms.optionLabel')"
        @update:model-value="update(index, 'label', $event)"
      />
      <el-input-number
        v-if="typeof option.value === 'number'"
        :model-value="option.value"
        :controls="false"
        :aria-label="t('forms.optionValue')"
        @update:model-value="update(index, 'value', $event)"
      />
      <el-switch
        v-else-if="typeof option.value === 'boolean'"
        :model-value="option.value"
        :aria-label="t('forms.optionValue')"
        @update:model-value="update(index, 'value', $event)"
      />
      <el-input
        v-else
        :model-value="option.value"
        :aria-label="t('forms.optionValue')"
        :placeholder="t('forms.optionValue')"
        @update:model-value="update(index, 'value', $event)"
      />
      <el-button
        text
        type="danger"
        :aria-label="t('crud.remove')"
        @click="
          emit(
            'update:modelValue',
            modelValue.filter((_, i) => i !== index)
          )
        "
        >×</el-button
      >
    </div>
    <el-button :disabled="(modelValue?.length ?? 0) >= 200" @click="add">{{
      t("forms.addOption")
    }}</el-button>
  </div>
</template>
<style scoped>
.static-options {
  display: grid;
  gap: 8px;
  width: 100%;
}

.option-row {
  display: grid;
  grid-template-columns: 1fr 1fr 28px;
  gap: 4px;
  align-items: center;
}

.option-row :deep(.el-input-number) {
  width: 100%;
}
</style>
