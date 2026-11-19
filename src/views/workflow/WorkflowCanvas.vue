<script setup lang="ts">
import { computed, watchEffect } from "vue";
import { useI18n } from "vue-i18n";
import NodeChain from "mldong-flow-designer-dingtalk/packages/flow-designer/src/dingtalk/components/NodeChain.vue";
import { setLocale } from "mldong-flow-designer-dingtalk/packages/flow-designer/src/locales/index";
import "mldong-flow-designer-dingtalk/lib/style.css";
import { addWorkflowBranch, copy, newNode, type Node } from "./model";

const props = defineProps<{
  nodes: Node[];
  readonly: boolean;
  activeId: string;
  firstField: string;
}>();
const emit = defineEmits<{
  "update:nodes": [nodes: Node[]];
  select: [id: string];
  details: [];
}>();
const { t, locale } = useI18n();
watchEffect(() => setLocale(locale.value.startsWith("en") ? "en-US" : "zh-CN"));

type Card = {
  id: string;
  type: string;
  name: string;
  properties: Record<string, unknown>;
  children?: Card;
  branches?: {
    id: string;
    name: string;
    properties: object;
    children?: Card;
  }[];
  joinId?: string;
  joinChildren?: Card;
};
const prefix = "snaker:";
const startId = "@start";
const applicantId = "@applicant";
const endId = "@end";
const palette = computed(() => [
  { type: "task", label: t("workflow.nodes.approve") },
  { type: "copy", label: t("workflow.nodes.copy") }
]);
const nodeTypes = new Map<string, Node["type"]>([
  ["task", "approve"],
  ["copy", "copy"],
  ["__condition__", "condition"],
  ["__parallel__", "parallel"]
]);
const endpoint = (id: string, type: string, name: string): Card => ({
  id,
  type: prefix + type,
  name,
  properties: {}
});
function toChain(nodes: Node[], tail?: Card): Card | undefined {
  return nodes.reduceRight<Card | undefined>((next, node) => {
    const card: Card = {
      id: node.id,
      name: node.name,
      type: node.type === "approve" ? `${prefix}task` : `${prefix}copy`,
      properties:
        node.type === "approve" && node.mode !== "any"
          ? {
              performType: "ALL",
              countersignType:
                node.mode === "sequential" ? "SEQUENTIAL" : "PARALLEL"
            }
          : {}
    };
    if (node.branches) {
      card.branches = node.branches.map(branch => ({
        id: branch.id,
        name: branch.name,
        properties: {},
        children: toChain(branch.nodes)
      }));
      if (node.type === "parallel") {
        card.type = "fork";
        card.joinId = `@join:${node.id}`;
        card.joinChildren = {
          ...endpoint(card.joinId, "join", ""),
          children: next
        };
        return card;
      }
      card.type = "condition";
    }
    return { ...card, children: next };
  }, tail);
}
const chain = computed(() => ({
  ...endpoint(startId, "start", ""),
  children: {
    ...endpoint(applicantId, "task", t("workflow.submitApplication")),
    children: toChain(props.nodes, endpoint(endId, "end", t("workflow.end")))
  }
}));

function select(id: string) {
  if (id === applicantId) emit("details");
  else if (!id.startsWith("@")) emit("select", id);
}

function locate(
  nodes: Node[],
  id: string
): { nodes: Node[]; index: number } | undefined {
  const index = nodes.findIndex(node => node.id === id);
  if (index >= 0) return { nodes, index };
  for (const node of nodes) {
    for (const branch of node.branches ?? []) {
      if (branch.id === id) return { nodes: branch.nodes, index: -1 };
      const nested = locate(branch.nodes, id);
      if (nested) return nested;
    }
  }
}
function insert(kind: string, id: string) {
  if (props.readonly) return;
  const type = nodeTypes.get(kind.replace(/^snaker:/, ""));
  if (!type) return;
  const nodes = copy(props.nodes);
  const target =
    id === applicantId
      ? { nodes, index: -1 }
      : locate(nodes, id.replace(/^@join:/, ""));
  if (!target) return;
  const node = newNode(type, t(`workflow.nodes.${type}`));
  for (const [index, branch] of (node.branches ?? []).entries()) {
    branch.name = `${t("workflow.branch")} ${index + 1}`;
  }
  target.nodes.splice(target.index + 1, 0, node);
  emit("update:nodes", nodes);
}
function remove(id: string) {
  if (props.readonly || id.startsWith("@")) return;
  const nodes = copy(props.nodes);
  const target = locate(nodes, id);
  if (!target || target.index < 0) return;
  target.nodes.splice(target.index, 1);
  emit("update:nodes", nodes);
}
function addBranch(id: string) {
  if (props.readonly) return;
  const nodes = copy(props.nodes);
  const target = locate(nodes, id);
  const node = target?.nodes[target.index];
  if (!node?.branches) return;
  addWorkflowBranch(
    node,
    `${t("workflow.branch")} ${node.branches.length + 1}`,
    props.firstField
  );
  emit("update:nodes", nodes);
  emit("select", id);
}
</script>

<template>
  <div class="workflow-canvas">
    <div class="workflow-canvas__content">
      <NodeChain
        :node="chain"
        :viewer="readonly"
        :type-prefix="prefix"
        :depth="0"
        :dnd-panel="palette"
        :high-light="{ activeNodeNames: [activeId] }"
        :can-delete-checker="node => !node.id.startsWith('@')"
        @edit="node => select(node.id)"
        @delete="node => remove(node.id)"
        @add="(kind, node) => node && insert(kind, node.id)"
        @add-to-branch="(kind, branch) => insert(kind, branch.id)"
        @add-branch="node => addBranch(node.id)"
        @edit-branch="branch => $emit('select', branch.id)"
      />
    </div>
  </div>
</template>

<style scoped>
.workflow-canvas {
  --ding-bg-color: var(--el-fill-color-light);
  --ding-card-bg: var(--el-bg-color);
  --ding-text-color: var(--el-text-color-primary);
  --ding-text-secondary: var(--el-text-color-secondary);
  --ding-primary-color: var(--el-color-primary);
  --ding-active-color: var(--el-color-primary);
  --ding-border-color: var(--el-border-color);

  min-width: 0;
  height: max(480px, calc(100dvh - 196px));
  overflow: auto;
  background: var(--ding-bg-color);
}

.workflow-canvas__content {
  display: grid;
  justify-items: center;
  width: max-content;
  min-width: 100%;
  padding: 20px 32px 64px;
}
</style>
