import test, { after } from "node:test";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";
const vite = await createServer({
  configFile: false,
  optimizeDeps: { noDiscovery: true, include: [] },
  server: { middlewareMode: true, ws: false },
  resolve: { alias: { "@": fileURLToPath(new URL("../src", import.meta.url)) } }
});
after(() => vite.close());
const { useTimeZones, matchesTimeZone } = await vite.ssrLoadModule(
  "/src/views/system/code-rule/useTimeZones.ts"
);
const { createApiClient } = await vite.ssrLoadModule("/src/api/client.ts");
const { RequestFailure } = await vite.ssrLoadModule("/src/utils/http/index.ts");
const { resetSessionViews } = await vite.ssrLoadModule(
  "/src/platform/lifecycle.ts"
);
const item = {
  value: "America/New_York",
  labelZh: "美洲 / 纽约（America/New_York）",
  labelEn: "New York (America/New_York)",
  common: true
};
test("时区支持中文城市、英文名称与大小写无关的IANA搜索", () => {
  for (const query of ["纽约", "NEW YORK", "america/new_york", "  New York  "])
    assert.equal(matchesTimeZone(item, query), true);
  assert.equal(matchesTimeZone(item, "上海"), false);
});
test("目录失败明确保留错误，重试后加载正式客户端返回的候选项", async () => {
  let fails = true;
  const calls = [];
  const directory = useTimeZones(
    createApiClient({
      request: async (method, url, input) => {
        calls.push({ method, url, input });
        if (fails)
          throw new RequestFailure({ status: 503, message: "目录暂不可用" });
        return { code: 1000, message: "ok", data: { list: [item] } };
      }
    })
  );
  try {
    await directory.load();
    assert.equal(directory.error.value, "目录暂不可用");
    assert.deepEqual(directory.options.value, []);
    fails = false;
    await directory.load();
    assert.equal(directory.error.value, "");
    assert.equal(directory.options.value[0].value, item.value);
    assert(calls.every(c => c.url === "/admin/system/code-rule/timezones"));
  } finally {
    directory.dispose();
  }
});
test("退出或切身份会取消加载，忽略旧响应，不回填其他身份界面", async () => {
  let finish, signal;
  const directory = useTimeZones(
    createApiClient({
      request: (_method, _url, _input, config) => {
        signal = config.signal;
        return new Promise(resolve => {
          finish = resolve;
        });
      }
    })
  );
  try {
    const pending = directory.load();
    resetSessionViews();
    assert.equal(signal.aborted, true);
    finish({ code: 1000, message: "ok", data: { list: [item] } });
    await pending;
    assert.deepEqual(directory.options.value, []);
    assert.equal(directory.error.value, "");
    assert.equal(directory.loading.value, false);
  } finally {
    directory.dispose();
  }
});
