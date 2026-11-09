import test from "node:test";
import assert from "node:assert/strict";
import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  unlinkSync,
  rmdirSync
} from "node:fs";
import { resolve } from "node:path";
import { createServer } from "vite";
import { fileURLToPath } from "node:url";
import ts from "typescript";
import { generateApi } from "../scripts/api-generator.mjs";
const schema = JSON.parse(
  readFileSync(new URL("./fixtures/t03-openapi.json", import.meta.url), "utf8")
);
const provenance = JSON.parse(
  readFileSync(
    new URL("./fixtures/t03-provenance.json", import.meta.url),
    "utf8"
  )
);
const source = {
  source: "test/fixtures/t03-openapi.json",
  revision: provenance.serverCommit
};
test("二进制成功响应走原始Blob，JSON及二进制错误响应不改变传输模式", async () => {
  const document = {
    openapi: "3.0.0",
    info: { title: "下载契约", version: "1" },
    paths: Object.fromEntries(
      ["csv", "zip", "json"].map(kind => [
        `/admin/${kind}`,
        {
          get: {
            operationId: kind,
            responses: {
              200: {
                description: "成功",
                content: {
                  [kind === "json"
                    ? "application/json"
                    : kind === "zip"
                      ? "application/zip"
                      : "text/csv"]: {
                    schema:
                      kind === "json"
                        ? { type: "object" }
                        : { type: "string", format: "binary" }
                  }
                }
              },
              400: {
                description: "错误",
                content: {
                  "application/octet-stream": {
                    schema: { type: "string", format: "binary" }
                  }
                }
              }
            }
          }
        }
      ])
    )
  };
  const files = await generateApi(document, source);
  const compiled = ts.transpileModule(
    files
      .get("client.ts")
      .replace('import { http } from "@/utils/http";', "const http = {};"),
    { compilerOptions: { module: ts.ModuleKind.CommonJS } }
  ).outputText;
  const exports = {};
  new Function("exports", compiled)(exports);
  const calls = [];
  const api = exports.createApiClient({
    request: (...args) => calls.push(args)
  });
  for (const kind of ["csv", "zip", "json"])
    api[kind]({}, { headers: { "X-Request-Id": "fixture" } });
  for (const call of calls.slice(0, 2)) {
    assert.equal(call[3].responseType, "blob");
    assert.equal(call[3].responseMode, "raw");
    assert.deepEqual(call[3].headers, { "X-Request-Id": "fixture" });
  }
  assert.equal(calls[2][3].responseType, undefined);
  assert.equal(calls[2][3].responseMode, undefined);
});
test("正式生成文件与版本化输入快照完全一致，CI 无需克隆后端", async () => {
  const document = JSON.parse(
    readFileSync(new URL("../api-source/admin.json", import.meta.url), "utf8")
  );
  const manifest = JSON.parse(
    readFileSync(new URL("../src/api/manifest.json", import.meta.url), "utf8")
  );
  const files = await generateApi(document, {
    source: manifest.source,
    revision: manifest.revision
  });
  for (const [name, text] of files)
    assert.equal(
      readFileSync(
        new URL("../src/api/" + name, import.meta.url),
        "utf8"
      ).replaceAll("\r\n", "\n"),
      text
    );
});
test("T03 实际测试资源生成可编译类型，并调用现有请求接口", async () => {
  const files = await generateApi(schema, source);
  assert.equal(
    JSON.parse(files.get("manifest.json")).operationCount,
    Object.values(schema.paths).reduce(
      (sum, path) =>
        sum +
        Object.keys(path).filter(method =>
          ["get", "post", "put", "patch", "delete"].includes(method)
        ).length,
      0
    )
  );
  assert.deepEqual(files, await generateApi(schema, source));
  const folder = fileURLToPath(
    new URL("./generated-contract", import.meta.url)
  );
  mkdirSync(folder, { recursive: true });
  for (const [name, contents] of files)
    writeFileSync(resolve(folder, name), contents);
  const consumer = `import { createApiClient } from "./client";
const api = createApiClient();
void api.testDemoUserAdd({ body: { data: { username: "alpha", nickname: "姓名" } } });
// @ts-expect-error 编号只能传字符串，版本必须有
void api.testDemoUserUpdate({ body: { id: 1, data: { nickname: "姓名" } } });
// @ts-expect-error 主体 DTO 里没有这个字段
void api.testDemoUserAdd({ body: { data: { nonexistent: true } } });
// @ts-expect-error 没有开放的操作不能调用
void api.testDemoLogUpdate({ body: {} });
`;
  writeFileSync(resolve(folder, "consumer.ts"), consumer);
  const vite = await createServer({
    configFile: false,
    optimizeDeps: { noDiscovery: true, include: [] },
    server: { middlewareMode: true, ws: false },
    resolve: {
      alias: { "@": fileURLToPath(new URL("../src", import.meta.url)) }
    }
  });
  try {
    const { createApiClient } = await vite.ssrLoadModule(
      "/test/generated-contract/client.ts"
    );
    const calls = [];
    const api = createApiClient({
      request: async (...args) => {
        calls.push(args);
        return { code: 1000, data: { id: "1" } };
      }
    });
    await api.testDemoUserUpdate(
      { body: { id: "1", version: 1, data: { nickname: "新名" } } },
      { headers: { "Idempotency-Key": "synthetic-key" } }
    );
    assert.equal(calls[0][0], "post");
    assert.equal(calls[0][1], "/admin/test/demo-user/update");
    assert.equal(calls[0][2].data.version, 1);
    assert.equal(calls[0][3].headers["Idempotency-Key"], "synthetic-key");
    const configPath = fileURLToPath(
      new URL("../tsconfig.json", import.meta.url)
    );
    const config = ts.readConfigFile(configPath, ts.sys.readFile);
    const parsed = ts.parseJsonConfigFileContent(
      config.config,
      ts.sys,
      resolve(folder, "../..")
    );
    const program = ts.createProgram([resolve(folder, "consumer.ts")], {
      ...parsed.options,
      noEmit: true
    });
    const errors = ts.getPreEmitDiagnostics(program);
    assert.equal(
      errors.length,
      0,
      ts.formatDiagnosticsWithColorAndContext(errors, {
        getCurrentDirectory: () => process.cwd(),
        getCanonicalFileName: path => path,
        getNewLine: () => "\n"
      })
    );
  } finally {
    await vite.close();
    for (const name of [...files.keys(), "consumer.ts"])
      unlinkSync(resolve(folder, name));
    rmdirSync(folder);
  }
});
test("从声明生成权限和枚举，不从路由猜权限", async () => {
  const copy = structuredClone(schema);
  copy["x-permissions"] = ["test:demo:read"];
  copy["x-scopes"] = ["test:read"];
  const files = await generateApi(copy, source);
  assert.match(files.get("constants.ts"), /test:demo:read/);
  assert.match(files.get("constants.ts"), /enabled/);
  const empty = await generateApi(
    { openapi: "3.0.0", info: { title: "空骨架", version: "1" }, paths: {} },
    source
  );
  assert.equal(
    JSON.parse(empty.get("manifest.json")).permissionsProvided,
    false
  );
});
test("重复 operationId、悬空或外部引用、非后台路径和缺来源一律拒绝", async () => {
  const duplicate = structuredClone(schema);
  duplicate.paths["/admin/test/demo-user/add"].post.operationId =
    duplicate.paths["/admin/test/demo-user/update"].post.operationId;
  await assert.rejects(generateApi(duplicate, source), /重复/);
  for (const ref of [
    "#/components/schemas/Missing",
    "https://example.invalid/model"
  ]) {
    const copy = structuredClone(schema);
    copy.components.schemas.Bad = { $ref: ref };
    await assert.rejects(generateApi(copy, source), /引用/);
  }
  await assert.rejects(
    generateApi({ ...schema, paths: { "/web/private": {} } }, source),
    /路径/
  );
  await assert.rejects(generateApi(schema, { source: "unknown" }), /提交号/);
});

