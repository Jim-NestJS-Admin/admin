import type { components } from "@/api/schema";
export type CrudSchema = components["schemas"]["CrudSchema"];
export type CrudColumn = components["schemas"]["CrudSchemaColumn"];
export type CrudChild = components["schemas"]["CrudSchemaChild"];
/** 内部编辑变化，适配器须映射到生成的资源请求 DTO；不是直接发送的请求体。 */
export interface CrudRelatedChange {
  resource: string;
  inserted: { localKey: string; values: CrudRecord }[];
  modified: { recordKey: string; values: CrudRecord }[];
  removed: string[];
}
export interface CrudChildDraft {
  resource: string;
  loaded: boolean;
  complete: boolean;
  rows: { key: string; original?: CrudRecord; values: CrudRecord }[];
  removed: string[];
}
export interface CrudRowIssue {
  group: string;
  key: string;
  field: string;
  message: string;
}
/** 组件内部的视图数据和适配口；业务 DTO 由生成客户端提供，不在这里重复声明。 */
export type CrudRecord = Record<string, unknown>;
export interface CrudQuery {
  pageNumber: number;
  pageSize: number;
  search: string;
  sorting: { field: string; direction: "asc" | "desc" }[];
  equality: Record<string, unknown>;
  advanced?: unknown;
}
export interface CrudColumnChoice {
  field: string;
  visible: boolean;
  width: number;
  fixed: false | "left" | "right";
}
export interface CrudChoices {
  columns: CrudColumnChoice[];
  density: "small" | "default" | "large";
}
export interface CrudMutation {
  signal: AbortSignal;
  idempotencyKey: string;
  relatedChanges?: CrudRelatedChange[];
}
export interface CrudPort {
  describe(signal: AbortSignal): Promise<CrudSchema>;
  list(
    query: CrudQuery,
    signal: AbortSignal
  ): Promise<{ rows: CrudRecord[]; totalRows: number }>;
  detail(id: string, signal: AbortSignal): Promise<CrudRecord>;
  create?(values: CrudRecord, context: CrudMutation): Promise<CrudRecord>;
  update?(
    identity: { id: string; version: number },
    values: CrudRecord,
    context: CrudMutation
  ): Promise<CrudRecord>;
  remove?(ids: string[], context: CrudMutation): Promise<unknown>;
  recycled?(
    query: Pick<CrudQuery, "pageNumber" | "pageSize" | "search">,
    signal: AbortSignal
  ): Promise<{ rows: CrudRecord[]; totalRows: number }>;
  restore?(
    records: { id: string; version: number }[],
    context: CrudMutation
  ): Promise<unknown>;
  purge?(
    records: { id: string; version: number }[],
    context: CrudMutation
  ): Promise<unknown>;
  /** 自定义详情只加载部分明细时必须返回 false；完整加载时才开放整体拖动排序。 */
  relatedComplete?(resource: string, detail: CrudRecord): boolean;
  /** 身份由已验证的服务端会话确定，接口不接受 userId/orgId/tenantId。 */
  preferences?: {
    load(page: string, signal: AbortSignal): Promise<unknown>;
    save(
      page: string,
      choices: CrudChoices,
      signal: AbortSignal
    ): Promise<void>;
  };
}
export interface CrudCell {
  state: "visible" | "readonly" | "masked" | "hidden";
  display: unknown;
}
