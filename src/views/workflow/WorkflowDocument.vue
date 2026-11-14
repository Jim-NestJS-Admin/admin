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
import { useRequestScope, copy, type Document, type Task } from "./model";
import DocumentFields from "./DocumentFields.vue";
import ProgressTree from "./ProgressTree.vue";
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
const recordPort: CrudPort = {
  describe: generated.port.describe,
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
    :model-value="true"
    :title="t('workflow.applicationDetail')"
    width="min(1320px,96vw)"
    top="3vh"
    append-to-body
    :close-on-click-modal="false"
    :before-close="close"
  >
    <el-skeleton v-if="!document && busy" :rows="6" animated />
    <el-alert
      v-if="error"
      :title="t(error)"
      type="error"
      :closable="false"
      role="alert"
      ><ul>
        <li v-for="(issue, i) in issues" :key="i">{{ issue }}</li>
      </ul></el-alert
    >
    <div v-if="document" class="application-detail">
      <header class="document-header">
        <h3>{{ document.instance.name }}</h3>
        <el-tag>{{
          t(`workflow.instanceStatus.${document.instance.status}`)
        }}</el-tag
        ><el-tag effect="plain">v{{ document.instance.revision }}</el-tag
        ><span>{{ t("workflow.round") }} {{ document.instance.round }}</span>
      </header>
      <div class="document-layout">
        <main>
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
          <section
            v-if="
              canAct ||
              canResubmit ||
              (own &&
                ['running', 'returned'].includes(
                  document.instance.status ?? ''
                ))
            "
            class="action-form"
          >
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
            <el-button
              type="primary"
              :loading="busy"
              :disabled="
                uploading > 0 ||
                previewing ||
                Boolean(previewError) ||
                !user.permissions.includes(
                  permission(
                    action === 'approve'
                      ? 'workflowTaskApprove'
                      : action === 'reject'
                        ? 'workflowTaskReject'
                        : action === 'transfer'
                          ? 'workflowTaskTransfer'
                          : action === 'withdraw'
                            ? 'workflowInstanceWithdraw'
                            : action === 'urge'
                              ? 'workflowInstanceUrge'
                              : 'workflowInstanceResubmit'
                  )
                )
              "
              @click="submit"
              >{{ t(`workflow.actions.${action}`) }}</el-button
            >
          </section>
        </main>
        <aside>
          <h4>{{ t("workflow.progressTitle") }}</h4>
          <ProgressTree :nodes="document.progress" />
        </aside>
      </div>
      <section class="approval-records">
        <h4>{{ t("workflow.records") }}</h4>
        <CrudPage
          ref="records"
          :port="recordPort"
          page-key="workflow:record"
          :fill="false"
          ><template #cell-attachmentIds="{ row, value }"
            ><el-space wrap
              ><el-button
                v-for="(id, i) in Array.isArray(value) ? value : []"
                :key="id"
                link
                type="primary"
                :disabled="busy"
                @click="download(String(row.id), String(id), i)"
                >{{ t("workflow.attachment") }} {{ i + 1 }}</el-button
              ></el-space
            ></template
          ></CrudPage
        >
      </section>
    </div>
  </el-dialog>
</template>
<style scoped>
.application-detail {
  display: grid;
  gap: 20px;
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
}

.document-header > span {
  font-size: 13px;
  color: var(--el-text-color-secondary);
}

.document-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  gap: 28px;
}

.document-layout > main,
.document-layout > aside {
  min-width: 0;
}

.document-layout > aside {
  padding-left: 20px;
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

.approval-records {
  padding-top: 20px;
  border-top: 1px solid var(--el-border-color-lighter);
}

.hint {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

@media (width<=850px) {
  .document-layout {
    grid-template-columns: 1fr;
  }

  .document-layout > aside {
    padding: 20px 0 0;
    border-top: 1px solid var(--el-border-color-lighter);
    border-left: 0;
  }
}
</style>
