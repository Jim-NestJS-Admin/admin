<script setup lang="ts">
import { computed, ref, onBeforeUnmount } from "vue";
import { useI18n } from "vue-i18n";
import { generatedCrud } from "@/platform/generated-crud";
import { permission } from "@/platform/system/resources";
import { useUserStoreHook } from "@/store/modules/user";
import { onSessionReset } from "@/platform/lifecycle";
import type { CrudPort, CrudRecord } from "@/components/Crud/types";
import CrudPage from "@/components/Crud/CrudPage.vue";
import StartApplication from "./StartApplication.vue";
import WorkflowDocument from "./WorkflowDocument.vue";
defineOptions({ name: "WorkflowWorkbenchPage" });
const { t } = useI18n();
const user = useUserStoreHook();
const tab = ref(
    user.permissions.includes(permission("workflowTaskPage"))
      ? "pending"
      : "mine"
  ),
  start = ref(false),
  detail = ref<{ instanceId: string; taskId?: string }>();
const list = ref<InstanceType<typeof CrudPage>>();
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
function started(id: string) {
  start.value = false;
  tab.value = "mine";
  detail.value = { instanceId: id };
  void list.value?.refresh();
}
const stop = onSessionReset(() => {
  start.value = false;
  detail.value = undefined;
});
onBeforeUnmount(stop);
</script>
<template>
  <div class="workflow-workbench">
    <el-tabs v-model="tab"
      ><el-tab-pane
        v-if="user.permissions.includes(permission('workflowTaskPage'))"
        :label="t('workflow.tabs.pending')"
        name="pending" /><el-tab-pane
        v-if="user.permissions.includes(permission('workflowTaskPage'))"
        :label="t('workflow.tabs.processed')"
        name="processed" /><el-tab-pane
        v-if="user.permissions.includes(permission('workflowInstancePage'))"
        :label="t('workflow.tabs.mine')"
        name="mine" /><el-tab-pane
        v-if="user.permissions.includes(permission('workflowTaskPage'))"
        :label="t('workflow.tabs.copy')"
        name="copy" /></el-tabs
    ><CrudPage
      ref="list"
      :key="tab"
      :port="port"
      :page-key="tab === 'mine' ? 'workflow:instance' : 'workflow:task'"
      :row-actions-width="150"
      ><template #toolbar
        ><el-button
          v-perm="permission('workflowInstanceStart')"
          type="primary"
          @click="start = true"
          >+ {{ t("workflow.startApplication") }}</el-button
        ></template
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
    ><StartApplication
      v-if="start"
      @close="start = false"
      @started="started"
    /><WorkflowDocument
      v-if="detail"
      :instance-id="detail.instanceId"
      :task-id="detail.taskId"
      @close="detail = undefined"
      @changed="list?.refresh()"
    />
  </div>
</template>
<style scoped>
.workflow-workbench {
  min-width: 0;
  min-height: 0;
}

.workflow-workbench :deep(.el-tabs__header) {
  margin-bottom: 12px;
}
</style>
