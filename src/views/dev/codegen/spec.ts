/**
 * 代码生成器改版（T29）：页面里编辑的「模块规格」草稿与 ModuleSpec v1 的互相转换。
 * 规格只含数据结构；列表、查询、表单等显示项生成后到「模块配置」调整。
 * 后端 validate-spec 是唯一的校验标准，这里只做推导、默认值和错误定位。
 */
import type { components } from "@/api/schema";

export type ModuleSpec = components["schemas"]["ModuleSpec"];
export type SpecField = components["schemas"]["SpecField"];
export type SpecError = components["schemas"]["SpecError"];
export type FieldTypeInfo = components["schemas"]["SpecFieldType"];
export type FieldType = SpecField["type"];
export type PermState = components["schemas"]["SpecFieldPerm"]["default"];
export type MaskRule = NonNullable<
  components["schemas"]["SpecFieldPerm"]["mask"]
>;
export type Template = ModuleSpec["template"];

export const PERM_STATES: PermState[] = [
  "editable",
  "readonly",
  "masked",
  "hidden"
];
export const MASK_RULES: MaskRule[] = [
  "phone",
  "email",
  "idcard",
  "last4",
  "all"
];
const NUMERIC: FieldType[] = ["decimal", "money"];
const LENGTHY: FieldType[] = ["string", "dictionary", "image", "file"];

/** 字段草稿：比规格多一个稳定 key（表格行、选中、错误定位用），默认值按文字编辑 */
export interface FieldDraft {
  key: string;
  property: string;
  column: string;
  label: string;
  type: FieldType;
  length?: number;
  precision?: number;
  scale?: number;
  nullable: boolean;
  /** 空 = 没有默认值；可空字段填 NULL 表示默认空 */
  defaultText: string;
  comment: string;
  unique: boolean;
  dictCode: string;
  permDefault: PermState;
  mask: MaskRule | "";
  /** 属性名、显示名称是否还跟着列名 / 注释自动变 */
  autoProperty: boolean;
  autoLabel: boolean;
}
export interface ChildDraft {
  key: string;
  tableName: string;
  title: string;
  foreignKey: string;
  fields: FieldDraft[];
}
export interface SpecDraft {
  moduleName: string;
  businessName: string;
  title: string;
  permissionPrefix: string;
  tableName: string;
  template: Template;
  tree: { parentField: string; nameField: string; sortField: string };
  options: {
    deleteMode: "soft" | "hard";
    scopeEnabled: boolean;
    exportEnabled: boolean;
  };
  fields: FieldDraft[];
  children: ChildDraft[];
  /** 模块 / 业务标识 / 权限前缀是否还跟着表名自动推导 */
  auto: {
    moduleName: boolean;
    businessName: boolean;
    permissionPrefix: boolean;
  };
}

let seed = 0;
export const newKey = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `k${Date.now().toString(36)}${(seed++).toString(36)}`;

export const camel = (value: string) =>
  value.replace(/_([a-z0-9])/g, (_, c: string) => c.toUpperCase());
export const snake = (value: string) =>
  value.replace(/[A-Z]/g, c => `_${c.toLowerCase()}`);

/** 表名推导模块、业务标识、权限前缀：crm_customer_contact → crm / customer_contact / crm:customer-contact */
export function deriveNames(tableName: string) {
  const name = tableName.trim();
  const at = name.indexOf("_");
  const moduleName = at > 0 ? name.slice(0, at) : name;
  const businessName = at > 0 ? name.slice(at + 1) : name;
  return {
    moduleName,
    businessName,
    permissionPrefix:
      moduleName && businessName
        ? `${moduleName}:${businessName.replace(/_/g, "-")}`
        : ""
  };
}

/** 表名改了：仍处于「自动」的名称跟着变，手改过的保持不动 */
export function applyTableName(draft: SpecDraft, tableName: string) {
  draft.tableName = tableName;
  const derived = deriveNames(tableName);
  if (draft.auto.moduleName) draft.moduleName = derived.moduleName;
  if (draft.auto.businessName) draft.businessName = derived.businessName;
  if (draft.auto.permissionPrefix)
    draft.permissionPrefix =
      draft.moduleName && draft.businessName
        ? `${draft.moduleName}:${draft.businessName.replace(/_/g, "-")}`
        : "";
}
/** 模块或业务标识手改后，权限前缀若仍是自动的，按新的模块 / 业务重算 */
export function syncPermission(draft: SpecDraft) {
  if (!draft.auto.permissionPrefix) return;
  draft.permissionPrefix =
    draft.moduleName && draft.businessName
      ? `${draft.moduleName}:${draft.businessName.replace(/_/g, "-")}`
      : "";
}

