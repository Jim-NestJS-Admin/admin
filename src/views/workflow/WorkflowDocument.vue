<script setup lang="ts">
import { computed, ref, onBeforeUnmount, watch } from "vue";
import { useI18n } from "vue-i18n";
import {
  ElMessage,
  ElMessageBox,
  type UploadRequestOptions,
  type UploadUserFile
} from "element-plus";
import { api } from "@/api/client";
import { permission } from "@/platform/system/resources";
import { generatedCrud } from "@/platform/generated-crud";
import { useUserStoreHook } from "@/store/modules/user";
import { onSessionReset } from "@/platform/lifecycle";
import type { CrudPort } from "@/components/Crud/types";
import CrudPage from "@/components/Crud/CrudPage.vue";
import { issuesFrom } from "../form/model";
import {
  useRequestScope,
  copy,
  pendingNodes,
  type Document,
  type Task
} from "./model";
import DocumentFields from "./DocumentFields.vue";
import WorkflowCanvas from "./WorkflowCanvas.vue";
import ResourceSelect from "./ResourceSelect.vue";
const props = defineProps<{ instanceId: string; taskId?: string }>();
const emit = defineEmits<{ close: []; changed: [] }>();
const { t } = useI18n();
const user = useUserStoreHook();
const { busy, error, run } = useRequestScope();
const document = ref<Document>(),
  task = ref<Task>(),
  values = ref<Record<string, unknown>>({}),
  original = ref<Record<string, unknown>>({}),
  patch = ref<Record<string, unknown>>({});
const currentNodes = computed(() =>
  pendingNodes(document.value?.progress ?? [])
);
const detailTab = ref("form");
const nodeNames = computed(() => {
  const names = new Map<string, string>();
  function visit(nodes: Document["progress"]) {
    for (const node of nodes) {
      names.set(node.id, node.name);
      for (const branch of node.branches ?? []) visit(branch.nodes);
    }
  }
  visit(document.value?.progress ?? []);
  return names;
});
const comment = ref(""),
  target = ref(""),
  action = ref<
    "approve" | "reject" | "transfer" | "withdraw" | "resubmit" | "urge"
  >("approve");
const attachments = ref<{ id: string; name: string; uid: number }[]>([]),
  uploads = ref<UploadUserFile[]>([]),
  uploading = ref(0),
  issues = ref<string[]>([]),
  previewing = ref(false),
  previewError = ref("");
const fieldForm = ref<InstanceType<typeof DocumentFields>>(),
  records = ref<InstanceType<typeof CrudPage>>();
let previewRequest: AbortController | undefined,
  previewTimer: ReturnType<typeof setTimeout> | undefined;
