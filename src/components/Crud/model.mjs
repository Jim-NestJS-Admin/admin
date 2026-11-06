/** 用户显示偏好只能收窄后端已允许的列，不能增加字段或写权限。 */
export function columnChoices(schema, saved) {
  const allowed = new Set(schema.actions?.page?.readable ?? []);
  const columns = schema.columns.filter(column => allowed.has(column.field));
  const byName = new Map(columns.map(column => [column.field, column]));
  const output = [],
    seen = new Set();
  for (const choice of Array.isArray(saved?.columns) ? saved.columns : []) {
    if (!byName.has(choice?.field) || seen.has(choice.field)) continue;
    const column = byName.get(choice.field);
    output.push({
      field: choice.field,
      visible: choice.visible !== false,
      width: width(choice.width ?? column.width),
      fixed: ["left", "right"].includes(choice.fixed) ? choice.fixed : false
    });
    seen.add(choice.field);
  }
  for (const column of columns)
    if (!seen.has(column.field))
      output.push({
        field: column.field,
        visible: true,
        width: width(column.width),
        fixed: false
      });
  return {
    columns: output,
    density: ["small", "default", "large"].includes(saved?.density)
      ? saved.density
      : "default"
  };
}
function width(value) {
  return typeof value === "number" && Number.isFinite(value)
    ? Math.min(600, Math.max(80, Math.round(value)))
    : 160;
}
export function identity(row) {
  if (
    typeof row?.id !== "string" ||
    !row.id ||
    !Number.isSafeInteger(row.version) ||
    row.version < 1
  )
    throw Error("crud.invalidData");
  return { id: row.id, version: row.version };
}
export function editableValues(schema, mode, values, record, cell) {
  const allowed = new Set(schema.actions?.[mode]?.writable ?? []);
  const output = {};
  for (const item of schema.form) {
    if (
      !allowed.has(item.field) ||
      item.edit === "none" ||
      (mode === "update" && item.edit !== "both")
    )
      continue;
    if (record && cell(record, item.field).state !== "visible") continue;
    if (Object.hasOwn(values, item.field) && values[item.field] !== undefined)
      output[item.field] = values[item.field];
  }
  return output;
}
export function defaultCell(row, field) {
  const state = row?._fieldState?.[field];
  if (
    !Object.hasOwn(row, field) ||
    state === "hidden" ||
    (state !== undefined && !["readonly", "masked"].includes(state))
  )
    return { state: "hidden", display: undefined };
  return { state: state ?? "visible", display: row[field] };
}

/** 页面最宽状态只控制列和新建表单；已有行写入还须核对_fieldState，不能靠星号猜测。 */
export function constrainFieldSchema(schema) {
  const state = field => schema.fieldPerms?.[field]?.state ?? "editable";
  const raw = field => ["editable", "readonly"].includes(state(field));
  const writable = field => state(field) === "editable";
  return {
    ...schema,
    columns: schema.columns
      .filter(column => state(column.field) !== "hidden")
      .map(column => ({
        ...column,
        sortable: column.sortable && raw(column.field)
      })),
    form: schema.form.filter(item => state(item.field) !== "hidden"),
    actions: Object.fromEntries(
      Object.entries(schema.actions).map(([action, description]) => [
        action,
        {
          ...description,
          ...("writable" in description
            ? { writable: description.writable.filter(writable) }
            : {}),
          ...("sortable" in description
            ? { sortable: description.sortable.filter(raw) }
            : {}),
          ...("readable" in description
            ? {
                readable: description.readable.filter(
                  field => state(field) !== "hidden"
                )
              }
            : {})
        }
      ])
    )
  };
}
export function cellText(cell, dictionary) {
  if (cell.state === "hidden") return "—";
  if (cell.state === "masked")
    return cell.display == null ? "—" : String(cell.display);
  const found = dictionary?.find(item => item.value === cell.display);
  const value = found?.label ?? cell.display;
  if (value === null || value === undefined || typeof value === "object")
    return "—";
  return String(value);
}
export function requiredFields(schema, mode, values, record, cell) {
  const writable = editableValues(schema, mode, values, record, cell);
  const allowed = new Set(schema.actions?.[mode]?.writable ?? []);
  return schema.form
    .filter(
      item =>
        item.required &&
        item.edit !== "none" &&
        (mode === "add" || item.edit === "both") &&
        allowed.has(item.field) &&
        !(record && cell(record, item.field).state !== "visible") &&
        (writable[item.field] == null ||
          (typeof writable[item.field] === "string" &&
            !writable[item.field].trim()))
    )
    .map(item => item.field);
}