export function newField(
  type: FieldType = "string",
  catalog: FieldTypeInfo[] = []
): FieldDraft {
  const field: FieldDraft = {
    key: newKey(),
    property: "",
    column: "",
    label: "",
    type,
    nullable: true,
    defaultText: "",
    comment: "",
    unique: false,
    dictCode: "",
    permDefault: "editable",
    mask: "",
    autoProperty: true,
    autoLabel: true
  };
  applyTypeDefaults(field, catalog);
  return field;
}

/** 换类型时按字段类型目录重置长度、精度等只对该类型有意义的选项 */
export function applyTypeDefaults(field: FieldDraft, catalog: FieldTypeInfo[]) {
  const info = catalog.find(item => item.type === field.type);
  const options = info?.options ?? [];
  field.length = options.includes("length")
    ? (field.length ?? info?.defaultLength ?? 255)
    : undefined;
  if (options.includes("precision")) {
    field.precision = field.precision ?? info?.precision ?? 14;
    field.scale =
      field.scale ?? info?.scale ?? (field.type === "money" ? 2 : 4);
  } else {
    field.precision = undefined;
    field.scale = undefined;
  }
  if (["text", "json"].includes(field.type)) {
    field.unique = false;
    if (field.defaultText.toUpperCase() !== "NULL") field.defaultText = "";
  }
}
export function changeType(
  field: FieldDraft,
  type: FieldType,
  catalog: FieldTypeInfo[]
) {
  if (field.type === type) return;
  const info = catalog.find(item => item.type === type);
  field.type = type;
  field.length = info?.options.includes("length")
    ? info.defaultLength
    : undefined;
  field.precision = undefined;
  field.scale = undefined;
  field.defaultText = "";
  applyTypeDefaults(field, catalog);
}

/** 列名改了：仍自动的属性名跟着变 */
export function applyColumn(field: FieldDraft, column: string) {
  field.column = column;
  if (field.autoProperty) field.property = camel(column);
}
/** 注释改了：显示名称没手改过就用注释（截 30 字） */
export function applyComment(field: FieldDraft, comment: string) {
  field.comment = comment;
  if (field.autoLabel) field.label = comment.trim().slice(0, 30);
}

function defaultText(field: SpecField) {
  if (!Object.hasOwn(field, "defaultValue")) return "";
  const value = field.defaultValue;
  if (value === null) return "NULL";
  if (typeof value === "boolean") return value ? "true" : "false";
  return String(value);
}
/** 默认值文字按类型转成常量；转不了的原样交给后端校验，错误会定位到这一格 */
function parseDefault(field: FieldDraft): {
  value?: SpecField["defaultValue"];
} {
  const text = field.defaultText.trim();
  if (!text) return {};
  if (text.toUpperCase() === "NULL") return { value: null };
  if (field.type === "boolean")
    return {
      value:
        text === "true" || text === "1"
          ? true
          : text === "false" || text === "0"
            ? false
            : text
    };
  if (field.type === "int" && /^-?\d+$/.test(text))
    return { value: Number(text) };
  return { value: text };
}

