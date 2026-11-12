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
const model = await vite.ssrLoadModule("/src/views/form/model.ts");
const { useFormWorkspace } = await vite.ssrLoadModule(
  "/src/views/form/useFormWorkspace.ts"
);
const { createApiClient } = await vite.ssrLoadModule("/src/api/client.ts");
const { RequestFailure } = await vite.ssrLoadModule("/src/utils/http/index.ts");
const { resetSessionViews } = await vite.ssrLoadModule(
  "/src/platform/lifecycle.ts"
);
const designer = () => ({
  schemaVersion: 1,
  rule: [{ type: "input", field: "reason", title: "原因", $required: false }],
  option: {},
  linkages: []
});
const field = (key, extra = {}) => ({
  field: key,
  title: key,
  component: "input",
  type: "string",
  required: false,
  visible: true,
  multiple: false,
  multilingual: false,
  queryable: true,
  options: [],
  validation: {},
  ...extra
});
const fields = [field("reason")];
const record = (id = "1", revision = 1) => ({
  id,
  revision,
  version: 1,
  code: "leave_request",
  name: "请假",
  designer: designer(),
  fields,
  createdAt: "2026-11-12T00:00:00Z",
  updatedAt: "2026-11-12T00:00:00Z",
  createdBy: null,
  updatedBy: null,
  orgId: null
});
const ok = data => ({ code: 1000, message: "ok", data });
function client(handler) {
  return createApiClient({
    request: async (method, url, params, config) =>
      handler({ method, url, body: params.data, config })
  });
}

test("设计器标记移除但未知配置不会静默丢失，结构化粘贴可在解释前识别", () => {
  const raw = [
    {
      ...designer().rule[0],
      name: "ref_generated",
      _fc_id: "editor-1",
      _fc_drag_tag: "input",
      unknown: { value: 1 }
    }
  ];
  const safe = model.exportRules(raw);
  assert.equal(safe[0]._fc_id, undefined);
  assert.equal(safe[0].name, undefined);
  assert.deepEqual(safe[0].unknown, { value: 1 });
  assert.throws(() => model.exportRules([{ type: "input", onChange() {} }]));
  assert.throws(() =>
    model.exportRules([{ type: "input", props: { formatter() {} } }])
  );
  assert.throws(() =>
    model.exportRules(JSON.parse('[{"type":"input","__proto__":{}}]'))
  );
  assert.equal(model.isDesignerClipboard('FormCreate:{"on":"script"}'), true);
  assert.equal(model.isDesignerClipboard("普通字段说明"), false);
  assert.equal(raw[0]._fc_id, "editor-1");
  assert.deepEqual(
    model.exportRules([
      { type: "input", value: undefined, props: { min: undefined } }
    ]),
    [{ type: "input", props: {} }]
  );
});

test("显示、必填、选项联动与隐藏来源处理一致，预览不修改原始定义", () => {
  assert.equal(model.comparisonValue(field("number", { type: "number" })), 0);
  assert.equal(
    model.comparisonValue(field("boolean", { type: "boolean" })),
    false
  );
  const definitions = [
    field("kind"),
    field("company"),
    field("city", {
      component: "select",
      options: [
        { label: "甲", value: "a" },
        { label: "乙", value: "b" }
      ]
    })
  ];
  const links = [
    {
      source: "kind",
      target: "company",
      operator: "eq",
      value: "company",
      action: "visible",
      whenTrue: true,
      whenFalse: false
    },
    {
      source: "kind",
      target: "company",
      operator: "eq",
      value: "company",
      action: "required",
      whenTrue: true,
      whenFalse: false
    },
    {
      source: "company",
      target: "city",
      operator: "eq",
      value: "偷填",
      action: "options",
      whenTrue: [{ label: "乙", value: "b" }],
      whenFalse: [{ label: "甲", value: "a" }]
    }
  ];
  const original = JSON.stringify(definitions);
  const effective = model.effectiveFields(definitions, links, {
    kind: "person",
    company: "偷填",
    city: "b"
  });
  assert.equal(effective[1].visible, false);
  assert.deepEqual(effective[2].options, [{ label: "甲", value: "a" }]);
  assert.deepEqual(
    model.cleanPreviewValues(effective, {
      kind: "person",
      company: "偷填",
      city: "b",
      injected: 1
    }),
    { kind: "person" }
  );
  assert.equal(JSON.stringify(definitions), original);
  const input = designer();
  input.rule[0].validate = [{ required: true, max: 10 }];
  const preview = model.previewRules(input, fields, {});
  assert.equal(preview.rules[0].$required, false);
  assert.deepEqual(preview.rules[0].validate, [{ max: 10 }]);
  assert.equal(input.rule[0].validate[0].required, true);
});

