/** 组件内部的目录适配口；正式接口类型由适配层使用生成契约。 */
export interface MemberChoice {
  id: string;
  label: string;
}
export interface MemberOrganization extends MemberChoice {
  parentId: string | null;
}
export interface MemberDirectory {
  organizations(signal: AbortSignal): Promise<MemberOrganization[]>;
  members(query: {
    orgId?: string;
    includeChildren: boolean;
    keyword: string;
    page: number;
    size: number;
    signal: AbortSignal;
  }): Promise<{ list: MemberChoice[]; total: number }>;
  resolve(ids: string[], signal: AbortSignal): Promise<MemberChoice[]>;
}
