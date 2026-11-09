import test from "node:test";
import assert from "node:assert/strict";
import { createServer } from "vite";
test("字段编辑往返保留安全设置，拒绝重复名称与损坏JSON", async () => {
  const server = await createServer({
    configFile: false,
    server: { middlewareMode: true, ws: false }
  });
  try {
    const { readColumns, writeColumns } = await server.ssrLoadModule(
      "/src/views/dev/codegen-draft.ts"
    );
    const rows = readColumns([
      {
        name: "phone",
        column: "phone",
        label: "手机号",
        type: "string",
        fieldPerm: { default: "masked", mask: "phone" }
      }
    ]);
    rows[0].label = "联系电话";
    const [output] = writeColumns(rows);
    assert.deepEqual(output.fieldPerm, { default: "masked", mask: "phone" });
    assert.equal(output.label, "联系电话");
    assert.throws(
      () => writeColumns([...rows, { ...rows[0], key: "other" }]),
      /invalidFields/
    );
    rows[0].security = "function(){ }";
    assert.throws(() => writeColumns(rows));
  } finally {
    await server.close();
  }
});
