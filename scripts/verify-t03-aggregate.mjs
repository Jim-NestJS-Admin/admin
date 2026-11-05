// 可选跨仓库契约验证：先执行 gen:api:fixture；只构建 metadata，禁止初始化数据库。
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve, join } from "node:path";
import { pathToFileURL } from "node:url";
import { createRequire } from "node:module";
import { spawnSync } from "node:child_process";
import {
  childDraft,
  insertChild,
  relatedChanges
} from "../src/components/Crud/children.mjs";
import { identity } from "../src/components/Crud/model.mjs";
const root = resolve(process.argv[2] ?? "../server-review-t03");
const provenance = JSON.parse(
  readFileSync("test/fixtures/t03-provenance.json", "utf8")
);
const git = args =>
  spawnSync(
    "git",
    ["-c", `safe.directory=${root.replaceAll("\\", "/")}`, "-C", root, ...args],
    { encoding: "utf8" }
  );
assert.equal(
  git(["rev-parse", "HEAD"]).stdout.trim(),
  provenance.serverCommit,
  "后端提交必须与已导出契约一致"
);
assert.equal(
  git(["diff", "HEAD", "--quiet", "--", "src", "test/fixtures"]).status,
  0,
  "后端契约源码必须已提交"
);
const require = createRequire(join(root, "package.json"));
require("reflect-metadata");
const source = path =>
  import(pathToFileURL(join(root, "dist/t12-contract", path)).href);
const fixtures = await source("test/fixtures/demo-order.js");
const { CRUD_RESOURCE } = await source("src/core/crud/base.controller.js");
const { planChildren } = await source("src/core/crud/crud-children.js");
const { buildCrudDtos } = await source("src/core/crud/crud.dto.js");
const { meta } = Reflect.getMetadata(
  CRUD_RESOURCE,
  fixtures.DemoOrderController
);
const { DataSource } = require("typeorm");
const { plainToInstance } = require("class-transformer");
const { validate } = require("class-validator");
const ds = new DataSource({
  type: "mysql",
  database: "metadata_only_not_connected",
  entities: [
    fixtures.DemoOrderEntity,
    fixtures.DemoOrderItemEntity,
    fixtures.DemoOrderNoteEntity,
    fixtures.DemoOrderTagEntity
  ]
});
await ds.buildMetadatas();
const schema = JSON.parse(
    readFileSync("test/fixtures/t03-order-schema.json", "utf8")
  ),
  child = schema.children.find(child => child.resource === "items");
const original = { id: "9007199254740999", productCode: "P1", qty: 1, sort: 0 };
const draft = childDraft(child, [original], false);
draft.rows[0].values = { qty: 2, tenantId: "forbidden", id: "forbidden" };
insertChild(child, draft, undefined, undefined, () => "new-line");
draft.rows[1].values = {
  productCode: "P2",
  qty: 3,
  sort: 1,
  tenantId: "forbidden"
};
const changes = relatedChanges(schema.children, [draft]);
// 业务适配器应使用生成 DTO，以下映射只用于将内部变化交给真实后端校验器验证。
const body = Object.fromEntries(
  changes.map(group => [
    group.resource,
    {
      added: group.inserted.map(row => ({
        ...row.values,
        clientId: row.localKey
      })),
      updated: group.modified.map(row => ({
        ...row.values,
        id: row.recordKey
      })),
      deleted: group.removed
    }
  ])
);
const plans = await planChildren(meta, body, "update", ds);
assert.equal(plans[0].updated[0].id, original.id);
assert.deepEqual(plans[0].updated[0].values, { qty: 2 });
assert.equal(plans[0].added[0].clientId, "new-line");
assert.equal(plans[0].added[0].values.tenantId, undefined);
const dtos = buildCrudDtos(meta),
  valid = { items: [identity({ id: "1", version: 7 })] };
const options = {
  whitelist: true,
  forbidNonWhitelisted: true,
  forbidUnknownValues: true
};
assert.deepEqual(
  await validate(plainToInstance(dtos.RecycleActionBody, valid), options),
  []
);
assert(
  (
    await validate(
      plainToInstance(dtos.RecycleActionBody, { ids: ["1"] }),
      options
    )
  ).length > 0
);
assert.equal(ds.isInitialized, false);
console.log(
  "跨仓库契约通过：新增/修改明细差异与回收站版本体被真实 T03 校验器接受，受保护字段未写出，未连接数据库"
);
