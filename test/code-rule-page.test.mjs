import test, { after } from "node:test";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";
const vite = await createServer({ configFile: false, optimizeDeps: { noDiscovery: true, include: [] }, server: { middlewareMode: true, ws: false }, resolve: { alias: { "@": fileURLToPath(new URL("../src", import.meta.url)) } } });
after(() => vite.close());
const { scopedSequencePort, copyRuleDraft } = await vite.ssrLoadModule("/src/views/system/code-rule/rule-page.ts");
test("复制为新规则只保留配置，独立深拷贝，不带编码、名称、修订和发号状态", () => {
  const source = { id: "9", version: 6, code: "old_code", name: "旧规则", revision: 3, firstBoundAt: "2026-11-13", firstBoundUsageKey: "customer_no", status: "disabled", current: "100", description: "说明", timezone: "Asia/Shanghai", resetPeriod: "never", start: "1", segments: [{ type: "literal", value: "a_" }, { type: "sequence", width: 6 }] };
  const copied = copyRuleDraft(source);
  assert.deepEqual(Object.keys(copied).sort(), ["description", "resetPeriod", "segments", "start", "timezone"]);
  copied.segments[0].value = "b_";
  assert.equal(source.segments[0].value, "a_");
});
test("序号抽屉始终限定当前规则，保留关键词、周期、分页与取消信号", async () => {
  const calls = [];
  const base = { list: async (query, signal) => { calls.push({ query, signal }); return { rows: [], totalRows: 0 }; } };
  const port = scopedSequencePort(base, "12");
  const signal = new AbortController().signal;
  const query = { pageNumber: 2, pageSize: 20, search: "202611", equality: { ruleId: "99", periodKey: "20261113" }, sorting: [] };
  await port.list(query, signal);
  assert.deepEqual(calls[0].query, { ...query, equality: { ruleId: "12", periodKey: "20261113" } });
  assert.equal(calls[0].signal, signal);
  assert.equal(query.equality.ruleId, "99");
  await port.list({ ...query, search: "", equality: {} }, signal);
  assert.deepEqual(calls[1].query.equality, { ruleId: "12" });
});
