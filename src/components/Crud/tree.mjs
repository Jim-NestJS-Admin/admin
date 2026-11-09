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
