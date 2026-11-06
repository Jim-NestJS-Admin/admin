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

export interface SessionSnapshot {
  accessToken: string;
  expiresAt: number;
  user: { id: string; username: string; nickname?: string };
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
  challenge(
    account: string,
    language: string,
    signal: AbortSignal
  ): Promise<{ id: string; image: string }>;
}
