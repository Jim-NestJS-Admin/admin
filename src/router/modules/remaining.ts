import { $t } from "@/plugins/i18n";
import Login from "@/views/login/index.vue";
const Layout = () => import("@/layout/index.vue");

export default [
  {
    path: "/automation/confirm",
    name: "McpConfirm",
    component: () => import("@/views/mcp/operation.vue"),
    meta: { title: "MCP操作确认", showLink: false }
  },
  {
    path: "/authorization/consent",
    name: "OAuthConsent",
    component: () => import("@/views/oauth/consent.vue"),
    meta: { title: "OAuth授权", showLink: false }
  },
  {
    path: "/authorizations",
    name: "MyAuthorizations",
    component: () => import("@/views/oauth/grant.vue"),
    meta: { title: "我的授权", showLink: false }
  },
  {
    path: "/login",
    name: "Login",
    // 退出时即使静态资源服务已断开，也能打开登录页。
    component: Login,
    meta: {
      title: $t("menus.pureLogin"),
      showLink: false
    }
  },
  // 全屏403（无权访问）页面
  {
    path: "/access-denied",
    name: "AccessDenied",
    component: () => import("@/views/error/403.vue"),
    meta: {
      title: $t("menus.pureAccessDenied"),
      showLink: false
    }
  },
  // 全屏500（服务器出错）页面
  {
    path: "/server-error",
    name: "ServerError",
    component: () => import("@/views/error/500.vue"),
    meta: {
      title: $t("menus.pureServerError"),
      showLink: false
    }
  },
  {
    path: "/redirect",
    component: Layout,
    meta: {
      title: $t("status.pureLoad"),
      showLink: false
    },
    children: [
      {
        path: "/redirect/:path(.*)",
        name: "Redirect",
        component: () => import("@/layout/redirect.vue")
      }
    ]
  }
] satisfies Array<RouteConfigsTable>;
