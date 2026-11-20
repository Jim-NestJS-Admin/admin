<script setup lang="ts">
import { computed, ref, onBeforeUnmount, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { generatedCrud } from "@/platform/generated-crud";
import { permission } from "@/platform/system/resources";
import { useUserStoreHook } from "@/store/modules/user";
import { onSessionReset } from "@/platform/lifecycle";
import type { CrudPort, CrudRecord } from "@/components/Crud/types";
import CrudPage from "@/components/Crud/CrudPage.vue";
import { useFillHeight } from "@/components/Crud/useFillHeight";
import WorkflowDocument from "./WorkflowDocument.vue";
import ApplicationCatalog from "./ApplicationCatalog.vue";
import ApplicationDrafts from "./ApplicationDrafts.vue";
defineOptions({ name: "WorkflowWorkbenchPage" });
const { t } = useI18n();
const user = useUserStoreHook();
const tab = ref(
    user.permissions.includes(permission("workflowTaskPage"))
      ? "pending"
      : "mine"
  ),
  detail = ref<{ instanceId: string; taskId?: string }>();
const list = ref<InstanceType<typeof CrudPage>>();
const page = ref<HTMLElement>();
const height = useFillHeight(page);
const catalogOpen = ref(false);
const canApply = computed(() =>
  user.permissions.includes(permission("workflowInstanceStart"))
);
const route = useRoute();
const router = useRouter();
watch(
  () => [
    route.query.instanceId,
    route.query.taskId,
    route.query.mine,
    route.query.drafts,
    route.query.apply
  ],
  ([value, taskId, mine, drafts, apply]) => {
    if (typeof value === "string" && /^[1-9]\d{0,19}$/.test(value))
      detail.value = {
        instanceId: value,
        ...(typeof taskId === "string" && /^[1-9]\d{0,19}$/.test(taskId)
          ? { taskId }
          : {})
      };
    if (
      mine === "1" &&
      user.permissions.includes(permission("workflowInstancePage"))
    )
      tab.value = "mine";
    if (drafts === "1" && canApply.value) tab.value = "drafts";
    if (apply === "1" && canApply.value) catalogOpen.value = true;
  },
  { immediate: true }
);
function closeCatalog() {
  catalogOpen.value = false;
  if (route.path === "/workflow/instance" && route.query.apply === "1") {
    const query = { ...route.query };
    delete query.apply;
    void router.replace({ query });
  }
}
function closeDocument() {
  detail.value = undefined;
  if (route.query.instanceId) {
    const query = { ...route.query };
    delete query.instanceId;
    delete query.taskId;
    void router.replace({ query });
  }
}
const port = computed<CrudPort>(() => {
  const resource = tab.value === "mine" ? "workflowInstance" : "workflowTask";
  const g = generatedCrud(resource);
  const status =
    tab.value === "pending"
      ? { kind: "approve", status: "pending" }
      : tab.value === "copy"
        ? { kind: "copy", status: "copied" }
        : tab.value === "mine"
          ? { applicantId: user.userId }
          : { kind: "approve" };
  return {
    describe: g.port.describe,
    detail: g.port.detail,
    preferences: g.port.preferences,
    list: (query, signal) =>
      g.port.list(
        {
          ...query,
          equality: { ...query.equality, ...status },
          ...(tab.value === "processed"
            ? {
                advanced: {
                  op: "and",
                  items: [
                    {
                      op: "or",
                      items: ["approved", "rejected", "transferred"].map(
                        value => ({ field: "status", op: "eq", value })
                      )
                    },
                    ...(query.advanced ? [query.advanced] : [])
                  ]
                }
              }
            : {})
        },
        signal
      )
  };
});
function open(row: CrudRecord) {
  detail.value = {
    instanceId: String(tab.value === "mine" ? row.id : row.instanceId),
    ...(tab.value !== "mine" ? { taskId: String(row.id) } : {})
  };
}
const stop = onSessionReset(() => {
  detail.value = undefined;
  catalogOpen.value = false;
});
onBeforeUnmount(stop);
</script>
<template>
  <div ref="page" class="workflow-workbench" :style="{ height: `${height}px` }">
    <header class="workbench-header">
      <el-tabs v-model="tab"
        ><el-tab-pane
          v-if="user.permissions.includes(permission('workflowTaskPage'))"
          :label="t('workflow.tabs.pending')"
          name="pending"
        /><el-tab-pane
          v-if="user.permissions.includes(permission('workflowTaskPage'))"
          :label="t('workflow.tabs.processed')"
          name="processed"
        /><el-tab-pane
          v-if="user.permissions.includes(permission('workflowInstancePage'))"
          :label="t('workflow.tabs.mine')"
          name="mine"
        /><el-tab-pane
          v-if="user.permissions.includes(permission('workflowTaskPage'))"
          :label="t('workflow.tabs.copy')"
          name="copy"
        />
        <el-tab-pane
          v-if="canApply"
          :label="t('workflow.applicationDrafts')"
          name="drafts"
        />
      </el-tabs>
      <el-button v-if="canApply" type="primary" @click="catalogOpen = true"
        >+ {{ t("workflow.startApplication") }}</el-button
      >
    </header>
    <ApplicationDrafts v-if="tab === 'drafts'" class="workbench-body" />
    <CrudPage
      v-else
      :key="tab"
      ref="list"
      class="workbench-body"
      :port="port"
      :page-key="tab === 'mine' ? 'workflow:instance' : 'workflow:task'"
      :row-actions-width="150"
      ><template #cell-revision="{ value }"
        ><el-tag size="small">v{{ value }}</el-tag></template
      ><template #row-actions="{ row, disabled }"
        ><el-button
          v-perm="permission('workflowInstanceDocument')"
          link
          type="primary"
          :disabled="disabled"
          @click="open(row)"
          >{{
            t(
              tab === "pending"
                ? "workflow.handle"
                : "workflow.applicationDetail"
            )
          }}</el-button
        ></template
      ></CrudPage
    >
    <ApplicationCatalog v-if="catalogOpen" @close="closeCatalog" />
    <WorkflowDocument
      v-if="detail"
      :instance-id="detail.instanceId"
      :task-id="detail.taskId"
      @close="closeDocument"
      @changed="list?.refresh()"
    />
  </div>
</template>
<style scoped>
.workflow-workbench {
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
  background: var(--el-bg-color);
  border-radius: var(--el-border-radius-base);
}

.workbench-header {
  display: flex;
  flex-wrap: wrap;
  gap: 0 16px;
  align-items: center;
  justify-content: space-between;
  padding: 6px 16px;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.workbench-header :deep(.el-tabs) {
  min-width: 0;
}

.workbench-header :deep(.el-tabs__header) {
  margin: 0;
}

.workbench-header :deep(.el-tabs__nav-wrap::after) {
  background: transparent;
}

.workbench-body {
  flex: 1;
  min-height: 0;
}
</style>
