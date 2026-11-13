<script setup lang="ts">
import { computed, defineAsyncComponent, nextTick, ref } from "vue";
import { onBeforeRouteLeave } from "vue-router";
import { useI18n } from "vue-i18n";
import { ElMessage, ElMessageBox } from "element-plus";
import { permission } from "@/platform/system/resources";
import type { useFormWorkspace } from "./useFormWorkspace";
import {
  copy,
  fingerprint,
  formIssueText,
  type Designer,
  type Field,
  type FieldIssue
} from "./model";
import FormFields from "./FormFields.vue";
import LinkageEditor from "./LinkageEditor.vue";
const SafeDesigner = defineAsyncComponent(() => import("./SafeDesigner.vue"));
const FormPreview = defineAsyncComponent(() => import("./FormPreview.vue"));
const props = defineProps<{ workspace: ReturnType<typeof useFormWorkspace> }>();
const emit = defineEmits<{ back: []; reopen: [] }>();
const { t } = useI18n();
const editor = props.workspace.editor;
const busy = computed(() => props.workspace.busy.value);
const editable = computed(() => editor.mode !== "view");
const tab = ref(editable.value ? "design" : "preview");
const canvas = ref<{
  rules: () => Designer["rule"];
  focus: (field: string) => void;
}>();
const preview = ref<{
  designer: Designer;
  fields: Field[];
  key: number;
} | null>(
  editor.mode === "view"
    ? { designer: copy(editor.designer), fields: copy(editor.fields), key: 0 }
    : null
);
const initial = fingerprint({
  code: editor.code,
  name: editor.name,
  designer: editor.designer
});
function designer(): Designer {
  return {
    ...copy(editor.designer),
    rule: editable.value
      ? (canvas.value?.rules() ?? editor.designer.rule)
      : copy(editor.designer.rule)
  };
}
function checkName() {
  if (editor.name.trim()) return true;
  editor.error = "forms.nameRequired";
  editor.issues = [{ field: "data.name", messages: [t("forms.nameRequired")] }];
  return false;
}
async function check(openPreview = false) {
  if (!checkName()) return;
  try {
    const result = await props.workspace.check(designer());
    if (result) {
      if (openPreview) {
        preview.value = {
          designer: copy(result.designer),
          fields: copy(result.fields),
          key: (preview.value?.key ?? 0) + 1
        };
        tab.value = "preview";
      } else ElMessage.success(t("forms.checked"));
    }
  } catch {
    editor.error = "forms.invalidDesign";
  }
}
async function save() {
  if (!checkName()) return;
  try {
    const saved = await props.workspace.save(designer());
    if (saved) {
      preview.value = {
        designer: copy(editor.designer),
        fields: copy(editor.fields),
        key: (preview.value?.key ?? 0) + 1
      };
      tab.value = "preview";
      ElMessage.success(t("forms.saved"));
    }
  } catch {
    editor.error = "forms.invalidDesign";
  }
}
async function refreshFields() {
  try {
    const linkages = copy(editor.designer.linkages ?? []);
    const result = await props.workspace.check({ ...designer(), linkages: [] });
    if (result) {
      editor.designer.linkages = linkages;
      ElMessage.success(t("forms.checked"));
    }
  } catch {
    editor.error = "forms.invalidDesign";
  }
}
async function canClose() {
  if (!editor.open) return true;
  if (busy.value) return false;
  if (!editable.value) return true;
  try {
    if (
      fingerprint({
        code: editor.code,
        name: editor.name,
        designer: designer()
      }) === initial
    )
      return true;
  } catch {
    /* 无法导出的设计也需要确认后再丢弃。 */
  }
  try {
    await ElMessageBox.confirm(t("forms.unsavedChanges"), t("forms.back"), {
      type: "warning"
    });
    return true;
  } catch {
    return false;
  }
}
async function back() {
  if (await canClose()) emit("back");
}
async function latest() {
  try {
    await ElMessageBox.confirm(
      t("forms.reloadLatestHint"),
      t("forms.reloadLatest"),
      { type: "warning" }
    );
  } catch {
    return;
  }
  if (await props.workspace.latest()) emit("reopen");
}
async function locate(issue: FieldIssue) {
  if (issue.field === "data.designer.rule" && editable.value) {
    tab.value = "design";
    return;
  }
  const path = issue.field.replace(/^data\.designer\./, "").split(".");
  let item: unknown = designer(),
    key = "";
  for (const part of path) {
    if (item && typeof item === "object") {
      if (typeof (item as Record<string, unknown>).field === "string")
        key = String((item as Record<string, unknown>).field);
      item = (item as Record<string, unknown>)[part];
    }
  }
  if (key && editable.value) {
    tab.value = "design";
    await nextTick();
    canvas.value?.focus(key);
  }
}
onBeforeRouteLeave(canClose);
async function beforeTab(name: string) {
  if (name !== "preview" || !editable.value) return true;
  try {
    if (
      preview.value &&
      fingerprint(preview.value.designer) === fingerprint(designer())
    )
      return true;
    const result = await props.workspace.check(designer());
    if (!result) return false;
    preview.value = {
      designer: copy(result.designer),
      fields: copy(result.fields),
      key: (preview.value?.key ?? 0) + 1
    };
    return true;
  } catch {
    editor.error = "forms.invalidDesign";
    return false;
  }
}
</script>
<template>
  <section class="form-editor">
    <header class="editor-header">
      <el-button :disabled="busy" @click="back"
        >← {{ t("forms.back") }}</el-button
      >
      <div class="editor-heading">
        <h2>
          {{
            editable
              ? t(
                  editor.mode === "create"
                    ? "forms.newForm"
                    : "forms.newRevision"
                )
              : editor.name
          }}
          <el-tag v-if="editor.record" size="small" effect="plain"
            >v{{ editor.record.revision }}</el-tag
          >
        </h2>
        <p>{{ t("forms.immutableHint") }}</p>
      </div>
      <div v-if="editable" class="editor-buttons">
        <el-button
          v-perm="permission('formDefinitionInspect')"
          :disabled="busy"
          @click="check(false)"
          >{{ t("forms.check") }}</el-button
        >
        <el-button
          v-perm="permission('formDefinitionInspect')"
          :disabled="busy"
          @click="check(true)"
          >{{ t("forms.preview") }}</el-button
        >
        <el-button
          v-perm="
            permission(
              editor.mode === 'create'
                ? 'formDefinitionAdd'
                : 'formDefinitionRevise'
            )
          "
          type="primary"
          :loading="busy"
          @click="save"
          >{{
            t(
              editor.mode === "create"
                ? "forms.saveFirst"
                : "forms.saveRevision"
            )
          }}</el-button
        >
      </div>
    </header>
    <el-alert
      v-if="editor.error"
      type="error"
      :title="t(editor.error)"
      :closable="false"
      role="alert"
    >
      <ul class="issue-list">
        <li v-for="(issue, index) in editor.issues" :key="index">
          <el-button link type="danger" @click="locate(issue)">{{
            formIssueText(issue, t)
          }}</el-button>
        </li>
      </ul>
      <el-button v-if="editor.conflict" :disabled="busy" @click="latest">{{
        t("forms.reloadLatest")
      }}</el-button>
    </el-alert>
    <div class="editor-body" :inert="busy">
      <el-form class="metadata-form" label-position="top" :disabled="!editable">
        <el-form-item
          :label="t('forms.name')"
          required
          :error="
            editor.issues
              .filter(issue => issue.field === 'data.name')
              .flatMap(issue => issue.messages)
              .join('；')
          "
          ><el-input v-model="editor.name" maxlength="100" show-word-limit
        /></el-form-item>
        <el-form-item
          :label="t('forms.code')"
          :error="
            editor.issues
              .filter(issue => issue.field === 'data.code')
              .flatMap(issue => issue.messages)
              .join('；')
          "
          ><el-input
            v-model="editor.code"
            disabled
            maxlength="64"
            :placeholder="t('crud.generatedHint')"
        /></el-form-item>
      </el-form>
      <el-tabs v-model="tab" :before-leave="beforeTab">
        <el-tab-pane v-if="editable" :label="t('forms.design')" name="design"
          ><SafeDesigner ref="canvas" :initial="editor.designer"
        /></el-tab-pane>
        <el-tab-pane
          v-if="editable"
          :label="t('forms.linkages')"
          name="linkages"
          ><LinkageEditor
            v-model="editor.designer.linkages"
            :fields="editor.fields"
            :issues="editor.issues"
            @refresh="refreshFields"
        /></el-tab-pane>
        <el-tab-pane :label="t('forms.fields')" name="fields"
          ><p class="field-note">{{ t("forms.fieldListHint") }}</p>
          <FormFields :fields="editor.fields"
        /></el-tab-pane>
        <el-tab-pane :label="t('forms.preview')" name="preview"
          ><FormPreview
            v-if="preview && tab === 'preview'"
            :key="preview.key"
            :designer="preview.designer"
            :fields="preview.fields"
            :definition-id="
              editable ? undefined : editor.record?.id
            " /><el-empty v-else :description="t('forms.previewFirst')"
        /></el-tab-pane>
      </el-tabs>
    </div>
  </section>
