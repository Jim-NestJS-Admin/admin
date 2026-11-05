import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  existsSync,
  realpathSync,
  lstatSync
} from "node:fs";
import { resolve, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { parseArgs } from "node:util";
import { generateApi, schemaDigest } from "./api-generator.mjs";
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const { values } = parseArgs({
  options: {
    input: { type: "string" },
    "source-revision": { type: "string" },
    check: { type: "boolean" }
  },
  strict: true
});
let input = values.input ?? resolve(root, "../server/openapi/admin.json");
let revision = values["source-revision"];
let recordedSource;
if (!values.input && !existsSync(input)) {
  const manifest = JSON.parse(
    readFileSync(resolve(root, "src/api/manifest.json"), "utf8")
  );
  input = resolve(root, "api-source/admin.json");
  revision ??= manifest.revision;
  recordedSource = manifest.source;
}
let text, source;
if (/^https?:\/\//.test(input)) {
  const url = new URL(input);
  if (url.username || url.password || url.search || url.hash)
    throw Error("契约地址不能带凭据、查询参数或片段");
  if (!revision)
    throw Error("远程契约必须显式指定 --source-revision 后端提交号");
  const response = await fetch(url, {
    signal: AbortSignal.timeout(10000),
    redirect: "error"
  });
  if (!response.ok) throw Error("接口文档下载失败");
  text = await response.text();
  source = url.href;
} else {
  const path = resolve(root, input);
  text = readFileSync(path, "utf8");
  source = relative(root, path).replaceAll("\\", "/");
  if (!revision) {
    const git = spawnSync(
      "git",
      [
        "-c",
        `safe.directory=${dirname(path).replaceAll("\\", "/")}`,
        "-C",
        dirname(path),
        "rev-parse",
        "HEAD"
      ],
      { encoding: "utf8" }
    );
    if (git.status !== 0)
      throw Error("无法确认契约来源，请指定 --source-revision");
    revision = git.stdout.trim();
  }
}
source = recordedSource ?? source;
if (Buffer.byteLength(text) > 5 * 1024 * 1024)
  throw Error("契约文档超过 5 MiB 上限");
const document = JSON.parse(text.replace(/^\uFEFF/, ""));
if (
  values.check &&
  !values["source-revision"] &&
  existsSync(resolve(root, "src/api/manifest.json"))
) {
  const recorded = JSON.parse(
    readFileSync(resolve(root, "src/api/manifest.json"), "utf8")
  );
  // 后端有新提交但契约未变时，保留当时实际生成的来源提交，不制造无关漂移。
  if (
    recorded.source === source &&
    recorded.schemaSha256 === schemaDigest(document)
  )
    revision = recorded.revision;
}
const files = await generateApi(document, {
  source,
  revision
});
const output = resolve(root, "src/api");
mkdirSync(output, { recursive: true });
if (realpathSync(output) !== output || lstatSync(output).isSymbolicLink())
  throw Error("生成目录不能通过链接指向外部");
for (const [name, value] of files) {
  const path = resolve(output, name);
  if (existsSync(path) && lstatSync(path).isSymbolicLink())
    throw Error("不覆盖符号链接");
  const existing = existsSync(path)
    ? readFileSync(path, "utf8").replaceAll("\r\n", "\n")
    : undefined;
  if (
    existing !== undefined &&
    name === "manifest.json" &&
    JSON.parse(existing).generator !== "openapi-typescript"
  )
    throw Error("不覆盖不属于生成器的 manifest");
  if (
    existing !== undefined &&
    name !== "manifest.json" &&
    !existing.startsWith("// 此文件由 pnpm gen:api 生成")
  )
    throw Error(`不覆盖手写文件：${name}`);
  if (values.check) {
    if (existing !== value)
      throw Error(`生成结果过期：${name}，请执行 pnpm gen:api`);
  }
}
if (!values.check)
  for (const [name, value] of files)
    writeFileSync(resolve(output, name), value);
const snapshotDirectory = resolve(root, "api-source");
const snapshot = resolve(snapshotDirectory, "admin.json");
const snapshotContents =
  JSON.stringify(JSON.parse(text.replace(/^\uFEFF/, "")), null, 2) + "\n";
if (values.check) {
  if (
    !existsSync(snapshot) ||
    JSON.stringify(JSON.parse(readFileSync(snapshot, "utf8"))) !==
      JSON.stringify(JSON.parse(text.replace(/^\uFEFF/, "")))
  )
    throw Error("接口源快照过期，请执行 pnpm gen:api");
} else {
  mkdirSync(snapshotDirectory, { recursive: true });
  if (
    realpathSync(snapshotDirectory) !== snapshotDirectory ||
    (existsSync(snapshot) && lstatSync(snapshot).isSymbolicLink())
  )
    throw Error("契约快照不能写到链接目标");
  writeFileSync(snapshot, snapshotContents);
}
console.log(
  `接口生成${values.check ? "一致性检查" : ""}完成；权限元数据${JSON.parse(files.get("manifest.json")).permissionsProvided ? "已提供" : "尚未提供，不推导权限码"}`
);
