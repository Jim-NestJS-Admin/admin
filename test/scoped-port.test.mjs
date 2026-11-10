import test from "node:test";
import assert from "node:assert/strict";
import { scopePort } from "../src/platform/system/scoped-port.mjs";
import { adaptNavigation } from "../src/platform/policy.mjs";

test("关联列表的查询、导出和保存不能切换归属，分页和请求上下文保留", async () => {
  const calls = [];
  const base = {
    describe: async () => ({
      form: [{ field: "userId" }, { field: "roleId" }]
    }),
    list: async (...args) => calls.push(args),
    export: async (...args) => calls.push(args),
    create: async (...args) => calls.push(args),
    update: async (...args) => calls.push(args)
  };
  const port = scopePort(base, { userId: "current" });
  const signal = new AbortController().signal;
  const query = {
    pageNumber: 2,
    equality: { userId: "other", roleId: "role" }
  };
  await port.list(query, signal);
  await port.export(query, signal);
  for (const [sent, requestSignal] of calls) {
    assert.deepEqual(sent.equality, { userId: "current", roleId: "role" });
    assert.equal(sent.pageNumber, 2);
    assert.equal(requestSignal, signal);
  }
  const context = { signal, idempotencyKey: "retry-key" };
  await port.create({ userId: "other", roleId: "role" }, context);
  await port.update(
    { id: "assignment", version: 3 },
    { userId: "other" },
    context
  );
  assert.equal(calls[2][0].userId, "current");
  assert.equal(calls[2][1], context);
  assert.deepEqual(calls[3], [
    { id: "assignment", version: 3 },
    { userId: "current" },
    context
  ]);
  assert.deepEqual((await port.describe(signal)).form, [{ field: "roleId" }]);
  const described = await scopePort(
    {
      ...base,
      describe: async () => ({
        form: [{ field: "userId" }],
        columns: [{ field: "userId" }, { field: "roleId" }],
        query: [{ field: "userId" }, { field: "roleId" }]
      })
    },
    { userId: "current" }
  ).describe(signal);
  assert.deepEqual(described.columns, [{ field: "roleId" }]);
  assert.deepEqual(described.query, [{ field: "roleId" }]);
  assert.equal(query.equality.userId, "other");
  assert.equal(scopePort(base), base);
});

test("只有一个可见页面的目录仍保留分组，隐藏页面保持隐藏", () => {
  const routes = adaptNavigation(
    [
      {
        key: "Dev",
        path: "/dev",
        title: "开发工具",
        kind: "directory",
        children: [
          {
            key: "Generator",
            path: "/dev/codegen",
            title: "代码生成",
            kind: "page",
            view: "codegen"
          },
          {
            key: "Hidden",
            path: "/dev/hidden",
            title: "隐藏页",
            kind: "page",
            view: "codegen",
            hidden: true
          }
        ]
      }
    ],
    [],
    new Set(["codegen"])
  );
  assert.equal(routes[0].children[0].meta.showParent, true);
  assert.equal(routes[0].children[1].meta.showLink, false);
});
