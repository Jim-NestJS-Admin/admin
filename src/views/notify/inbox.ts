import type { components } from "@/api/schema";

export const inboxTabs = [
  { key: "notice", label: "status.pureNotify", empty: "status.pureNoNotify" },
  {
    key: "message",
    label: "status.pureMessage",
    empty: "status.pureNoMessage"
  },
  { key: "todo", label: "status.pureTodo", empty: "status.pureNoTodo" }
] as const;
export type InboxTab = (typeof inboxTabs)[number]["key"];

const securityEvent = "mcp.exempt";
export const notificationEventLabels = new Map<string, string>([
  ["task.created", "notifications.event.taskCreated"],
  ["task.reminder", "notifications.event.taskReminder"],
  ["task.cancelled", "notifications.event.taskCancelled"],
  ["task.copied", "notifications.event.taskCopied"],
  ["instance.approved", "notifications.event.instanceApproved"],
  ["instance.returned", "notifications.event.instanceReturned"],
  ["instance.withdrawn", "notifications.event.instanceWithdrawn"],
  [securityEvent, "notifications.event.mcpExempt"]
]);
const workflowEvents = [...notificationEventLabels.keys()].filter(
  event => event !== securityEvent
);
const todoEvents = ["task.created", "task.reminder"];
const eventFilters = {
  notice: { op: "notIn", events: workflowEvents },
  message: {
    op: "in",
    events: workflowEvents.filter(event => !todoEvents.includes(event))
  },
  todo: { op: "in", events: todoEvents }
} as const;

export function inboxFilter(tab: InboxTab, unread = false) {
  const { op, events } = eventFilters[tab];
  const items: components["schemas"]["QueryGroupDto"]["items"] = [
    {
      field: "event",
      op,
      // 接口的通用查询 DTO 运行时允许 in / notIn 接收数组。
      value:
        events as unknown as components["schemas"]["QueryConditionDto"]["value"]
    }
  ];
  if (unread) items.push({ field: "readAt", op: "isNull" });
  return { op: "and", items } as const;
}

export function messageDestination(row: {
  instanceId?: unknown;
  taskId?: unknown;
  event?: unknown;
}) {
  if (
    typeof row.instanceId !== "string" ||
    !/^[1-9]\d{0,19}$/.test(row.instanceId)
  )
    return;
  if (row.event === securityEvent)
    return { kind: "mcp", instanceId: row.instanceId } as const;
  if (!workflowEvents.some(event => event === row.event)) return;
  return {
    kind: "workflow",
    instanceId: row.instanceId,
    ...(typeof row.taskId === "string" && /^[1-9]\d{0,19}$/.test(row.taskId)
      ? { taskId: row.taskId }
      : {})
  } as const;
}
