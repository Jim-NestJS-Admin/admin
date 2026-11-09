<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { ENUMS } from "@/api/constants";
import {
  isGroup,
  newGroup,
  newCondition,
  type GroupDraft,
  type QueryField,
  type ConditionDraft
} from "./query-draft";
const props = defineProps<{
  fields: QueryField[];
  depth: number;
  count: number;
}>();
const group = defineModel<GroupDraft>("group", { required: true });
const { t } = useI18n();
const joins = ENUMS["components.schemas.QueryGroupDto.properties.op"];
function changeField(node: ConditionDraft) {
  node.operator =
    props.fields.find(field => field.field === node.field)?.operators[0] ??
    "eq";
  node.text = "";
  node.end = "";
}
function typeOf(node: ConditionDraft) {
  return props.fields.find(field => field.field === node.field)?.type;
}
</script>
<template>
  <fieldset class="query-group">
    <legend>{{ t("query.group", { depth }) }}</legend>
    <div class="query-controls">
      <el-select v-model="group.join" :aria-label="t('query.join')"
        ><el-option
          v-for="join in joins"
          :key="join"
          :value="join"
          :label="t(`query.${join}`)"
      /></el-select>
      <el-button
        :disabled="count >= 20 || !fields.length"
        @click="group.children.push(newCondition(fields))"
        >{{ t("query.addCondition") }}</el-button
      >
      <el-button
        :disabled="depth >= 3 || count >= 20"
        @click="group.children.push(newGroup())"
        >{{ t("query.addGroup") }}</el-button
      >
    </div>
    <div
      v-for="(node, index) in group.children"
      :key="node.key"
      class="query-node"
    >
      <QueryGroupEditor
        v-if="isGroup(node)"
        :group="node"
        :fields="fields"
        :depth="depth + 1"
        :count="count"
      />
      <div v-else class="query-condition">
        <el-select
          v-model="node.field"
          :aria-label="t('query.field')"
          @change="changeField(node)"
          ><el-option
            v-for="field in fields"
            :key="field.field"
            :value="field.field"
            :label="field.label"
        /></el-select>
        <el-select v-model="node.operator" :aria-label="t('query.operator')"
          ><el-option
            v-for="op in fields.find(field => field.field === node.field)
              ?.operators ?? []"
            :key="op"
            :value="op"
            :label="t(`query.ops.${op}`)"
        /></el-select>
        <template v-if="!['isNull', 'notNull'].includes(node.operator)">
          <el-select
            v-if="typeOf(node) === 'boolean'"
            v-model="node.text"
            :aria-label="t('query.value')"
            ><el-option value="true" :label="t('query.true')" /><el-option
              value="false"
              :label="t('query.false')"
          /></el-select>
          <el-input
            v-else
            v-model="node.text"
            :type="
              typeOf(node) === 'date' &&
              !['in', 'notIn'].includes(node.operator)
                ? 'datetime-local'
                : 'text'
            "
            :aria-label="t('query.value')"
            :placeholder="
              t(
                ['in', 'notIn'].includes(node.operator)
                  ? 'query.listHint'
                  : 'query.value'
              )
            "
          />
          <el-input
            v-if="node.operator === 'between'"
            v-model="node.end"
            :type="typeOf(node) === 'date' ? 'datetime-local' : 'text'"
            :aria-label="t('query.upper')"
            :placeholder="t('query.upper')"
          />
        </template>
      </div>
      <el-button
        :aria-label="t('crud.remove')"
        @click="group.children.splice(index, 1)"
        >{{ t("crud.remove") }}</el-button
      >
    </div>
  </fieldset>
</template>
<style scoped>
.query-group {
  min-width: 0;
  padding: 12px;
  border: 1px solid var(--el-border-color);
}

.query-controls,
.query-condition,
.query-node {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 10px;
}

.query-node > .query-group {
  flex: 1;
}

.query-condition {
  flex: 1;
}

.query-controls :deep(.el-select),
.query-condition :deep(.el-select),
.query-condition :deep(.el-input) {
  width: 180px;
}
</style>