test("真实生成客户端先检查再创建；原样重试使用同幂等键，改内容换键", async () => {
  const calls = [];
  const workspace = useFormWorkspace(
    client(async call => {
      calls.push(call);
      if (call.url.endsWith("/inspect"))
        return ok({ designer: call.body.designer, fields });
      if (calls.filter(item => item.url.endsWith("/add")).length < 3)
        throw new RequestFailure({
          status: 400,
          message: "名称有误",
          data: { errors: [{ field: "data.name", messages: ["名称有误"] }] }
        });
      return ok(record());
    })
  );
  try {
    await workspace.open(null, "create");
    workspace.editor.code = "leave_request";
    workspace.editor.name = "请假";
    assert.equal(await workspace.save(designer()), false);
    assert.equal(workspace.editor.open, true);
    assert.deepEqual(workspace.editor.issues, [
      { field: "data.name", messages: ["名称有误"] }
    ]);
    assert.equal(await workspace.save(designer()), false);
    workspace.editor.name = "请假新版";
    assert.equal(await workspace.save(designer()), true);
    const writes = calls.filter(call => call.url.endsWith("/add"));
    assert.equal(
      writes[0].config.headers["Idempotency-Key"],
      writes[1].config.headers["Idempotency-Key"]
    );
    assert.notEqual(
      writes[1].config.headers["Idempotency-Key"],
      writes[2].config.headers["Idempotency-Key"]
    );
    assert.deepEqual(writes[2].body, {
      data: { code: "leave_request", name: "请假新版", designer: designer() }
    });
    assert.equal(workspace.editor.mode, "view");
    assert.equal(calls[0].url, "/admin/form/definition/inspect");
  } finally {
    workspace.dispose();
  }
});

test("修订409保留草稿与基版，不自动改成最新版或覆盖旧版本", async () => {
  let sent;
  const workspace = useFormWorkspace(
    client(async call => {
      if (call.url.endsWith("/info")) return ok(record("10", 2));
      if (call.url.endsWith("/inspect"))
        return ok({ designer: call.body.designer, fields });
      sent = call;
      throw new RequestFailure({ status: 409, message: "版本冲突" });
    })
  );
  try {
    await workspace.open(record("10", 2), "revise");
    workspace.editor.name = "本地草稿";
    assert.equal(await workspace.save(designer()), false);
    assert.equal(workspace.editor.conflict, true);
    assert.equal(workspace.editor.name, "本地草稿");
    assert.equal(workspace.editor.record.revision, 2);
    assert.equal(sent.url, "/admin/form/definition/revise");
    assert.equal(sent.body.baseRevision, 2);
  } finally {
    workspace.dispose();
  }
});

test("主动载入最新版本先按编码查询，再读取固定版本详情", async () => {
  const calls = [];
  const workspace = useFormWorkspace(
    client(async call => {
      calls.push(call);
      if (call.url.endsWith("/page"))
        return ok({ list: [record("20", 3)], total: 1 });
      return ok(record(call.body.id, call.body.id === "20" ? 3 : 2));
    })
  );
  try {
    await workspace.open(record("10", 2), "revise");
    assert.equal(await workspace.latest(), true);
    assert.deepEqual(calls[1].body.eq, { code: "leave_request" });
    assert.equal(workspace.editor.record.id, "20");
    assert.equal(workspace.editor.mode, "revise");
  } finally {
    workspace.dispose();
  }
});

test("会话切换中止请求并清空草稿，迟到响应不能写入新租户页面", async () => {
  let release, signal;
  const workspace = useFormWorkspace(
    client(call => {
      signal = call.config.signal;
      return new Promise(resolve => {
        release = resolve;
      });
    })
  );
  try {
    workspace.editor.code = "旧租户草稿";
    workspace.search.value = "旧租户";
    const pending = workspace.load();
    resetSessionViews();
    assert.equal(signal.aborted, true);
    release(ok({ list: [record()], total: 1 }));
    await pending;
    assert.deepEqual(workspace.records.value, []);
    assert.equal(workspace.editor.code, "");
    assert.equal(workspace.search.value, "");
    assert.equal(workspace.loading.value, false);
  } finally {
    workspace.dispose();
  }
});

test("检查失败时不创建；详情被字段权限裁剪时不打开设计器", async () => {
  let writes = 0;
  const workspace = useFormWorkspace(
    client(async call => {
      if (call.url.endsWith("/info"))
        return ok({ ...record(), designer: undefined });
      if (call.url.endsWith("/inspect"))
        throw new RequestFailure({ status: 400, message: "不允许脚本" });
      writes++;
      return ok(record());
    })
  );
  try {
    await workspace.open(record(), "view");
    assert.equal(workspace.editor.open, false);
    assert.equal(workspace.listError.value, "forms.unavailable");
    await workspace.open(null, "create");
    assert.equal(await workspace.save(designer()), false);
    assert.equal(writes, 0);
  } finally {
    workspace.dispose();
  }
});

test("上一会话的检查错误不能污染重开的编辑器", async () => {
  let reject;
  const workspace = useFormWorkspace(
    client(
      () =>
        new Promise((_resolve, fail) => {
          reject = fail;
        })
    )
  );
  try {
    await workspace.open(null, "create");
    const pending = workspace.check(designer());
    resetSessionViews();
    await workspace.open(null, "create");
    workspace.editor.name = "新会话草稿";
    reject(new RequestFailure({ status: 400, message: "旧会话错误" }));
    await pending;
    assert.equal(workspace.editor.error, "");
    assert.equal(workspace.editor.name, "新会话草稿");
    assert.equal(workspace.busy.value, false);
  } finally {
    workspace.dispose();
  }
});
