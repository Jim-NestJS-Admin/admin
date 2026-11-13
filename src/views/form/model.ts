import type { components } from "@/api/schema";
import { ENUMS } from "@/api/constants";

type Schemas = components["schemas"];
export type Designer = Schemas["FormDesignerDto"];
export type FormRecord = Schemas["FormDefinitionRow"];
export type Field = Schemas["FormFieldDto"];
export type Linkage = Schemas["FormLinkageDto"];
export type Rule = Designer["rule"][number];
export type FieldIssue = { field: string; messages: string[] };
export const componentTypes =
  ENUMS["components.schemas.FormFieldDto.properties.component"];
export const emptyDesigner = (): Designer => ({
  schemaVersion: 1,
  rule: [],
  option: { form: { labelPosition: "top" }, submitBtn: false, resetBtn: false },
  linkages: []
});
export const copy = <T>(value: T): T => JSON.parse(JSON.stringify(value));
export const fingerprint = (value: unknown): string => JSON.stringify(value);

/** 只清除设计器自己的编辑标记，保留其他属性交后端校验，避免静默丢失用户配置。 */
export function exportRules(input: unknown, depth = 0): Rule[] {
  if (!Array.isArray(input) || input.length > 200 || depth > 12)
    throw new Error("forms.invalidDesign");
  return input.map(item => {
    if (!item || typeof item !== "object" || Array.isArray(item))
      throw new Error("forms.invalidDesign");
    const rule: Rule = {};
    for (const [key, value] of Object.entries(item)) {
      if (value === undefined) continue;
      if (["_fc_id", "_fc_drag_tag"].includes(key)) continue;
      if (
        key === "name" &&
        typeof value === "string" &&
        value.startsWith("ref_")
      )
        continue;
      if (
        ["__proto__", "constructor", "prototype"].includes(key) ||
        typeof value === "function"
      )
        throw new Error("forms.invalidDesign");
      if (key === "children") rule.children = exportRules(value, depth + 1);
      else rule[key] = value;
    }
    const assertJson = (value: unknown, level: number) => {
      if (
        level > 32 ||
        typeof value === "function" ||
        typeof value === "symbol" ||
        typeof value === "bigint" ||
        (typeof value === "number" && !Number.isFinite(value))
      )
        throw new Error("forms.invalidDesign");
      if (Array.isArray(value))
        value.forEach(item => assertJson(item, level + 1));
      else if (value && typeof value === "object")
        for (const [key, item] of Object.entries(value)) {
          if (item === undefined) continue;
          if (["__proto__", "constructor", "prototype"].includes(key))
            throw new Error("forms.invalidDesign");
          assertJson(item, level + 1);
        }
    };
    assertJson(rule, 0);
    return copy(rule);
  });
}

export const isDesignerClipboard = (text: string) =>
  text.startsWith("FormCreate:");

/** 元数据来自inspect；只实现固定操作，不构造/执行FormCreate表达式。 */
export const comparisonValue = (field?: Field): Linkage["value"] =>
  field?.options[0]?.value ??
  (field?.type === "number" ? 0 : field?.type === "boolean" ? false : "");

export function effectiveFields(
  fields: Field[],
  linkages: Linkage[],
  values: Record<string, unknown>
) {
  const source: Record<string, unknown> = Object.create(null);
  const result = fields.map(base => {
    const field = copy(base);
    for (const link of linkages)
      if (link.target === field.field) {
        const value = source[link.source];
        const matches =
          link.operator === "in"
            ? Array.isArray(link.value) && link.value.includes(value as never)
            : link.operator === "eq"
              ? value === link.value
              : value !== link.value;
        const action = matches ? link.whenTrue : link.whenFalse;
        if (link.action === "options")
          field.options = copy(action as Field["options"]);
        else field[link.action] = action as boolean;
      }
    if (field.visible) source[field.field] = values[field.field];
    return field;
  });
  return result;
}

export function previewRules(
  designer: Designer,
  fields: Field[],
  values: Record<string, unknown>
) {
  const effective = effectiveFields(fields, designer.linkages ?? [], values);
  const lookup = new Map(effective.map(field => [field.field, field]));
  const walk = (rules: Rule[]): Rule[] =>
    rules.map(original => {
      const rule = copy(original);
      delete rule.meta;
      if (Array.isArray(rule.children))
        rule.children = walk(rule.children as Rule[]);
      const field = lookup.get(String(rule.field ?? ""));
      if (field) {
        rule.hidden = !field.visible;
        rule.display = field.visible;
        rule.$required = field.generated ? false : field.required;
        if (field.generated)
          rule.props = {
            ...((rule.props && typeof rule.props === "object"
              ? rule.props
              : {}) as Record<string, unknown>),
            disabled: true,
            placeholder: "保存时自动生成"
          };
        // 旧validate.required不能抵消联动后的必填设置。
        rule.validate = (Array.isArray(rule.validate) ? rule.validate : []).map(
          value => {
            const v = { ...(value as Record<string, unknown>) };
            delete v.required;
            return v;
          }
        );
        if (field.options.length) rule.options = copy(field.options);
      }
      return rule;
    });
  return { rules: walk(designer.rule), fields: effective };
}

export function cleanPreviewValues(
  fields: Field[],
  values: Record<string, unknown>
) {
  const out: Record<string, unknown> = {};
  for (const field of fields) {
    if (
      field.generated ||
      !field.visible ||
      !Object.hasOwn(values, field.field)
    )
      continue;
    const value = values[field.field];
    if (
      field.options.length &&
      value !== undefined &&
      value !== null &&
      value !== ""
    ) {
      const items = field.multiple
        ? Array.isArray(value)
          ? value
          : []
        : [value];
      if (
        !items.every(item =>
          field.options.some(option => option.value === item)
        )
      )
        continue;
    }
    out[field.field] = value;
  }
  return out;
}

export function formIssueLabel(
  path: string,
  t: (key: string, params?: Record<string, number>) => string
) {
  if (path === "data.code") return t("forms.code");
  if (path === "data.name") return t("forms.name");
  if (/^data\.designer\.rule(?:\.|$)/.test(path)) {
    const positions = [...path.matchAll(/(?:rule|children)\.(\d+)(?=\.|$)/g)];
    return positions.length
      ? positions
          .map(match => t("forms.fieldNumber", { n: Number(match[1]) + 1 }))
          .join(" / ")
      : t("forms.content");
  }
  const condition = /^data\.designer\.linkages\.(\d+)(?=\.|$)/.exec(path);
  if (condition) return t("forms.condition", { n: Number(condition[1]) + 1 });
  if (/^data\.designer\.linkages(?:\.|$)/.test(path))
    return t("forms.linkages");
  if (/^data\.designer\.option(?:\.|$)/.test(path)) return t("forms.settings");
  return t("forms.design");
}

export function formIssueText(
  issue: FieldIssue,
  t: (key: string, params?: Record<string, number>) => string
) {
  return issue.messages
    .map(message =>
      issue.field === "data.designer.rule" && message === "表单至少包含一个字段"
        ? t("forms.addFieldHint")
        : `${formIssueLabel(issue.field, t)}：${message}`
    )
    .join("；");
}

export function issuesFrom(reason: unknown): FieldIssue[] {
  const errors = (reason as { failure?: { data?: { errors?: unknown } } })
    ?.failure?.data?.errors;
  return Array.isArray(errors)
    ? errors.filter(
        (item): item is FieldIssue =>
          typeof item?.field === "string" &&
          Array.isArray(item.messages) &&
          item.messages.every((v: unknown) => typeof v === "string")
      )
    : [];
}
