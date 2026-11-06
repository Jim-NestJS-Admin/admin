import openapiTS, { astToString } from "openapi-typescript";
import { createHash } from "node:crypto";
import { format, resolveConfig } from "prettier";
import ts from "typescript";
import { fileURLToPath } from "node:url";
const header = "// 此文件由 pnpm gen:api 生成，禁止手改。\n";
const methods = new Set([
  "get",
  "post",
  "put",
  "patch",
  "delete",
  "options",
  "head"
]);
const reserved = new Set(["__proto__", "constructor", "prototype"]);
const stable = value =>
  Array.isArray(value)
    ? value.map(stable)
    : value && typeof value === "object"
      ? Object.fromEntries(
          Object.keys(value)
            .sort()
            .map(key => [key, stable(value[key])])
        )
      : value;
const literal = value => JSON.stringify(value);
export const schemaDigest = document =>
  createHash("sha256")
    .update(JSON.stringify(stable(document)))
    .digest("hex");
function dereference(value, document) {
  let current = value;
  for (let depth = 0; current?.$ref; depth++) {
    if (depth > 20) throw Error("参数或请求体引用存在循环");
    current = current.$ref
      .slice(2)
      .split("/")
      .map(part =>
        decodeURIComponent(part).replaceAll("~1", "/").replaceAll("~0", "~")
      )
      .reduce((node, key) => node[key], document);
  }
  return current;
}
export function validateDocument(document) {
  if (
    !/^3\.(0|1)\./.test(document?.openapi ?? "") ||
    !document.paths ||
    typeof document.paths !== "object"
  )
    throw Error("只接受带 paths 的 OpenAPI 3.0/3.1 JSON 文档");
  const walk = value => {
    if (!value || typeof value !== "object") return;
    if (typeof value.$ref === "string") {
      if (!value.$ref.startsWith("#/"))
        throw Error("不接受外部引用，请先由后端导出完整文档");
      let target = document;
      for (const key of value.$ref
        .slice(2)
        .split("/")
        .map(part =>
          decodeURIComponent(part).replaceAll("~1", "/").replaceAll("~0", "~")
        )) {
        if (!target || !Object.hasOwn(target, key))
          throw Error(`悬空引用：${value.$ref}`);
        target = target[key];
      }
    }
    Object.values(value).forEach(walk);
  };
  walk(document);
  const ids = new Set();
  for (const [path, item] of Object.entries(document.paths)) {
    if (item.$ref) throw Error("请先展开路径项引用，不能静默漏掉接口");
    if (
      !path.startsWith("/admin/") ||
      path.includes("..") ||
      path.includes("\\") ||
      path.includes("?") ||
      path.includes("#")
    )
      throw Error(`后台接口路径不合法：${path}`);
    for (const [method, operation] of Object.entries(item)) {
      if (!methods.has(method)) continue;
      const id = operation.operationId;
      if (
        !/^[A-Za-z_$][\w$]*$/.test(id ?? "") ||
        reserved.has(id) ||
        ids.has(id)
      )
        throw Error(`operationId 缺失、不合法或重复：${id ?? path}`);
      ids.add(id);
    }
  }
}
function strings(value) {
  if (value === undefined) return [];
  if (!Array.isArray(value) || value.some(item => typeof item !== "string"))
    throw Error("x-permissions / x-scopes 必须是字符串数组");
  return value;
}
// T06 的正式权限声明是 { code, risk }；同时保留早期字符串数组扩展的兼容。
function permissionCodes(value) {
  const codes = strings(value["x-permissions"]);
  const single = value["x-permission"];
  if (single === undefined) return codes;
  if (
    !single ||
    typeof single !== "object" ||
    Array.isArray(single) ||
    typeof single.code !== "string" ||
    !/^[a-z][a-z0-9-]*(:[a-z][a-z0-9-]*)+$/.test(single.code) ||
    (single.risk !== undefined && !["normal", "high"].includes(single.risk))
  )
    throw Error("x-permission 必须包含合法 code，risk 只能是 normal 或 high");
  return [...codes, single.code];
}
export async function generateApi(input, provenance) {
  const document = stable(input);
  validateDocument(document);
  if (!/^[a-f0-9]{7,40}$/i.test(provenance.revision ?? ""))
    throw Error("必须记录有效的后端 Git 提交号");
  const operations = [];
  let multipartUsed = false;
  const permissions = new Set(permissionCodes(document));
  const operationPermissions = {};
  const scopes = new Set(strings(document["x-scopes"]));
  const enums = {};
  const collect = (value, path = []) => {
    if (!value || typeof value !== "object") return;
    if (Array.isArray(value.enum)) enums[path.join(".")] = value.enum;
    for (const [key, child] of Object.entries(value))
      collect(child, [...path, key]);
  };
  collect(document.components?.schemas, ["components", "schemas"]);
  for (const scheme of Object.values(
    document.components?.securitySchemes ?? {}
  )) {
    for (const flow of Object.values(scheme.flows ?? {}))
      for (const scope of Object.keys(flow.scopes ?? {})) scopes.add(scope);
  }
  for (const [path, item] of Object.entries(document.paths))
    for (const [method, op] of Object.entries(item)) {
      if (!methods.has(method)) continue;
      permissionCodes(op).forEach(value => permissions.add(value));
      operationPermissions[op.operationId] = permissionCodes(op);
      const required = [];
      const body = dereference(op.requestBody, document);
      if (body?.required)
        required.push("body: OperationBody<" + literal(op.operationId) + ">");
      const parameters = [
        ...new Map(
          [...(item.parameters ?? []), ...(op.parameters ?? [])].map(value => {
            const parameter = dereference(value, document);
            return [`${parameter.in}:${parameter.name}`, parameter];
          })
        ).values()
      ];
      for (const [location, name] of [
        ["path", "path"],
        ["query", "query"],
        ["header", "headers"]
      ]) {
        if (
          parameters.some(
            parameter => parameter.in === location && parameter.required
          )
        )
          required.push(
            `${name}: OperationParameter<${literal(op.operationId)}, ${literal(location)}>`
          );
      }
      const type = `OperationInput<${literal(op.operationId)}>${required.length ? ` & { ${required.join("; ")} }` : ""}`;
      const multipart = !!body?.content?.["multipart/form-data"];
      multipartUsed ||= multipart;
      operations.push(
        `${literal(op.operationId)}(input: ${type}${required.length ? "" : " = {}"}, config: PureHttpRequestConfig = {}) { return transport.request<OperationResponse<${literal(op.operationId)}>>(${literal(method)}, interpolate(${literal(path)}, input.path), { params: input.query, headers: input.headers, data: ${multipart ? "multipart(input.body)" : "input.body"} }, config); }`
      );
    }
  const ast = await openapiTS(document, {
    alphabetize: true,
    exportType: true,
    silent: true,
    transform(schema) {
      if (schema.format === "binary") {
        const blob = ts.factory.createTypeReferenceNode("Blob");
        return schema.nullable
          ? ts.factory.createUnionTypeNode([
              blob,
              ts.factory.createLiteralTypeNode(ts.factory.createNull())
            ])
          : blob;
      }
    }
  });
  const schema = header + astToString(ast);
  const client =
    header +
    `
import type { operations } from "./schema";
import { http } from "@/utils/http";
${operations.length ? 'import type { PureHttpRequestConfig } from "@/utils/http/types";' : ""}
type Content<T> = T extends { content: infer C } ? C extends { "application/json": infer J } ? J : C[keyof C] : void;
export type OperationBody<K extends keyof operations> = operations[K] extends { requestBody?: infer B } ? Content<NonNullable<B>> : never;
export type OperationParameter<K extends keyof operations, P extends string> = operations[K] extends { parameters: infer V } ? P extends keyof V ? V[P] : never : never;
export type OperationResponse<K extends keyof operations> = operations[K] extends { responses: infer R } ? Content<R[Extract<keyof R, 200 | 201 | 202 | 203 | 204 | 205 | 206 | "200" | "201" | "202" | "204">]> : never;
export type OperationInput<K extends keyof operations> = { body?: OperationBody<K>; path?: OperationParameter<K, "path">; query?: OperationParameter<K, "query">; headers?: OperationParameter<K, "header"> };
${operations.length ? 'function interpolate(path: string, params: unknown): string { return path.replace(/\\{([^}]+)\\}/g, (_match, key: string) => { const value = (params as Record<string, unknown> | undefined)?.[key]; if (value === undefined || value === null) throw new Error("缺少接口路径参数"); return encodeURIComponent(String(value)); }); }' : ""}
${multipartUsed ? "function multipart(body: unknown): FormData { const form = new FormData(); for (const [key, value] of Object.entries((body ?? {}) as object)) { for (const item of Array.isArray(value) ? value : [value]) if (item !== undefined && item !== null) form.append(key, item instanceof Blob ? item : String(item)); } return form; }" : ""}
export function createApiClient(transport: Pick<typeof http, "request"> = http) { void transport; return { ${operations.join(",\n")} }; }
export const api = createApiClient();
`;
  const constants =
    header +
    `export const PERMISSIONS = ${literal([...permissions].sort())} as const;\nexport type PermissionCode = typeof PERMISSIONS[number];\nexport const OPERATION_PERMISSIONS = ${literal(stable(operationPermissions))} as const;\nexport const SCOPES = ${literal([...scopes].sort())} as const;\nexport const ENUMS = ${literal(stable(enums))} as const;\n`;
  const files = new Map();
  const prettier = await resolveConfig(
    fileURLToPath(new URL("../src/api/client.ts", import.meta.url))
  );
  for (const [name, code] of [
    ["schema.d.ts", schema],
    ["client.ts", client],
    ["constants.ts", constants]
  ])
    files.set(
      name,
      await format(code, { ...prettier, parser: "typescript", endOfLine: "lf" })
    );
  files.set(
    "manifest.json",
    JSON.stringify(
      {
        generator: "openapi-typescript",
        revision: provenance.revision,
        source: provenance.source,
        schemaSha256: createHash("sha256")
          .update(JSON.stringify(document))
          .digest("hex"),
        operationCount: operations.length,
        permissionsProvided: permissions.size > 0,
        files: [...files.keys(), "manifest.json"]
      },
      null,
      2
    ) + "\n"
  );
  files.set(
    "manifest.json",
    await format(files.get("manifest.json"), {
      ...prettier,
      parser: "json",
      endOfLine: "lf"
    })
  );
  return files;
}
