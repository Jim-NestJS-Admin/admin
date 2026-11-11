import test from "node:test";
import assert from "node:assert/strict";
import {
  minimalPageConfig,
  minimalPrefix
} from "../src/views/system/page-config-diff.mjs";

const defaults = {
  columns: [
    { field: "name" },
    { field: "phone", width: 140 },
    { field: "status" },
    { field: "id", hidden: true },
    { field: "createdAt" }
  ],
  items: [{ field: "name", placeholder: "请输入名称" }, { field: "phone" }],
  keyWords: ["name", "phone"],
  filterable: ["status"],
  sorting: [{ field: "createdAt", order: "desc" }]
};
const untouched = () => ({
  columns: defaults.columns.map(column => ({
    field: column.field,
    width: column.width,
    hidden: column.hidden === true,
    fixed: ""
  })),
  items: defaults.items.map(item => ({
    field: item.field,
    group: "",
    span: 24,
    placeholder: item.placeholder ?? ""
  })),
  options: {
    pageSize: 20,
    tree: true,
    mode: "dialog",
    keyWords: ["name", "phone"],
    filterable: ["status"],
    sorting: [{ field: "createdAt", order: "desc" }]
  }
});

test("什么都没改时保存空配置", () => {
  assert.deepEqual(minimalPageConfig(untouched(), defaults), {});
});

test("只改一列的属性时，只写到这一列为止的最短前缀，且只带改过的属性", () => {
  const state = untouched();
  state.columns[1].hidden = true;
  assert.deepEqual(minimalPageConfig(state, defaults), {
    list: { columns: [{ field: "name" }, { field: "phone", hidden: true }] }
  });
});

test("宽度与代码默认相同、隐藏状态与默认相同都不写", () => {
  const state = untouched();
  state.columns[3].hidden = true;
  state.columns[1].width = 140;
  assert.deepEqual(minimalPageConfig(state, defaults), {});
});

test("调整顺序时写出足以还原顺序的前缀", () => {
  const state = untouched();
  const [status] = state.columns.splice(2, 1);
  state.columns.unshift(status);
  assert.deepEqual(minimalPageConfig(state, defaults), {
    list: { columns: [{ field: "status" }] }
  });
});

test("把前面的列挪到后面时，写出挪到它前面的列即可", () => {
  assert.equal(
    minimalPrefix(["b", "c", "a", "d"], ["a", "b", "c", "d"], []),
    2
  );
  assert.equal(minimalPrefix(["a", "c", "b"], ["a", "b", "c"], ["a"]), 2);
});

test("其余选项只写和默认不同的", () => {
  const state = untouched();
  state.options.pageSize = 50;
  state.options.mode = "drawer";
  state.options.tree = false;
  state.options.keyWords = ["name"];
  state.items[1].span = 12;
  assert.deepEqual(minimalPageConfig(state, defaults), {
    list: { keyWords: ["name"], pageSize: 50, tree: false },
    form: {
      mode: "drawer",
      items: [{ field: "name" }, { field: "phone", span: 12 }]
    }
  });
});

test("表单提示改回代码默认时不写", () => {
  const state = untouched();
  state.items[0].placeholder = "请输入名称";
  state.items[0].group = "基本信息";
  assert.deepEqual(minimalPageConfig(state, defaults), {
    form: { items: [{ field: "name", group: "基本信息" }] }
  });
});
