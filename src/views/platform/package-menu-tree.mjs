/** 仅保留套餐选择的节点和连接它们的上级，不补入未选的兄弟或子节点。 */
export function filterPackageMenuTree(options, ids) {
  const missing = new Set(ids.map(String));
  function filter(nodes) {
    return nodes.flatMap(node => {
      const selected = missing.delete(String(node.id));
      const children = filter(node.children ?? []);
      return selected || children.length ? [{ ...node, children }] : [];
    });
  }
  return [
    ...filter(options),
    ...Array.from(missing, id => ({ id, title: id, parentId: null, type: "" }))
  ];
}
