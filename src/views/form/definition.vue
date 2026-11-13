<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref } from "vue";
import { useI18n } from "vue-i18n";
import CrudPage from "@/components/Crud/CrudPage.vue";
import type { CrudPort, CrudRecord } from "@/components/Crud/types";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import AddIcon from "~icons/ri/add-circle-line";
import ViewIcon from "~icons/ri/eye-line";
import EditIcon from "~icons/ri/edit-line";
import { generatedCrud } from "@/platform/generated-crud";
import { permission } from "@/platform/system/resources";
import FormEditor from "./FormEditor.vue";
import { useFormWorkspace } from "./useFormWorkspace";

defineOptions({ name: "FormDefinitionPage" });
const { t } = useI18n();
const generated = generatedCrud("formDefinition");
// 版本快照只开放列表读取；创建和修订由设计工作区办理。
const port: CrudPort = {
  describe: generated.port.describe,
  list: generated.port.list,
  detail: generated.port.detail,
  preferences: generated.port.preferences
};
const workspace = useFormWorkspace();
const { busy, listError, editor } = workspace;
const list = ref<InstanceType<typeof CrudPage>>();
const editorKey = ref(0);
async function open(
  record: CrudRecord | null,
  mode: "create" | "view" | "revise"
) {
  if (busy.value) return;
  if (record && typeof record.id !== "string") {
    listError.value = "forms.unavailable";
    return;
  }
  ++editorKey.value;
  await workspace.open(record ? { id: record.id as string } : null, mode);
}
async function back() {
  editor.open = false;
  await nextTick();
  await list.value?.refresh();
}
onBeforeUnmount(workspace.dispose);
</script>
<template>
  <div>
    <FormEditor
      v-if="editor.open"
      :key="editorKey"
      :workspace="workspace"
      @back="back"
      @reopen="editorKey++"
    />
    <div v-show="!editor.open">
      <el-alert
        v-if="listError"
        :title="t(listError)"
        type="error"
        :closable="false"
        role="alert"
        class="list-error"
      />
      <CrudPage
        ref="list"
        :port="port"
        page-key="form:definition"
        :row-actions-width="250"
      >
        <template #toolbar>
          <el-button
            v-perm="permission('formDefinitionAdd')"
            type="primary"
            :icon="useRenderIcon(AddIcon)"
            :disabled="busy"
            @click="open(null, 'create')"
            >{{ t("forms.newForm") }}</el-button
          >
          <span class="list-hint">{{ t("forms.versionListHint") }}</span>
        </template>
        <template #cell-revision="{ value }">
          <el-tag size="small" effect="plain">v{{ value }}</el-tag>
        </template>
        <template #row-actions="{ row, disabled }">
          <el-button
            v-perm="permission('formDefinitionInfo')"
            link
            type="primary"
            :icon="useRenderIcon(ViewIcon)"
            :disabled="disabled || busy"
            @click="open(row, 'view')"
            >{{ t("forms.view") }}</el-button
          ><el-button
            v-perm="permission('formDefinitionRevise')"
            link
            type="primary"
            :icon="useRenderIcon(EditIcon)"
            :disabled="disabled || busy"
            @click="open(row, 'revise')"
            >{{ t("forms.newRevision") }}</el-button
          >
        </template>
      </CrudPage>
    </div>
  </div>
</template>
<style scoped>
.list-hint {
  font-size: 13px;
  color: var(--el-text-color-secondary);
}

.list-error {
  margin-bottom: 12px;
}

@media (width <= 760px) {
  .list-hint {
    display: none;
  }
}
</style>
