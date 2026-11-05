import test from "node:test";
import assert from "node:assert/strict";
import { createServer } from "vite";
import { fileURLToPath } from "node:url";
test("会话刷新、退出竞态及组织切换隔离", async t => {
  const server = await createServer({
    configFile: false,
    optimizeDeps: { noDiscovery: true, include: [] },
    server: { middlewareMode: true, ws: false },
    resolve: {
      alias: { "@": fileURLToPath(new URL("../src", import.meta.url)) }
    }
  });
  try {
    const { useUserStoreHook } = await server.ssrLoadModule(
      "/src/store/modules/user.ts"
    );
    const { configureAdminGateway } = await server.ssrLoadModule(
      "/src/platform/gateway.ts"
    );
    const user = useUserStoreHook();
    const snapshot = () => ({
      accessToken: "测试凭据",
      expiresAt: Date.now() + 1000,
      user: { id: "test", username: "test" },
      organizationId: "one",
      permissions: ["read"],
      menus: []
    });
    let resolveRefresh,
      rejectRefresh,
      calls = 0;
    const adapter = {
      refresh: () => {
        calls++;
        return new Promise((resolve, reject) => {
          resolveRefresh = resolve;
          rejectRefresh = reject;
        });
      },
      signOut: () => Promise.resolve(),
      switchOrganization: () =>
        Promise.resolve({ ...snapshot(), organizationId: "two" })
    };
    configureAdminGateway(adapter);
    await t.test("并发刷新只调用一次", async () => {
      user.applySession(snapshot());
      const tasks = [user.ensureFreshSession(), user.ensureFreshSession()];
      assert.equal(calls, 1);
      resolveRefresh(snapshot());
      await Promise.all(tasks);
    });
    await t.test("退出后迟到的刷新不得恢复会话", async () => {
      const task = user.ensureFreshSession();
      await user.logOut();
      resolveRefresh(snapshot());
      await assert.rejects(task);
      assert.equal(user.accessToken, "");
      assert.deepEqual(user.permissions, []);
    });
    await t.test("刷新失败共同拒绝并清理会话", async () => {
      user.applySession(snapshot());
      const tasks = [user.ensureFreshSession(), user.ensureFreshSession()];
      rejectRefresh(new Error("服务失效"));
      const outcomes = await Promise.allSettled(tasks);
      assert.ok(outcomes.every(x => x.status === "rejected"));
      assert.equal(user.accessToken, "");
    });
    await t.test("切换时立即撤销旧权限，成功后采用新上下文", async () => {
      user.applySession(snapshot());
      const task = user.switchOrganization("two");
      assert.equal(user.transitioning, true);
      assert.deepEqual(user.permissions, []);
      await task;
      assert.equal(user.organizationId, "two");
      assert.equal(user.transitioning, false);
    });
    await t.test("远程退出同步抛错也必须清理本地会话", async () => {
      configureAdminGateway({
        ...adapter,
        signOut: () => {
          throw new Error("失败");
        }
      });
      await user.logOut();
      assert.equal(user.accessToken, "");
    });
  } finally {
    await server.close();
  }
});
