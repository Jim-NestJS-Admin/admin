import test from "node:test";
import assert from "node:assert/strict";
import { generateApi } from "../scripts/api-generator.mjs";

const document = () => ({
  openapi: "3.0.0",
  info: { title: "权限声明契约", version: "1" },
  "x-permissions": ["file:asset:read"],
  paths: {
    "/admin/file/asset/download": {
      post: {
        operationId: "downloadFile",
        "x-permissions": ["file:asset:read"],
        "x-permission": { code: "file:asset:download", risk: "normal" },
        responses: { 200: { description: "ok" } }
      }
    }
  }
});
const source = { revision: "6475933", source: "T06权限声明契约" };

test("T06对象权限扩展与已有数组扩展合并去重，产物有明确权限常量", async () => {
  const files = await generateApi(document(), source);
  const text = files.get("constants.ts");
  assert.match(text, /file:asset:download/);
  assert.match(text, /file:asset:read/);
  assert.equal((text.match(/file:asset:read/g) ?? []).length, 1);
  assert.equal(
    JSON.parse(files.get("manifest.json")).permissionsProvided,
    true
  );
});

test("非法对象权限扩展直接拒绝生成，不静默产出空权限集合", async () => {
  for (const value of [
    null,
    "file:asset:read",
    {},
    { code: "" },
    { code: "file:asset:read", risk: "other" }
  ]) {
    const copy = document();
    copy.paths["/admin/file/asset/download"].post["x-permission"] = value;
    await assert.rejects(generateApi(copy, source), /x-permission/);
  }
});
