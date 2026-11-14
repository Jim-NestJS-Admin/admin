<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { ElMessage, ElMessageBox } from "element-plus";
import { api } from "@/api/client";
import { permission } from "@/platform/system/resources";
import { issuesFrom } from "../form/model";
import {
  allNodes,
  copy,
  newNode,
  useRequestScope,
  type Definition,
  type Designer,
  type Field,
  type Node
} from "./model";
import NodeList from "./NodeList.vue";
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
const fields = ref<Field[]>([]),
  selectedId = ref(""),
  valid = ref(false),
  issues = ref<string[]>([]);
const readonly = computed(() => props.mode === "view");
const selected = computed(() =>
  allNodes(designer.value.nodes).find(n => n.id === selectedId.value)
);
const initial = JSON.stringify({ form: form.value, designer: designer.value });
watch(
  () => form.value.formDefinitionId,
  async id => {
    fields.value = [];
    if (!id) return;
    await run(async signal => {
      fields.value = (
        await api.formDefinitionInfo({ body: { id } }, { signal })
      ).data.fields;
    });
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
      node.actor &&
      ["users", "roles"].includes(node.actor.type) &&
      !node.actor.ids?.length
    )
      issues.value.push(`${node.name}：${t("workflow.needPeople")}`);
    for (const b of node.branches ?? [])
      if (!b.name.trim()) issues.value.push(t("workflow.needBranchName"));
  }
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
async function close(done?: () => void) {
  if (busy.value) return;
  if (
    !readonly.value &&
    initial !== JSON.stringify({ form: form.value, designer: designer.value })
  ) {
    try {
      await ElMessageBox.confirm(
        t("workflow.discardConfirm"),
        t("workflow.leave"),
        { type: "warning" }
      );
    } catch {
      return;
    }
  }
  done?.();
  emit("close");
}
</script>
<template>
  <el-dialog
    :model-value="true"
    width="min(1440px,96vw)"
    top="3vh"
    append-to-body
    destroy-on-close
    :close-on-click-modal="false"
    :before-close="close"
    :title="
      t(
        readonly
          ? 'workflow.viewDefinition'
          : mode === 'revise'
            ? 'workflow.revise'
            : 'workflow.create'
      )
    "
  >
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
      <el-form
        label-position="top"
        :disabled="readonly || busy"
        class="definition-meta"
      >
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
        <el-form-item :label="t('workflow.description')" class="description"
          ><el-input
            v-model="form.description"
            type="textarea"
            maxlength="500"
            show-word-limit
            :rows="2"
        /></el-form-item>
      </el-form>
      <p class="hint">{{ t("workflow.immutableHint") }}</p>
      <div class="designer-layout">
        <div class="designer-canvas">
          <div class="endpoint">{{ t("workflow.startApplicant") }}</div>
          <NodeList
            v-model="designer.nodes"
            :readonly="readonly || busy"
            :selected-id="selectedId"
            @select="selectedId = $event"
          />
          <div class="endpoint">{{ t("workflow.end") }}</div>
        </div>
        <aside class="designer-settings">
          <h3>{{ t("workflow.nodeSettings") }}</h3>
          <NodeSettings
            v-if="selected"
            :model-value="selected"
            :fields="fields"
            :readonly="readonly || busy"
            @update:model-value="setNode"
          /><el-empty
            v-else
            :description="t('workflow.selectNode')"
            :image-size="64"
          />
        </aside>
      </div>
    </div>
    <template #footer
      ><el-space wrap
        ><el-button v-if="!readonly" :disabled="busy" @click="close()">{{
          t("crud.cancel")
        }}</el-button
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
      ></template
    >
  </el-dialog>
</template>
<style scoped>
.workflow-editor {
  display: grid;
  gap: 16px;
}

.hint {
  font-size: 13px;
  line-height: 1.6;
  color: var(--el-text-color-secondary);
}

.definition-meta {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0 24px;
}

.description {
  grid-column: 1/-1;
}

.designer-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 380px;
  min-height: 480px;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 6px;
}

.designer-canvas {
  max-height: 65vh;
  padding: 24px;
  overflow: auto;
  background: var(--el-fill-color-lighter);
}

.endpoint {
  max-width: 220px;
  padding: 12px;
  margin: 10px auto;
  text-align: center;
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color);
  border-radius: 24px;
}

.designer-settings {
  max-height: 65vh;
  padding: 20px;
  overflow: auto;
  border-left: 1px solid var(--el-border-color-lighter);
}

.designer-settings h3 {
  margin: 0 0 20px;
  font-size: 15px;
}

@media (width<=900px) {
  .designer-layout {
    grid-template-columns: 1fr;
  }

  .designer-settings {
    max-height: none;
    border-top: 1px solid var(--el-border-color-lighter);
    border-left: 0;
  }

  .designer-canvas {
    max-height: 45vh;
  }

  .definition-meta {
    grid-template-columns: 1fr;
  }
}
</style>
