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
