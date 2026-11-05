// 仅由测试 HTML 引用，正式入口和路由不导入。全部记录均为合成数据。
import { createApp } from "vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import { store } from "@/store";
import { i18n } from "@/plugins/i18n";
import { perm } from "@/directives/perm";
import Harness from "./CrudHarness.vue";
createApp(Harness)
  .use(store)
  .use(i18n)
  .use(ElementPlus)
  .directive("perm", perm)
  .mount("#app");
