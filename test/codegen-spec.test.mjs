import test from "node:test";
import assert from "node:assert/strict";
import { createServer } from "vite";

async function load(path) {
  const server = await createServer({
    configFile: false,
    server: { middlewareMode: true, ws: false }
  });
  try {
    return { module: await server.ssrLoadModule(path), server };
  } catch (error) {
    await server.close();
    throw error;
  }
}

const catalog = [
  {
    type: "string",
    label: "文本",
    databaseType: "varchar",
    defaultLength: 255,
    component: "input",
    options: ["length"]
  },
  {
    type: "money",
    label: "金额",
    databaseType: "decimal",
    precision: 14,
    scale: 2,
    component: "number",
    options: ["precision", "scale"]
  },
  {
    type: "int",
    label: "整数",
    databaseType: "int",
    component: "number",
    options: []
  },
  {
    type: "boolean",
    label: "布尔",
    databaseType: "boolean",
    component: "switch",
    options: []
  }
];

const customer = {
  version: 1,
  moduleName: "crm",
  businessName: "customer",
  title: "客户管理",
  permissionPrefix: "crm:customer",
  tableName: "crm_customer",
  template: "masterDetail",
  options: { deleteMode: "soft", scopeEnabled: true, exportEnabled: true },
  fields: [
    {
      property: "name",
      column: "name",
      label: "客户名称",
      type: "string",
      length: 100,
      nullable: false
    },
    {
      property: "enabled",
      column: "enabled",
      label: "启用",
      type: "boolean",
      nullable: false,
      defaultValue: true
    },
    {
      property: "credit",
      column: "credit",
      label: "信用额度",
      type: "money",
      precision: 14,
      scale: 2,
      nullable: true,
      defaultValue: null
    }
  ],
  children: [
    {
      tableName: "crm_customer_contact",
      title: "联系人",
      foreignKey: "customerId",
      fields: [
        {
          property: "phone",
          column: "phone",
          label: "电话",
          type: "string",
          length: 30,
          nullable: false,
          fieldPerm: { default: "masked", mask: "phone" }
        }
      ]
    }
  ]
};

test("模块规格：草稿往返不丢数据，显示项不会出现", async () => {
  const { module, server } = await load("/src/views/dev/codegen/spec.ts");
  try {
    const draft = module.readSpec(customer);
    assert.deepEqual(module.writeSpec(draft), customer);
    // 单表时不带 tree / children
    draft.template = "single";
    const single = module.writeSpec(draft);
    assert.equal(single.children, undefined);
    assert.equal(single.tree, undefined);
    for (const field of single.fields)
      for (const key of ["list", "query", "form", "component", "widget"])
        assert.equal(Object.hasOwn(field, key), false);
  } finally {
    await server.close();
  }
});

test("模块规格：表名推导名称，手改过的不再跟着变", async () => {
  const { module, server } = await load("/src/views/dev/codegen/spec.ts");
  try {
    assert.deepEqual(module.deriveNames("crm_customer_contact"), {
      moduleName: "crm",
      businessName: "customer_contact",
      permissionPrefix: "crm:customer-contact"
    });
    const draft = module.emptyDraft();
    module.applyTableName(draft, "crm_customer");
    assert.equal(draft.permissionPrefix, "crm:customer");
    draft.businessName = "client";
    draft.auto.businessName = false;
    module.syncPermission(draft);
    assert.equal(draft.permissionPrefix, "crm:client");
    module.applyTableName(draft, "sales_customer");
    assert.equal(draft.moduleName, "sales");
    assert.equal(draft.businessName, "client");
    assert.equal(draft.permissionPrefix, "sales:client");
    assert.equal(module.defaultForeignKey(draft), "clientId");
  } finally {
    await server.close();
  }
});

test("模块规格：列名、注释、类型联动和默认值转换", async () => {
  const { module, server } = await load("/src/views/dev/codegen/spec.ts");
  try {
    const field = module.newField("string", catalog);
    assert.equal(field.length, 255);
    module.applyColumn(field, "customer_name");
    module.applyComment(field, "客户名称");
    assert.equal(field.property, "customerName");
    assert.equal(field.label, "客户名称");
    field.label = "名称";
    field.autoLabel = false;
    module.applyComment(field, "新的注释");
    assert.equal(field.label, "名称");

    module.changeType(field, "money", catalog);
    assert.equal(field.length, undefined);
    assert.equal(field.precision, 14);
    assert.equal(field.scale, 2);

    module.changeType(field, "int", catalog);
    field.defaultText = "12";
    const draft = module.emptyDraft();
    draft.fields.push(field);
    assert.equal(module.writeSpec(draft).fields[0].defaultValue, 12);
    // 转不了的原样交给后端校验，错误会定位到这一格
    field.defaultText = "abc";
    assert.equal(module.writeSpec(draft).fields[0].defaultValue, "abc");
    field.defaultText = "";
    assert.equal(
      Object.hasOwn(module.writeSpec(draft).fields[0], "defaultValue"),
      false
    );
  } finally {
    await server.close();
  }
});

