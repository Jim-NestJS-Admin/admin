import { $t } from "@/plugins/i18n";
const { VITE_HIDE_HOME } = import.meta.env;
const Layout = () => import("@/layout/index.vue");

export default {
  path: "/",
  name: "Home",
  component: Layout,
  redirect: "/welcome",
  meta: {
    icon: "ep/home-filled",
    title: $t("menus.pureHome"),
    rank: 0
  },
  children: [
    {
      path: "/welcome",
      name: "Welcome",
      component: () => import("@/views/welcome/index.vue"),
      meta: {
        title: $t("menus.pureHome"),
        showLink: VITE_HIDE_HOME === "true" ? false : true
      }
    },
    {
      path: "/workflow/definition/new",
      name: "WorkflowCreate",
      component: () => import("@/views/workflow/design.vue"),
      meta: { title: $t("workflow.create"), showLink: false }
    },
    {
      path: "/workflow/definition/:id/revise",
      name: "WorkflowRevise",
      component: () => import("@/views/workflow/design.vue"),
      meta: { title: $t("workflow.revise"), showLink: false }
    },
    {
      path: "/workflow/definition/:id/view",
      name: "WorkflowView",
      component: () => import("@/views/workflow/design.vue"),
      meta: { title: $t("workflow.viewDefinition"), showLink: false }
    }
  ]
} satisfies RouteConfigsTable;
