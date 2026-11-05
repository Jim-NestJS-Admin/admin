import { useUserStoreHook } from "@/store/modules/user";
import { allows } from "@/platform/policy.mjs";
/** 兼容 Pure 布局的清理入口；凭据仅在内存中。 */
export const removeToken = () => useUserStoreHook().clearSession();
export const getToken = () => useUserStoreHook().accessToken;
export const formatToken = (value: string) => "Bearer " + value;
export const hasPerms = (requested: string | string[]) => {
  const user = useUserStoreHook();
  return (
    user.isAuthenticated &&
    !user.transitioning &&
    allows(user.permissions, requested)
  );
};
