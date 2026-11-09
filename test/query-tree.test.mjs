import test from "node:test";
import assert from "node:assert/strict";
import { createServer } from "vite";
import { treeRows } from "../src/components/Crud/tree.mjs";

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
