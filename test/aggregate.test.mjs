import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";
import { createSSRApp, defineComponent, h } from "vue";
import { renderToString } from "vue/server-renderer";
import { insertChild } from "../src/components/Crud/children.mjs";
const schema = JSON.parse(
  readFileSync(
    new URL("./fixtures/t03-order-schema.json", import.meta.url),
    "utf8"
  )
);
test("聚合与回收站控制器：真实描述、版本、错误定位和上下文隔离", async t => {
  const vite = await createServer({
    configFile: false,
    optimizeDeps: { noDiscovery: true, include: [] },
    server: { middlewareMode: true, ws: false },
    resolve: {
      alias: { "@": fileURLToPath(new URL("../src", import.meta.url)) }
    }
  });
  try {
    const { useCrud } = await vite.ssrLoadModule(
      "/src/components/Crud/useCrud.ts"
    );
    const { resetSessionViews } = await vite.ssrLoadModule(
      "/src/platform/lifecycle.ts"
    );
    const { RequestFailure } = await vite.ssrLoadModule(
      "/src/utils/http/index.ts"
    );
    let view, failure, resolver;
    const calls = [];
    const parent = {
      id: "1",
      version: 7,
      orderNo: "O1",
      title: "单据",
      children: {
        items: [{ id: "10", productCode: "P1", qty: 1, sort: 0 }],
        notes: [],
        tags: []
      }
    };
    const recycled = {
      ...parent,
      version: 9,
      deletedAt: "2026-11-05T01:00:00Z"
    };
    const port = {
      describe: async () => structuredClone(schema),
      list: async () => ({ rows: [structuredClone(parent)], totalRows: 1 }),
      detail: async () => structuredClone(parent),
      relatedComplete: () => true,
      update: async (identity, values, context) => {
        calls.push({ identity, values, context });
        if (failure) throw failure;
        return parent;
      },
      recycled: async () => ({
        rows: [structuredClone(recycled)],
        totalRows: 1
      }),
      restore: async (records, context) => {
        calls.push({ records, context });
        if (failure) throw failure;
        if (resolver)
          await new Promise(resolve => {
            resolver = resolve;
          });
      },
      purge: async (records, context) => {
        calls.push({ records, context });
      }
    };
    await renderToString(
      createSSRApp(
        defineComponent({
          setup() {
            view = useCrud(port, "orders");
            return () => h("div");
          }
        })
      )
    );
    await view.initialize();
    await t.test("只改明细也只调用一次主表update，保留主表旧版本", async () => {
      await view.edit(parent);
      view.editor.related[0].rows[0].values.qty = 2;
      await view.save();
      assert.equal(calls.length, 1);
      assert.deepEqual(calls[0].identity, { id: "1", version: 7 });
      assert.deepEqual(
        calls[0].context.relatedChanges.find(
          group => group.resource === "items"
        ),
        {
          resource: "items",
          inserted: [],
          modified: [{ recordKey: "10", values: { qty: 2 } }],
          removed: []
        }
      );
      assert.equal(view.editor.open, false);
    });
    await t.test(
      "后端按resource/index报告的错误定位到新增行，失败和重试保留本地编号及键",
      async () => {
        await view.edit(parent);
        const draft = view.editor.related[0];
        insertChild(
          schema.children[0],
          draft,
          undefined,
          undefined,
          () => "new-line"
        );
        draft.rows[1].values = { productCode: "P2", qty: 2, sort: 1 };
        failure = new RequestFailure({
          code: 4000,
          status: 400,
          message: "明细有误",
          data: {
            errors: [
              {
                resource: "items",
                index: 0,
                field: "qty",
                messages: ["数量超过限制"]
              }
            ]
          }
        });
        await view.save();
        const key = calls.at(-1).context.idempotencyKey;
        assert.deepEqual(view.rowIssues.value, [
          {
            group: "items",
            key: "new-line",
            field: "qty",
            message: "数量超过限制"
          }
        ]);
        assert.equal(view.editor.open, true);
        assert.equal(view.editor.related[0].rows[1].key, "new-line");
        await view.save();
        assert.equal(calls.at(-1).context.idempotencyKey, key);
        draft.rows[1].values.qty = 3;
        await view.save();
        assert.notEqual(calls.at(-1).context.idempotencyKey, key);
        failure = undefined;
      }
    );
    await t.test("详情只读状态即使调用save也不提交", async () => {
      await view.edit(parent, true);
      const count = calls.length;
      view.editor.values.title = "不应提交";
      await view.save();
      assert.equal(calls.length, count);
    });
    await t.test(
      "恢复和彻底删除都提交回收站里读到的旧版本，409不静默刷新后重试",
      async () => {
        await view.showRecycled(true);
        assert.equal(view.editor.open, false);
        assert.equal(view.rows.value[0].version, 9);
        failure = new RequestFailure({
          code: 4009,
          status: 409,
          data: null,
          message: "数据已变更"
        });
        await view.recycleAction("restore", [view.rows.value[0]]);
        const key = calls.at(-1).context.idempotencyKey;
        assert.deepEqual(calls.at(-1).records, [{ id: "1", version: 9 }]);
        assert.equal(view.rows.value[0].version, 9);
        await view.recycleAction("restore", [view.rows.value[0]]);
        assert.equal(calls.at(-1).context.idempotencyKey, key);
        failure = undefined;
        await view.recycleAction("purge", [view.rows.value[0]]);
        assert.deepEqual(calls.at(-1).records, [{ id: "1", version: 9 }]);
      }
    );
    await t.test("切换组织后，迟到的恢复结果不能回填旧列表或明细", async () => {
      resolver = true;
      const restoring = view.recycleAction("restore", [view.rows.value[0]]),
        finish = resolver;
      resetSessionViews();
      assert.equal(calls.at(-1).context.signal.aborted, true);
      resolver = undefined;
      finish();
      await restoring;
      assert.deepEqual(view.rows.value, []);
      assert.deepEqual(view.editor.related, []);
      assert.equal(view.schema.value, undefined);
    });
  } finally {
    await vite.close();
  }
});
