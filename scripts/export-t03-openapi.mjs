// 仅在 Codex 独立 server 审查 worktree 运行，不加载 AppModule、不连接数据库。
import { readFileSync, writeFileSync, mkdirSync, unlinkSync } from "node:fs";
import { resolve, join } from "node:path";
import { pathToFileURL } from "node:url";
import { createRequire } from "node:module";
import { spawnSync } from "node:child_process";
const serverRoot = resolve(process.argv[2] ?? "../server-review-t03");
const git = spawnSync(
  "git",
  [
    "-c",
    `safe.directory=${serverRoot.replaceAll("\\", "/")}`,
    "-C",
    serverRoot,
    "rev-parse",
    "HEAD"
  ],
  { encoding: "utf8" }
);
if (git.status !== 0) throw new Error("无法确定后端提交，拒绝导出无来源契约");
const commit = git.stdout.trim();
const config = join(serverRoot, ".t12-fixture-tsconfig.json");
writeFileSync(
  config,
  JSON.stringify({
    extends: "./tsconfig.json",
    include: ["src/**/*.ts", "test/fixtures/demo-resources.ts"],
    exclude: ["dist", "node_modules"],
    compilerOptions: {
      outDir: "./dist/t12-contract",
      incremental: false,
      declaration: false,
      sourceMap: false
    }
  }),
  { flag: "wx" }
);
try {
  const build = spawnSync(
    process.execPath,
    [join(serverRoot, "node_modules/typescript/bin/tsc"), "-p", config],
    { cwd: serverRoot, stdio: "inherit" }
  );
  if (build.status !== 0) throw new Error("后端测试资源编译失败");
} finally {
  unlinkSync(config);
}
const backendRequire = createRequire(join(serverRoot, "package.json"));
backendRequire("reflect-metadata");
const { Test } = backendRequire("@nestjs/testing");
const source = relative =>
  import(pathToFileURL(join(serverRoot, "dist/t12-contract", relative)).href);
const fixtures = await source("test/fixtures/demo-resources.js");
const { CrudRuntime } = await source("src/core/crud/crud.runtime.js");
const { buildOpenApiDocument, stableStringify } = await source(
  "src/core/swagger/swagger.js"
);
const module = await Test.createTestingModule({
  controllers: [fixtures.DemoUserController, fixtures.DemoLogController],
  providers: [
    fixtures.DemoUserService,
    {
      provide: CrudRuntime,
      useValue: { dataSource: {}, scope: {}, context: {}, register() {} }
    }
  ]
}).compile();
const app = module.createNestApplication();
try {
  await app.init();
  const pkg = JSON.parse(
    readFileSync(join(serverRoot, "package.json"), "utf8")
  );
  const document = buildOpenApiDocument(app, pkg.version);
  mkdirSync("test/fixtures", { recursive: true });
  writeFileSync("test/fixtures/t03-openapi.json", stableStringify(document));
  writeFileSync(
    "test/fixtures/t03-provenance.json",
    JSON.stringify(
      {
        serverCommit: commit,
        source: "test/fixtures/demo-resources.ts",
        databaseConnected: false
      },
      null,
      2
    ) + "\n"
  );
  console.log(`已导出 T03 测试资源，后端 ${commit.slice(0, 7)}，未连接数据库`);
} finally {
  await app.close();
}
