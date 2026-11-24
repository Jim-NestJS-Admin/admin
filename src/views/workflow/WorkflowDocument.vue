<script setup lang="ts">
import { computed, ref, onBeforeUnmount } from "vue";
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
import MemberPicker from "@/components/MemberPicker/index.vue";
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
import { workflowMemberDirectory } from "./member-directory";
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
const operations = {
  approve: "workflowTaskApprove",
  reject: "workflowTaskReject",
  transfer: "workflowTaskTransfer",
  resubmit: "workflowInstanceResubmit",
  withdraw: "workflowInstanceWithdraw",
  urge: "workflowInstanceUrge"
} as const;
type Action = keyof typeof operations;
const actionStyles = {
  approve: "success",
  reject: "danger",
  resubmit: "primary",
  withdraw: "danger",
  urge: "primary"
} as const;
const comment = ref(""),
  activeAction = ref<Action>();
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
  const available: Action[] = [];
  if (canAct.value) available.push("approve", "reject", "transfer");
  if (canResubmit.value) available.push("resubmit");
  if (
    own.value &&
    ["running", "returned"].includes(document.value?.instance.status ?? "")
  )
    available.push("withdraw");
  if (own.value && document.value?.instance.status === "running")
    available.push("urge");
  return available.filter(a =>
    user.permissions.includes(permission(operations[a]))
  );
});
const actionsDisabled = computed(
  () =>
    busy.value ||
    uploading.value > 0 ||
    previewing.value ||
    Boolean(previewError.value)
);
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
function transfer(value: string | string[]) {
  if (typeof value === "string" && value) void submit("transfer", value);
}
async function submit(action: Action, targetUserId?: string) {
  if (
    !document.value ||
    actionsDisabled.value ||
    activeAction.value ||
    !permittedActions.value.includes(action) ||
    (action === "transfer" && !targetUserId)
  )
    return;
  activeAction.value = action;
  try {
    if (
      (action === "approve" || action === "resubmit") &&
      !(await fieldForm.value?.validate())
    ) {
      detailTab.value = "form";
      return;
    }
    if (action !== "transfer") {
      const label = t(`workflow.actions.${action}`);
      try {
        await ElMessageBox.confirm(
          t("workflow.actionConfirm", { action: label }),
          label,
          { type: "warning" }
        );
      } catch {
        return;
      }
    }
    if (document.value && permittedActions.value.includes(action))
      await executeAction(action, targetUserId);
  } finally {
    activeAction.value = undefined;
  }
}
async function executeAction(action: Action, targetUserId?: string) {
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
      headers: { "Idempotency-Key": key({ action, body }) }
    });
    try {
      if (action === "approve") {
        const body = { ...taskBody, values: patch.value };
        await api.workflowTaskApprove({ body }, requestConfig(body));
      } else if (action === "reject")
        await api.workflowTaskReject(
          { body: taskBody },
          requestConfig(taskBody)
        );
      else if (action === "transfer" && targetUserId) {
        const body = { ...taskBody, targetUserId };
        await api.workflowTaskTransfer({ body }, requestConfig(body));
      } else if (action === "withdraw")
        await api.workflowInstanceWithdraw({ body: base }, requestConfig(base));
      else if (action === "urge")
        await api.workflowInstanceUrge({ body: base }, requestConfig(base));
      else if (action === "resubmit") {
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
  if (busy.value || uploading.value || activeAction.value) return;
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
  <el-drawer
    class="workflow-document-drawer"
    body-class="workflow-document-body"
    :model-value="true"
    size="min(960px, 100vw)"
    direction="rtl"
    append-to-body
    :close-on-click-modal="false"
    :before-close="close"
  >
    <template #header="{ titleId, titleClass }">
      <div class="document-header">
        <h3 :id="titleId" :class="titleClass">
          {{
            document?.form.name ||
            document?.instance.name ||
            t("workflow.applicationDetail")
          }}
        </h3>
        <template v-if="document">
          <el-tag>{{
            t(`workflow.instanceStatus.${document.instance.status}`)
          }}</el-tag>
          <el-tag type="info" effect="plain">
            {{ t("workflow.round") }} {{ document.instance.round }}
          </el-tag>
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
    <el-tabs v-if="document" v-model="detailTab" class="document-tabs">
      <el-tab-pane :label="t('workflow.formValues')" name="form">
        <section
          class="document-form-pane"
          tabindex="0"
          :aria-label="t('workflow.formValues')"
        >
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
            <el-form label-position="top" :disabled="busy">
              <el-form-item :label="t('workflow.comment')"
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
                      attachments = attachments.filter(a => a.uid !== file.uid);
                    }
                  "
                  ><el-button>{{ t("workflow.uploadAttachment") }}</el-button
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
      </el-tab-pane>
      <el-tab-pane :label="t('workflow.progressTitle')" name="progress" lazy>
        <section
          class="document-flow"
          :aria-label="t('workflow.progressTitle')"
        >
          <div v-if="currentNodes.length" class="current-nodes">
            <strong>{{ t("workflow.currentNodes") }}</strong>
            <el-tag v-for="node in currentNodes" :key="node.id" size="small">
              {{ node.name }}
            </el-tag>
          </div>
          <WorkflowCanvas
            :progress="document.progress"
            readonly
            show-status
            embedded
          />
        </section>
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
              ><span class="record-comment">{{ value || "—" }}</span></template
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
    <template v-if="permittedActions.length" #footer>
      <div class="document-actions">
        <template v-for="action in permittedActions" :key="action">
          <MemberPicker
            v-if="action === 'transfer'"
            class="document-transfer"
            :source="workflowMemberDirectory"
            :disabled="actionsDisabled || Boolean(activeAction)"
            :confirm-label="t('workflow.actions.transfer')"
            required
            show-avatars
            @update:model-value="transfer"
          >
            <template #trigger="{ open, disabled }">
              <el-button
                :disabled="disabled"
                :loading="busy && activeAction === 'transfer'"
                aria-haspopup="dialog"
                @click="open"
                >{{ t("workflow.actions.transfer") }}</el-button
              >
            </template>
          </MemberPicker>
          <el-button
            v-else
            :type="actionStyles[action]"
            :loading="busy && activeAction === action"
            :disabled="actionsDisabled || Boolean(activeAction)"
            @click="submit(action)"
            >{{ t(`workflow.actions.${action}`) }}</el-button
          >
        </template>
      </div>
    </template>
  </el-drawer>
</template>
<style scoped>
:global(.workflow-document-drawer .el-drawer__header) {
  margin-block-end: 0;
}

:global(.workflow-document-drawer .el-drawer__footer) {
  border-top: 1px solid var(--el-border-color-lighter);
}

:global(.workflow-document-body.el-drawer__body) {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 0;
  padding-block-start: 4px;
  overflow: hidden;
}

.document-feedback {
  max-height: 30%;
  overflow: auto;
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

.document-tabs,
.document-flow {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
}

.document-tabs :deep(.el-tabs__content) {
  flex: 1;
  min-height: 0;
}

.document-tabs :deep(.el-tab-pane),
.document-flow,
.document-form-pane {
  height: 100%;
}

.document-form-pane {
  padding: 4px 2px 12px;
  overflow: auto;
  overscroll-behavior: contain;
}

.document-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: flex-end;
}

.document-actions :deep(.el-button) {
  margin-inline-start: 0;
}

.document-actions .document-transfer {
  width: auto;
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

.action-form {
  padding-top: 20px;
  border-top: 1px solid var(--el-border-color-lighter);
}

.hint {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}
</style>
