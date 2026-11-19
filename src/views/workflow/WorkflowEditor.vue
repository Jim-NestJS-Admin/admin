<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from "vue";
import { onBeforeRouteLeave, onBeforeRouteUpdate } from "vue-router";
import { onSessionReset } from "@/platform/lifecycle";
import { useI18n } from "vue-i18n";
import { ElMessage, ElMessageBox } from "element-plus";
import { api } from "@/api/client";
import type { components } from "@/api/schema";
import { permission } from "@/platform/system/resources";
import { issuesFrom } from "../form/model";
import {
  allNodes,
  copy,
  newNode,
  parallelApproverBlocks,
  useRequestScope,
  type Definition,
  type Designer,
  type Field,
  type Node
} from "./model";
import WorkflowCanvas from "./WorkflowCanvas.vue";
import NodeSettings from "./NodeSettings.vue";
import ResourceSelect from "./ResourceSelect.vue";
const props = defineProps<{
  record: Definition | null;
  mode: "create" | "revise" | "view";
}>();
const emit = defineEmits<{ saved: []; close: [] }>();
const { t } = useI18n();
const { busy, error, run } = useRequestScope();
const form = ref({
  name: props.record?.name ?? "",
  description: props.record?.description ?? "",
  category: props.record?.category ?? "",
  formDefinitionId: props.record?.formDefinitionId ?? ""
});
const designer = ref<Designer>(
  copy(
    props.record?.designer ?? {
      schemaVersion: 1,
      nodes: [newNode("approve", t("workflow.nodes.approve"))]
    }
  )
);
const boundForm = ref<components["schemas"]["FormDefinitionRow"]>(),
  formState = ref<"loading" | "ready" | "unavailable" | "error">("unavailable"),
  formLoadAttempt = ref(0),
  nodeTab = ref<"approval" | "fields">("approval"),
  selectedId = ref(""),
  panel = ref<"workflow" | "node" | "">(""),
  valid = ref(false),
  issues = ref<string[]>([]);
const readonly = computed(() => props.mode === "view");
const fields = computed<Field[]>(() => boundForm.value?.fields ?? []);
const formLabel = computed(() => {
  const record = boundForm.value;
  return [record?.name, record?.revision && `v${record.revision}`]
    .filter(Boolean)
    .join(" · ");
});
const selected = computed(() =>
  allNodes(designer.value.nodes).find(
    node =>
      node.id === selectedId.value ||
      node.branches?.some(branch => branch.id === selectedId.value)
  )
);
const drawerOpen = computed({
  get: () => panel.value !== "",
  set: (open: boolean) => {
    if (!open) {
      panel.value = "";
      selectedId.value = "";
    }
  }
});
function openNode(id: string) {
  nodeTab.value = "approval";
  selectedId.value = id;
  panel.value = "node";
}
function bindFormForNode() {
  nodeTab.value = "fields";
  panel.value = "workflow";
}
const snapshot = () =>
  JSON.stringify({ form: form.value, designer: designer.value });
