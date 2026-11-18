/** 服务端返回平铺节点；不可见父节点和脏循环均作为根处理，不让递归陷入循环。 */
export function treeRows(rows, parentField) {
  const nodes = new Map(
    rows
      .filter(row => typeof row.id === "string")
      .map(row => [row.id, { ...row, __crudTreeChildren: [] }])
  );
  const roots = [];
  for (const [id, node] of nodes) {
    let parent = nodes.get(node[parentField]);
    const visited = new Set([id]);
    for (let cursor = parent; cursor; cursor = nodes.get(cursor[parentField])) {
      if (visited.has(cursor.id)) {
        parent = undefined;
        break;
      }
      visited.add(cursor.id);
    }
    if (parent) parent.__crudTreeChildren.push(node);
    else roots.push(node);
  }
  return roots;
}

export function* walkTreeRows(rows) {
  for (const row of rows) {
    yield row;
    yield* walkTreeRows(row.__crudTreeChildren ?? []);
  }
}

/** 和普通树表格一致，子节点全选时选中父节点，部分选中时标记半选。 */
export function treeSelection(rows, selected) {
  const states = new Map();
  function visit(row) {
    const id = String(row.id);
    const children = (row.__crudTreeChildren ?? []).map(visit);
    const checked = children.length
      ? children.every(child => child.checked)
      : selected.has(id);
    const indeterminate =
      !checked && children.some(child => child.checked || child.indeterminate);
    const state = { checked, indeterminate };
    states.set(id, state);
    return state;
  }
  rows.forEach(visit);
  return states;
}
