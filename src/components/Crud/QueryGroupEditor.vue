<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { ENUMS } from "@/api/constants";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import AddIcon from "~icons/ri/add-line";
import GroupIcon from "~icons/ri/folder-add-line";
import DeleteIcon from "~icons/ri/delete-bin-line";
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
  /** 子分组可以整组删除 */
  removable?: boolean;
}>();
const emit = defineEmits<{ remove: [] }>();
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
  <!-- 条件组：标题栏（层级、条件关系、添加条件 / 分组）+ 条件行，子分组缩进成卡片 -->
  <div class="query-group" :class="{ 'is-nested': depth > 1 }">
    <div class="query-group-head">
      <span class="query-group-title">{{ t("query.group", { depth }) }}</span>
      <el-select
        v-model="group.join"
        class="query-join"
        :aria-label="t('query.join')"
        ><el-option
          v-for="join in joins"
          :key="join"
          :value="join"
          :label="t(`query.${join}`)"
      /></el-select>
      <div class="query-flex1" />
      <el-button
        link
        type="primary"
        :icon="useRenderIcon(AddIcon)"
        :disabled="count >= 20 || !fields.length"
        @click="group.children.push(newCondition(fields))"
        >{{ t("query.addCondition") }}</el-button
      >
      <el-button
        link
        type="primary"
        :icon="useRenderIcon(GroupIcon)"
        :disabled="depth >= 3 || count >= 20"
        @click="group.children.push(newGroup())"
        >{{ t("query.addGroup") }}</el-button
      >
      <el-button
        v-if="removable"
        link
        type="danger"
        :icon="useRenderIcon(DeleteIcon)"
        @click="emit('remove')"
        >{{ t("crud.remove") }}</el-button
      >
    </div>
    <div class="query-group-body">
      <p v-if="!group.children.length" class="query-empty">
        {{ t("query.empty") }}
      </p>
      <template v-for="(node, index) in group.children" :key="node.key">
        <QueryGroupEditor
          v-if="isGroup(node)"
          :group="node"
          :fields="fields"
          :depth="depth + 1"
          :count="count"
          removable
          @remove="group.children.splice(index, 1)"
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
          <div class="query-value">
            <template v-if="!['isNull', 'notNull'].includes(node.operator)">
              <el-select
                v-if="typeOf(node) === 'boolean'"
                v-model="node.text"
                :aria-label="t('query.value')"
                :placeholder="t('query.value')"
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
              <template v-if="node.operator === 'between'">
                <span class="query-range-sep">~</span>
                <el-input
                  v-model="node.end"
                  :type="typeOf(node) === 'date' ? 'datetime-local' : 'text'"
                  :aria-label="t('query.upper')"
                  :placeholder="t('query.upper')"
                />
              </template>
            </template>
          </div>
          <el-tooltip :content="t('crud.remove')" placement="top">
            <el-button
              text
              class="query-remove"
              :icon="useRenderIcon(DeleteIcon)"
              :aria-label="t('crud.remove')"
              @click="group.children.splice(index, 1)"
            />
          </el-tooltip>
        </div>
      </template>
    </div>
  </div>
</template>
<style scoped>
@media (width <= 760px) {
  .query-group-head {
    flex-wrap: wrap;
  }

  .query-condition {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) auto;
  }

  .query-value {
    grid-row: 2;
    grid-column: 1 / -1;
  }
}

.query-group {
  min-width: 0;
  overflow: hidden;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: var(--el-border-radius-base);
}

.query-group-head {
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 8px 12px;
  background: var(--el-fill-color-light);
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.query-group.is-nested > .query-group-head {
  background: var(--el-fill-color-lighter);
}

.query-group-head :deep(.el-button + .el-button) {
  margin-left: 0;
}

.query-group-title {
  font-size: var(--el-font-size-base);
  color: var(--el-text-color-regular);
  white-space: nowrap;
}

.query-join {
  width: 150px;
}

.query-flex1 {
  flex: 1;
}

.query-group-body {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 12px;
}

.query-empty {
  margin: 0;
  font-size: var(--el-font-size-small);
  line-height: var(--crud-control-height, 32px);
  color: var(--el-text-color-placeholder);
  text-align: center;
}

/* 条件行：字段、比较方式、条件值（区间时两个框）、删除，列宽固定，上下对齐 */
.query-condition {
  display: grid;
  grid-template-columns: 170px 130px minmax(0, 1fr) auto;
  gap: 8px;
  align-items: center;
}

.query-value {
  display: flex;
  gap: 8px;
  align-items: center;
  min-width: 0;
}

.query-value > * {
  flex: 1;
  min-width: 0;
}

.query-value > .query-range-sep {
  flex: none;
  color: var(--el-text-color-secondary);
}

.query-remove {
  color: var(--el-text-color-secondary);
}

.query-remove:hover {
  color: var(--el-color-danger);
}
</style>
