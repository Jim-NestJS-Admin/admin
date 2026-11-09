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
        visible: column.hidden !== true,
        width: width(column.width),
        fixed: ["left", "right"].includes(column.fixed) ? column.fixed : false
      });
  return {
    columns: output,
    density: ["small", "default", "large"].includes(saved?.density)
      ? saved.density
      : "default"
  };
}
/**
 * 没设置列宽时返回 undefined，由列表按字段类型给最小宽度、剩余空间自动分配。
 * 160 是旧版本保存列设置时写进去的默认值，不算用户自己设的宽度。
 */
function width(value) {
  return typeof value === "number" && Number.isFinite(value) && value !== 160
    ? Math.min(600, Math.max(80, Math.round(value)))
    : undefined;
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
  // 编号字段（创建人、修改人、所属组织）后端在 _display 里给了名称，优先显示名称
  const named = row?._display?.[field];
  return {
    state: state ?? "visible",
    display: named !== undefined && named !== null ? named : row[field]
  };
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

/** 读取已合并显示配置；仍和原schema白名单取交集，显示配置不能增加字段或写权限。 */
export function applyPageView(schema) {
  const list = schema.view?.list,
    form = schema.view?.form;
  if (!list && !form) return schema;
  const columns = new Map(schema.columns.map(column => [column.field, column]));
  const configured = [],
    seen = new Set();
  for (const choice of Array.isArray(list?.columns) ? list.columns : []) {
    const column = columns.get(choice?.field);
    if (!column || seen.has(column.field)) continue;
    seen.add(column.field);
    configured.push({
      ...column,
      width: width(choice.width ?? column.width),
      hidden: choice.hidden === true,
      fixed: ["left", "right"].includes(choice.fixed) ? choice.fixed : false
    });
  }
  for (const column of schema.columns)
    if (!seen.has(column.field)) configured.push(column);
  const items = new Map(schema.form.map(item => [item.field, item])),
    configuredForm = [],
    formSeen = new Set();
  for (const choice of Array.isArray(form?.items) ? form.items : []) {
    const item = items.get(choice?.field);
    if (!item || formSeen.has(item.field)) continue;
    formSeen.add(item.field);
    configuredForm.push({
      ...item,
      placeholder:
        typeof choice.placeholder === "string"
          ? choice.placeholder
          : item.placeholder
    });
  }
  for (const item of schema.form)
    if (!formSeen.has(item.field)) configuredForm.push(item);
  const page = schema.actions.page;
  const intersect = (base, selected) =>
    Array.isArray(selected)
      ? base.filter(field => selected.includes(field))
      : base;
  return {
    ...schema,
    columns: configured,
    form: configuredForm,
    defaultSort: Array.isArray(list?.defaultSort)
      ? list.defaultSort
          .filter(
            item =>
              page?.sortable.includes(item.field) &&
              ["asc", "desc"].includes(item.order)
          )
          .slice(0, 5)
      : schema.defaultSort,
    actions: {
      ...schema.actions,
      ...(page
        ? {
            page: {
              ...page,
              keyWords: intersect(page.keyWords, list?.keyWords),
              filterable: intersect(page.filterable, list?.filterable)
            }
          }
        : {}),
      ...(form?.readonly
        ? { add: { writable: [] }, update: { writable: [] } }
        : {})
    },
    query: schema.query.filter(
      field =>
        !page ||
        intersect(page.filterable, list?.filterable).includes(field.field)
    )
  };
}
export const pageSize = schema =>
  Math.min(
    schema.maxSize,
    Math.max(
      1,
      Number.isSafeInteger(schema.view?.list?.pageSize)
        ? schema.view.list.pageSize
        : 20
    )
  );
export function formPresentation(schema, field) {
  const form = schema?.view?.form;
  const item = Array.isArray(form?.items)
    ? form.items.find(item => item.field === field)
    : undefined;
  return {
    mode: form?.mode === "dialog" ? "dialog" : "drawer",
    span: item?.span === 12 ? 12 : 24,
    group: typeof item?.group === "string" ? item.group : ""
  };
}
export function cellText(cell, dictionary, type) {
  if (cell.state === "hidden") return "—";
  if (cell.state === "masked")
    return cell.display == null ? "—" : String(cell.display);
  const found = dictionary?.find(item => item.value === cell.display);
  if (found) return String(found.label);
  return formatValue(cell.display, type);
}

const pad = value => String(value).padStart(2, "0");
/** 按列类型格式化：时间转本地「年-月-日 时:分:秒」，布尔显示是 / 否，空值显示 — */
export function formatValue(value, type) {
  if (value === null || value === undefined || value === "") return "—";
  if (type === "boolean" && typeof value === "boolean")
    return value ? "是" : "否";
  if ((type === "datetime" || type === "date") && typeof value === "string") {
    const time = new Date(value);
    if (Number.isNaN(time.getTime())) return value;
    const day = `${time.getFullYear()}-${pad(time.getMonth() + 1)}-${pad(time.getDate())}`;
    return type === "date" || /^\d{4}-\d{2}-\d{2}$/.test(value)
      ? day
      : `${day} ${pad(time.getHours())}:${pad(time.getMinutes())}:${pad(time.getSeconds())}`;
  }
  if (typeof value === "object") return "—";
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