const initial = snapshot();
let canLeave = false;
const stop = onSessionReset(() => (canLeave = true));
onBeforeUnmount(stop);
watch(
  () => [form.value.formDefinitionId, formLoadAttempt.value] as const,
  async ([id], _, onCleanup) => {
    boundForm.value = undefined;
    formState.value = id ? "loading" : "unavailable";
    if (!id) return;
    const request = new AbortController();
    onCleanup(() => request.abort());
    try {
      const { data } = await api.formDefinitionInfo(
        { body: { id } },
        { signal: request.signal }
      );
      if (request.signal.aborted) return;
      boundForm.value = data;
      formState.value = Array.isArray(data.fields) ? "ready" : "unavailable";
    } catch {
      if (!request.signal.aborted) formState.value = "error";
    }
  },
  { immediate: true }
);
watch(
  [form, designer],
  () => {
    valid.value = false;
  },
  { deep: true }
);
function replace(nodes: Node[], value: Node): Node[] {
  return nodes.map(n =>
    n.id === value.id
      ? value
      : {
          ...n,
          ...(n.branches
            ? {
                branches: n.branches.map(b => ({
                  ...b,
                  nodes: replace(b.nodes, value)
                }))
              }
            : {})
        }
  );
}
function setNode(node: Node) {
  designer.value.nodes = replace(designer.value.nodes, node);
}
function validateLocal() {
  issues.value = [];
  if (!form.value.name.trim()) issues.value.push(t("workflow.needName"));
  if (!form.value.formDefinitionId) issues.value.push(t("workflow.needForm"));
  const nodes = allNodes(designer.value.nodes);
  if (!nodes.some(n => n.type === "approve"))
    issues.value.push(t("workflow.needApproval"));
  for (const node of nodes) {
    if (!node.name.trim()) issues.value.push(t("workflow.needNodeName"));
    if (
      (node.type === "approve" || node.type === "copy") &&
      (!node.actor ||
        (["users", "roles"].includes(node.actor.type) &&
          !node.actor.ids?.length))
    )
      issues.value.push(`${node.name}：${t("workflow.needPeople")}`);
    if (node.type === "approve" && node.actor?.type === "users") {
      const blocked = parallelApproverBlocks(designer.value.nodes, node.id);
      for (const branch of new Set(
        node.actor.ids?.map(id => blocked[id]).filter(Boolean)
      ))
        issues.value.push(
          `${node.name}：${t("workflow.memberInBranch", { name: branch })}`
        );
    }
    for (const b of node.branches ?? [])
      if (!b.name.trim()) issues.value.push(t("workflow.needBranchName"));
  }
  if (!form.value.name.trim() || !form.value.formDefinitionId)
    panel.value = "workflow";
  return !issues.value.length;
}
async function inspect() {
  if (!validateLocal()) return;
  await run(async signal => {
    try {
      await api.workflowDefinitionInspect(
        {
          body: {
            formDefinitionId: form.value.formDefinitionId,
            designer: designer.value
          }
        },
        { signal }
      );
      valid.value = true;
    } catch (e) {
      issues.value = issuesFrom(e).map(
        i =>
          `${i.field.replace(/^data\.designer\.nodes/, "")}: ${i.messages.join("；")}`
      );
      throw e;
    }
  });
}
async function save() {
  if (!validateLocal()) return;
  await run(async (signal, key) => {
    try {
      await api.workflowDefinitionInspect(
        {
          body: {
            formDefinitionId: form.value.formDefinitionId,
            designer: designer.value
          }
        },
        { signal }
      );
      const data = {
        ...form.value,
        name: form.value.name.trim(),
        designer: designer.value
      };
      const body =
        props.mode === "revise"
          ? {
              definitionId: props.record!.id,
              baseRevision: props.record!.revision!,
              data
            }
          : { data };
      const config = { signal, headers: { "Idempotency-Key": key(body) } };
      if (props.mode === "revise")
        await api.workflowDefinitionRevise(
          {
            body: body as Parameters<
              typeof api.workflowDefinitionRevise
            >[0]["body"]
          },
          config
        );
      else await api.workflowDefinitionAdd({ body: { data } }, config);
      ElMessage.success(t("workflow.savedDraft"));
      canLeave = true;
      emit("saved");
    } catch (e) {
      issues.value = issuesFrom(e).map(i => i.messages.join("；"));
      throw e;
    }
  });
}
async function publish() {
  if (!props.record) return;
  try {
    await ElMessageBox.confirm(
      t("workflow.publishConfirm"),
      t("workflow.publish"),
      { type: "warning" }
    );
  } catch {
    return;
  }
  await run(async (signal, key) => {
    const body = { id: props.record!.id, version: props.record!.version };
    await api.workflowDefinitionPublish(
      { body },
      { signal, headers: { "Idempotency-Key": key(body) } }
    );
    ElMessage.success(t("workflow.published"));
    emit("saved");
  });
}
async function confirmLeave() {
  if (canLeave || readonly.value) return true;
  if (busy.value) return false;
  if (initial === snapshot()) return true;
  try {
    await ElMessageBox.confirm(
      t("workflow.discardConfirm"),
      t("workflow.leave"),
      { type: "warning" }
    );
    return true;
  } catch {
    return false;
  }
}
onBeforeRouteLeave(confirmLeave);
onBeforeRouteUpdate(confirmLeave);
</script>
<template>
  <section class="workflow-designer-page">
    <header class="workflow-designer-page__header">
      <el-page-header @back="emit('close')">
        <template #content>
          {{
            t(
              readonly
                ? "workflow.viewDefinition"
                : mode === "revise"
                  ? "workflow.revise"
                  : "workflow.create"
            )
          }}
        </template>
      </el-page-header>
      <div class="workflow-designer-page__actions">
        <el-space wrap
          ><el-button :disabled="busy" @click="panel = 'workflow'">{{
            t("workflow.definitionDetails")
          }}</el-button
          ><el-button
            v-if="!readonly"
            :disabled="busy"
            @click="emit('close')"
            >{{ t("crud.cancel") }}</el-button
          ><el-button
            v-if="!readonly"
            v-perm="permission('workflowDefinitionInspect')"
            :loading="busy"
            @click="inspect"
            >{{ t("workflow.inspect") }}</el-button
          ><el-button
            v-if="!readonly"
            v-perm="
              permission(
                mode === 'revise'
                  ? 'workflowDefinitionRevise'
                  : 'workflowDefinitionAdd'
              )
            "
            type="primary"
            :loading="busy"
            @click="save"
            >{{ t("workflow.saveDraft") }}</el-button
          ><el-button
            v-if="readonly && record?.status === 'draft'"
            v-perm="permission('workflowDefinitionPublish')"
            type="primary"
            :loading="busy"
            @click="publish"
            >{{ t("workflow.publish") }}</el-button
          ></el-space
        >
      </div>
    </header>
    <div v-loading="busy" class="workflow-editor">
      <el-space v-if="record" wrap
        ><el-tag>{{ record.name }}</el-tag
        ><el-tag effect="plain">v{{ record.revision }}</el-tag
        ><span class="hint">{{ record.code }}</span></el-space
      >
      <el-alert
        v-if="error || issues.length"
        :title="error ? t(error) : t('workflow.correctFields')"
        type="error"
        :closable="false"
        role="alert"
        ><ul v-if="issues.length">
          <li v-for="(issue, i) in issues" :key="i">{{ issue }}</li>
        </ul></el-alert
      >
      <el-alert
        v-if="valid"
        :title="t('workflow.inspectionPassed')"
        type="success"
        :closable="false"
      />
      <WorkflowCanvas
        v-model:nodes="designer.nodes"
        :readonly="readonly || busy"
        :active-id="selected?.id ?? ''"
        :first-field="fields[0]?.field ?? ''"
        @select="openNode"
        @details="panel = 'workflow'"
      />
    </div>
    <el-drawer
      v-model="drawerOpen"
      :title="
        panel === 'workflow'
          ? t('workflow.definitionDetails')
          : selected?.name || t('workflow.nodeSettings')
      "
      size="min(600px, 100vw)"
      append-to-body
    >
      <template v-if="panel === 'workflow'">
        <el-form label-position="top" :disabled="readonly || busy">
          <el-form-item
            :label="t('workflow.name')"
            required
            :error="
              !form.name.trim() && issues.length
                ? t('workflow.needName')
                : undefined
            "
            ><el-input v-model="form.name" maxlength="100" show-word-limit
          /></el-form-item>
          <el-form-item :label="t('workflow.formVersion')" required
            ><ResourceSelect
              :model-value="form.formDefinitionId"
              kind="forms"
              :disabled="readonly || busy"
              @update:model-value="form.formDefinitionId = String($event)"
          /></el-form-item>
          <el-form-item :label="t('workflow.applicationCategory')">
            <el-input v-model="form.category" maxlength="50" />
          </el-form-item>
          <el-form-item :label="t('workflow.description')"
            ><el-input
              v-model="form.description"
              type="textarea"
              maxlength="500"
              show-word-limit
              :rows="2"
          /></el-form-item>
        </el-form>
        <p class="hint">{{ t("workflow.immutableHint") }}</p>
        <el-button
          v-if="selected && nodeTab === 'fields'"
          @click="panel = 'node'"
        >
          {{ t("workflow.returnToFieldPermissions") }}
        </el-button>
      </template>
      <NodeSettings
        v-else-if="selected"
        :key="selected.id"
        :model-value="selected"
        :fields="fields"
        :form-definition-id="form.formDefinitionId"
        :form-label="formLabel"
        :form-state="formState"
        :initial-tab="nodeTab"
        :blocked-members="parallelApproverBlocks(designer.nodes, selected.id)"
        :readonly="readonly || busy"
        @update:model-value="setNode"
        @bind-form="bindFormForNode"
        @retry-form="formLoadAttempt++"
      />
    </el-drawer>
  </section>
</template>
<style scoped>
.workflow-designer-page {
  min-width: 0;
  overflow: hidden;
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 6px;
}

.workflow-designer-page__header {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.workflow-editor > .el-alert,
.workflow-editor > .el-space {
  margin: 12px 16px;
}

.hint {
  font-size: 13px;
  line-height: 1.6;
  color: var(--el-text-color-secondary);
}
</style>
