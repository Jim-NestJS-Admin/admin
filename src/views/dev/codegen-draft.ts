/** 生成器编辑器内部草稿；接口配置仍作为后端校验的JSON通过生成客户端传输。 */
export interface ColumnDraft {
  key: string;
  property: string;
  column: string;
  label: string;
  kind: string;
  widget: string;
  query: string;
  size: number;
  optional: boolean;
  listed: boolean;
  editable: boolean;
  required: boolean;
  unique: boolean;
  dictionary: string;
  security: string;
  original: Record<string, unknown>;
}
export const object = (value: unknown): Record<string, unknown> =>
  value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
export const text = (value: unknown, fallback = "") =>
  typeof value === "string" ? value : fallback;
export const newColumn = (): ColumnDraft => ({
  key: crypto.randomUUID(),
  property: "",
  column: "",
  label: "",
  kind: "string",
  widget: "input",
  query: "",
  size: 255,
  optional: true,
  listed: true,
  editable: true,
  required: false,
  unique: false,
  dictionary: "",
  security: "",
  original: {}
});
export function readColumns(value: unknown): ColumnDraft[] {
  return Array.isArray(value)
    ? value.map(object).map(raw => ({
        ...newColumn(),
        property: text(raw.name),
        column: text(raw.column),
        label: text(raw.label),
        kind: text(raw.type, "string"),
        widget: text(raw.component, "input"),
        query: text(raw.query),
        size: typeof raw.length === "number" ? raw.length : 255,
        optional: raw.nullable === true,
        listed: raw.list !== false,
        editable: raw.form !== false,
        required: raw.required === true,
        unique: raw.unique === true,
        dictionary: text(raw.dict),
        security: raw.fieldPerm ? JSON.stringify(raw.fieldPerm) : "",
        original: raw
      }))
    : [];
}
export function writeColumns(rows: ColumnDraft[]) {
  if (!rows.length || rows.length > 200) throw Error("codegen.invalidFields");
  const names = new Set<string>();
  return rows.map(row => {
    if (
      !/^[a-z][A-Za-z0-9]{0,62}$/.test(row.property) ||
      !/^[a-z][a-z0-9_]{0,62}$/.test(row.column) ||
      !row.label ||
      names.has(row.property)
    )
      throw Error("codegen.invalidFields");
    names.add(row.property);
    return {
      ...row.original,
      name: row.property,
      column: row.column,
      label: row.label,
      type: row.kind,
      component: row.widget,
      query: row.query || null,
      length: row.size,
      nullable: row.optional,
      list: row.listed,
      form: row.editable,
      required: row.required,
      unique: row.unique,
      dict: row.dictionary || null,
      fieldPerm: row.security ? object(JSON.parse(row.security)) : null
    };
  });
}
