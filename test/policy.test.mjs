import test from "node:test";
import assert from "node:assert/strict";
import {
  allows,
  adaptNavigation,
  normalizeFailure,
  singleFlight
} from "../src/platform/policy.mjs";
import { assertProduction } from "../scripts/verify-production.mjs";
test("权限必须逐项明确授予，空列表与通配符不能放行", () => {
  assert.equal(allows(["*:*:*"], "system:user:page"), false);
  assert.equal(allows(["*:*:*"], "*:*:*"), false);
  assert.equal(allows([], []), false);
  assert.equal(allows(["read"], ["read", "write"]), false);
  assert.equal(allows(["read"], "read"), true);
});
const page = {
  key: "Users",
  path: "/system/users",
  title: "用户",
  kind: "page",
  view: "users",
  permission: "read"
};
test("未知视图、异常子树和外部路径不影响合法菜单", () => {
  const errors = [];
  const result = adaptNavigation(
    [
      {
        ...page,
        key: "Unknown",
        path: "/unknown",
        view: "remote",
        children: [page]
      },
      { ...page, key: "Remote", path: "//evil.test" },
      page,
      { key: "Empty", path: "/empty", kind: "directory", title: "空目录" }
    ],
    ["read"],
    new Set(["users"]),
    reason => errors.push(reason)
  );
  assert.equal(result.length, 1);
  assert.equal(result[0].path, page.path);
  assert.equal(errors.length, 2);
  assert.equal(adaptNavigation([page], [], new Set(["users"])).length, 0);
});
test("非 2xx 保留统一错误，网络异常不回显内部信息", () => {
  assert.deepEqual(
    normalizeFailure({
      response: {
        status: 409,
        data: { code: 4009, message: "冲突", data: { errors: [] } }
      }
    }),
    { status: 409, code: 4009, message: "冲突", data: { errors: [] } }
  );
  assert.equal(
    normalizeFailure(new Error("内部连接信息")).message,
    "admin.serviceUnavailable"
  );
});
test("单飞失败共同拒绝，结束后可开始下一次", async () => {
  let calls = 0;
  const run = singleFlight(async () => {
    calls++;
    throw new Error("失败");
  });
  const results = await Promise.allSettled([run(), run(), run()]);
  assert.equal(calls, 1);
  assert.ok(results.every(result => result.status === "rejected"));
  await assert.rejects(run());
  assert.equal(calls, 2);
});
test("生产检查会拒绝真实 mock 插件及演示登录标记", () => {
  assert.throws(() =>
    assertProduction("vitePluginFakeServer({enableProd:true})")
  );
  assert.throws(() => assertProduction("const password='admin123'"));
  assert.doesNotThrow(() => assertProduction("createApp(App).mount('#app')"));
});
