import { defaultCell } from "./model.mjs";
/** 编辑状态保存原快照，删除只记用户明确删除的已加载编号，绝不推断未加载行被删除。 */
export function childDraft(child, records, complete = false) {
  if (!Array.isArray(records))
    return {
      resource: child.resource,
      loaded: false,
      complete: false,
      rows: [],
      removed: []
    };
  const seen = new Set();
  return {
    resource: child.resource,
    loaded: true,
    complete,
    removed: [],
    rows: records.map(record => {
      if (typeof record.id !== "string" || !record.id || seen.has(record.id))
        throw Error("crud.invalidData");
      seen.add(record.id);
      return {
        key: record.id,
        original: JSON.parse(JSON.stringify(record)),
        values: {}
      };
    })
  };
}
export function childWritable(child, row, field, cell = defaultCell) {
  const mode = row.original ? "update" : "add";
  const item = child.form.find(item => item.field === field);
  return (
    !!item &&
    child[mode].writable.includes(field) &&
    (item.edit === "both" || (item.edit === "add" && mode === "add")) &&
    (!row.original || cell(row.original, field).state === "visible")
  );
}
export function childValue(row, field, cell = defaultCell) {
  if (Object.hasOwn(row.values, field)) return row.values[field];
  if (!row.original) return undefined;
  const state = cell(row.original, field);
  return state.state === "hidden" ? undefined : state.display;
}
export function insertChild(
  child,
  draft,
  source,
  cell = defaultCell,
  newKey = () => crypto.randomUUID()
) {
  if (!draft.loaded || draft.rows.length >= child.max) return false;
  const next = { key: newKey(), values: {} };
  for (const item of child.form) {
    if (!childWritable(child, next, item.field, cell)) continue;
    if (
      source &&
      (!source.original ||
        cell(source.original, item.field).state === "visible")
    ) {
      const value = childValue(source, item.field, cell);
      if (value !== undefined)
        next.values[item.field] = JSON.parse(JSON.stringify(value));
    }
  }
  draft.rows.push(next);
  return true;
}
export function removeChild(draft, key) {
  const index = draft.rows.findIndex(row => row.key === key);
  if (index < 0) return;
  const row = draft.rows[index];
  if (row.original) draft.removed.push(row.original.id);
  draft.rows.splice(index, 1);
}
export function canReorder(child, draft, cell = defaultCell) {
  return (
    !!child.sortField &&
    draft.complete &&
    draft.loaded &&
    draft.rows.every(row => childWritable(child, row, child.sortField, cell))
  );
}
export function reorderChild(child, draft, key, to, cell = defaultCell) {
  const from = draft.rows.findIndex(row => row.key === key);
  if (
    !canReorder(child, draft, cell) ||
    from < 0 ||
    !Number.isInteger(to) ||
    to < 0 ||
    to >= draft.rows.length
  )
    return;
  const [row] = draft.rows.splice(from, 1);
  draft.rows.splice(to, 0, row);
  draft.rows.forEach((row, index) => {
    row.values[child.sortField] = index;
  });
}
export function relatedChanges(children, drafts, getCell = () => defaultCell) {
  return children.flatMap(child => {
    const draft = drafts.find(draft => draft.resource === child.resource);
    if (!draft?.loaded) return [];
    const inserted = [],
      modified = [],
      cell = getCell(child.resource);
    for (const row of draft.rows) {
      const values = {};
      for (const item of child.form) {
        if (
          !childWritable(child, row, item.field, cell) ||
          !Object.hasOwn(row.values, item.field) ||
          row.values[item.field] === undefined
        )
          continue;
        const value = row.values[item.field];
        if (
          !row.original ||
          JSON.stringify(value) !== JSON.stringify(row.original[item.field])
        )
          values[item.field] = value;
      }
      if (!row.original) inserted.push({ localKey: row.key, values });
      else if (Object.keys(values).length)
        modified.push({ recordKey: row.original.id, values });
    }
    return [
      {
        resource: child.resource,
        inserted,
        modified,
        removed: [...new Set(draft.removed)]
      }
    ];
  });
}
/** 仅做确定可判断的本地提示，SQL排序规则/默认值和完整结果校验仍由后端完成。 */
export function childIssues(children, drafts, getCell = () => defaultCell) {
  const issues = [];
  for (const child of children) {
    const draft = drafts.find(draft => draft.resource === child.resource);
    if (!draft?.loaded) continue;
    const cell = getCell(child.resource);
    if (
      (draft.complete && draft.rows.length < child.min) ||
      draft.rows.length > child.max
    )
      issues.push({
        group: child.resource,
        key: "",
        field: "_rows",
        message: "crud.rowLimit"
      });
    for (const row of draft.rows) {
      for (const item of child.form) {
        if (!item.required || !childWritable(child, row, item.field, cell))
          continue;
        const value = childValue(row, item.field, cell);
        if (value == null || (typeof value === "string" && !value.trim()))
          issues.push({
            group: child.resource,
            key: row.key,
            field: item.field,
            message: "crud.required"
          });
      }
    }
    for (const group of child.unique) {
      const seen = new Map();
      for (const row of draft.rows) {
        if (
          row.original &&
          group.some(field => cell(row.original, field).state !== "visible")
        )
          continue;
        const values = group.map(field => childValue(row, field, cell));
        if (values.some(value => value === undefined || value === null))
          continue;
        const key = JSON.stringify(values),
          previous = seen.get(key);
        if (previous) {
          for (const duplicate of [previous, row])
            issues.push({
              group: child.resource,
              key: duplicate.key,
              field: group[0],
              message: "crud.duplicateRow"
            });
        } else seen.set(key, row);
      }
    }
  }
  return issues;
}
