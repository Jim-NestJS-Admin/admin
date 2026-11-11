import test from "node:test";
import assert from "node:assert/strict";
import {
  applyPageView,
  constrainFieldSchema,
  formPresentation
} from "../src/components/Crud/model.mjs";
test("显示配置不能增加字段或恢复隐藏字段，表单跨度分组只影响显示", () => {
  const source = {
    columns: [{ field: "name" }, { field: "cost" }],
    form: [{ field: "name" }],
    query: [],
    actions: {
      page: {
        keyWords: ["name"],
        filterable: ["name"],
        sortable: ["name"],
        readable: ["name", "cost"]
      },
      update: { writable: ["name"] }
    },
    defaultSort: [],
    fieldPerms: { cost: { state: "hidden" } },
    view: {
      list: {
        columns: [{ field: "unknown" }, { field: "cost", hidden: false }],
        keyWords: ["cost"]
      },
      form: { items: [{ field: "name", span: 12, group: "基本信息" }] }
    }
  };
  const result = constrainFieldSchema(applyPageView(source));
  assert.deepEqual(
    result.columns.map(column => column.field),
    ["name"]
  );
  assert.deepEqual(result.actions.page.keyWords, []);
  assert.deepEqual(formPresentation(result, "name"), {
    mode: "drawer",
    span: 12,
    group: "基本信息"
  });
});

test("列设置只保存和模块配置不同的部分", async () => {
  const { choiceDifference, columnChoices } = await import(
    "../src/components/Crud/model.mjs"
  );
  const schema = {
    columns: [
      { field: "name" },
      { field: "phone" },
      { field: "id", hidden: true }
    ],
    actions: { page: { readable: ["name", "phone", "id"] } }
  };
  const baseline = columnChoices(schema);
  const untouched = columnChoices(schema);
  assert.deepEqual(choiceDifference(untouched, baseline), {
    columns: [],
    density: "default"
  });
  const changed = columnChoices(schema);
  changed.columns[1].visible = false;
  assert.deepEqual(choiceDifference(changed, baseline).columns, [
    { field: "name" },
    { field: "phone", visible: false }
  ]);
  // 只保存了一部分的列设置读回来时，没写的列跟随模块配置
  const loaded = columnChoices(schema, {
    columns: [{ field: "phone", visible: false }]
  });
  assert.deepEqual(
    loaded.columns.map(column => [column.field, column.visible]),
    [
      ["phone", false],
      ["name", true],
      ["id", false]
    ]
  );
});
