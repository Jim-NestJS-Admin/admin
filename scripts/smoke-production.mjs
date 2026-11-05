import { preview } from "vite";
import assert from "node:assert/strict";
const server = await preview({
  configFile: false,
  preview: { host: "127.0.0.1", port: 8853, strictPort: true }
});
try {
  const root = await fetch("http://127.0.0.1:8853/");
  assert.equal(root.status, 200);
  assert.match(await root.text(), /jim-nestjs-admin/);
  const response = await fetch(
    "http://127.0.0.1:8853/admin/__production_probe"
  );
  assert.ok(
    !response.headers.get("content-type")?.includes("application/json"),
    "静态生产预览不应伪造后台 JSON 响应"
  );
  console.log("生产预览冒烟通过：页面可访问，后台探测没有被 mock 响应");
} finally {
  await new Promise((resolve, reject) =>
    server.httpServer.close(error => (error ? reject(error) : resolve()))
  );
}
