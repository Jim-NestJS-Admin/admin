<script setup lang="ts">
import { ref, watch, computed, defineAsyncComponent } from "vue";
import { useI18n } from "vue-i18n";
import { ElMessage, ElMessageBox } from "element-plus";
import { api } from "@/api/client";
import type { components } from "@/api/schema";
import { permission } from "@/platform/system/resources";
import ResourceSelect from "./ResourceSelect.vue";
import { useRequestScope } from "./model";
const FormPreview = defineAsyncComponent(
  () => import("../form/FormPreview.vue")
);
const emit = defineEmits<{ close: []; started: [id: string] }>();
const { t } = useI18n();
const { busy, error, run } = useRequestScope();
const definitionId = ref(""),
  submissionId = ref(""),
  mode = ref<"new" | "existing">("new"),
  selections = ref<Record<string, string[]>>({});
const definition = ref<components["schemas"]["WorkflowAvailableRow"]>();
const canStart = computed(() =>
  Boolean(
    definition.value &&
      submissionId.value &&
      definition.value.selections.every(n => selections.value[n.id]?.length)
  )
);
watch(definitionId, async id => {
  definition.value = undefined;
  submissionId.value = "";
  selections.value = {};
  mode.value = "new";
  if (id)
    await run(async signal => {
      const row = (
        await api.workflowDefinitionAvailable(
          { body: { id, keyword: "", page: 1, size: 1 } },
          { signal }
        )
      ).data.list[0];
      if (!row?.form) throw Error(t("workflow.unavailableChoice"));
      definition.value = row;
    });
});
async function start() {
  if (!canStart.value) return;
  await run(async (signal, key) => {
    const body = {
      definitionId: definitionId.value,
      submissionId: submissionId.value,
      selections: selections.value
    };
    const r = await api.workflowInstanceStart(
      { body },
      { signal, headers: { "Idempotency-Key": key(body) } }
    );
    ElMessage.success(t("workflow.started"));
    emit("started", r.data.id);
  });
}
function submitted(record: components["schemas"]["FormSubmissionRow"]) {
  submissionId.value = record.id;
  mode.value = "existing";
  ElMessage.success(t("workflow.submissionReady"));
}
async function close(done?: () => void) {
  if (busy.value) return;
  if (submissionId.value) {
    try {
      await ElMessageBox.confirm(
        t("workflow.savedSubmissionHint"),
        t("workflow.leave")
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
    :title="t('workflow.startApplication')"
    width="min(980px,96vw)"
    top="4vh"
    append-to-body
    :close-on-click-modal="false"
    :before-close="close"
  >
    <div class="start-application">
      <el-alert v-if="error" :title="t(error)" type="error" :closable="false" />
      <el-steps :active="submissionId ? 2 : definition ? 1 : 0" simple
        ><el-step :title="t('workflow.selectWorkflow')" /><el-step
          :title="t('workflow.fillApplication')" /><el-step
          :title="t('workflow.startApplication')"
      /></el-steps>
      <el-form label-position="top" :disabled="busy"
        ><el-form-item :label="t('workflow.selectWorkflow')" required
          ><ResourceSelect
            v-model="definitionId"
            kind="workflows"
            published
            :disabled="busy" /></el-form-item
        ><el-form-item
          v-for="node in definition?.selections ?? []"
          :key="node.id"
          :label="node.name"
          required
          ><ResourceSelect
            :model-value="selections[node.id] ?? []"
            kind="users"
            multiple
            :disabled="busy"
            @update:model-value="
              selections[node.id] = $event as string[]
            " /></el-form-item
      ></el-form>
      <template v-if="definition?.form"
        ><el-radio-group v-model="mode" :disabled="busy"
          ><el-radio-button
            value="new"
            :label="t('workflow.fillNew')" /><el-radio-button
            value="existing"
            :label="t('workflow.useSubmission')"
        /></el-radio-group>
        <FormPreview
          v-if="mode === 'new'"
          :key="definitionId"
          :definition-id="definition.formDefinitionId"
          :fields="definition.form.fields!"
          :designer="definition.form.designer!"
          submit
          @submitted="submitted"
        />
        <el-form v-else label-position="top"
          ><el-form-item :label="t('workflow.mySubmission')" required
            ><ResourceSelect
              v-model="submissionId"
              kind="submissions"
              :definition-id="definition.formDefinitionId"
              :disabled="busy" /></el-form-item
        ></el-form>
      </template>
      <p class="hint">{{ t("workflow.startHint") }}</p>
    </div>
    <template #footer
      ><el-button :disabled="busy" @click="close()">{{
        t("crud.cancel")
      }}</el-button
      ><el-button
        v-perm="permission('workflowInstanceStart')"
        type="primary"
        :loading="busy"
        :disabled="!canStart"
        @click="start"
        >{{ t("workflow.startApplication") }}</el-button
      ></template
    >
  </el-dialog>
</template>
<style scoped>
.start-application {
  display: grid;
  gap: 20px;
  min-width: 0;
}

.hint {
  font-size: 13px;
  line-height: 1.6;
  color: var(--el-text-color-secondary);
}

.start-application :deep(.form-preview) {
  max-width: none;
}
</style>
