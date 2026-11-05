import vue from "@vitejs/plugin-vue";
import { pathResolve } from "./utils";
import { viteBuildInfo } from "./info";
import svgLoader from "vite-svg-loader";
import Icons from "unplugin-icons/vite";
import type { PluginOption } from "vite";
import vueJsx from "@vitejs/plugin-vue-jsx";
import tailwindcss from "@tailwindcss/vite";
import { configCompressPlugin } from "./compress";
import VueI18nPlugin from "@intlify/unplugin-vue-i18n/vite";
export function getPluginsList(
  _cdn: boolean,
  compression: ViteCompression
): PluginOption[] {
  return [
    tailwindcss(),
    vue({
      template: {
        compilerOptions: { isCustomElement: tag => tag === "altcha-widget" }
      }
    }),
    vueJsx(),
    VueI18nPlugin({ include: [pathResolve("../locales/**")] }),
    viteBuildInfo(),
    svgLoader(),
    Icons({ compiler: "vue3", scale: 1 }),
    configCompressPlugin(compression)
  ];
}
