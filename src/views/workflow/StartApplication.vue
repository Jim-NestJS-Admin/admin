<script setup lang="ts">
import { ref, watch, computed, defineAsyncComponent } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { ElMessage } from "element-plus";
import { api } from "@/api/client";
import type { components } from "@/api/schema";
import { useFillHeight } from "@/components/Crud/useFillHeight";
import ResourceSelect from "./ResourceSelect.vue";
import WorkflowCanvas from "./WorkflowCanvas.vue";
import { copy, useRequestScope } from "./model";

const FormPreview = defineAsyncComponent(
  () => import("../form/FormPreview.vue")
);
type Schema = components["schemas"];
const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const { busy, error, run, reset } = useRequestScope();
const graphRequest = useRequestScope();
const page = ref<HTMLElement>();
const height = useFillHeight(page, 320);
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
    graphRequest.reset();
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
            size: 1,
            selections: existing?.selections
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

function back() {
  void router.push({
    path: "/workflow/instance",
    query: route.name === "WorkflowApplicationDraft" ? { drafts: "1" } : {}
  });
}

function updateSelection(id: string, value: string[]) {
  selections.value[id] = value;
  const current = definition.value;
  if (!current) return;
  graphRequest.reset();
  void graphRequest.run(async signal => {
    const { data } = await api.workflowDefinitionAvailable(
      {
        body: {
          id: current.id,
          keyword: "",
          page: 1,
          size: 1,
          selections: Object.fromEntries(
            Object.entries(selections.value).filter(([, users]) => users.length)
          )
        }
      },
      { signal }
    );
    if (!signal.aborted && definition.value === current)
      current.progress = data.list[0]?.progress;
  });
}

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
      selections: copy(
        Object.fromEntries(
          Object.entries(selections.value).filter(([, users]) => users.length)
        )
      ),
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
  <section
    ref="page"
    class="application-editor"
    :style="{ height: `${height}px` }"
  >
    <el-page-header @back="back">
      <template #content>{{
        definition?.name || t("workflow.startApplication")
      }}</template>
    </el-page-header>
    <el-alert v-if="error" :title="t(error)" type="error" :closable="false" />
    <el-skeleton v-if="busy && !definition" :rows="4" animated />
    <template v-if="definition?.form?.fields && definition.form.designer">
      <div class="application-layout">
        <section
          class="application-form"
          :aria-label="t('workflow.fillApplication')"
        >
          <div class="application-fields" tabindex="0" :inert="busy">
            <FormPreview
              ref="preview"
              :key="definition.id"
              :definition-id="definition.formDefinitionId"
              :fields="definition.form.fields"
              :designer="definition.form.designer"
              :initial-values="initialValues"
              embedded
            />
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
                  @update:model-value="
                    updateSelection(node.id, $event as string[])
                  "
                />
              </el-form-item>
            </el-form>
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
        </section>
        <aside
          class="application-diagram"
          :aria-label="t('workflow.approvalFlow')"
        >
          <h2>{{ t("workflow.approvalFlow") }}</h2>
          <el-alert
            v-if="graphRequest.error.value"
            :title="t(graphRequest.error.value)"
            type="error"
            :closable="false"
          />
          <WorkflowCanvas
            v-if="definition.progress"
            v-loading="graphRequest.busy.value"
            :progress="definition.progress"
            readonly
            embedded
          />
        </aside>
      </div>
    </template>
  </section>
</template>

<style scoped>
.application-editor {
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
  background: var(--el-bg-color);
  border-radius: var(--el-border-radius-base);
}

.application-editor :deep(.el-page-header) {
  padding: 14px 18px;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.application-layout {
  display: grid;
  flex: 1;
  grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
  min-height: 0;
}

.application-form,
.application-diagram {
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
}

.application-fields {
  flex: 1;
  min-height: 0;
  padding: 20px;
  overflow: auto;
  overscroll-behavior: contain;
}

.application-fields :deep(.form-preview) {
  max-width: none;
}

.application-actions {
  padding: 12px 20px;
  border-top: 1px solid var(--el-border-color-lighter);
}

.application-diagram {
  border-inline-start: 1px solid var(--el-border-color-lighter);
}

.application-diagram h2 {
  padding: 12px 16px;
  margin: 0;
  font-size: 14px;
}

.application-diagram :deep(.workflow-canvas) {
  flex: 1;
}

@media (width <= 850px) {
  .application-layout {
    grid-template-rows: minmax(0, 1fr) minmax(0, 0.8fr);
    grid-template-columns: minmax(0, 1fr);
  }

  .application-diagram {
    border-inline-start: 0;
    border-top: 1px solid var(--el-border-color-lighter);
  }
}
</style>
