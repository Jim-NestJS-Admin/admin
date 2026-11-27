import { onBeforeUnmount, ref } from "vue";
import type { components } from "@/api/schema";
import { onSessionReset } from "@/platform/lifecycle";
import { RequestFailure } from "@/utils/http";
import { copy } from "../form/model";
export { copy };
type S = components["schemas"];
export type Node = S["WorkflowNode"];
export type Branch = S["WorkflowBranch"];
export type Designer = S["WorkflowDesignerDto"];
export type Condition =
  | S["WorkflowConditionGroup"]
  | S["WorkflowConditionValue"];
export type Definition = S["WorkflowDefinitionRow"];
export type Document = S["WorkflowDocumentResult"];
export function pendingNodes(
  nodes: Document["progress"]
): Document["progress"] {
  return nodes.flatMap(node => [
    ...(node.type === "approve" && node.status === "pending" ? [node] : []),
    ...pendingNodes(node.branches?.flatMap(branch => branch.nodes) ?? [])
  ]);
}
export type Task = S["WorkflowTaskRow"];
export type Field = S["FormFieldDto"];
export const uid = () => `n_${crypto.randomUUID().replaceAll("-", "")}`;
export function allNodes<T extends { branches?: { nodes: T[] }[] }>(
  nodes: T[]
): T[] {
  return nodes.flatMap(node => [
    node,
    ...allNodes(node.branches?.flatMap(b => b.nodes) ?? [])
  ]);
}
export function newNode(type: Node["type"], name: string): Node {
  const node: Node = { id: uid(), name, type };
  if (type === "approve" || type === "copy") {
    if (type === "approve")
      Object.assign(node, {
        empty: "stop",
        mode: "all",
        skipRepeated: false,
        rejectTo: "applicant"
      });
  } else
    node.branches = [
      {
        id: uid(),
        name: "",
        nodes: [],
        ...(type === "condition"
          ? {
              condition: {
                source: "field",
                field: "",
                operator: "eq",
                value: ""
              } as Condition
            }
          : {})
      },
      {
        id: uid(),
        name: "",
        nodes: [],
        ...(type === "condition" ? { default: true } : {})
      }
    ];
  return node;
}
export function parallelApproverBlocks(nodes: Node[], selectedId: string) {
  const blocked: Record<string, string> = {};
  for (const group of allNodes(nodes)) {
    if (group.type !== "parallel" || !group.branches) continue;
    const current = group.branches.find(branch =>
      allNodes(branch.nodes).some(node => node.id === selectedId)
    );
    if (!current) continue;
    for (const branch of group.branches) {
      if (branch === current) continue;
      for (const node of allNodes(branch.nodes))
        if (node.type === "approve" && node.actor?.type === "users")
          for (const id of node.actor.ids ?? []) blocked[id] = branch.name;
    }
  }
  return blocked;
}
export function addWorkflowBranch(node: Node, name: string, field: string) {
  const branches = node.branches;
  if (!branches || branches.length >= 10) return;
  const branch: Branch = { id: uid(), name, nodes: [] };
  if (node.type === "condition") {
    branch.condition = { source: "field", field, operator: "eq", value: "" };
    branches.splice(branches.length - 1, 0, branch);
  } else branches.push(branch);
}
export function text(value: unknown) {
  return value == null || value === ""
    ? "—"
    : typeof value === "object"
      ? JSON.stringify(value)
      : String(value);
}
export function date(value: unknown) {
  if (typeof value !== "string") return "—";
  const parsed = new Date(value);
  return Number.isFinite(parsed.getTime()) ? parsed.toLocaleString() : "—";
}
/** 所有弹窗错误留在弹窗；同一内容重试保留幂等键，切组织/登出清空。 */
export function useRequestScope() {
  const busy = ref(false),
    error = ref("");
  const pending = new Set<AbortController>();
  const keys = new Map<string, string>();
  const reset = () => {
    pending.forEach(c => c.abort());
    pending.clear();
    keys.clear();
    busy.value = false;
    error.value = "";
  };
  const stop = onSessionReset(reset);
  onBeforeUnmount(() => {
    stop();
    reset();
  });
  async function run<T>(
    fn: (signal: AbortSignal, key: (payload: unknown) => string) => Promise<T>
  ): Promise<T | undefined> {
    if (busy.value) return;
    const c = new AbortController();
    pending.add(c);
    busy.value = true;
    error.value = "";
    const key = (payload: unknown) => {
      const id = JSON.stringify(payload);
      if (!keys.has(id)) keys.set(id, crypto.randomUUID());
      return keys.get(id)!;
    };
    try {
      const result = await fn(c.signal, key);
      return c.signal.aborted ? undefined : result;
    } catch (reason) {
      if (!c.signal.aborted)
        error.value =
          reason instanceof RequestFailure
            ? reason.message
            : reason instanceof Error
              ? reason.message
              : "crud.requestFailed";
    } finally {
      pending.delete(c);
      if (!c.signal.aborted) busy.value = false;
    }
  }
  return { busy, error, run, reset };
}
