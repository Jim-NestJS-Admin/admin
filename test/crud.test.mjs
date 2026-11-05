import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createServer } from "vite";
import { createSSRApp, defineComponent, h } from "vue";
import { renderToString } from "vue/server-renderer";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import {
  columnChoices,
  defaultCell,
  cellText,
  editableValues,
  identity,
  requiredFields
} from "../src/components/Crud/model.mjs";
const original = JSON.parse(
  readFileSync(
    new URL("./fixtures/t03-user-schema.json", import.meta.url),
    "utf8"
  )
);
test("框架类型由真实后端 OpenAPI 子集生成，版本化产物无漂移", () => {
  const input = JSON.parse(
    readFileSync(
      new URL("../api-source/crud-schema.json", import.meta.url),
      "utf8"
    )
  );
  const exported = JSON.parse(
    readFileSync(
      new URL("./fixtures/t03-openapi.json", import.meta.url),
      "utf8"
    )
  );
  assert.deepEqual(
    input.components.schemas,
    Object.fromEntries(
      Object.entries(exported.components.schemas).filter(([name]) =>
        name.startsWith("CrudSchema")
      )
    )
  );
  const result = spawnSync(
    process.execPath,
    ["scripts/gen-crud-schema.mjs", "--check"],
    { cwd: fileURLToPath(new URL("../", import.meta.url)), encoding: "utf8" }
  );
  assert.equal(result.status, 0, result.stderr);
});
test("显示偏好不能恢复被收回的字段，并限制重复列、宽度和固定位置", () => {
  const schema = structuredClone(original);
  schema.actions.page.readable = ["username", "nickname"];
  const result = columnChoices(schema, {
    columns: [
      { field: "internalNote" },
      { field: "status" },
      { field: "nickname", width: 9000, fixed: "invalid" },
      { field: "nickname" },
      { field: "username", visible: false, width: -5, fixed: "left" }
    ],
    density: "invalid"
  });
  assert.deepEqual(result, {
    columns: [
      { field: "nickname", visible: true, width: 600, fixed: false },
      { field: "username", visible: false, width: 80, fixed: "left" }
    ],
    density: "default"
  });
});
test("逐行隐藏状态不读取原值，脱敏值不反向匹配字典", () => {
  const hidden = {
    state: "hidden",
    get display() {
      throw Error("泄漏");
    }
  };
  assert.equal(cellText(hidden, []), "—");
  assert.equal(
    cellText({ state: "masked", display: "1***" }, [
      { value: "1***", label: "完整姓名" }
    ]),
    "1***"
  );
  assert.equal(defaultCell({}, "nickname").state, "hidden");
  assert.equal(
    cellText(
      { state: "visible", display: "enabled" },
      original.dictionaries.status
    ),
    "正常"
  );
});
test("表单仅提交动作白名单，保护只增字段、系统字段和逐行脱敏字段", () => {
  const row = {
    id: "9007199254740999",
    version: 1,
    username: "test",
    nickname: "已脱敏",
    status: "enabled"
  };
  const cells = (row, field) =>
    field === "nickname"
      ? { state: "masked", display: "已脱敏" }
      : defaultCell(row, field);
  const supplied = {
    ...row,
    nickname: "偷改",
    tenantId: "other",
    unknown: 123
  };
  assert.deepEqual(editableValues(original, "update", supplied, row, cells), {
    status: "enabled"
  });
  assert.deepEqual(identity(row), { id: "9007199254740999", version: 1 });
  assert.throws(() => identity({ id: 9007199254740999, version: 1 }));
  assert.throws(() => identity({ id: "1", version: 0 }));
  assert.deepEqual(
    requiredFields(original, "update", supplied, row, cells),
    []
  );
  const schema = {
    form: [
      { field: "count", required: true, edit: "both" },
      { field: "enabled", required: true, edit: "both" }
    ],
    actions: { add: { writable: ["count", "enabled"] } }
  };
  assert.deepEqual(
    requiredFields(
      schema,
      "add",
      { count: 0, enabled: false },
      undefined,
      defaultCell
    ),
    []
  );
});
test("控制器拒绝旧上下文/乱序回填，保留失败表单和重试幂等键", async t => {
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
    let rateLimited = false;
    let view,
      requests = [],
      resolveList,
      deferList = false,
      failWrite = true,
      resolveWrite;
    const row = {
      id: "12",
      version: 3,
      username: "alpha",
      nickname: "测试员",
      status: "enabled",
      remark: ""
    };
    const port = {
      describe: async () => structuredClone(original),
      list: async (query, signal) => {
        requests.push({ query, signal });
        if (deferList)
          return new Promise(resolve => {
            resolveList = resolve;
          });
        return { rows: [row], totalRows: 1 };
      },
      detail: async () => structuredClone(row),
      update: async (current, values, options) => {
        requests.push({ current, values, options });
        if (rateLimited)
          throw new RequestFailure({
            code: 4429,
            status: 429,
            message: "请求太频繁",
            data: { retryAfterSeconds: 10 }
          });
        if (resolveWrite)
          await new Promise(resolve => {
            resolveWrite = resolve;
          });
        if (failWrite)
          throw new RequestFailure({
            code: 4009,
            status: 409,
            data: {
              errors: [{ field: "data.nickname", messages: ["版本冲突"] }]
            },
            message: "数据已变更"
          });
        return row;
      }
    };
    await renderToString(
      createSSRApp(
        defineComponent({
          setup() {
            view = useCrud(port, "test-user");
            return () => h("div");
          }
        })
      )
    );
    await view.initialize();
    await t.test("后端排序和筛选白名单", async () => {
      await view.sort("internalNote", "ascending");
      assert.equal(requests.length, 1);
      await view.filter("tenantId", "other");
      assert.equal(requests.length, 1);
      await view.sort("nickname", "descending");
      assert.deepEqual(requests.at(-1).query.sorting, [
        { field: "nickname", direction: "desc" }
      ]);
    });
    await t.test("409 不关闭表单，旧版本号和同一意图的键保留", async () => {
      await view.edit(row);
      view.editor.values.nickname = "新姓名";
      view.editor.values.tenantId = "forbidden";
      await view.save();
      const first = requests.at(-1);
      assert.equal(view.editor.open, true);
      assert.deepEqual(first.current, { id: "12", version: 3 });
      assert.equal(first.values.tenantId, undefined);
      assert.equal(first.values.username, undefined);
      assert.deepEqual(view.fields.value.nickname, ["版本冲突"]);
      await view.save();
      assert.equal(
        requests.at(-1).options.idempotencyKey,
        first.options.idempotencyKey
      );
      view.editor.values.nickname = "再次修改";
      await view.save();
      assert.notEqual(
        requests.at(-1).options.idempotencyKey,
        first.options.idempotencyKey
      );
    });
    await t.test("双击只提交一次且成功后清除编辑数据", async () => {
      failWrite = false;
      resolveWrite = true;
      const before = requests.length,
        saving = view.save();
      await view.save();
      assert.equal(requests.length, before + 1);
      const finish = resolveWrite;
      resolveWrite = undefined;
      finish();
      await saving;
      assert.equal(view.editor.open, false);
      assert.deepEqual(view.editor.values, {});
    });
    await t.test("429 保留表单并在等待期间拒绝重复写入", async () => {
      await view.edit(row);
      rateLimited = true;
      await view.save();
      const count = requests.length;
      assert(view.retryUntil.value > Date.now());
      await view.save();
      assert.equal(requests.length, count);
      assert.equal(view.editor.open, true);
      rateLimited = false;
    });
    await t.test("后发列表先返回，旧页不能覆盖最新页", async () => {
      deferList = true;
      const olderRequest = view.load(),
        older = resolveList;
      const newerRequest = view.load(),
        newer = resolveList;
      newer({ rows: [{ ...row, nickname: "最新页" }], totalRows: 1 });
      await newerRequest;
      older({ rows: [{ ...row, nickname: "旧页" }], totalRows: 1 });
      await olderRequest;
      assert.equal(view.rows.value[0].nickname, "最新页");
    });
    await t.test(
      "切组织时清空，忽略未遵守 AbortSignal 的适配器旧响应",
      async () => {
        deferList = true;
        const loading = view.load();
        const last = requests.at(-1);
        resetSessionViews();
        assert.equal(last.signal.aborted, true);
        resolveList({
          rows: [{ ...row, nickname: "不应显示" }],
          totalRows: 99
        });
        await loading;
        assert.deepEqual(view.rows.value, []);
        assert.equal(view.schema.value, undefined);
        assert.equal(view.total.value, 0);
      }
    );
  } finally {
    await vite.close();
  }
});
