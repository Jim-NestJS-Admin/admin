import test from "node:test";
import assert from "node:assert/strict";
import { createServer } from "vite";
import {
  treeRows,
  treeSelection,
  walkTreeRows
} from "../src/components/Crud/tree.mjs";
import { filterPackageMenuTree } from "../src/views/platform/package-menu-tree.mjs";

test("树节点不可见父级和脏循环都不丢行、不生成递归环", () => {
  const rows = treeRows(
    [
      { id: "1", parentId: "2" },
      { id: "2", parentId: "1" },
      { id: "3", parentId: "other" }
    ],
    "parentId"
  );
  assert.equal(rows.length, 3);
  assert.doesNotThrow(() => JSON.stringify(rows));
});
test("虚拟树所有层级可选，部分按钮选中时父级半选", () => {
  const rows = treeRows(
    [
      { id: "1" },
      { id: "2", parentId: "1" },
      { id: "3", parentId: "2" },
      { id: "4", parentId: "2" },
      { id: "5" }
    ],
    "parentId"
  );
  assert.deepEqual(
    Array.from(walkTreeRows(rows), row => row.id),
    ["1", "2", "3", "4", "5"]
  );
  const partial = treeSelection(rows, new Set(["3"]));
  assert.deepEqual(partial.get("1"), { checked: false, indeterminate: true });
  assert.deepEqual(partial.get("2"), { checked: false, indeterminate: true });
  assert.deepEqual(partial.get("3"), { checked: true, indeterminate: false });
  const completeBranch = treeSelection(rows, new Set(["3", "4"]));
  assert.equal(completeBranch.get("1").checked, true);
  assert.equal(completeBranch.get("2").checked, true);
  assert.equal(completeBranch.get("5").checked, false);
});
test("套餐只读树保留已选节点和上级，未选子节点不随父级显示", () => {
  const menu = [
    {
      id: "1",
      children: [{ id: "2", children: [{ id: "3" }, { id: "4" }] }, { id: "5" }]
    }
  ];
  const result = filterPackageMenuTree(menu, ["2", "3", "9"]);
  assert.deepEqual(result, [
    { id: "1", children: [{ id: "2", children: [{ id: "3", children: [] }] }] },
    { id: "9", title: "9", parentId: null, type: "" }
  ]);
  assert.deepEqual(filterPackageMenuTree(menu, []), []);
  assert.deepEqual(
    menu[0].children[0].children.map(node => node.id),
    ["3", "4"]
  );
});
test("查询草稿保留0/false，拒绝失效字段、超过100个in值和深分组", async () => {
  const vite = await createServer({
    configFile: false,
    server: { middlewareMode: true, ws: false }
  });
  try {
    const { serializeQuery, restoreQuery } = await vite.ssrLoadModule(
      "/src/components/Crud/query-draft.ts"
    );
    const fields = [
      { field: "amount", type: "number", operators: ["eq", "in"] },
      { field: "enabled", type: "boolean", operators: ["eq"] }
    ];
    const draft = {
      key: "g",
      join: "and",
      children: [
        { key: "a", field: "amount", operator: "eq", text: "0", end: "" },
        { key: "b", field: "enabled", operator: "eq", text: "false", end: "" }
      ]
    };
    assert.deepEqual(
      serializeQuery(draft, fields).items.map(item => item.value),
      [0, false]
    );
    assert.throws(
      () => serializeQuery(draft, fields.slice(1)),
      /unavailableField/
    );
    draft.children[0].operator = "in";
    draft.children[0].text = Array(101).fill("1").join(",");
    assert.throws(() => serializeQuery(draft, fields), /invalidList/);
    assert.throws(
      () =>
        restoreQuery(
          { op: "and", items: [{ field: "deleted", op: "eq", value: 1 }] },
          fields
        ),
      /unavailableField/
    );
  } finally {
    await vite.close();
  }
});
