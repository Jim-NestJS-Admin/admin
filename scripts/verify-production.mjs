import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { resolve } from "node:path";
export function assertProduction(text) {
  if (
    /vite-plugin-fake-server|vitePluginFakeServer|enableProd\s*:\s*true|admin123|fake-user|\/mock\/|synthetic-browser-only|组件验收台|test\/crud-browser/i.test(
      text
    )
  )
    throw new Error("生产产物含演示认证或 mock 标记");
}
function walk(root) {
  return readdirSync(root).flatMap(name => {
    const path = resolve(root, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}
export function verify(root = process.cwd()) {
  assertProduction(readFileSync(resolve(root, "build/plugins.ts"), "utf8"));
  for (const file of walk(resolve(root, "src")))
    if (/\.(ts|tsx|vue|mjs)$/.test(file))
      assertProduction(readFileSync(file, "utf8"));
  if (!existsSync(resolve(root, "dist/index.html")))
    throw new Error("缺少生产构建，请先运行 build");
  for (const file of walk(resolve(root, "dist")))
    if (/\.(js|html)$/.test(file)) assertProduction(readFileSync(file, "utf8"));
  console.log("生产插件配置与实际 JS/HTML 产物检查通过");
}
if (
  process.argv[1] &&
  resolve(process.argv[1]) === resolve(import.meta.filename)
)
  verify();
