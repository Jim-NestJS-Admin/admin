<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import {
  comparisonValue,
  copy,
  type Field,
  type FieldIssue,
  type Linkage
} from "./model";
const props = defineProps<{
  modelValue: Linkage[];
  fields: Field[];
  issues: FieldIssue[];
  disabled?: boolean;
}>();
const emit = defineEmits<{
  "update:modelValue": [rules: Linkage[]];
  refresh: [];
}>();
const { t } = useI18n();
const sources = computed(() =>
  props.fields.filter(
    (field, i) =>
      !field.generated &&
      !field.multiple &&
      props.fields.slice(i + 1).some(next => !next.generated)
  )
);
const sourceOf = (rule: Linkage) =>
  props.fields.find(field => field.field === rule.source);
const targets = (rule: Linkage) =>
  props.fields
    .slice(props.fields.findIndex(field => field.field === rule.source) + 1)
    .filter(field => !field.generated);
const targetOf = (rule: Linkage) =>
  props.fields.find(field => field.field === rule.target);
function change(index: number, changes: Partial<Linkage>) {
  const rules = copy(props.modelValue);
  Object.assign(rules[index], changes);
  emit("update:modelValue", rules);
}
function add() {
  const source = sources.value[0];
  if (!source) return;
  const target = props.fields
    .slice(props.fields.indexOf(source) + 1)
    .find(field => !field.generated)!;
  emit("update:modelValue", [
    ...copy(props.modelValue),
    {
      source: source.field,
      target: target.field,
      operator: "eq",
      value: comparisonValue(source),
      action: "visible",
      whenTrue: true,
      whenFalse: false
    }
  ]);
}
function action(index: number, next: Linkage["action"]) {
  const options = targetOf(props.modelValue[index])?.options ?? [];
  change(index, {
    action: next,
    whenTrue: next === "options" ? copy(options) : true,
    whenFalse: next === "options" ? copy(options) : false
  });
}
function subset(
  index: number,
  key: "whenTrue" | "whenFalse",
  values: unknown[]
) {
  change(index, {
    [key]: copy(
      targetOf(props.modelValue[index])?.options.filter(option =>
        values.includes(option.value)
      ) ?? []
    )
  });
}
</script>
<template>
  <section class="linkage-editor">
    <div class="linkage-toolbar">
      <p>{{ t("forms.linkageHint") }}</p>
      <el-button :disabled="disabled" @click="emit('refresh')">{{
        t("forms.refreshFields")
      }}</el-button>
    </div>
    <el-empty
      v-if="!modelValue.length"
      :description="t('forms.noLinkages')"
      :image-size="60"
    />
    <el-card
      v-for="(rule, index) in modelValue"
      :key="index"
      shadow="never"
      :class="{
        invalid: issues.some(issue =>
          issue.field.startsWith(`data.designer.linkages.${index}`)
        )
      }"
    >
      <div class="linkage-toolbar">
        <strong>{{ t("forms.condition", { n: index + 1 }) }}</strong
        ><el-button
          :disabled="disabled"
          text
          type="danger"
          @click="
            emit(
              'update:modelValue',
              modelValue.filter((_, i) => i !== index)
            )
          "
          >{{ t("crud.remove") }}</el-button
        >
      </div>
      <el-form label-position="top" :disabled="disabled" class="linkage-grid">
        <el-form-item :label="t('forms.source')"
          ><el-select
            :model-value="rule.source"
            @update:model-value="
              change(index, {
                source: $event,
                target: '',
                operator: 'eq',
                value: comparisonValue(
                  fields.find(field => field.field === $event)
                ),
                action: 'visible',
                whenTrue: true,
                whenFalse: false
              })
            "
            ><el-option
              v-for="field in sources"
              :key="field.field"
              :label="`${field.title} (${field.field})`"
              :value="field.field" /></el-select
        ></el-form-item>
        <el-form-item :label="t('forms.operator')"
          ><el-select
            :model-value="rule.operator"
            @update:model-value="
              change(index, {
                operator: $event,
                value: $event === 'in' ? [] : comparisonValue(sourceOf(rule))
              })
            "
            ><el-option
              v-for="op in ['eq', 'ne', 'in']"
              :key="op"
              :label="t(`forms.operators.${op}`)"
              :value="op"
              :disabled="
                op === 'in' && !sourceOf(rule)?.options.length
              " /></el-select
        ></el-form-item>
        <el-form-item :label="t('forms.compareValue')">
          <el-select
            v-if="sourceOf(rule)?.options.length"
            :key="`${rule.source}-${rule.operator}`"
            :model-value="rule.value as never"
            :multiple="rule.operator === 'in'"
            @update:model-value="change(index, { value: $event })"
            ><el-option
              v-for="option in sourceOf(rule).options"
              :key="String(option.value)"
              :label="option.label"
              :value="option.value"
          /></el-select>
          <el-input-number
            v-else-if="sourceOf(rule)?.type === 'number'"
            :model-value="
              typeof rule.value === 'number' ? rule.value : undefined
            "
            @update:model-value="change(index, { value: $event })"
          />
          <el-switch
            v-else-if="sourceOf(rule)?.type === 'boolean'"
            :model-value="rule.value === true"
            @update:model-value="change(index, { value: $event as boolean })"
          />
          <el-input
            v-else
            :model-value="typeof rule.value === 'string' ? rule.value : ''"
            @update:model-value="change(index, { value: $event })"
          />
        </el-form-item>
        <el-form-item :label="t('forms.target')"
          ><el-select
            :model-value="rule.target"
            @update:model-value="
              change(index, {
                target: $event,
                action: 'visible',
                whenTrue: true,
                whenFalse: false
              })
            "
            ><el-option
              v-for="field in targets(rule)"
              :key="field.field"
              :label="`${field.title} (${field.field})`"
              :value="field.field" /></el-select
        ></el-form-item>
        <el-form-item :label="t('forms.action')"
          ><el-select
            :model-value="rule.action"
            @update:model-value="action(index, $event)"
            ><el-option
              v-for="kind in ['visible', 'required', 'options']"
              :key="kind"
              :value="kind"
              :label="t(`forms.actions.${kind}`)"
              :disabled="
                kind === 'options' && !targetOf(rule)?.options.length
              " /></el-select
        ></el-form-item>
        <el-form-item
          v-for="key in ['whenTrue', 'whenFalse'] as const"
          :key="key"
          :label="t(`forms.${key}`)"
        >
          <el-select
            v-if="rule.action === 'options'"
            :model-value="
              Array.isArray(rule[key])
                ? (rule[key] as Field['options']).map(option => option.value)
                : []
            "
            multiple
            @update:model-value="subset(index, key, $event)"
            ><el-option
              v-for="option in targetOf(rule)?.options ?? []"
              :key="String(option.value)"
              :label="option.label"
              :value="option.value"
          /></el-select>
          <el-switch
            v-else
            :model-value="rule[key] === true"
            @update:model-value="change(index, { [key]: $event })"
          />
        </el-form-item>
      </el-form>
    </el-card>
    <el-button
      :disabled="disabled || !sources.length || modelValue.length >= 200"
      @click="add"
      >{{ t("forms.addCondition") }}</el-button
    >
  </section>
</template>
<style scoped>
.linkage-editor {
  display: grid;
  gap: 16px;
}

.linkage-toolbar {
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
}

.linkage-toolbar p {
  margin: 0;
  font-size: 13px;
  color: var(--el-text-color-secondary);
}

.linkage-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0 16px;
}

.invalid {
  border-color: var(--el-color-danger);
}

@media (width <= 760px) {
  .linkage-grid {
    grid-template-columns: 1fr;
  }

  .linkage-toolbar {
    flex-wrap: wrap;
    align-items: flex-start;
  }
}
</style>