function readField(field: SpecField): FieldDraft {
  return {
    key: newKey(),
    property: field.property ?? "",
    column: field.column ?? "",
    label: field.label ?? "",
    type: field.type ?? "string",
    length: field.length,
    precision: field.precision,
    scale: field.scale,
    nullable: field.nullable === true,
    defaultText: defaultText(field),
    comment: field.comment ?? "",
    unique: field.unique === true,
    dictCode: field.dictCode ?? "",
    permDefault: field.fieldPerm?.default ?? "editable",
    mask: field.fieldPerm?.mask ?? "",
    autoProperty:
      !field.property || field.property === camel(field.column ?? ""),
    autoLabel:
      !field.label || field.label === (field.comment ?? "").slice(0, 30)
  };
}
function writeField(field: FieldDraft): SpecField {
  const result: SpecField = {
    property: field.property.trim(),
    column: field.column.trim(),
    label: field.label.trim(),
    type: field.type,
    nullable: field.nullable
  };
  if (field.length !== undefined && LENGTHY.includes(field.type))
    result.length = field.length;
  if (NUMERIC.includes(field.type)) {
    if (field.precision !== undefined) result.precision = field.precision;
    if (field.scale !== undefined) result.scale = field.scale;
  }
  const parsed = parseDefault(field);
  if (Object.hasOwn(parsed, "value")) result.defaultValue = parsed.value;
  if (field.comment.trim()) result.comment = field.comment.trim();
  if (field.unique) result.unique = true;
  if (field.dictCode.trim()) result.dictCode = field.dictCode.trim();
  if (field.permDefault !== "editable" || field.mask)
    result.fieldPerm = {
      default: field.permDefault,
      ...(field.mask ? { mask: field.mask } : {})
    };
  return result;
}

export function emptyDraft(): SpecDraft {
  return {
    moduleName: "",
    businessName: "",
    title: "",
    permissionPrefix: "",
    tableName: "",
    template: "single",
    tree: { parentField: "", nameField: "", sortField: "" },
    options: { deleteMode: "soft", scopeEnabled: false, exportEnabled: true },
    fields: [],
    children: [],
    auto: { moduleName: true, businessName: true, permissionPrefix: true }
  };
}

export function readSpec(spec: ModuleSpec): SpecDraft {
  const derived = deriveNames(spec.tableName ?? "");
  return {
    moduleName: spec.moduleName ?? "",
    businessName: spec.businessName ?? "",
    title: spec.title ?? "",
    permissionPrefix: spec.permissionPrefix ?? "",
    tableName: spec.tableName ?? "",
    template: spec.template ?? "single",
    tree: {
      parentField: spec.tree?.parentField ?? "",
      nameField: spec.tree?.nameField ?? "",
      sortField: spec.tree?.sortField ?? ""
    },
    options: {
      deleteMode: spec.options?.deleteMode ?? "soft",
      scopeEnabled: spec.options?.scopeEnabled ?? false,
      exportEnabled: spec.options?.exportEnabled ?? true
    },
    fields: (spec.fields ?? []).map(readField),
    children: (spec.children ?? []).map(child => ({
      key: newKey(),
      tableName: child.tableName ?? "",
      title: child.title ?? "",
      foreignKey: child.foreignKey ?? "",
      fields: (child.fields ?? []).map(readField)
    })),
    auto: {
      moduleName: spec.moduleName === derived.moduleName,
      businessName: spec.businessName === derived.businessName,
      permissionPrefix:
        spec.permissionPrefix ===
        `${spec.moduleName}:${(spec.businessName ?? "").replace(/_/g, "-")}`
    }
  };
}

export function writeSpec(draft: SpecDraft): ModuleSpec {
  const spec: ModuleSpec = {
    version: 1,
    moduleName: draft.moduleName.trim(),
    businessName: draft.businessName.trim(),
    title: draft.title.trim(),
    permissionPrefix: draft.permissionPrefix.trim(),
    tableName: draft.tableName.trim(),
    template: draft.template,
    options: { ...draft.options },
    fields: draft.fields.map(writeField)
  };
  if (draft.template === "tree")
    spec.tree = {
      parentField: draft.tree.parentField,
      nameField: draft.tree.nameField,
      ...(draft.tree.sortField ? { sortField: draft.tree.sortField } : {})
    };
  if (draft.template === "masterDetail")
    spec.children = draft.children.map(child => ({
      tableName: child.tableName.trim(),
      title: child.title.trim(),
      foreignKey: child.foreignKey.trim(),
      fields: child.fields.map(writeField)
    }));
  return spec;
}

/** 子表默认外键：主表业务标识 + Id（customer → customerId） */
export function defaultForeignKey(draft: SpecDraft) {
  return draft.businessName ? camel(`${draft.businessName}_id`) : "";
}
export function newChild(draft: SpecDraft): ChildDraft {
  return {
    key: newKey(),
    tableName: draft.tableName ? `${draft.tableName}_item` : "",
    title: "",
    foreignKey: defaultForeignKey(draft),
    fields: []
  };
}

