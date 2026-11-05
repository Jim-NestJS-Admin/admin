import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  childDraft,
  childWritable,
  childValue,
  insertChild,
  removeChild,
  canReorder,
  reorderChild,
  relatedChanges,
  childIssues
} from "../src/components/Crud/children.mjs";
import { defaultCell } from "../src/components/Crud/model.mjs";
const schema = JSON.parse(
  readFileSync(
    new URL("./fixtures/t03-order-schema.json", import.meta.url),
    "utf8"
  )
);
const child = schema.children.find(child => child.resource === "items");
const row = {
  id: "9007199254740999",
  version: 1,
  productCode: "P1",
  qty: 1,
  sort: 0,
  remark: "已展示"
};
test("部分加载只保存明确差异，未加载组不参与提交，未改行不被删除", () => {
  const draft = childDraft(child, [row], false);
  draft.rows[0].values.qty = 2;
  const absent = childDraft(schema.children[1], undefined);
  assert.deepEqual(relatedChanges(schema.children, [draft, absent]), [
    {
      resource: "items",
      inserted: [],
      modified: [{ recordKey: row.id, values: { qty: 2 } }],
      removed: []
    }
  ]);
  assert.equal(canReorder(child, draft), false);
  removeChild(draft, row.id);
  assert.deepEqual(relatedChanges([child], [draft])[0].removed, [row.id]);
});
test("复制用新本地标识，只有可新增且可见字段，不复制编号、归属与受保护原值", () => {
  const restricted = structuredClone(child);
  restricted.add.writable = ["productCode", "qty", "remark"];
  const draft = childDraft(restricted, [row], true);
  const cell = (record, field) =>
    field === "remark"
      ? {
          state: "masked",
          get display() {
            throw Error("不允许读原值");
          }
        }
      : defaultCell(record, field);
  assert.equal(
    insertChild(restricted, draft, draft.rows[0], cell, () => "local-copy"),
    true
  );
  assert.deepEqual(draft.rows[1], {
    key: "local-copy",
    values: { productCode: "P1", qty: 1 }
  });
  removeChild(draft, "local-copy");
  assert.deepEqual(draft.removed, []);
});
test("只读/脱敏/隐藏/系统字段即使被手动塞入编辑状态也不会写出", () => {
  const restricted = structuredClone(child);
  restricted.update.writable = ["qty", "remark"];
  const draft = childDraft(restricted, [row], true);
  Object.assign(draft.rows[0].values, {
    id: "other",
    tenantId: "2",
    productCode: "changed",
    qty: 2,
    remark: "偷改"
  });
  const cell = (record, field) =>
    field === "remark"
      ? {
          state: "hidden",
          get display() {
            throw Error("隐藏字段不读");
          }
        }
      : defaultCell(record, field);
  assert.equal(childWritable(restricted, draft.rows[0], "remark", cell), false);
  // hidden 也不能通过显示读值函数拿到原快照。
  const clean = childDraft(restricted, [row], true);
  assert.equal(childValue(clean.rows[0], "remark", cell), undefined);
  assert.deepEqual(
    relatedChanges([restricted], [draft], () => cell)[0].modified,
    [{ recordKey: row.id, values: { qty: 2 } }]
  );
});
test("只有完整、全部行排序字段可写时才可拖动；键盘和拖动共用同一个排序函数", () => {
  const draft = childDraft(
    child,
    [row, { ...row, id: "2", productCode: "P2", sort: 1 }],
    true
  );
  reorderChild(child, draft, "2", 0);
  assert.deepEqual(
    draft.rows.map(row => row.key),
    ["2", row.id]
  );
  assert.deepEqual(
    draft.rows.map(row => row.values.sort),
    [0, 1]
  );
  const blocked = (_row, field) => ({
    state: field === "sort" ? "masked" : "visible",
    display: "*"
  });
  assert.equal(canReorder(child, draft, blocked), false);
  reorderChild(child, draft, row.id, 0, blocked);
  assert.equal(draft.rows[0].key, "2");
});
test("重复编号/不精确的数值编号拒绝，未加载组不能增删，新行的必填和完整行数有提示", () => {
  assert.throws(() => childDraft(child, [row, row], true));
  assert.throws(() =>
    childDraft(child, [{ ...row, id: 9007199254740999 }], true)
  );
  const absent = childDraft(child, undefined);
  assert.equal(insertChild(child, absent), false);
  const draft = childDraft(child, [], true);
  assert.equal(childIssues([child], [draft])[0].field, "_rows");
  insertChild(child, draft, undefined, defaultCell, () => "new");
  assert(
    childIssues([child], [draft]).some(
      issue => issue.key === "new" && issue.field === "productCode"
    )
  );
  draft.rows[0].values = { productCode: "P", qty: 0, sort: 0 };
  assert(!childIssues([child], [draft]).some(issue => issue.field === "qty"));
});
test("复制产生的明确唯一冲突标出两行；不知道的数据库默认值不猜", () => {
  const draft = childDraft(child, [row], true);
  insertChild(child, draft, draft.rows[0], defaultCell, () => "copied");
  assert.deepEqual(
    childIssues([child], [draft])
      .filter(issue => issue.message === "crud.duplicateRow")
      .map(issue => issue.key),
    [row.id, "copied"]
  );
  const tags = schema.children.find(child => child.resource === "tags"),
    tagDraft = childDraft(tags, [], true);
  insertChild(tags, tagDraft, undefined, defaultCell, () => "a");
  insertChild(tags, tagDraft, undefined, defaultCell, () => "b");
  tagDraft.rows.forEach((row, i) => {
    row.values.label = String(i);
  });
  assert(
    !childIssues([tags], [tagDraft]).some(
      issue => issue.message === "crud.duplicateRow"
    )
  );
});
