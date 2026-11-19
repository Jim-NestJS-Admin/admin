<script setup lang="ts">
import { ref, watch, computed, defineAsyncComponent } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { ElMessage } from "element-plus";
import { api } from "@/api/client";
import type { components } from "@/api/schema";
import ResourceSelect from "./ResourceSelect.vue";
import { copy, useRequestScope } from "./model";

const FormPreview = defineAsyncComponent(
  () => import("../form/FormPreview.vue")
);
type Schema = components["schemas"];
const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const { busy, error, run, reset } = useRequestScope();
const definition = ref<Schema["WorkflowAvailableRow"]>();
const draft = ref<Schema["ApplicationDraftRow"]>();
const initialValues = ref<Record<string, unknown>>({});
const selections = ref<Record<string, string[]>>({});
const preview = ref<InstanceType<typeof FormPreview>>();
const canStart = computed(() =>
  definition.value?.selections.every(node => selections.value[node.id]?.length)
);

watch(
  () => [route.name, route.params.id],
  async ([name, id]) => {
    if (
      name === "WorkflowApplicationDraft" &&
      draft.value?.id === id &&
      definition.value
    )
      return;
    reset();
    definition.value = undefined;
    draft.value = undefined;
    initialValues.value = {};
    selections.value = {};
    if (typeof id !== "string" || !/^[1-9]\d{0,19}$/.test(id)) {
      error.value = "crud.recordUnavailable";
      return;
    }
    await run(async signal => {
      const existing =
        name === "WorkflowApplicationDraft"
          ? (await api.workflowInstanceDraftInfo({ body: { id } }, { signal }))
              .data
          : undefined;
      const { data } = await api.workflowDefinitionAvailable(
        {
          body: {
            id: existing?.definitionId ?? id,
            keyword: "",
            page: 1,
            size: 1
          }
        },
        { signal }
      );
      if (signal.aborted) return;
      const row = data.list[0];
      if (!row?.form?.fields || !row.form.designer)
        throw Error(t("workflow.unavailableChoice"));
      draft.value = existing;
      initialValues.value = existing?.values ?? {};
      selections.value = existing?.selections ?? {};
      definition.value = row;
    });
  },
  { immediate: true }
);

async function submit(action: "draft" | "start") {
  if (
    busy.value ||
    !definition.value ||
    !preview.value ||
    (action === "start" && !canStart.value)
  )
    return;
  await run(async (signal, key) => {
    const values = await preview.value?.applicationValues(action === "start");
    if (!values || signal.aborted || !definition.value) return;
    const body = {
      definitionId: definition.value.id,
      values,
      selections: copy(selections.value),
      ...(draft.value
        ? { draftId: draft.value.id, version: draft.value.version }
        : {})
    };
    const config = {
      signal,
      headers: { "Idempotency-Key": key({ action, body }) }
    };
    if (action === "draft") {
      const { data } = await api.workflowInstanceDraftSave({ body }, config);
      if (signal.aborted) return;
      draft.value = data;
      ElMessage.success(t("workflow.applicationDraftSaved"));
      await router.replace({
        name: "WorkflowApplicationDraft",
        params: { id: data.id }
      });
    } else {
      const { data } = await api.workflowInstanceStartApplication(
        { body },
        config
      );
      if (signal.aborted) return;
      ElMessage.success(t("workflow.started"));
      await router.replace({
        path: "/workflow/instance",
        query: { instanceId: data.id, mine: "1" }
      });
    }
  });
}
</script>

<template>
  <el-card shadow="never" class="application-editor">
    <el-page-header @back="router.push({ name: 'WorkflowApplicationCatalog' })">
      <template #content>{{
        definition?.name || t("workflow.startApplication")
      }}</template>
    </el-page-header>
    <el-alert v-if="error" :title="t(error)" type="error" :closable="false" />
    <el-skeleton v-if="busy && !definition" :rows="4" animated />
    <template v-if="definition?.form?.fields && definition.form.designer">
      <el-form label-position="top" :disabled="busy">
        <el-form-item
          v-for="node in definition.selections"
          :key="node.id"
          :label="node.name"
          required
        >
          <ResourceSelect
            :model-value="selections[node.id] ?? []"
            kind="users"
            multiple
            show-avatars
            :disabled="busy"
            @update:model-value="selections[node.id] = $event as string[]"
          />
        </el-form-item>
      </el-form>
      <div :inert="busy">
        <FormPreview
          ref="preview"
          :key="definition.id"
          :definition-id="definition.formDefinitionId"
          :fields="definition.form.fields"
          :designer="definition.form.designer"
          :initial-values="initialValues"
          embedded
        />
      </div>
      <el-space wrap class="application-actions">
        <el-button :disabled="busy" @click="submit('draft')">{{
          t("workflow.saveApplicationDraft")
        }}</el-button>
        <el-button
          type="primary"
          :loading="busy"
          :disabled="!canStart"
          @click="submit('start')"
        >
          {{ t("workflow.startApplication") }}
        </el-button>
      </el-space>
    </template>
  </el-card>
</template>

<style scoped>
.application-actions {
  margin-block-start: 18px;
}

.application-editor :deep(.el-page-header) {
  margin-block-end: 18px;
}
</style>
