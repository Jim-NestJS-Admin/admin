import test from "node:test";
import assert from "node:assert/strict";
import {
  allows,
  adaptNavigation,
  normalizeFailure,
  singleFlight
} from "../src/platform/policy.mjs";
import { assertProduction } from "../scripts/verify-production.mjs";
import { failureView } from "../src/platform/failure-view.mjs";
test("字段错误与限流等待提示来自公开响应，异常数值不启动无限计时", () => {
  assert.deepEqual(
    failureView({
      status: 429,
      message: "稍后重试",
      data: {
        retryAfterSeconds: 12.2,
        errors: [{ messages: ["字段有误", 42] }]
      }
    }),
    { message: "稍后重试", fields: ["字段有误"], retrySeconds: 13 }
  );
  assert.equal(
    failureView({ status: 429, data: { retryAfterSeconds: Infinity } })
      .retrySeconds,
    0
  );
  assert.equal(failureView(null).message, "admin.serviceUnavailable");
  assert.deepEqual(
    failureView({
      status: 400,
      message: "验证码错误，请重新输入",
      data: {
        errors: [
          { field: "captchaCode", messages: ["验证码错误，请重新输入"] },
          { field: "a", messages: ["重复", "重复"] }
        ]
      }
    }).fields,
    ["重复"]
  );
});
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
test("导航保留后台配置的隐藏、缓存、排序和图标", () => {
  const [route] = adaptNavigation(
    [{ ...page, hidden: true, keepAlive: true, rank: 3, icon: "ep:user" }],
    ["read"],
    new Set(["users"])
  );
  assert.deepEqual(route.meta, {
    title: "用户",
    rank: 3,
    showLink: false,
    keepAlive: true,
    icon: "ep:user"
  });
});
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
