import { defineComponent, h } from "vue";
import { useI18n } from "vue-i18n";

/** 现有设计器白名单不开放富文本；不渲染HTML，也不加载上游旧编辑器。 */
export default defineComponent({
  name: "UnsupportedRichText",
  inheritAttrs: false,
  setup() {
    const { t } = useI18n();
    return () => h("span", { role: "alert" }, t("forms.unsupportedRichText"));
  }
});
