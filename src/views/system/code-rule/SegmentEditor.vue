<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import type { components } from "@/api/schema";
type Segments = components["schemas"]["SystemCodeRuleAddData"]["segments"];
const props = defineProps<{ modelValue?: Segments; disabled?: boolean }>();
const emit = defineEmits<{ "update:modelValue": [value: Segments] }>();
const { t } = useI18n();
const segments = computed(() => props.modelValue ?? []);
function change(index: number, key: string, value: unknown) {
  emit(
    "update:modelValue",
    segments.value.map((s, i) => (i === index ? { ...s, [key]: value } : s))
  );
}
function add(type: string) {
  emit("update:modelValue", [
    ...segments.value,
    type === "literal"
      ? { type, value: "FORM_" }
      : type === "date"
        ? { type, format: "yyyyMMdd" }
        : { type, width: 6 }
  ]);
}
function remove(index: number) {
  emit(
    "update:modelValue",
    segments.value.filter((_, i) => i !== index)
  );
}
function move(index: number, step: number) {
  const next = [...segments.value];
  [next[index], next[index + step]] = [next[index + step], next[index]];
  emit("update:modelValue", next);
}
</script>
<template>
  <div class="segment-editor">
    <p>{{ t("codeRules.segmentHint") }}</p>
    <div v-for="(segment, index) in segments" :key="index" class="segment-row">
      <el-tag>{{ t(`codeRules.${segment.type}`) }}</el-tag>
      <el-input
        v-if="segment.type === 'literal'"
        :model-value="String(segment.value ?? '')"
        :disabled="disabled"
        maxlength="16"
        :aria-label="t('codeRules.literal')"
        @update:model-value="change(index, 'value', $event)"
      />
      <el-select
        v-else-if="segment.type === 'date'"
        :model-value="segment.format"
        :disabled="disabled"
        :aria-label="t('codeRules.date')"
        @update:model-value="change(index, 'format', $event)"
      >
        <el-option
          v-for="format in [
            'yyyy',
            'yyyyMM',
            'yyyy-MM',
            'yyyyMMdd',
            'yyyy-MM-dd'
          ]"
          :key="format"
          :label="format"
          :value="format"
        />
      </el-select>
      <el-input-number
        v-else
        :model-value="Number(segment.width)"
        :min="1"
        :max="12"
        :disabled="disabled"
        :aria-label="t('codeRules.width')"
        @update:model-value="change(index, 'width', $event)"
      />
      <el-button
        :disabled="disabled || index === 0"
        :aria-label="t('codeRules.up')"
        @click="move(index, -1)"
        >↑</el-button
      >
      <el-button
        :disabled="disabled || index === segments.length - 1"
        :aria-label="t('codeRules.down')"
        @click="move(index, 1)"
        >↓</el-button
      >
      <el-button
        type="danger"
        link
        :disabled="disabled"
        @click="remove(index)"
        >{{ t("crud.remove") }}</el-button
      >
    </div>
    <div class="segment-buttons">
      <el-button
        v-for="type in ['literal', 'date', 'sequence']"
        :key="type"
        :disabled="
          disabled ||
          segments.length >= 4 ||
          (type !== 'literal' && segments.some(s => s.type === type))
        "
        @click="add(type)"
        >+ {{ t(`codeRules.${type}`) }}</el-button
      >
    </div>
  </div>
</template>
<style scoped>
.segment-editor {
  width: 100%;
}

.segment-editor p {
  margin: 0 0 12px;
  color: var(--el-text-color-secondary);
}

.segment-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  margin-bottom: 12px;
}

.segment-row :deep(.el-input),
.segment-row :deep(.el-select) {
  flex: 1;
  min-width: 150px;
}

.segment-row :deep(.el-button + .el-button) {
  margin-left: 0;
}

.segment-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.segment-buttons :deep(.el-button + .el-button) {
  margin-left: 0;
}
</style>
