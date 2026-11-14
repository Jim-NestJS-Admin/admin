<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import type { components } from "@/api/schema";
import { copy, type Condition, type Field } from "./model";
import ResourceSelect from "./ResourceSelect.vue";
defineOptions({ name: "WorkflowConditionEditor" });
const props = withDefaults(
  defineProps<{
    modelValue: Condition;
    fields: Field[];
    disabled?: boolean;
    depth?: number;
  }>(),
  { depth: 0 }
);
const emit = defineEmits<{ "update:modelValue": [value: Condition] }>();
const { t } = useI18n();
type Leaf = components["schemas"]["WorkflowConditionValue"];
const group = computed(() =>
  "logic" in props.modelValue ? props.modelValue : null
);
const leaf = computed(() =>
  "source" in props.modelValue ? props.modelValue : null
);
const field = computed(() =>
  props.fields.find(f => f.field === leaf.value?.field)
);
const multiple = computed(() =>
  ["in", "not_in"].includes(leaf.value?.operator ?? "")
);
const directoryValue = computed(() => leaf.value?.value as string | string[]);
const atom = (): Leaf => ({
  source: "field",
  field: props.fields[0]?.field ?? "",
  operator: "eq",
  value: ""
});
function set(change: Partial<Leaf>) {
  if (leaf.value) emit("update:modelValue", { ...copy(leaf.value), ...change });
}
function child(index: number, value: Condition) {
  if (group.value) {
    const n = copy(group.value);
    n.conditions[index] = value;
    emit("update:modelValue", n);
  }
}
function add(nested: boolean) {
  if (group.value) {
    const n = copy(group.value);
    n.conditions.push(nested ? { logic: "all", conditions: [atom()] } : atom());
    emit("update:modelValue", n);
  }
}
function remove(index: number) {
  if (group.value) {
    const n = copy(group.value);
    n.conditions.splice(index, 1);
    emit("update:modelValue", n);
  }
}
function values(value: unknown) {
  const convert = (v: unknown) =>
    field.value?.type === "number" ? Number(v) : String(v);
  set({ value: Array.isArray(value) ? value.map(convert) : convert(value) });
}
</script>
<template>
  <div class="condition-editor">
    <template v-if="group">
      <el-space wrap
        ><el-select
          :model-value="group.logic"
          :disabled="disabled"
          class="logic"
          @update:model-value="
            emit('update:modelValue', { ...copy(group), logic: $event })
          "
          ><el-option
            :label="t('workflow.allConditions')"
            value="all" /><el-option
            :label="t('workflow.anyConditions')"
            value="any" /></el-select
        ><el-button
          :disabled="disabled || group.conditions.length >= 20"
          @click="add(false)"
          >{{ t("workflow.addCondition") }}</el-button
        ><el-button
          :disabled="disabled || depth >= 6 || group.conditions.length >= 20"
          @click="add(true)"
          >{{ t("workflow.addGroup") }}</el-button
        ></el-space
      >
      <div
        v-for="(condition, i) in group.conditions"
        :key="i"
        class="condition-child"
      >
        <ConditionEditor
          :model-value="condition"
          :fields="fields"
          :disabled="disabled"
          :depth="depth + 1"
          @update:model-value="child(i, $event)"
        /><el-button
          link
          type="danger"
          :disabled="disabled || group.conditions.length <= 1"
          @click="remove(i)"
          >{{ t("workflow.remove") }}</el-button
        >
      </div>
    </template>
    <template v-else-if="leaf">
      <div class="condition-line">
        <el-select
          :model-value="leaf.source"
          :disabled="disabled"
          @update:model-value="
            set({
              source: $event,
              field: $event === 'field' ? fields[0]?.field : undefined,
              operator: 'eq',
              value: ''
            })
          "
          ><el-option
            v-for="source in ['field', 'applicant_org', 'applicant_role']"
            :key="source"
            :value="source"
            :label="t(`workflow.sources.${source}`)" /></el-select
        ><el-select
          v-if="leaf.source === 'field'"
          :model-value="leaf.field"
          filterable
          :disabled="disabled"
          @update:model-value="
            set({ field: $event, value: '', operator: 'eq' })
          "
          ><el-option
            v-for="f in fields"
            :key="f.field"
            :value="f.field"
            :label="f.title"
        /></el-select>
      </div>
      <div class="condition-line">
        <el-select
          :model-value="leaf.operator"
          :disabled="disabled"
          @update:model-value="
            set({
              operator: $event,
              value: ['in', 'not_in'].includes($event) ? [] : ''
            })
          "
          ><el-option
            v-for="op in [
              'eq',
              'ne',
              'in',
              'not_in',
              ...(['number', 'date'].includes(field?.type ?? '') &&
              leaf.source === 'field'
                ? ['gt', 'gte', 'lt', 'lte']
                : [])
            ]"
            :key="op"
            :value="op"
            :label="t(`workflow.operators.${op}`)"
        /></el-select>
        <ResourceSelect
          v-if="leaf.source !== 'field'"
          :kind="leaf.source === 'applicant_org' ? 'orgs' : 'roles'"
          :multiple="multiple"
          :model-value="directoryValue"
          :disabled="disabled"
          @update:model-value="set({ value: $event })"
        />
        <el-select
          v-else-if="field?.options?.length"
          :model-value="leaf.value"
          :multiple="multiple"
          :disabled="disabled"
          @update:model-value="set({ value: $event })"
          ><el-option
            v-for="option in field.options"
            :key="String(option.value)"
            :value="option.value"
            :label="option.label"
        /></el-select>
        <el-select
          v-else-if="field?.type === 'boolean'"
          :model-value="leaf.value"
          :disabled="disabled"
          @update:model-value="set({ value: $event })"
          ><el-option :value="true" :label="t('crud.booleanYes')" /><el-option
            :value="false"
            :label="t('crud.booleanNo')"
        /></el-select>
        <el-input-tag
          v-else-if="multiple"
          :model-value="Array.isArray(leaf.value) ? leaf.value.map(String) : []"
          :disabled="disabled"
          @update:model-value="values($event)"
        />
        <el-input-number
          v-else-if="field?.type === 'number'"
          :model-value="typeof leaf.value === 'number' ? leaf.value : undefined"
          :disabled="disabled"
          @update:model-value="set({ value: $event ?? 0 })"
        />
        <el-date-picker
          v-else-if="field?.type === 'date'"
          :model-value="leaf.value as string"
          type="date"
          value-format="YYYY-MM-DD"
          :disabled="disabled"
          @update:model-value="set({ value: $event ?? '' })"
        />
        <el-input
          v-else
          :model-value="String(leaf.value)"
          :disabled="disabled"
          maxlength="500"
          @update:model-value="set({ value: $event })"
        />
      </div>
      <el-button
        v-if="depth === 0"
        link
        :disabled="disabled"
        @click="
          emit('update:modelValue', { logic: 'all', conditions: [copy(leaf)] })
        "
        >{{ t("workflow.addGroup") }}</el-button
      >
    </template>
  </div>
</template>
<style scoped>
.condition-editor {
  display: grid;
  gap: 8px;
  min-width: 0;
}

.condition-line {
  display: flex;
  gap: 8px;
  min-width: 0;
}

.condition-line > * {
  flex: 1;
  min-width: 0;
}

.condition-child {
  display: flex;
  gap: 8px;
  padding: 10px;
  border-left: 2px solid var(--el-border-color);
}

.condition-child > .condition-editor {
  flex: 1;
}

.logic {
  width: 150px;
}

@media (width<=600px) {
  .condition-line {
    flex-wrap: wrap;
  }

  .condition-line > * {
    flex-basis: 100%;
  }
}
</style>