test("模块规格：后端错误路径定位到步骤和单元格", async () => {
  const { module, server } = await load("/src/views/dev/codegen/spec.ts");
  try {
    assert.equal(module.stepOf("tableName"), 1);
    assert.equal(module.stepOf("fields"), 2);
    assert.equal(module.stepOf("fields[3].length"), 2);
    assert.equal(module.stepOf("children[0].fields[1].column"), 2);
    assert.equal(module.stepOf("children[0].foreignKey"), 3);
    assert.equal(module.stepOf("tree.parentField"), 3);
    assert.equal(module.stepOf("options.deleteMode"), 4);
    assert.deepEqual(module.placeOf("children[0].fields[1].fieldPerm.mask"), {
      table: 0,
      row: 1,
      cell: "fieldPerm.mask"
    });
    const draft = module.readSpec(customer);
    const errors = module.fieldErrors(draft, [
      { path: "fields[0].length", message: "长度不对" },
      { path: "children[0].fields[0].fieldPerm.mask", message: "脱敏规则无效" },
      { path: "fields[9].column", message: "不存在的行" }
    ]);
    assert.deepEqual(errors[draft.fields[0].key], { length: "长度不对" });
    assert.deepEqual(errors[draft.children[0].fields[0].key], {
      fieldPerm: "脱敏规则无效"
    });
    assert.equal(Object.keys(errors).length, 2);
  } finally {
    await server.close();
  }
});

test("页面预览示例数据：按类型造值，树表有父子关系", async () => {
  const { module, server } = await load("/src/views/dev/codegen/spec.ts");
  try {
    const rows = module.sampleRows(
      [
        { property: "name", label: "名称", type: "string" },
        { property: "level", label: "等级", type: "dictionary" },
        { property: "parentId", label: "上级", type: "reference" }
      ],
      { level: [{ value: "a" }, { value: "b" }] },
      { count: 4, treeParent: "parentId" }
    );
    assert.equal(rows.length, 4);
    assert.equal(rows[0].name, "名称1");
    assert.deepEqual(
      rows.map(row => row.level),
      ["a", "b", "a", "b"]
    );
    assert.equal(rows[0].parentId, null);
    assert.equal(rows[1].parentId, "1");
    assert.equal(typeof rows[0].id, "string");
  } finally {
    await server.close();
  }
});

test("代码预览：行级差异只保留改动附近，并能折叠相同内容", async () => {
  const { module, server } = await load("/src/views/dev/codegen/code.ts");
  try {
    const before = Array.from({ length: 20 }, (_, i) => `line ${i}`).join("\n");
    const after = before.replace("line 10", "line ten") + "\nline 20";
    const diff = module.lineDiff(before, after, 1);
    assert.deepEqual(module.diffStats(diff), { added: 2, removed: 1 });
    assert.equal(diff[0].kind, "skip");
    const removed = diff.find(line => line.kind === "remove");
    assert.equal(removed.text, "line 10");
    assert.equal(removed.left, 11);
    const added = diff.filter(line => line.kind === "add");
    assert.deepEqual(
      added.map(line => [line.text, line.right]),
      [
        ["line ten", 11],
        ["line 20", 21]
      ]
    );
    assert.deepEqual(module.lineDiff("a", "a"), [{ kind: "skip", text: "1" }]);
  } finally {
    await server.close();
  }
});

test("代码预览：高亮切词不改变原文", async () => {
  const { module, server } = await load("/src/views/dev/codegen/code.ts");
  try {
    const ts = `// 注释\nexport const a = "x"; // 尾注\nconst n = 12;\n<template><el-input /></template>`;
    const lines = module.tokenLines(ts, module.languageOf("a.vue"));
    assert.equal(
      lines.map(line => line.map(token => token.text).join("")).join("\n"),
      ts
    );
    const tokens = module.tokenize(ts, "ts");
    assert.ok(
      tokens.some(token => token.kind === "keyword" && token.text === "export")
    );
    assert.ok(tokens.some(token => token.kind === "string"));
    const sql =
      "CREATE TABLE `a` (\n  `n` int NOT NULL DEFAULT 1 COMMENT '数'\n);";
    assert.equal(
      module
        .tokenize(sql, "sql")
        .map(token => token.text)
        .join(""),
      sql
    );
    assert.equal(module.languageOf("x.sql"), "sql");
    assert.equal(module.languageOf("locales/zh-CN.yaml"), "yaml");
  } finally {
    await server.close();
  }
});

test("语言包：中英文都能解析，代码生成的键一致", async () => {
  const { readFile } = await import("node:fs/promises");
  const { parseDocument } = await import("yaml");
  const keys = (value, prefix = "") =>
    Object.entries(value).flatMap(([key, item]) =>
      item && typeof item === "object"
        ? keys(item, `${prefix}${key}.`)
        : [`${prefix}${key}`]
    );
  const result = {};
  for (const lang of ["zh-CN", "en"]) {
    const document = parseDocument(
      await readFile(
        new URL(`../locales/${lang}.yaml`, import.meta.url),
        "utf8"
      )
    );
    assert.deepEqual(
      document.errors.map(error => error.message),
      [],
      `${lang}.yaml`
    );
    result[lang] = keys(document.toJS().codegen).sort();
  }
  assert.deepEqual(result.en, result["zh-CN"]);
});

test("代码预览：SQL 排版只换行不改内容", async () => {
  const { module, server } = await load("/src/views/dev/codegen/code.ts");
  try {
    const sql =
      "CREATE TABLE `a` (`id` bigint NOT NULL, `n` decimal(14,2) NULL COMMENT 'x, (y)', INDEX `i` (`id`, `n`), PRIMARY KEY (`id`)) ENGINE=InnoDB";
    const formatted = module.formatSql(sql);
    assert.equal(formatted.split("\n").length, 6);
    assert.ok(formatted.includes("decimal(14,2)"));
    assert.ok(formatted.includes("'x, (y)'"));
    assert.equal(
      formatted
        .replace("(\n  ", "(")
        .replace(/,\n {2}/g, ", ")
        .replace("\n)", ")"),
      sql
    );
  } finally {
    await server.close();
  }
});
