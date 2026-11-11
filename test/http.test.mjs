import test from "node:test";
import assert from "node:assert/strict";
import { createServer as createHttpServer } from "node:http";
import { createServer } from "vite";
import { fileURLToPath } from "node:url";
import Axios from "axios";
test("真实 HTTP 响应下的刷新、错误、取消与重放边界", async t => {
  let requests = [];
  const backend = createHttpServer((request, response) => {
    const parts = [];
    request.on("data", part => parts.push(part));
    request.on("end", () => {
      requests.push({
        path: request.url,
        authorization: request.headers.authorization,
        key: request.headers["idempotency-key"],
        body: Buffer.concat(parts).toString()
      });
      response.setHeader("Content-Type", "application/json");
      const send = (status, body) => {
        response.statusCode = status;
        response.end(JSON.stringify(body));
      };
      if (request.url === "/admin/renew") {
        if (request.headers.authorization !== "Bearer fresh")
          return send(401, { code: 4001, data: null, message: "会话失效" });
        return send(200, { code: 1000, data: { saved: true }, message: "ok" });
      }
      if (request.url === "/admin/always-401")
        return send(401, { code: 4001, data: null, message: "会话失效" });
      if (request.url === "/admin/forbidden")
        return send(403, { code: 4003, data: null, message: "无权访问" });
      if (request.url === "/admin/invalid")
        return send(400, {
          code: 4000,
          data: {
            errors: [{ field: "data.name", messages: ["名称不能为空"] }]
          },
          message: "参数有误"
        });
      if (request.url === "/admin/missing-file")
        return send(404, {
          code: 4004,
          data: null,
          message: "数据不存在或无权访问"
        });
      if (request.url === "/admin/raw")
        return send(200, { algorithm: "raw-fixture" });
      if (request.url === "/admin/slow")
        return setTimeout(
          () => send(200, { code: 1000, data: "旧内容", message: "ok" }),
          60
        );
      return send(409, { code: 4009, data: null, message: "版本冲突" });
    });
  });
  await new Promise(resolve => backend.listen(0, "127.0.0.1", resolve));
  const port = backend.address().port;
  const vite = await createServer({
    configFile: false,
    optimizeDeps: { noDiscovery: true, include: [] },
    server: { middlewareMode: true, ws: false },
    resolve: {
      alias: { "@": fileURLToPath(new URL("../src", import.meta.url)) }
    }
  });
  try {
    const { PureHttp } = await vite.ssrLoadModule("/src/utils/http/index.ts");
    const { useUserStoreHook } = await vite.ssrLoadModule(
      "/src/store/modules/user.ts"
    );
    const { configureAdminGateway } = await vite.ssrLoadModule(
      "/src/platform/gateway.ts"
    );
    const user = useUserStoreHook();
    const client = new PureHttp(
      Axios.create({ baseURL: `http://127.0.0.1:${port}` })
    );
    const snapshot = accessToken => ({
      accessToken,
      expiresAt: Date.now() + 120000,
      user: { id: "one", username: "one" },
      organizationId: "one",
      permissions: ["read"],
      menus: []
    });
    let refreshes = 0;
    const reset = () => {
      requests = [];
      refreshes = 0;
      user.clearSession();
      user.applySession(snapshot("old"));
      configureAdminGateway({
        refresh: async () => {
          refreshes++;
          return snapshot("fresh");
        }
      });
    };
    await t.test("并发 4001 共享刷新，原请求体和幂等键保持不变", async () => {
      reset();
      const calls = Array.from({ length: 3 }, () =>
        client.post("/admin/renew", {
          data: { name: "值" },
          headers: { "Idempotency-Key": "request-key" }
        })
      );
      const responses = await Promise.all(calls);
      assert.ok(responses.every(value => value.data.saved));
      assert.equal(refreshes, 1);
      assert.ok(
        requests.every(
          value => value.body === '{"name":"值"}' && value.key === "request-key"
        )
      );
    });
    await t.test("第二次 4001 不继续重放，清理会话", async () => {
      reset();
      await assert.rejects(client.get("/admin/always-401"));
      assert.equal(refreshes, 1);
      assert.equal(requests.length, 2);
      assert.equal(user.accessToken, "");
    });
    await t.test("403、字段校验和版本冲突保留错误体，不刷新", async () => {
      reset();
      for (const [path, code] of [
        ["forbidden", 4003],
        ["invalid", 4000],
        ["conflict", 4009]
      ]) {
        await assert.rejects(
          client.get(`/admin/${path}`),
          error => error.failure.code === code
        );
      }
      assert.equal(refreshes, 0);
      assert.equal(user.accessToken, "old");
    });
    await t.test("下载类请求出错时仍显示后端返回的原因", async () => {
      reset();
      await assert.rejects(
        client.post(
          "/admin/missing-file",
          { data: { id: "1" } },
          { responseType: "blob", responseMode: "raw" }
        ),
        error =>
          error.failure.code === 4004 &&
          error.failure.message === "数据不存在或无权访问" &&
          error.failure.status === 404
      );
    });
    await t.test("显式匿名原始响应不附带访问令牌", async () => {
      reset();
      const raw = await client.get(
        "/admin/raw",
        {},
        { authPolicy: "none", responseMode: "raw" }
      );
      assert.equal(raw.algorithm, "raw-fixture");
      assert.equal(requests[0].authorization, undefined);
    });
    await t.test("退出时取消在途请求，迟到内容不返回页面", async () => {
      reset();
      const pending = client.get("/admin/slow");
      const settled = assert.rejects(
        pending,
        error => error.failure.message === "admin.requestCanceled"
      );
      await new Promise(resolve => setTimeout(resolve, 10));
      user.clearSession();
      await settled;
    });
    await t.test("拒绝外部地址和归一化后越出 admin 的路径", async () => {
      reset();
      await assert.rejects(client.get("https://example.invalid/admin/data"));
      await assert.rejects(client.get("/admin/../public"));
      await assert.rejects(
        client.get("/admin/%E0"),
        error => error.failure.message === "admin.serviceUnavailable"
      );
      assert.equal(requests.length, 0);
    });
  } finally {
    await vite.close();
    backend.closeAllConnections();
    await new Promise(resolve => backend.close(resolve));
  }
});
