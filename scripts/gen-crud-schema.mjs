import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { format } from "prettier";
import { generateApi } from "./api-generator.mjs";
const root = new URL("../", import.meta.url);
const document = JSON.parse(
  readFileSync(new URL("api-source/crud-schema.json", root), "utf8")
);
const files = await generateApi(document, {
  source: "T03 framework schema subset (test/fixtures/t03-openapi.json)",
  revision: JSON.parse(
    readFileSync(new URL("test/fixtures/t03-provenance.json", root), "utf8")
  ).serverCommit
});
const manifest = JSON.parse(files.get("manifest.json"));
manifest.files = ["crud-schema.d.ts", "crud-schema.manifest.json"];
for (const [name, value] of [
  ["crud-schema.d.ts", files.get("schema.d.ts")],
  [
    "crud-schema.manifest.json",
    await format(JSON.stringify(manifest), {
      parser: "json",
      trailingComma: "none"
    })
  ]
]) {
  const path = new URL(`src/api/${name}`, root);
  if (process.argv.includes("--check")) {
    if (readFileSync(path, "utf8").replaceAll("\r\n", "\n") !== value)
      throw Error(`框架契约未同步：${name}`);
  } else writeFileSync(fileURLToPath(path), value);
}
