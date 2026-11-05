import { getConfig } from "@/config";
import { transformI18n } from "@/plugins/i18n";
import NProgress from "@/utils/progress";
import {
  createRouter,
  type RouteRecordRaw,
  type RouteComponent
} from "vue-router";
import { cloneDeep } from "@pureadmin/utils";
import { buildHierarchyTree } from "@/utils/tree";
import {
  ascending,
  formatTwoStageRoutes,
  formatFlatteningRoutes,
  getHistoryMode,
  initRouter
} from "./utils";
import remainingRouter from "./modules/remaining";
import { useUserStoreHook } from "@/store/modules/user";
import { usePermissionStoreHook } from "@/store/modules/permission";
import { useMultiTagsStoreHook } from "@/store/modules/multiTags";
import { routerArrays } from "@/layout/types";
import { onSessionReset } from "@/platform/lifecycle";
const modules = import.meta.glob(
  ["./modules/**/*.ts", "!./modules/**/remaining.ts"],
  { eager: true }
);
const routes = Object.values(modules).flatMap((module: any) => module.default);
export const constantRoutes: RouteRecordRaw[] = formatTwoStageRoutes(
  formatFlatteningRoutes(buildHierarchyTree(ascending(routes)))
);
const initial = cloneDeep(constantRoutes);
export const constantMenus: RouteComponent[] = ascending(routes).concat(
  ...remainingRouter
);
export const remainingPaths = remainingRouter.map(route => route.path);
export const router = createRouter({
  history: getHistoryMode(import.meta.env.VITE_ROUTER_HISTORY || "hash"),
  routes: constantRoutes.concat(remainingRouter as any),
  scrollBehavior: () => ({ top: 0 })
});
let loaded = false,
  restored = false;
export function resetLoadedPaths() {
  loaded = false;
}
export function resetRouter() {
  loaded = false;
  router.clearRoutes();
  initial
    .concat(remainingRouter as any)
    .forEach(route => router.addRoute(cloneDeep(route)));
  router.options.routes = cloneDeep(initial);
  usePermissionStoreHook().clearAllCachePage();
  useMultiTagsStoreHook().handleTags("equal", [...routerArrays]);
}
onSessionReset(() => {
  resetRouter();
  queueMicrotask(() => {
    if (!useUserStoreHook().isAuthenticated) void router.replace("/login");
  });
});
router.beforeEach(async to => {
  NProgress.start();
  const user = useUserStoreHook();
  if (!restored) {
    restored = true;
    await user.restoreSession();
  }
  if (to.path === "/login") return user.isAuthenticated ? "/welcome" : true;
  if (!user.accessToken) return "/login";
  if (user.transitioning) return false;
  try {
    await user.ensureFreshSession();
    if (!loaded) {
      await initRouter();
      loaded = true;
      return to.fullPath;
    }
    document.title =
      transformI18n(to.meta.title) +
      " | " +
      (getConfig().Title ?? "jim-nestjs-admin");
    return true;
  } catch {
    user.clearSession();
    return "/login";
  }
});
router.afterEach(() => NProgress.done());
router.onError(() => NProgress.done());
export default router;
