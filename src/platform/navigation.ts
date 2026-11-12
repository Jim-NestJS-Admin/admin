import { adaptNavigation } from "./policy.mjs";
import { useUserStoreHook } from "@/store/modules/user";
// 只注册实际实现的业务页，T14/T13 添加页面时显式扩展，禁止任意组件路径。
export const navigationViews = new Map<string, () => Promise<unknown>>([
  ["dev/codegen", () => import("@/views/dev/codegen.vue")],

  ["system/page-config", () => import("@/views/system/page-config.vue")],
  ["system/field", () => import("@/views/system/field.vue")],
  ["system/user", () => import("@/views/system/user.vue")],
  ["system/role", () => import("@/views/system/role.vue")],
  ["system/org", () => import("@/views/system/org.vue")],
  ["system/menu", () => import("@/views/system/menu.vue")],
  ["system/user-role", () => import("@/views/system/user-role.vue")],
  [
    "system/user-supervisor",
    () => import("@/views/system/user-supervisor.vue")
  ],
  ["system/dict-type", () => import("@/views/system/dict-type.vue")],
  ["system/dict-item", () => import("@/views/system/dict-item.vue")],
  ["system/parameter", () => import("@/views/system/parameter.vue")],
  ["system/operation-log", () => import("@/views/system/operation-log.vue")],
  ["system/login-log", () => import("@/views/system/login-log.vue")],
  // 平台管理（阶段 2）：只有平台用户的菜单里会出现
  ["platform/tenant", () => import("@/views/platform/tenant.vue")],
  ["platform/package", () => import("@/views/platform/package.vue")]
]);
export async function getAsyncRoutes() {
  const user = useUserStoreHook();
  const data = adaptNavigation(
    user.menus,
    user.permissions,
    new Set(navigationViews.keys()),
    reason => console.warn("导航配置忽略：", reason)
  );
  return { data };
}
