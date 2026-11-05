import type { components } from "@/api/crud-schema";
export type CrudSchema = components["schemas"]["CrudSchema"];
export type CrudColumn = components["schemas"]["CrudSchemaColumn"];
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
  state: "visible" | "masked" | "hidden";
  display: unknown;
}
