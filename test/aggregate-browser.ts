// 独立合成数据验收入口，不进入正式应用。
import { createApp } from "vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import { store } from "@/store";
import { i18n } from "@/plugins/i18n";
import { perm } from "@/directives/perm";
import Harness from "./AggregateHarness.vue";
createApp(Harness)
  .use(store)
  .use(i18n)
  .use(ElementPlus)
  .directive("perm", perm)
  .mount("#app");
