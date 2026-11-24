<script setup lang="ts">
import {
  computed,
  onBeforeUnmount,
  ref,
  watch,
  watchEffect,
  type Component
} from "vue";
import { useI18n } from "vue-i18n";
import { ElMessageBox } from "element-plus";
import CircleCheckFilled from "~icons/ep/circle-check-filled";
import CircleCloseFilled from "~icons/ep/circle-close-filled";
import Clock from "~icons/ep/clock";
import NodeChain from "mldong-flow-designer-dingtalk/packages/flow-designer/src/dingtalk/components/NodeChain.vue";
import { setLocale } from "mldong-flow-designer-dingtalk/packages/flow-designer/src/locales/index";
import "mldong-flow-designer-dingtalk/lib/style.css";
import type { MemberChoice } from "@/components/MemberPicker/types";
import { onSessionReset } from "@/platform/lifecycle";
import {
  addWorkflowBranch,
  allNodes,
  copy,
  newNode,
  pendingNodes,
  type Document,
  type Node
} from "./model";
import { workflowMemberDirectory } from "./member-directory";

type ProgressNode = Document["progress"][number];
const progressAppearance: Partial<
  Record<
    ProgressNode["status"],
    { icon: Component; tone: "success" | "danger" | "warning" }
  >
> = {
  approved: { icon: CircleCheckFilled, tone: "success" },
  returned: { icon: CircleCloseFilled, tone: "danger" },
  pending: { icon: Clock, tone: "warning" }
};
const progressTheme = { historyColor: "var(--el-color-success)" };
const props = withDefaults(
  defineProps<{
    nodes?: Node[];
    progress?: ProgressNode[];
    showStatus?: boolean;
    embedded?: boolean;
    readonly: boolean;
    activeId?: string;
    firstField?: string;
  }>(),
  { nodes: () => [], activeId: "", firstField: "" }
);
const emit = defineEmits<{
  "update:nodes": [nodes: Node[]];
  select: [id: string];
  details: [];
}>();
const { t, locale } = useI18n();
watchEffect(() => setLocale(locale.value.startsWith("en") ? "en-US" : "zh-CN"));

const approvedNodeIds = computed(() =>
  props.showStatus
    ? allNodes(props.progress ?? [])
        .filter(node => node.type === "approve" && node.status === "approved")
        .map(node => node.id)
    : []
);

