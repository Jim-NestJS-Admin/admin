/**
 * 共用域名时的租户编码（契约 tenant.md 第 4 节）：登录页填写后保存在本机，
 * 出题、登录、刷新、退出请求都带上 X-Tenant-Code；域名绑定了租户时清空。不填等同默认租户。
 */
const KEY = "jna-tenant-code";
export const TENANT_CODE_HEADER = "X-Tenant-Code";

export function normalizeTenantCode(value: string): string {
  return value.trim().toLowerCase();
}

export function readTenantCode(): string {
  try {
    return localStorage.getItem(KEY) ?? "";
  } catch {
    return "";
  }
}

export function writeTenantCode(value: string): void {
  const code = normalizeTenantCode(value);
  try {
    if (code) localStorage.setItem(KEY, code);
    else localStorage.removeItem(KEY);
  } catch {
    // 浏览器禁用本地存储时忽略：本次页面仍按内存里的值发送
  }
  memory = code;
}

let memory: string | undefined;
/** 优先用本页内存里的值（本地存储不可用时也能工作） */
export function currentTenantCode(): string {
  return memory ?? readTenantCode();
}
