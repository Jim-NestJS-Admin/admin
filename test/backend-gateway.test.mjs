import test from "node:test";
import assert from "node:assert/strict";
import { createServer } from "vite";
import { fileURLToPath } from "node:url";

test("正式生成客户端的认证适配与会话边界", async t => {
  const server = await createServer({
    configFile: false,
    optimizeDeps: { noDiscovery: true, include: [] },
    server: { middlewareMode: true, ws: false },
    resolve: {
      alias: { "@": fileURLToPath(new URL("../src", import.meta.url)) }
    }
  });
  try {
    const { createBackendGateway } = await server.ssrLoadModule(
      "/src/platform/backend-gateway.ts"
    );
    const { writeTenantCode } = await server.ssrLoadModule(
      "/src/platform/tenant-code.ts"
    );
    const { useUserStoreHook } = await server.ssrLoadModule(
      "/src/store/modules/user.ts"
    );
    const calls = [];
    let unauthorized = false;
    let profileFails = false;
    const token = {
      accessToken: "测试访问凭据",
      tokenType: "Bearer",
      expiresIn: 60
    };
    const gateway = createBackendGateway(() => "切组织前凭据", {
      async request(config) {
        calls.push(config);
        if (config.signal?.aborted) throw { code: "ERR_CANCELED" };
        if (unauthorized)
          throw {
            response: { status: 401, data: { code: 4001, message: "登录失效" } }
          };
        let data = token;
        if (config.url.endsWith("/captcha"))
          return {
            data: {
              code: 1000,
              data: {
                captchaId: "image-id",
                image: "data:image/svg+xml;base64,PHN2Zy8+"
              },
              message: "成功"
            }
          };
        if (config.url.endsWith("/profile")) {
          if (profileFails)
            throw {
              response: {
                status: 503,
                data: { code: 5003, message: "服务不可用" }
              }
            };
          data = {
            tenant: {
              id: "2",
              code: "demo",
              name: "演示租户",
              platform: false
            },
            superAdmin: true,
            user: { id: "1", username: "tester", nickname: "测试" },
            currentOrg: null,
            orgs: [],
            locale: "zh-CN"
          };
        }
        if (config.url.endsWith("/menu"))
          data = {
            authVersion: 2,
            permissions: ["system:user:page"],
            menus: [
              {
                id: "9007199254740993",
                path: "/system/users",
                title: "用户管理",
                type: "page",
                component: "system/users",
                permission: "system:user:page"
              }
            ]
          };
        return { data: { code: 1000, data, message: "成功" } };
      }
    });
    await t.test(
      "登录映射正式 DTO，资料请求携带新令牌并允许无当前组织",
      async () => {
        const snapshot = await gateway.signIn({
          account: "tester",
          password: "仅测试输入",
          captchaId: "image-id",
          captchaCode: "aB12"
        });
        assert.deepEqual(calls[0].data, {
          username: "tester",
          password: "仅测试输入",
          captchaId: "image-id",
          captchaCode: "aB12"
        });
        assert.equal(calls[0].headers.get("Authorization"), undefined);
        assert.equal(
          calls[1].headers.get("Authorization"),
          "Bearer 测试访问凭据"
        );
        assert.ok(calls.every(call => call.withCredentials));
        assert.equal(snapshot.organizationId, "");
        assert.equal(snapshot.menus[0].key, "menu-9007199254740993");
        const user = useUserStoreHook();
        user.applySession(snapshot);
        const epoch = user.epoch;
        user.applySession({ ...snapshot, authVersion: 3 });
        assert.equal(user.epoch, epoch + 1);
        user.clearSession(false);
      }
    );
    await t.test("图形验证码解包成功信封、绑定账号并支持取消", async () => {
      assert.deepEqual(
        await gateway.challenge(
          "tester",
          "zh-CN",
          new AbortController().signal
        ),
        { id: "image-id", image: "data:image/svg+xml;base64,PHN2Zy8+" }
      );
      assert.deepEqual(calls.at(-1).params, {
        purpose: "login",
        account: "tester"
      });
      const controller = new AbortController();
      controller.abort();
      await assert.rejects(
        gateway.challenge("tester", "en", controller.signal),
        error => error.message === "admin.requestCanceled"
      );
    });
    await t.test(
      "刷新失效只请求一次；退出携带现有令牌或明确使用Cookie",
      async () => {
        unauthorized = true;
        const count = calls.length;
        assert.equal(await gateway.resume(), null);
        assert.equal(calls.length, count + 1);
        unauthorized = false;
        await gateway.signOut();
        assert.equal(calls.at(-1).url, "/admin/auth/logout");
        assert.equal(
          calls.at(-1).headers.get("Authorization"),
          "Bearer 切组织前凭据"
        );
        await gateway.signOut("");
        assert.equal(calls.at(-1).headers.get("Authorization"), undefined);
      }
    );
    await t.test(
      "租户编码绑定出题、登录、刷新和退出；资料保留租户超管身份",
      async () => {
        writeTenantCode(" DEMO ");
        const start = calls.length;
        await gateway.challenge("tester", "zh-CN");
        const snapshot = await gateway.signIn({
          account: "tester",
          password: "仅测试输入",
          captchaId: "image-id",
          captchaCode: "aB12"
        });
        await gateway.refresh();
        await gateway.signOut();
        assert.ok(
          calls
            .slice(start)
            .every(call => call.headers.get("X-Tenant-Code") === "demo")
        );
        assert.deepEqual(snapshot.tenant, {
          id: "2",
          code: "demo",
          name: "演示租户",
          platform: false
        });
        assert.equal(snapshot.superAdmin, true);
        writeTenantCode("");
        await gateway.challenge("tester", "zh-CN");
        assert.equal(calls.at(-1).headers.get("X-Tenant-Code"), undefined);
      }
    );
    await t.test("切组织使用现有令牌；资料失败不返回部分会话", async () => {
      const count = calls.length;
      await gateway.switchOrganization("org-two");
      assert.deepEqual(calls[count].data, { orgId: "org-two" });
      assert.equal(
        calls[count].headers.get("Authorization"),
        "Bearer 切组织前凭据"
      );
      profileFails = true;
      await assert.rejects(
        gateway.refresh(),
        error => error.failure.code === 5003
      );
    });
  } finally {
    await server.close();
  }
});
