import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";
import { createSSRApp, defineComponent, h } from "vue";
import { renderToString } from "vue/server-renderer";

test("新增额外凭据显式传递、参与幂等重试，且不扩大实体写权限", async () => {
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
    const { RequestFailure } = await vite.ssrLoadModule(
      "/src/utils/http/index.ts"
    );
    const schema = JSON.parse(
      readFileSync(
        new URL("./fixtures/t03-user-schema.json", import.meta.url),
        "utf8"
      )
    );
    const row = { id: "1", version: 1, username: "tenant", nickname: "租户" };
    const calls = [];
    let view,
      reject = true;
    const port = {
      describe: async () => structuredClone(schema),
      list: async () => ({ rows: [], totalRows: 0 }),
      detail: async () => structuredClone(row),
      create: async (values, context) => {
        calls.push({
          values: structuredClone(values),
          key: context.idempotencyKey
        });
        if (reject)
          throw new RequestFailure({
            status: 400,
            code: 4000,
            message: "密码有误",
            data: {
              errors: [{ field: "adminPassword", messages: ["密码有误"] }]
            }
          });
        return row;
      },
      update: async (_identity, values) => {
        calls.push({ values: structuredClone(values) });
        return row;
      }
    };
    await renderToString(
      createSSRApp(
        defineComponent({
          setup() {
            view = useCrud(
              port,
              "tenant-extra",
              undefined,
              undefined,
              () => ({}),
              () => ["adminUsername", "adminPassword", "id"]
            );
            return () => h("div");
          }
        })
      )
    );
    await view.initialize();
    await view.edit();
    Object.assign(view.editor.values, {
      username: "tenant",
      nickname: "租户",
      adminUsername: "test-admin",
      adminPassword: "test-value-a",
      unexpected: "不应发送",
      id: "999"
    });
    await view.save();
    assert.deepEqual(calls[0].values, {
      username: "tenant",
      nickname: "租户",
      adminUsername: "test-admin",
      adminPassword: "test-value-a"
    });
    assert.deepEqual(view.fields.value.adminPassword, ["密码有误"]);
    assert.equal(view.editor.open, true);
    await view.save();
    assert.equal(calls[0].key, calls[1].key);
    view.editor.values.adminPassword = "test-value-b";
    reject = false;
    await view.save();
    assert.notEqual(calls[1].key, calls[2].key);
    assert.equal(view.editor.open, false);
    assert.deepEqual(view.editor.values, {});
    await view.edit(row);
    Object.assign(view.editor.values, {
      nickname: "修改",
      adminUsername: "不应在修改时发送",
      adminPassword: "不应发送"
    });
    await view.save();
    assert.deepEqual(calls[3].values, { nickname: "修改" });
  } finally {
    await vite.close();
  }
});
