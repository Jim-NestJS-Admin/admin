<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { ENUMS } from "@/api/constants";
import { useI18n } from "vue-i18n";
import FcDesigner, { type Config, type DragRule } from "@form-create/designer";
import type { Rule as FcRule } from "@form-create/element-ui";
import en from "@form-create/designer/locale/en.es.js";
import zh from "@form-create/designer/locale/zh-cn.es.js";
import StaticOptions from "./StaticOptions.vue";
import {
  componentTypes,
  exportRules,
  isDesignerClipboard,
  type Designer
} from "./model";

const props = defineProps<{ initial: Designer }>();
const { t, locale } = useI18n();
const designer = ref<InstanceType<typeof FcDesigner>>();
FcDesigner.designerForm.component("SafeFormOptions", StaticOptions);
const lang = computed(() => (locale.value.startsWith("zh") ? zh : en));
const menu = computed(() => [
  {
    name: "safe",
    title: t("forms.availableFields"),
    list: [
      {
        name: "autoCode",
        label: t("autoCodes.dynamicField"),
        icon: "icon-input"
      },
      ...componentTypes.map(type => ({
        name: type,
        label: t(`forms.components.${type}`),
        icon: "icon-input"
      }))
    ]
  }
]);
const field = (
  name: string,
  type: string,
  title: string,
  extra: object = {}
) => ({ type, field: name, title: t(title), ...extra });
const config: Config &
  Record<
    "showPrintBtn" | "showPageManage" | "showAdvancedForm" | "showTemplate",
    boolean
  > = {
  showSaveBtn: false,
  showPreviewBtn: false,
  showPrintBtn: false,
  showAi: false,
  showJsonPreview: false,
  showCustomProps: false,
  showPageManage: false,
  showAdvancedForm: false,
  showEventForm: false,
  showControl: false,
  showStyleForm: false,
  showValidateForm: false,
  showLanguage: false,
  showFormConfig: false,
  showTemplate: false,
  showDevice: false,
  showInputData: false,
  switchType: false,
  autoActive: true,
  autoResetName: false,
  updateConfigOnBlur: false,
  baseRule: () => [
    field("formCreateField", "input", "forms.fieldKey"),
    field("formCreateTitle", "input", "forms.fieldTitle"),
    field("formCreateInfo", "input", "forms.fieldHint"),
    field("formCreate$required", "switch", "forms.required"),
    field("formCreateMeta>multilingual", "switch", "forms.multilingual"),
    field("formCreateMeta>queryable", "switch", "forms.queryable"),
    field("formCreateMeta>generated", "switch", "autoCodes.dynamicField"),
    field("formCreateMeta>codeCharset", "select", "autoCodes.charset", {
      options: ENUMS[
        "components.schemas.FormFieldDto.properties.codeCharset"
      ].map(value => ({ value, label: t(`autoCodes.charsets.${value}`) })),
      info: t("autoCodes.designerHint")
    })
  ]
};
function componentProps(type: string): FcRule[] {
  const list: FcRule[] = [];
  if (["select", "radio", "checkbox"].includes(type))
    list.push(field("formCreateOptions", "SafeFormOptions", "forms.options"));
  if (type === "input")
    list.push(
      field("type", "select", "forms.inputType", {
        options: ["text", "textarea", "password", "email", "url"].map(
          value => ({ label: t(`forms.inputTypes.${value}`), value })
        )
      }),
      field("maxlength", "inputNumber", "forms.maxLength", {
        props: { min: 0, max: 20000 }
      })
    );
  if (type === "inputNumber")
    for (const key of ["min", "max", "precision"])
      list.push(
        field(key, "inputNumber", `forms.${key}`, {
          props: key === "precision" ? { min: 0, max: 15, precision: 0 } : {}
        })
      );
  if (type === "select")
    list.push(field("multiple", "switch", "forms.multiple"));
  if (["input", "select", "datePicker"].includes(type))
    list.push(field("placeholder", "input", "forms.placeholder"));
  return list;
}
function template(type: (typeof componentTypes)[number]): DragRule {
  return {
    name: type,
    languageKey: [],
    label: t(`forms.components.${type}`),
    icon: "icon-input",
    menu: "safe",
    input: true,
    handleBtn: ["delete"],
    validate: false,
    rule: () => ({
      type,
      field: `field_${crypto.randomUUID().replaceAll("-", "")}`,
      title: t(`forms.components.${type}`),
      $required: false,
      meta: { multilingual: false, queryable: true },
      props:
        type === "datePicker"
          ? { type: "date", valueFormat: "YYYY-MM-DD" }
          : {},
      ...(["select", "radio", "checkbox"].includes(type)
        ? {
            options: [
              { label: t("forms.optionOne"), value: "one" },
              { label: t("forms.optionTwo"), value: "two" }
            ]
          }
        : {})
    }),
    props: () => componentProps(type)
  };
}
// 上游全局粘贴会解释序列化函数，必须在捕获阶段拦截结构化表单粘贴。
function blockPaste(event: ClipboardEvent) {
  if (isDesignerClipboard(event.clipboardData?.getData("text/plain") ?? "")) {
    event.preventDefault();
    event.stopImmediatePropagation();
  }
}
onMounted(() => {
  document.addEventListener("paste", blockPaste, true);
  const autoCode = template("input");
  autoCode.name = "autoCode";
  autoCode.label = t("autoCodes.dynamicField");
  const inputRule = autoCode.rule;
  autoCode.rule = options => ({
    ...inputRule(options),
    title: t("autoCodes.dynamicField"),
    meta: {
      generated: true,
      codeCharset: "lower_slug",
      multilingual: false,
      queryable: true
    },
    props: { maxlength: 64 }
  });
  designer.value!.addComponent([...componentTypes.map(template), autoCode]);
  designer.value!.setRule(JSON.parse(JSON.stringify(props.initial.rule)));
});
onBeforeUnmount(() => document.removeEventListener("paste", blockPaste, true));
function rules() {
  return exportRules(designer.value?.getRule() ?? props.initial.rule);
}
function focus(field: string) {
  designer.value?.triggerActive(field);
}
defineExpose({ rules, focus });
</script>
<template>
  <div class="designer-scroll" :aria-label="t('forms.design')">
    <div class="designer-stage">
      <FcDesigner
        ref="designer"
        :menu="menu"
        :locale="lang"
        :config="config"
        height="620px"
      />
    </div>
  </div>
</template>
<style scoped>
.designer-scroll {
  overflow: auto;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 6px;
}

.designer-stage {
  min-width: 860px;
}
</style>
