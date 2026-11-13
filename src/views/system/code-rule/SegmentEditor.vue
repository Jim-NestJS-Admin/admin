<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import Sortable from "sortablejs";
import DragIcon from "~icons/ri/draggable";
import type { components } from "@/api/schema";
type Segments = components["schemas"]["SystemCodeRuleAddData"]["segments"];
const props = defineProps<{ modelValue?: Segments; disabled?: boolean }>();
const emit = defineEmits<{ "update:modelValue": [value: Segments] }>();
const { t } = useI18n();
const segments = computed(() => props.modelValue ?? []);
const listEl = ref<HTMLElement>();
let serial = 0;
const rowKeys = ref(segments.value.map(() => ++serial));
let sortable: Sortable | undefined;
watch(
  () => segments.value.length,
  length => {
    while (rowKeys.value.length < length) rowKeys.value.push(++serial);
    rowKeys.value.length = length;
  }
);
watch(
  () => props.disabled,
  value => sortable?.option("disabled", Boolean(value))
);
onMounted(() => {
  if (!listEl.value) return;
  sortable = Sortable.create(listEl.value, {
    handle: ".segment-drag",
    draggable: ".segment-row",
    filter: ".sequence-segment",
    preventOnFilter: false,
    animation: 150,
    disabled: Boolean(props.disabled),
    onMove: event =>
      !(
        event.related.classList.contains("sequence-segment") &&
        event.willInsertAfter
      ),
    onEnd: ({ oldIndex, newIndex }) => {
      if (oldIndex == null || newIndex == null) return;
      reorder(oldIndex, newIndex);
    }
  });
});
onBeforeUnmount(() => sortable?.destroy());
function reorder(from: number, to: number) {
  if (
    props.disabled ||
    from === to ||
    to < 0 ||
    to >= segments.value.length ||
    segments.value[from]?.type === "sequence" ||
    segments.value[to]?.type === "sequence"
  )
    return;
  const next = [...segments.value];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  const [key] = rowKeys.value.splice(from, 1);
  rowKeys.value.splice(to, 0, key);
  emit("update:modelValue", next);
}
function change(index: number, key: string, value: unknown) {
  if (props.disabled) return;
  emit(
    "update:modelValue",
    segments.value.map((s, i) => (i === index ? { ...s, [key]: value } : s))
  );
}
function add(type: string) {
  if (
    props.disabled ||
    segments.value.length >= 4 ||
    (type !== "literal" && segments.value.some(s => s.type === type))
  )
    return;
  const next = [...segments.value];
  const sequence = next.findIndex(s => s.type === "sequence");
  const index = sequence < 0 ? next.length : sequence;
  next.splice(
    index,
    0,
    type === "literal"
      ? { type, value: "FORM_" }
      : type === "date"
        ? { type, format: "yyyyMMdd" }
        : type === "timestamp"
          ? { type, unit: "milliseconds" }
          : { type, width: 6 }
  );
  rowKeys.value.splice(index, 0, ++serial);
  emit("update:modelValue", next);
}
function remove(index: number) {
  if (props.disabled) return;
  rowKeys.value.splice(index, 1);
  emit(
    "update:modelValue",
    segments.value.filter((_, i) => i !== index)
  );
}
</script>
<template>
  <div class="segment-editor">
    <p>{{ t("codeRules.dragHint") }}</p>
    <div ref="listEl">
      <div
        v-for="(segment, index) in segments"
        :key="rowKeys[index]"
        class="segment-row"
        :class="{ 'sequence-segment': segment.type === 'sequence' }"
      >
        <button
          type="button"
          class="segment-drag"
          :disabled="disabled || segment.type === 'sequence'"
          :aria-label="t('codeRules.dragSegment')"
          :title="
            t(
              segment.type === 'sequence'
                ? 'codeRules.sequenceFixed'
                : 'codeRules.dragSegment'
            )
          "
          @keydown.up.prevent="reorder(index, index - 1)"
          @keydown.down.prevent="reorder(index, index + 1)"
        >
          <DragIcon />
        </button>
        <el-tag>{{ t(`codeRules.${segment.type}`) }}</el-tag>
        <div class="segment-control">
          <el-input
            v-if="segment.type === 'literal'"
            :model-value="String(segment.value ?? '')"
            :disabled="disabled"
            maxlength="16"
            show-word-limit
            :aria-label="t('codeRules.literal')"
            @update:model-value="change(index, 'value', $event)"
          />
          <el-select
            v-else-if="segment.type === 'date'"
            :model-value="segment.format"
            :disabled="disabled"
            :aria-label="t('codeRules.date')"
            @update:model-value="change(index, 'format', $event)"
            ><el-option
              v-for="format in [
                'yyyy',
                'yyyyMM',
                'yyyy-MM',
                'yyyyMMdd',
                'yyyy-MM-dd',
                'yyyyMMddHHmmss',
                'yyyy-MM-dd_HH-mm-ss'
              ]"
              :key="format"
              :label="format"
              :value="format"
          /></el-select>
          <el-select
            v-else-if="segment.type === 'timestamp'"
            :model-value="segment.unit"
            :disabled="disabled"
            :aria-label="t('codeRules.timestamp')"
            @update:model-value="change(index, 'unit', $event)"
          >
            <el-option value="seconds" :label="t('codeRules.seconds')" />
            <el-option
              value="milliseconds"
              :label="t('codeRules.milliseconds')"
            />
          </el-select>
          <div v-else class="sequence-control">
            <el-input-number
              :model-value="Number(segment.width)"
              :min="1"
              :max="12"
              :disabled="disabled"
              :aria-label="t('codeRules.width')"
              @update:model-value="change(index, 'width', $event)"
            /><span>{{ t("codeRules.digits") }}</span>
          </div>
        </div>
        <el-button
          type="danger"
          link
          :disabled="disabled"
          @click="remove(index)"
          >{{ t("crud.remove") }}</el-button
        >
      </div>
    </div>
    <div class="segment-buttons">
      <el-button
        v-for="type in ['literal', 'date', 'timestamp', 'sequence']"
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
  min-width: 0;
}

.segment-editor p {
  margin: 0 0 12px;
  color: var(--el-text-color-secondary);
}

.segment-row {
  display: grid;
  grid-template-columns: 28px 80px minmax(0, 1fr) 44px;
  gap: 8px;
  align-items: center;
  margin-bottom: 12px;
}

.segment-drag {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 32px;
  padding: 0;
  color: var(--el-text-color-secondary);
  touch-action: none;
  cursor: grab;
  background: transparent;
  border: 0;
}

.segment-drag:disabled {
  cursor: default;
  opacity: 0.35;
}

.segment-drag:focus-visible {
  outline: 2px solid var(--el-color-primary);
  outline-offset: 2px;
}

.segment-control {
  min-width: 0;
}

.sequence-control {
  display: flex;
  gap: 8px;
  align-items: center;
}

.segment-editor .segment-control :deep(.el-input-number) {
  flex: 0 1 160px;
  width: 160px;
  min-width: 0;
  max-width: 100%;
}

.segment-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.segment-buttons :deep(.el-button + .el-button) {
  margin-left: 0;
}

@media (width <= 600px) {
  .segment-row {
    grid-template-columns: 24px 64px minmax(0, 1fr) 40px;
    gap: 4px;
  }
}
</style>