/** 六步；错误按路径归到步骤，「下一步」只拦当前步骤及以前的错误 */
export const STEPS = [
  "source",
  "table",
  "fields",
  "relations",
  "options",
  "generate"
] as const;
export type StepName = (typeof STEPS)[number];
export function stepOf(path: string): number {
  if (/^(fields|children\[\d+\]\.fields)(\[|$)/.test(path)) return 2;
  if (/^(tree|children)/.test(path)) return 3;
  if (/^options/.test(path)) return 4;
  return 1;
}
/** 错误定位：fields[3].length → 主表第 4 行的长度格；children[0].fields[2].column → 子表 1 第 3 行的列名格 */
export interface ErrorPlace {
  /** 'main' 或子表下标 */
  table: "main" | number;
  row?: number;
  cell?: string;
}
export function placeOf(path: string): ErrorPlace | undefined {
  const main = /^fields(?:\[(\d+)\](?:\.([A-Za-z.]+))?)?$/.exec(path);
  if (main)
    return {
      table: "main",
      row: main[1] === undefined ? undefined : Number(main[1]),
      cell: main[2]
    };
  const child =
    /^children\[(\d+)\]\.fields(?:\[(\d+)\](?:\.([A-Za-z.]+))?)?$/.exec(path);
  if (child)
    return {
      table: Number(child[1]),
      row: child[2] === undefined ? undefined : Number(child[2]),
      cell: child[3]
    };
  return undefined;
}
/** 把错误挂到字段 key 上：{ [fieldKey]: { [cell]: message } } */
export function fieldErrors(draft: SpecDraft, errors: SpecError[]) {
  const result: Record<string, Record<string, string>> = {};
  for (const error of errors) {
    const place = placeOf(error.path);
    if (!place || place.row === undefined) continue;
    const fields =
      place.table === "main"
        ? draft.fields
        : draft.children[place.table]?.fields;
    const field = fields?.[place.row];
    if (!field) continue;
    const cell = (place.cell ?? "row").split(".")[0];
    (result[field.key] ??= {})[cell] ??= error.message;
  }
  return result;
}

/** 页面预览用的示例数据：按字段类型造 5 行，字典取第一批选项 */
export function sampleValue(
  field: Pick<SpecField, "type" | "label" | "property">,
  index: number,
  dictionary?: { value: unknown }[]
): unknown {
  const n = index + 1;
  switch (field.type) {
    case "int":
      return n * 10;
    case "decimal":
      return (n * 12.5).toFixed(4);
    case "money":
      return (n * 1280).toFixed(2);
    case "date":
      return `2026-11-${String(n).padStart(2, "0")}`;
    case "datetime":
      return new Date(Date.UTC(2026, 10, n, 1 + n, 30)).toISOString();
    case "boolean":
      return n % 2 === 1;
    case "json":
      return { sample: n };
    case "dictionary":
      return dictionary?.length
        ? dictionary[index % dictionary.length].value
        : `${field.label}${n}`;
    case "reference":
      return String(1000 + n);
    case "image":
      return `https://example.com/images/${n}.png`;
    case "file":
      return `https://example.com/files/${n}.pdf`;
    case "text":
      return `${field.label}说明 ${n}`;
    default:
      return `${field.label}${n}`;
  }
}

export function sampleRows(
  fields: SpecField[],
  dictionaries: Record<string, { value: unknown }[]>,
  options: {
    count?: number;
    idBase?: number;
    dictPrefix?: string;
    treeParent?: string;
  } = {}
) {
  const count = options.count ?? 5,
    base = options.idBase ?? 0;
  return Array.from({ length: count }, (_, index) => {
    const id = String(base + index + 1);
    const row: Record<string, unknown> = {
      id,
      version: 1,
      createdAt: new Date(Date.UTC(2026, 10, index + 1, 2)).toISOString(),
      updatedAt: new Date(Date.UTC(2026, 10, index + 1, 3)).toISOString(),
      createdBy: "1",
      updatedBy: "1",
      orgId: "1",
      _display: { createdBy: "admin", updatedBy: "admin", orgId: "总部" }
    };
    for (const field of fields)
      row[field.property] = sampleValue(
        field,
        index,
        dictionaries[`${options.dictPrefix ?? ""}${field.property}`]
      );
    if (options.treeParent)
      row[options.treeParent] =
        index === 0 ? null : index < 3 ? String(base + 1) : String(base + 2);
    return row;
  });
}