const configuredIds = computed(() => [
  ...new Set(
    allNodes(props.nodes).flatMap(node =>
      node.actor?.type === "users" ? (node.actor.ids ?? []) : []
    )
  )
]);
const members = ref(new Map<string, MemberChoice | null>());
let memberRequest: AbortController | undefined;
watch(
  configuredIds,
  async ids => {
    memberRequest?.abort();
    const missing = ids.filter(id => !members.value.has(id));
    if (!missing.length) return;
    const request = (memberRequest = new AbortController());
    // 审批目录每次最多解析 50 个成员，逐批加载以兼顾大流程。
    try {
      for (let offset = 0; offset < missing.length; offset += 50) {
        const batch = missing.slice(offset, offset + 50);
        const resolved = await workflowMemberDirectory.resolve(
          batch,
          request.signal
        );
        if (request.signal.aborted) return;
        for (const id of batch)
          members.value.set(id, resolved.find(item => item.id === id) ?? null);
      }
    } catch {
      if (!request.signal.aborted)
        for (const id of missing)
          if (!members.value.has(id)) members.value.set(id, null);
    }
  },
  { immediate: true }
);
const stop = onSessionReset(() => {
  memberRequest?.abort();
  members.value.clear();
});
onBeforeUnmount(() => {
  stop();
  memberRequest?.abort();
});

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
function toChain(
  nodes: (Node | ProgressNode)[],
  tail?: Card
): Card | undefined {
  return nodes.reduceRight<Card | undefined>((next, node) => {
    const progress = "status" in node ? node : undefined;
    const appearance =
      props.showStatus && progress?.type === "approve"
        ? progressAppearance[progress.status]
        : undefined;
    const actor = "actor" in node ? node.actor : undefined;
    const actorType = progress?.actorType ?? actor?.type;
    const level = progress?.actorLevel ?? actor?.level ?? 1;
    const actorLabel =
      actorType === "department_leader"
        ? t(
            level > 1
              ? "workflow.cardDepartmentLeaderLevel"
              : "workflow.cardDepartmentLeader",
            { level }
          )
        : actorType === "supervisor"
          ? t(
              level > 1
                ? "workflow.cardSupervisorLevel"
                : "workflow.cardSupervisor",
              { level }
            )
          : actorType && actorType !== "users"
            ? t(`workflow.actors.${actorType}`)
            : "";
    const card: Card = {
      id: node.id,
      name: node.name,
      type: node.type === "approve" ? `${prefix}task` : `${prefix}copy`,
      properties: {
        ...(node.type === "approve" &&
          node.mode &&
          node.mode !== "any" && {
            performType: "ALL",
            countersignType:
              node.mode === "sequential" ? "SEQUENTIAL" : "PARALLEL"
          }),
        ...(actor?.type === "users" && {
          configuredMembers: (actor.ids ?? []).flatMap(id => {
            const member = members.value.get(id);
            if (member === undefined) return [];
            const name = member?.label || t("workflow.unavailableChoice");
            return [
              { id, name, avatar: member?.avatar, initial: Array.from(name)[0] }
            ];
          })
        }),
        ...(progress && {
          configuredMembers: (progress.members ?? []).map(member => ({
            ...member,
            initial: Array.from(member.name)[0]
          })),
          statusLabel: props.showStatus
            ? t(`workflow.progress.${progress.status}`)
            : "",
          statusIcon: appearance?.icon,
          statusTone: appearance?.tone,
          actorHint:
            !props.showStatus &&
            actorType &&
            actorType !== "self_select" &&
            !progress.members?.length
              ? t("workflow.noResolvedMembers")
              : ""
        }),
        actorLabel
      }
    };
    if (node.branches) {
      card.branches = node.branches.map(branch => ({
        id: branch.id,
        name:
          props.showStatus && progress?.chosenBranch === branch.id
            ? `${branch.name} · ${t("workflow.chosenBranch")}`
            : branch.name,
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
    children: toChain(
      props.progress ?? props.nodes,
      endpoint(endId, "end", t("workflow.end"))
    )
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
async function remove(id: string) {
  if (props.readonly || id.startsWith("@")) return;
  const branch = allNodes(props.nodes)
    .filter(node => node.type === "parallel")
    .flatMap(node => node.branches ?? [])
    .find(item => item.id === id);
  if (branch?.nodes.length) {
    const confirmed = await ElMessageBox.confirm(
      t("workflow.removeBranchConfirm", { name: branch.name }),
      t("workflow.removeBranch"),
      { type: "warning" }
    ).then(
      () => true,
      () => false
    );
    if (!confirmed || props.readonly) return;
  }
  const nodes = copy(props.nodes);
  if (branch) {
    const branches = allNodes(nodes).find(
      node =>
        node.type === "parallel" && node.branches?.some(item => item.id === id)
    )?.branches;
    if (!branches || branches.length <= 2) return;
    branches.splice(
      branches.findIndex(item => item.id === id),
      1
    );
    emit("update:nodes", nodes);
    return;
  }
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
  if (node.type !== "parallel") emit("select", id);
}
</script>

<template>
  <div
    class="workflow-canvas"
    :class="{
      'workflow-canvas--embedded': embedded,
      'workflow-canvas--progress': showStatus
    }"
    :tabindex="embedded ? 0 : undefined"
  >
    <div class="workflow-canvas__content">
      <NodeChain
        :node="chain"
        :viewer="readonly"
        :type-prefix="prefix"
        :depth="0"
        :theme="showStatus ? progressTheme : undefined"
        :dnd-panel="palette"
        :high-light="{
          activeNodeNames:
            showStatus && progress
              ? pendingNodes(progress).map(node => node.id)
              : [activeId],
          historyNodeNames: approvedNodeIds
        }"
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
  --ding-history-color: var(--el-color-success);
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

.workflow-canvas--embedded {
  height: 100%;
  min-height: 0;
  overscroll-behavior: contain;
}

.workflow-canvas :deep(.ding-node-card__actor-label),
.workflow-canvas :deep(.ding-node-card__actor-hint),
.workflow-canvas :deep(.ding-node-card__status) {
  padding-inline: 12px;
  margin-block-start: 6px;
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.workflow-canvas :deep(.ding-node-card__status .el-tag) {
  border-style: dashed;
}

.workflow-canvas :deep(.ding-node-card__status .el-tag__content) {
  display: inline-flex;
  gap: 4px;
  align-items: center;
}

.workflow-canvas--progress :deep(.ding-node-card__icon) {
  display: none;
}

.workflow-canvas--progress :deep(.ding-node-card--history) {
  background-color: var(--el-color-success-light-9);
}

.workflow-canvas :deep(.ding-node-card__configured-members) {
  display: grid;
  gap: 6px;
  padding: 0 12px 10px;
  margin-block-start: 8px;
}

.workflow-canvas :deep(.ding-node-card__configured-member) {
  display: flex;
  gap: 6px;
  align-items: center;
  min-width: 0;
  font-size: 12px;
}

.workflow-canvas :deep(.ding-node-card__configured-member .el-avatar) {
  flex: none;
}

.workflow-canvas :deep(.ding-node-card__configured-member-name) {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