</template>
<style scoped>
.form-editor {
  display: grid;
  gap: 16px;
  padding: 20px;
  background: var(--el-bg-color);
  border-radius: 8px;
}

.editor-header {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: flex-start;
}

.editor-heading {
  flex: 1;
  min-width: 220px;
}

.editor-heading h2 {
  display: flex;
  gap: 10px;
  align-items: center;
  margin: 0 0 6px;
  font-size: 18px;
  font-weight: 600;
}

.editor-heading p,
.field-note {
  margin: 0;
  font-size: 13px;
  line-height: 1.6;
  color: var(--el-text-color-secondary);
}

.editor-buttons {
  display: flex;
  gap: 8px;
}

.editor-buttons :deep(.el-button + .el-button) {
  margin-left: 0;
}

.metadata-form {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  max-width: 900px;
}

.field-note {
  margin-bottom: 14px;
}

.issue-list {
  padding-left: 18px;
}

.issue-list :deep(.el-button) {
  height: auto;
  text-align: left;
  white-space: normal;
}

@media (width <= 760px) {
  .form-editor {
    padding: 12px;
  }

  .metadata-form {
    grid-template-columns: 1fr;
    gap: 0;
  }

  .editor-buttons {
    flex-wrap: wrap;
    width: 100%;
  }
}
</style>