const uploadRequests = new Set<AbortController>();
const own = computed(
  () => document.value?.instance.applicantId === user.userId
);
const canAct = computed(
  () =>
    task.value?.kind === "approve" &&
    task.value.status === "pending" &&
    task.value.round === document.value?.instance.round &&
    document.value?.instance.status === "running"
);
const canResubmit = computed(
  () => own.value && document.value?.instance.status === "returned"
);
const permittedActions = computed(() => {
  const available: (typeof action.value)[] = [];
  if (canAct.value) available.push("approve", "reject", "transfer");
  if (canResubmit.value) available.push("resubmit");
  if (
    own.value &&
    ["running", "returned"].includes(document.value?.instance.status ?? "")
  )
    available.push("withdraw");
  if (own.value && document.value?.instance.status === "running")
    available.push("urge");
  const operations = {
    approve: "workflowTaskApprove",
    reject: "workflowTaskReject",
    transfer: "workflowTaskTransfer",
    resubmit: "workflowInstanceResubmit",
    withdraw: "workflowInstanceWithdraw",
    urge: "workflowInstanceUrge"
  } as const;
  return available.filter(a =>
    user.permissions.includes(permission(operations[a]))
  );
});
watch(permittedActions, list => {
  if (!list.includes(action.value) && list.length) action.value = list[0];
});
const generated = generatedCrud("workflowRecord");
const recordFields = [
  "action",
  "nodeId",
  "actorId",
  "comment",
  "createdAt",
  "attachmentIds"
];
const recordPort: CrudPort = {
  describe: async signal => {
    const schema = await generated.port.describe(signal);
    const byField = new Map(
      schema.columns.map(column => [column.field, column])
    );
    return {
      ...schema,
      columns: recordFields.flatMap(field => {
        const column = byField.get(field);
        return column ? [column] : [];
      })
    };
  },
  detail: generated.port.detail,
  preferences: generated.port.preferences,
  list: (query, signal) =>
    generated.port.list(
      {
        ...query,
        equality: { ...query.equality, instanceId: props.instanceId }
      },
      signal
    )
};
async function load() {
  await run(async signal => {
    const r = await api.workflowInstanceDocument(
      {
        body: {
          id: props.instanceId,
          ...(props.taskId ? { taskId: props.taskId } : {})
        }
      },
      { signal }
    );
    document.value = r.data;
    values.value = copy(r.data.form.values);
    original.value = copy(r.data.form.values);
    patch.value = {};
    if (props.taskId)
      task.value = (
        await api.workflowTaskInfo({ body: { id: props.taskId } }, { signal })
      ).data;
    if (permittedActions.value.length) action.value = permittedActions.value[0];
  });
}
void load();
function change(next: Record<string, unknown>) {
  values.value = next;
  for (const [key, value] of Object.entries(next))
    if (document.value?.form.fieldStates[key] === "editable") {
      if (JSON.stringify(value) !== JSON.stringify(original.value[key]))
        patch.value[key] = value;
      else delete patch.value[key];
    }
  previewRequest?.abort();
  clearTimeout(previewTimer);
  previewing.value = true;
  previewTimer = setTimeout(() => void preview(), 300);
}
async function preview() {
  if (!document.value) return;
  const c = (previewRequest = new AbortController());
  previewing.value = true;
  previewError.value = "";
  try {
    const r = await api.workflowInstancePreview(
      {
        body: {
          id: props.instanceId,
          ...(props.taskId ? { taskId: props.taskId } : {}),
          values: patch.value
        }
      },
      { signal: c.signal }
    );
    if (!c.signal.aborted) {
      for (const [key, state] of Object.entries(r.data.form.fieldStates))
        if (
          state === "hidden" &&
          document.value.form.fieldStates[key] === "editable" &&
          values.value[key] != null
        ) {
          patch.value[key] = null;
        }
      document.value = r.data;
      values.value = copy(r.data.form.values);
    }
  } catch (e) {
    if (!c.signal.aborted)
      previewError.value =
        e instanceof Error ? e.message : "crud.requestFailed";
  } finally {
    if (!c.signal.aborted) previewing.value = false;
  }
}
async function upload(options: UploadRequestOptions) {
  const c = new AbortController();
  uploadRequests.add(c);
  uploading.value++;
  try {
    const response = await api.fileAssetUpload(
      { body: { file: options.file } },
      { signal: c.signal, headers: { "Idempotency-Key": crypto.randomUUID() } }
    );
    if (!c.signal.aborted) {
      attachments.value.push({
        id: response.data.id,
        name: options.file.name,
        uid: options.file.uid
      });
      options.onSuccess(response.data);
    }
  } catch (e) {
    if (!c.signal.aborted) {
      error.value = e instanceof Error ? e.message : "crud.requestFailed";
      options.onError(e as Parameters<typeof options.onError>[0]);
    }
  } finally {
    uploadRequests.delete(c);
    uploading.value--;
  }
}
async function download(recordId: string, fileId: string, index: number) {
  await run(async signal => {
    const file = await api.workflowInstanceAttachment(
      { body: { id: props.instanceId, recordId, fileId } },
      { signal }
    );
    if (!(file instanceof Blob)) throw Error(t("crud.requestFailed"));
    const url = URL.createObjectURL(file);
    const a = globalThis.document.createElement("a");
    a.href = url;
    a.download = `${t("workflow.attachment")}-${index + 1}`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
}
async function submit() {
  if (!permittedActions.value.includes(action.value)) return;
  if (
    !document.value ||
    uploading.value ||
    previewing.value ||
    previewError.value
  )
    return;
  if (
    (action.value === "approve" || action.value === "resubmit") &&
    !(await fieldForm.value?.validate())
  )
    return;
  if (action.value === "transfer" && !target.value) {
    error.value = t("workflow.needTarget");
    return;
  }
  try {
    await ElMessageBox.confirm(
      t("workflow.actionConfirm", {
        action: t(`workflow.actions.${action.value}`)
      }),
      t(`workflow.actions.${action.value}`),
      { type: "warning" }
    );
  } catch {
    return;
  }
  await run(async (signal, key) => {
    const current = document.value!.instance;
    const base = {
      id: current.id,
      version: current.version,
      comment: comment.value
    };
    const taskBody = {
      id: task.value?.id ?? "",
      version: task.value?.version ?? 0,
      comment: comment.value,
      attachmentIds: attachments.value.map(a => a.id)
    };
    const requestConfig = (body: unknown) => ({
      signal,
      headers: { "Idempotency-Key": key({ action: action.value, body }) }
    });
    try {
      if (action.value === "approve") {
        const body = { ...taskBody, values: patch.value };
        await api.workflowTaskApprove({ body }, requestConfig(body));
      } else if (action.value === "reject")
        await api.workflowTaskReject(
          { body: taskBody },
          requestConfig(taskBody)
        );
      else if (action.value === "transfer") {
        const body = { ...taskBody, targetUserId: target.value };
        await api.workflowTaskTransfer({ body }, requestConfig(body));
      } else if (action.value === "withdraw")
        await api.workflowInstanceWithdraw({ body: base }, requestConfig(base));
      else if (action.value === "urge")
        await api.workflowInstanceUrge({ body: base }, requestConfig(base));
      else {
        const body = { ...base, values: patch.value };
        await api.workflowInstanceResubmit({ body }, requestConfig(body));
      }
      ElMessage.success(t("workflow.actionDone"));
      emit("changed");
      emit("close");
    } catch (e) {
      issues.value = issuesFrom(e).map(
        i =>
          `${document.value?.form.fields.find(f => i.field === `values.${f.field}` || i.field === `data.${f.field}`)?.title ?? t("workflow.formValues")}：${i.messages.join("；")}`
      );
      throw e;
    }
  });
}
async function close(done?: () => void) {
  if (busy.value || uploading.value) return;
  if (
    Object.keys(patch.value).length ||
    comment.value ||
    attachments.value.length
  ) {
    try {
      await ElMessageBox.confirm(
        t("workflow.discardConfirm"),
        t("workflow.leave")
      );
    } catch {
      return;
    }
  }
  done?.();
  emit("close");
}
function reset() {
  clearTimeout(previewTimer);
  previewRequest?.abort();
  uploadRequests.forEach(c => c.abort());
  document.value = undefined;
  values.value = {};
  patch.value = {};
  attachments.value = [];
  uploads.value = [];
  comment.value = "";
}
const stop = onSessionReset(() => {
  reset();
  emit("close");
});
onBeforeUnmount(() => {
  stop();
  reset();
});
</script>
<template>
  <el-dialog
    class="workflow-document-dialog"
    body-class="workflow-document-body"
    :model-value="true"
    width="min(1440px, calc(100vw - 32px))"
    top="16px"
    append-to-body
    :close-on-click-modal="false"
    :before-close="close"
  >
    <template #header="{ titleId, titleClass }">
      <div class="document-header">
        <h3 :id="titleId" :class="titleClass">
          {{ document?.instance.name ?? t("workflow.applicationDetail") }}
        </h3>
        <template v-if="document">
          <el-tag>{{
            t(`workflow.instanceStatus.${document.instance.status}`)
          }}</el-tag>
          <el-tag effect="plain">v{{ document.instance.revision }}</el-tag>
          <span>{{ t("workflow.round") }} {{ document.instance.round }}</span>
        </template>
      </div>
    </template>
    <el-skeleton v-if="!document && busy" :rows="6" animated />
    <el-alert
      v-if="error"
      class="document-feedback"
      :title="t(error)"
      type="error"
      :closable="false"
      role="alert"
      ><ul>
        <li v-for="(issue, i) in issues" :key="i">{{ issue }}</li>
      </ul></el-alert
    >
    <div v-if="document" class="application-detail">
      <div class="document-layout">
        <el-tabs v-model="detailTab" class="document-tabs">
          <el-tab-pane
            :label="t('workflow.formValues')"
            name="form"
            class="document-form-layout"
          >
            <section
              class="document-form-pane"
              tabindex="0"
              :aria-label="t('workflow.formValues')"
            >
              <h4>{{ document.form.name }}</h4>
              <el-alert
                v-if="previewError"
                :title="t(previewError)"
                type="error"
                :closable="false"
                ><el-button link @click="preview">{{
                  t("workflow.retry")
                }}</el-button></el-alert
              ><DocumentFields
                ref="fieldForm"
                :form="document.form"
                :model-value="values"
                :disabled="busy || (!canAct && !canResubmit)"
                @update:model-value="change"
              />
              <section v-if="permittedActions.length" class="action-form">
                <el-form label-position="top" :disabled="busy"
                  ><el-form-item :label="t('workflow.action')"
                    ><el-select v-model="action"
                      ><el-option
                        v-if="
                          canAct &&
                          user.permissions.includes(
                            permission('workflowTaskApprove')
                          )
                        "
                        value="approve"
                        :label="t('workflow.actions.approve')" /><el-option
                        v-if="
                          canAct &&
                          user.permissions.includes(
                            permission('workflowTaskReject')
                          )
                        "
                        value="reject"
                        :label="t('workflow.actions.reject')" /><el-option
                        v-if="
                          canAct &&
                          user.permissions.includes(
                            permission('workflowTaskTransfer')
                          )
                        "
                        value="transfer"
                        :label="t('workflow.actions.transfer')" /><el-option
                        v-if="
                          canResubmit &&
                          user.permissions.includes(
                            permission('workflowInstanceResubmit')
                          )
                        "
                        value="resubmit"
                        :label="t('workflow.actions.resubmit')" /><el-option
                        v-if="
                          own &&
                          ['running', 'returned'].includes(
                            document.instance.status ?? ''
                          ) &&
                          user.permissions.includes(
                            permission('workflowInstanceWithdraw')
                          )
                        "
                        value="withdraw"
                        :label="t('workflow.actions.withdraw')" /><el-option
                        v-if="
                          own &&
                          document.instance.status === 'running' &&
                          user.permissions.includes(
                            permission('workflowInstanceUrge')
                          )
                        "
                        value="urge"
                        :label="t('workflow.actions.urge')" /></el-select
                  ></el-form-item>
                  <el-form-item
                    v-if="action === 'transfer'"
                    :label="t('workflow.transferTarget')"
                    required
                    ><ResourceSelect
                      v-model="target"
                      kind="users"
                      :disabled="busy" /></el-form-item
                  ><el-form-item :label="t('workflow.comment')"
                    ><el-input
                      v-model="comment"
                      type="textarea"
                      :rows="3"
                      maxlength="1000"
                      show-word-limit
                  /></el-form-item>
                  <el-form-item v-if="canAct" :label="t('workflow.attachments')"
                    ><el-upload
                      v-model:file-list="uploads"
                      v-perm="permission('fileAssetUpload')"
                      :http-request="upload"
                      :limit="10"
                      :disabled="busy || uploading > 0"
                      :on-remove="
                        file => {
                          attachments = attachments.filter(
                            a => a.uid !== file.uid
                          );
                        }
                      "
                      ><el-button>{{
                        t("workflow.uploadAttachment")
                      }}</el-button
                      ><template #tip
                        ><div class="hint">
                          {{ t("workflow.attachmentHint") }}
                        </div></template
                      ></el-upload
                    ></el-form-item
                  >
                </el-form>
              </section>
            </section>
            <footer v-if="permittedActions.length" class="document-actions">
              <el-button
                type="primary"
                :loading="busy"
                :disabled="
                  uploading > 0 ||
                  previewing ||
                  Boolean(previewError) ||
                  !permittedActions.includes(action)
                "
                @click="submit"
                >{{ t(`workflow.actions.${action}`) }}</el-button
              >
            </footer>
          </el-tab-pane>
          <el-tab-pane :label="t('workflow.records')" name="records" lazy>
            <section
              class="approval-records"
              tabindex="0"
              :aria-label="t('workflow.records')"
            >
              <CrudPage
                ref="records"
                class="approval-record-list"
                :port="recordPort"
                page-key="workflow:record"
                :fill="false"
              >
                <template #cell-nodeId="{ value }">{{
                  nodeNames.get(String(value)) ?? value ?? "—"
                }}</template>
                <template #cell-comment="{ value }"
                  ><span class="record-comment">{{
                    value || "—"
                  }}</span></template
                >
                <template #cell-attachmentIds="{ row, value }">
                  <el-space wrap>
                    <el-button
                      v-for="(id, i) in Array.isArray(value) ? value : []"
                      :key="id"
                      link
                      type="primary"
                      :disabled="busy"
                      @click="download(String(row.id), String(id), i)"
                      >{{ t("workflow.attachment") }} {{ i + 1 }}</el-button
                    >
                  </el-space>
                </template>
              </CrudPage>
            </section>
          </el-tab-pane>
        </el-tabs>
        <aside class="document-flow">
          <h4>{{ t("workflow.progressTitle") }}</h4>
          <div v-if="currentNodes.length" class="current-nodes">
            <strong>{{ t("workflow.currentNodes") }}</strong>
            <el-tag v-for="node in currentNodes" :key="node.id" size="small">{{
              node.name
            }}</el-tag>
          </div>
          <WorkflowCanvas
            :progress="document.progress"
            readonly
            show-status
            embedded
          />
        </aside>
      </div>
    </div>
  </el-dialog>
