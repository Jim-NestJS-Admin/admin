/**
 * 模块显示配置只保存「和代码默认不同」的部分。
 *
 * 后端合并规则（server core/page-config/page-config.rules.ts mergeView）：
 * - 列：配置里列出的列按配置顺序排在前面，其余列按代码默认顺序接在后面；
 *   列上没写的属性（宽度、隐藏、固定）沿用代码默认。
 * - 表单项：同样是配置里列出的在前，其余按默认顺序补上；没写的属性沿用默认。
 * - 其余选项不写就用默认（每页 20 条、显示左侧树、弹窗、白名单全部、默认排序）。
 * 因此这里只保留：改了属性的列 / 表单项，以及为保持顺序必须写出的最短前缀。
 */

import { minimalPrefix } from "../../components/Crud/model.mjs";

export const DEFAULT_PAGE_SIZE = 20;
export const DEFAULT_FORM_MODE = "dialog";

const sameList = (a, b) =>
  a.length === b.length && a.every((value, index) => value === b[index]);

export { minimalPrefix };

function trimRows(rows, base, attributes) {
  const changed = rows
    .filter(row => Object.keys(attributes(row)).length)
    .map(row => row.field);
  const desired = rows.map(row => row.field);
  const size = minimalPrefix(desired, base, changed);
  return rows.slice(0, size).map(row => ({
    field: row.field,
    ...attributes(row)
  }));
}

/**
 * @param {object} state 编辑器当前状态
 *   columns: [{ field, width?, hidden, fixed }]
 *   items: [{ field, group, span, placeholder }]
 *   options: { pageSize, tree, mode, keyWords, filterable, sorting }
 * @param {object} defaults 代码默认（来自原始页面描述，不含任何配置）
 *   columns: [{ field, width?, hidden? }]，按默认顺序
 *   items: [{ field, placeholder? }]，按默认顺序
 *   keyWords, filterable: string[]；sorting: [{ field, order }]
 */
export function minimalPageConfig(state, defaults) {
  const columnDefault = new Map(
    defaults.columns.map(column => [column.field, column])
  );
  const columns = trimRows(
    state.columns.filter(column => columnDefault.has(column.field)),
    defaults.columns.map(column => column.field),
    column => {
      const original = columnDefault.get(column.field);
      const out = {};
      if (typeof column.width === "number" && column.width !== original.width)
        out.width = column.width;
      if (column.hidden !== (original.hidden === true))
        out.hidden = column.hidden;
      if (column.fixed === "left" || column.fixed === "right")
        out.fixed = column.fixed;
      return out;
    }
  );
  const itemDefault = new Map(defaults.items.map(item => [item.field, item]));
  const items = trimRows(
    state.items.filter(item => itemDefault.has(item.field)),
    defaults.items.map(item => item.field),
    item => {
      const original = itemDefault.get(item.field);
      const out = {};
      if (item.group) out.group = item.group;
      if (item.span === 12) out.span = 12;
      if ((item.placeholder ?? "") !== (original.placeholder ?? ""))
        out.placeholder = item.placeholder ?? "";
      return out;
    }
  );
  const { options } = state;
  const list = {};
  if (columns.length) list.columns = columns;
  if (!sameList(options.keyWords, defaults.keyWords))
    list.keyWords = [...options.keyWords];
  if (!sameList(options.filterable, defaults.filterable))
    list.filterable = [...options.filterable];
  const sortKey = sorting => sorting.map(item => `${item.field}:${item.order}`);
  if (!sameList(sortKey(options.sorting), sortKey(defaults.sorting)))
    list.defaultSort = options.sorting.map(item => ({ ...item }));
  if (options.pageSize !== DEFAULT_PAGE_SIZE) list.pageSize = options.pageSize;
  if (options.tree === false) list.tree = false;
  const form = {};
  if (options.mode !== DEFAULT_FORM_MODE) form.mode = options.mode;
  if (items.length) form.items = items;
  return {
    ...(Object.keys(list).length ? { list } : {}),
    ...(Object.keys(form).length ? { form } : {})
  };
}
