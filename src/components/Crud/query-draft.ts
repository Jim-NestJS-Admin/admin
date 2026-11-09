import type { components } from "@/api/schema";
export type QueryGroup = components["schemas"]["QueryGroupDto"];
export type QueryField = components["schemas"]["CrudSchemaQueryItem"];
type Condition = components["schemas"]["QueryConditionDto"];
/** 仅供编辑器使用的草稿，文本输入在提交时按后端字段类型转换。 */
export interface ConditionDraft {
  key: string;
  field: string;
  operator: Condition["op"];
  text: string;
  end: string;
}
export interface GroupDraft {
  key: string;
  join: QueryGroup["op"];
  children: (GroupDraft | ConditionDraft)[];
}
export const newGroup = (): GroupDraft => ({
  key: crypto.randomUUID(),
  join: "and",
  children: []
});
export const isGroup = (
  node: GroupDraft | ConditionDraft
): node is GroupDraft => "children" in node;
export const countConditions = (node: GroupDraft): number =>
  node.children.reduce(
    (total, child) => total + (isGroup(child) ? countConditions(child) : 1),
    0
  );
export function newCondition(fields: QueryField[]): ConditionDraft {
  return {
    key: crypto.randomUUID(),
    field: fields[0]?.field ?? "",
    operator: fields[0]?.operators[0] ?? "eq",
    text: "",
    end: ""
  };
}
function scalar(
  text: string,
  type: QueryField["type"]
): string | number | boolean {
  if (type === "number") {
    if (!text.trim() || !Number.isFinite(Number(text)))
      throw Error("query.invalidNumber");
    return Number(text);
  }
  if (type === "boolean") {
    if (text !== "true" && text !== "false")
      throw Error("query.invalidBoolean");
    return text === "true";
  }
  if (type === "date" && (!text || Number.isNaN(Date.parse(text))))
    throw Error("query.invalidDate");
  return text;
}
export function serializeQuery(
  draft: GroupDraft,
  fields: QueryField[],
  depth = 1
): QueryGroup {
  if (depth > 3 || countConditions(draft) > 20) throw Error("query.limit");
  if (!draft.children.length) throw Error("query.emptyGroup");
  return {
    op: draft.join,
    items: draft.children.map(node => {
      if (isGroup(node)) return serializeQuery(node, fields, depth + 1);
      const field = fields.find(item => item.field === node.field);
      if (!field || !field.operators.includes(node.operator))
        throw Error("query.unavailableField");
      const base = { field: node.field, op: node.operator };
      if (["isNull", "notNull"].includes(node.operator)) return base;
      let value: unknown;
      if (["in", "notIn"].includes(node.operator)) {
        const items = node.text.split(/[,\n]/).map(item => item.trim());
        if (!items.length || items.length > 100 || items.some(item => !item))
          throw Error("query.invalidList");
        value = items.map(item => scalar(item, field.type));
      } else if (node.operator === "between")
        value = [scalar(node.text, field.type), scalar(node.end, field.type)];
      else {
        if (
          ["contains", "startsWith"].includes(node.operator) &&
          (!node.text || node.text.length > 100)
        )
          throw Error("query.invalidText");
        value = scalar(node.text, field.type);
      }
      // 当前OpenAPI把unknown value导成object，实际契约允许简单值/数组；只在适配边界转换。
      return { ...base, value } as Condition;
    })
  };
}
export function restoreQuery(
  value: unknown,
  fields: QueryField[],
  depth = 1
): GroupDraft {
  if (!value || typeof value !== "object" || depth > 3)
    throw Error("query.limit");
  const group = value as QueryGroup;
  if (
    !["and", "or"].includes(group.op) ||
    !Array.isArray(group.items) ||
    group.items.length > 20
  )
    throw Error("query.invalidSaved");
  const draft: GroupDraft = {
    key: crypto.randomUUID(),
    join: group.op,
    children: group.items.map(item => {
      if ("items" in item) return restoreQuery(item, fields, depth + 1);
      const field = fields.find(field => field.field === item.field);
      if (!field || !field.operators.includes(item.op))
        throw Error("query.unavailableField");
      const v: unknown = item.value;
      const input = (v: unknown) => {
        if (!["string", "number", "boolean"].includes(typeof v))
          throw Error("query.invalidSaved");
        return String(v);
      };
      return {
        key: crypto.randomUUID(),
        field: item.field,
        operator: item.op,
        text: ["isNull", "notNull"].includes(item.op)
          ? ""
          : Array.isArray(v)
            ? v.map(input).join(item.op === "between" ? "\n" : ",")
            : input(v),
        end: ""
      };
    })
  };
  for (const node of draft.children)
    if (!isGroup(node) && node.operator === "between") {
      const parts = node.text.split("\n");
      if (parts.length !== 2) throw Error("query.invalidSaved");
      [node.text, node.end] = parts;
    }
  serializeQuery(draft, fields, depth);
  return draft;
}