</template>
<style scoped>
:global(.workflow-document-dialog.el-dialog) {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  height: calc(100dvh - 32px);
  margin-block-end: 16px;
  overflow: hidden;
}

:global(.workflow-document-body.el-dialog__body) {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 12px;
  min-height: 0;
  overflow: hidden;
}

.document-feedback {
  max-height: 30%;
  overflow: auto;
}

.application-detail {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;
}

.document-header {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}

.document-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  overflow-wrap: anywhere;
}

.document-header > span {
  font-size: 13px;
  color: var(--el-text-color-secondary);
}

.document-layout {
  display: grid;
  flex: 1;
  grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
  gap: 16px;
  min-height: 0;
}

.document-tabs,
.document-flow {
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
}

.document-tabs :deep(.el-tabs__content) {
  flex: 1;
  min-height: 0;
}

.document-tabs :deep(.el-tab-pane) {
  height: 100%;
}

.document-form-layout {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  padding-inline-end: 12px;
}

.document-form-pane {
  flex: 1;
  min-height: 0;
  padding: 4px 2px 12px;
  overflow: auto;
  overscroll-behavior: contain;
}

.document-actions {
  display: flex;
  flex-shrink: 0;
  justify-content: flex-end;
  padding: 12px 2px 0;
  border-top: 1px solid var(--el-border-color-lighter);
}

.approval-records,
.approval-record-list {
  height: 100%;
}

.approval-records :deep(.crud-table-bounded) {
  flex: 1;
  height: auto;
}

.document-flow :deep(.workflow-canvas) {
  flex: 1;
  height: auto;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: var(--el-border-radius-base);
}

.current-nodes {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  margin-block-end: 12px;
}

.record-comment {
  overflow-wrap: anywhere;
  white-space: pre-wrap;
}

.document-flow {
  padding-inline-start: 16px;
  border-left: 1px solid var(--el-border-color-lighter);
}

h4 {
  margin: 8px 0 20px;
  font-size: 15px;
}

.action-form {
  padding-top: 20px;
  border-top: 1px solid var(--el-border-color-lighter);
}

.hint {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

@media (width<=850px) {
  .document-layout {
    grid-template-rows: minmax(0, 1.25fr) minmax(0, 1fr);
    grid-template-columns: minmax(0, 1fr);
  }

  .document-flow {
    padding: 8px 0 0;
    border-top: 1px solid var(--el-border-color-lighter);
    border-left: 0;
  }
}
</style>
