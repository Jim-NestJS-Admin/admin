/** 前端内部模型；T12 的生成客户端适配成这些状态，不是后端 DTO。 */
export interface NavigationItem {
  key: string;
  path: string;
  title: string;
  kind: "directory" | "page";
  view?: string;
  permission?: string;
  children?: NavigationItem[];
  hidden?: boolean;
  keepAlive?: boolean;
  rank?: number;
  icon?: string | null;
}

export interface TenantInfo {
  id: string;
  code: string;
  name: string;
  platform: boolean;
}

/** 登录页提示：domain 表示域名已绑定租户，不用填租户编码 */
export type TenantHint =
  | { mode: "domain"; tenant: { code: string; name: string } }
  | { mode: "code" };

export interface SessionSnapshot {
  accessToken: string;
  expiresAt: number;
  user: { id: string; username: string; nickname?: string };
  /** 内置超级管理员：可以管理系统字典等平台级配置；后端仍独立鉴权 */
  superAdmin?: boolean;
  /** 当前租户；platform 为 true 是平台（管理所有租户） */
  tenant?: TenantInfo;
  organizationId: string;
  authVersion?: number;
  organizations?: { id: string; name: string; path: string[] }[];
  permissions: string[];
  menus: NavigationItem[];
}

/** 登录页内部输入，生成客户端适配层负责转换成正式请求 DTO。 */
export interface SignInInput {
  account: string;
  password: string;
  captchaId: string;
  captchaCode: string;
}

export interface AdminGateway {
  signIn(input: SignInInput): Promise<SessionSnapshot>;
  resume(): Promise<SessionSnapshot | null>;
  refresh(): Promise<SessionSnapshot>;
  signOut(accessToken?: string): Promise<void>;
  switchOrganization(id: string): Promise<SessionSnapshot>;
  tenantHint(signal?: AbortSignal): Promise<TenantHint>;
  challenge(
    account: string,
    language: string,
    signal: AbortSignal
  ): Promise<{ id: string; image: string }>;
}