test("路径参数引用与 multipart 请求体引用可生成可执行调用", async () => {
  const document = {
    openapi: "3.0.0",
    info: { title: "生成器边界测试", version: "1" },
    paths: {
      "/admin/files/{fileId}": {
        post: {
          operationId: "uploadFile",
          parameters: [{ $ref: "#/components/parameters/FileId" }],
          requestBody: { $ref: "#/components/requestBodies/Upload" },
          responses: {
            200: {
              description: "ok",
              content: { "application/json": { schema: { type: "object" } } }
            }
          }
        }
      }
    },
    components: {
      parameters: {
        FileId: {
          in: "path",
          name: "fileId",
          required: true,
          schema: { type: "string" }
        }
      },
      requestBodies: {
        Upload: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                required: ["file"],
                properties: { file: { type: "string", format: "binary" } }
              }
            }
          }
        }
      }
    }
  };
  const files = await generateApi(document, source);
  assert.match(files.get("schema.d.ts"), /file: Blob/);
  const folder = fileURLToPath(new URL("./generated-upload", import.meta.url));
  mkdirSync(folder, { recursive: true });
  for (const [name, text] of files) writeFileSync(resolve(folder, name), text);
  const vite = await createServer({
    configFile: false,
    optimizeDeps: { noDiscovery: true, include: [] },
    server: { middlewareMode: true, ws: false },
    resolve: {
      alias: { "@": fileURLToPath(new URL("../src", import.meta.url)) }
    }
  });
  try {
    const { createApiClient } = await vite.ssrLoadModule(
      "/test/generated-upload/client.ts"
    );
    let call;
    const api = createApiClient({
      request: async (...args) => {
        call = args;
      }
    });
    await api.uploadFile({
      path: { fileId: "a/b" },
      body: { file: new Blob(["内容"]) }
    });
    assert.equal(call[1], "/admin/files/a%2Fb");
    assert.ok(call[2].data instanceof FormData);
    assert.equal(await call[2].data.get("file").text(), "内容");
    assert.throws(() => api.uploadFile({ body: {} }), /路径参数/);
  } finally {
    await vite.close();
    for (const name of files.keys()) unlinkSync(resolve(folder, name));
    rmdirSync(folder);
  }
});
