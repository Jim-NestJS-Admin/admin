<script setup lang="ts">
import { api } from "@/api/client";
import { ElMessage, ElMessageBox } from "element-plus";
import { onSessionReset } from "@/platform/lifecycle";
import type { FormRecord } from "./model";

import FormSubmissions from "./FormSubmissions.vue";
import { requestText } from "./useFormWorkspace";
import { defineAsyncComponent, nextTick, onBeforeUnmount, ref } from "vue";
import { useI18n } from "vue-i18n";
import CrudPage from "@/components/Crud/CrudPage.vue";
import type { CrudPort, CrudRecord } from "@/components/Crud/types";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import ArrowDownIcon from "~icons/ri/arrow-down-s-line";
import AddIcon from "~icons/ri/add-circle-line";
import ViewIcon from "~icons/ri/eye-line";
import EditIcon from "~icons/ri/edit-line";
import { generatedCrud } from "@/platform/generated-crud";
import { permission } from "@/platform/system/resources";
import { Perms } from "@/components/RePerms";
import FormEditor from "./FormEditor.vue";
import { useFormWorkspace } from "./useFormWorkspace";

defineOptions({ name: "FormDefinitionPage" });
const FormPreview = defineAsyncComponent(() => import("./FormPreview.vue"));
const { t } = useI18n();
const generated = generatedCrud("formDefinition");
const showArchived = ref(false);
const archiveBusy = ref(false);
// 版本快照只开放列表读取；创建和修订由设计工作区办理。
const port: CrudPort = {
  describe: generated.port.describe,
  list: (query, meta) =>
    generated.port.list(
      {
        ...query,
        equality: { ...query.equality, archived: showArchived.value }
      },
      meta
    ),
  detail: generated.port.detail,
  preferences: generated.port.preferences
};
const workspace = useFormWorkspace();
const { busy, listError, editor } = workspace;
const list = ref<InstanceType<typeof CrudPage>>();
const editorKey = ref(0);
const targetForm = ref<FormRecord>();
const action = ref<"" | "fill" | "records">("");
const actionError = ref("");
let actionRequest: AbortController | undefined;
let archiveRequest: AbortController | undefined;
async function setArchived(row: CrudRecord, archived: boolean) {
  if (
    archiveBusy.value ||
    typeof row.id !== "string" ||
    typeof row.version !== "number"
  )
    return;
  const { id, version } = row;
  archiveBusy.value = true;
  actionError.value = "";
  const request = (archiveRequest = new AbortController());
  try {
    if (archived) {
      const confirmed = await ElMessageBox.confirm(
        t("forms.archiveConfirm", { name: row.name, revision: row.revision }),
        t("forms.archiveVersion"),
        { type: "warning" }
      ).then(
        () => true,
        () => false
      );
      if (!confirmed || request.signal.aborted) return;
    }
    await api.formDefinitionSetArchived(
      { body: { id, version, archived } },
      {
        signal: request.signal,
        headers: { "Idempotency-Key": crypto.randomUUID() }
      }
    );
    if (request.signal.aborted) return;
    ElMessage.success(
      t(archived ? "forms.archivedSuccess" : "forms.restoredSuccess")
    );
    await list.value?.reload();
  } catch (reason) {
    if (!request.signal.aborted) actionError.value = requestText(reason);
  } finally {
    if (archiveRequest === request) archiveBusy.value = false;
  }
}
async function openAction(row: CrudRecord, mode: "fill" | "records") {
  if (typeof row.id !== "string") return;
  actionRequest?.abort();
  const request = (actionRequest = new AbortController());
  actionError.value = "";
  try {
    const response = await api.formDefinitionInfo(
      { body: { id: row.id } },
      { signal: request.signal }
    );
    if (request.signal.aborted) return;
    targetForm.value = response.data;
    action.value = mode;
  } catch (reason) {
    if (!request.signal.aborted) actionError.value = requestText(reason);
  }
}
const stopSession = onSessionReset(() => {
  actionRequest?.abort();
  archiveRequest?.abort();
  showArchived.value = false;
  action.value = "";
  targetForm.value = undefined;
  actionError.value = "";
});
onBeforeUnmount(() => {
  stopSession();
  actionRequest?.abort();
  archiveRequest?.abort();
});
function submitted() {
  action.value = "";
  ElMessage.success(t("autoCodes.saved"));
}
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
      <el-alert
        v-if="actionError"
        :title="t(actionError)"
        type="error"
        :closable="false"
      />
      <CrudPage
        ref="list"
        :port="port"
        page-key="form:definition"
        :row-actions-width="300"
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
          <el-switch
            v-model="showArchived"
            :active-text="t('forms.archivedVersions')"
            :disabled="archiveBusy"
            @change="list?.reload()"
          />
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
            >{{
              t(showArchived ? "forms.viewArchived" : "forms.view")
            }}</el-button
          ><el-button
            v-if="!showArchived"
            v-perm="permission('formDefinitionRevise')"
            link
            type="primary"
            :icon="useRenderIcon(EditIcon)"
            :disabled="disabled || busy"
            @click="open(row, 'revise')"
            >{{ t("forms.newRevision") }}</el-button
          >
          <el-button
            v-if="showArchived"
            v-perm="permission('formDefinitionSetArchived')"
            link
            type="primary"
            :disabled="disabled || busy || archiveBusy"
            @click="setArchived(row, false)"
            >{{ t("forms.restoreVersion") }}</el-button
          >
          <el-dropdown
            v-else
            class="form-more"
            trigger="click"
            :disabled="disabled || busy || archiveBusy"
          >
            <el-button
              link
              type="primary"
              :disabled="disabled || busy || archiveBusy"
              >{{ t("codeRules.more") }}<ArrowDownIcon class="more-arrow"
            /></el-button>
            <template #dropdown
              ><el-dropdown-menu>
                <Perms :value="permission('formSubmissionAdd')">
                  <el-dropdown-item @click="openAction(row, 'fill')">{{
                    t("autoCodes.fill")
                  }}</el-dropdown-item>
                </Perms>
                <Perms :value="permission('formSubmissionPage')">
                  <el-dropdown-item @click="openAction(row, 'records')">{{
                    t("autoCodes.submissions")
                  }}</el-dropdown-item>
                </Perms>
                <Perms :value="permission('formDefinitionSetArchived')">
                  <el-dropdown-item divided @click="setArchived(row, true)">{{
                    t("forms.archiveVersion")
                  }}</el-dropdown-item>
                </Perms>
              </el-dropdown-menu></template
            >
          </el-dropdown>
        </template>
      </CrudPage>
    </div>
    <el-dialog
      :model-value="Boolean(action)"
      width="min(1080px, 96vw)"
      append-to-body
      destroy-on-close
      :close-on-click-modal="false"
      @update:model-value="action = ''"
    >
      <template #header
        ><el-space wrap
          ><span>{{
            t(action === "fill" ? "autoCodes.fill" : "autoCodes.submissions")
          }}</span
          ><el-tag v-if="targetForm"
            >{{ targetForm.name }} · v{{ targetForm.revision }}</el-tag
          ></el-space
        ></template
      >
      <FormPreview
        v-if="action === 'fill' && targetForm"
        :definition-id="targetForm.id"
        :fields="targetForm.fields"
        :designer="targetForm.designer"
        submit
        @submitted="submitted"
      />
      <FormSubmissions
        v-else-if="action === 'records' && targetForm"
        :definition-id="targetForm.id"
      />
    </el-dialog>
  </div>
</template>
<style scoped>
.form-more {
  margin-left: 12px;
  vertical-align: middle;
}

.more-arrow {
  width: 14px;
  height: 14px;
  margin-left: 4px;
}

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
