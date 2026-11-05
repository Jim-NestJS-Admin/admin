import { adaptNavigation } from "./policy.mjs";
import { useUserStoreHook } from "@/store/modules/user";
// 只注册实际实现的业务页，T14/T13 添加页面时显式扩展，禁止任意组件路径。
export const navigationViews = new Map<string, () => Promise<unknown>>();
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
