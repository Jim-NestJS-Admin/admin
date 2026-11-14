<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { newNode, copy, type Node } from "./model";
defineOptions({ name: "WorkflowNodeList" });
const props = defineProps<{
  modelValue: Node[];
  selectedId?: string;
  readonly?: boolean;
}>();
const emit = defineEmits<{
  "update:modelValue": [value: Node[]];
  select: [id: string];
}>();
const { t } = useI18n();
function insert(at: number, type: Node["type"]) {
  const nodes = copy(props.modelValue);
  const node = newNode(type, t(`workflow.nodes.${type}`));
  node.branches?.forEach(
    (b, i) =>
      (b.name = b.default
        ? t("workflow.defaultBranch")
        : `${t("workflow.branch")} ${i + 1}`)
  );
  nodes.splice(at, 0, node);
  emit("update:modelValue", nodes);
  emit("select", node.id);
}
function move(index: number, step: number) {
  const nodes = copy(props.modelValue);
  const [n] = nodes.splice(index, 1);
  nodes.splice(index + step, 0, n);
  emit("update:modelValue", nodes);
}
function remove(index: number) {
  const nodes = copy(props.modelValue);
  nodes.splice(index, 1);
  emit("update:modelValue", nodes);
}
function branch(index: number, b: number, nodes: Node[]) {
  const next = copy(props.modelValue);
  next[index].branches![b].nodes = nodes;
  emit("update:modelValue", next);
}
</script>
<template>
  <div class="node-list">
    <template v-for="index in modelValue.length + 1" :key="index">
      <div v-if="!readonly" class="node-add">
        <el-dropdown trigger="click" @command="insert(index - 1, $event)"
          ><el-button circle :aria-label="t('workflow.addNode')">+</el-button
          ><template #dropdown
            ><el-dropdown-menu
              ><el-dropdown-item
                v-for="kind in ['approve', 'copy', 'condition', 'parallel']"
                :key="kind"
                :command="kind"
                >{{ t(`workflow.nodes.${kind}`) }}</el-dropdown-item
              ></el-dropdown-menu
            ></template
          ></el-dropdown
        >
      </div>
      <article
        v-if="modelValue[index - 1]"
        class="node-card"
        :class="{ selected: selectedId === modelValue[index - 1].id }"
      >
        <header>
          <el-button
            link
            type="primary"
            class="node-name"
            @click="emit('select', modelValue[index - 1].id)"
            ><el-tag size="small" effect="plain">{{
              t(`workflow.nodes.${modelValue[index - 1].type}`)
            }}</el-tag
            ><strong>{{ modelValue[index - 1].name }}</strong></el-button
          ><el-space v-if="!readonly" :size="4"
            ><el-button
              link
              :disabled="index === 1"
              :aria-label="t('workflow.moveUp')"
              @click="move(index - 1, -1)"
              >↑</el-button
            ><el-button
              link
              :disabled="index === modelValue.length"
              :aria-label="t('workflow.moveDown')"
              @click="move(index - 1, 1)"
              >↓</el-button
            ><el-button link type="danger" @click="remove(index - 1)">{{
              t("workflow.remove")
            }}</el-button></el-space
          >
        </header>
        <div v-if="modelValue[index - 1].actor" class="node-summary">
          {{ t(`workflow.actors.${modelValue[index - 1].actor!.type}`)
          }}<span v-if="modelValue[index - 1].mode">
            · {{ t(`workflow.modes.${modelValue[index - 1].mode}`) }}</span
          >
        </div>
        <div v-if="modelValue[index - 1].branches" class="branches">
          <div
            v-for="(b, bi) in modelValue[index - 1].branches"
            :key="b.id"
            class="branch"
          >
            <el-button link @click="emit('select', modelValue[index - 1].id)"
              >{{ b.name
              }}<el-tag v-if="b.default" size="small" type="info">{{
                t("workflow.defaultBranch")
              }}</el-tag></el-button
            ><NodeList
              :model-value="b.nodes"
              :selected-id="selectedId"
              :readonly="readonly"
              @update:model-value="branch(index - 1, bi, $event)"
              @select="emit('select', $event)"
            />
          </div>
        </div>
      </article>
    </template>
  </div>
</template>
<style scoped>
.node-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: stretch;
  min-width: 240px;
}

.node-add {
  position: relative;
  display: flex;
  justify-content: center;
  padding: 5px;
}

.node-add::before {
  position: absolute;
  top: -8px;
  bottom: -8px;
  left: 50%;
  content: "";
  border-left: 1px solid var(--el-border-color);
}

.node-add :deep(.el-dropdown) {
  z-index: 1;
}

.node-card {
  padding: 14px;
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color);
  border-radius: 6px;
}

.node-card.selected {
  border-color: var(--el-color-primary);
  box-shadow: 0 0 0 1px var(--el-color-primary);
}

.node-card > header {
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
}

.node-name {
  min-width: 0;
  text-align: left;
  white-space: normal;
}

.node-name strong {
  margin-left: 8px;
  color: var(--el-text-color-primary);
}

.node-summary {
  margin-top: 8px;
  font-size: 13px;
  color: var(--el-text-color-secondary);
}

.branches {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  margin-top: 16px;
  overflow: auto;
}

.branch {
  flex: 1;
  min-width: 250px;
  padding: 10px;
  background: var(--el-fill-color-lighter);
  border-radius: 4px;
}

.branch > .el-button {
  margin-bottom: 12px;
}

.branch :deep(.node-card) {
  padding: 10px;
}
</style>
