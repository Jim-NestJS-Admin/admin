<script setup lang="ts">
import { computed, ref, onBeforeUnmount } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { api } from "@/api/client";
import { generatedCrud } from "@/platform/generated-crud";
import { permission } from "@/platform/system/resources";
import { onSessionReset } from "@/platform/lifecycle";
import { useWorkflowCounts } from "@/store/modules/workflow-counts";
import type { CrudPort, CrudRecord } from "@/components/Crud/types";
import CrudPage from "@/components/Crud/CrudPage.vue";
import WorkflowDocument from "../workflow/WorkflowDocument.vue";
import { useRequestScope } from "../workflow/model";
import { defaultCell } from "@/components/Crud/model.mjs";
import {
  inboxFilter,
  inboxTabs,
  messageDestination,
  notificationEventLabels
} from "./inbox";
const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const workflowCounts = useWorkflowCounts();
const { busy, error, run } = useRequestScope();
const generated = generatedCrud("notifyMessage");
const tab = computed(
  () => inboxTabs.find(item => item.key === route.query.tab)?.key ?? "all"
);
const port: CrudPort = {
  ...generated.port,
  async describe(signal) {
    const schema = await generated.port.describe(signal);
    return {
      ...schema,
      query: schema.query.map(field =>
        field.field === "event"
          ? {
              ...field,
              operators: field.operators.filter(op =>
                ["eq", "ne", "in", "notIn"].includes(op)
              ),
              options: Array.from(
                notificationEventLabels,
                ([value, label]) => ({
                  value,
                  label: t(label)
                })
              )
            }
          : field
      )
    };
  },
  list(query, signal) {
    if (tab.value === "all") return generated.port.list(query, signal);
    const filter = inboxFilter(tab.value);
    return generated.port.list(
      {
        ...query,
        advanced: query.advanced
          ? { op: "and", items: [filter, query.advanced] }
          : filter
      },
      signal
    );
  }
};
function messageCell(row: CrudRecord, field: string) {
  const cell = defaultCell(row, field);
  if (
    field !== "event" ||
    (cell.state !== "visible" && cell.state !== "readonly") ||
    typeof cell.display !== "string" ||
    !cell.display
  )
    return cell;
  return {
    ...cell,
    display: t(
      notificationEventLabels.get(cell.display) ?? "notifications.event.other"
    )
  };
}
const list = ref<InstanceType<typeof CrudPage>>();
const detail = ref<{ instanceId: string; taskId?: string }>();
function changeTab(key: string | number) {
  return router.replace({ query: key === "all" ? {} : { tab: key } });
}
async function open(row: CrudRecord) {
  await run(async (signal, key) => {
    if (row.readAt === null) {
      const body = { id: String(row.id) };
      await api.notifyMessageRead(
        { body },
        { signal, headers: { "Idempotency-Key": key(body) } }
      );
      if (signal.aborted) return;
      void workflowCounts.refreshUnread();
      void list.value?.refresh();
    }
    if (signal.aborted) return;
    const target = messageDestination(row);
    if (target?.kind === "mcp")
      await router.push({
        path: "/automation/confirm",
        query: { operation: target.instanceId }
      });
    else if (target) detail.value = target;
  });
}
const stop = onSessionReset(() => {
  detail.value = undefined;
});
onBeforeUnmount(stop);
</script>
<template>
  <div class="notification-center">
    <el-tabs
      :model-value="tab"
      class="notification-center__tabs"
      @tab-change="changeTab"
    >
      <el-tab-pane name="all" :label="t('notifications.all')" />
      <el-tab-pane
        v-for="item in inboxTabs"
        :key="item.key"
        :name="item.key"
        :label="t(item.label)"
      />
    </el-tabs>
    <el-alert v-if="error" :title="t(error)" type="error" :closable="false" />
    <CrudPage
      :key="tab"
      ref="list"
      :port="port"
      :cell="messageCell"
      page-key="notify:message"
    >
      <template #cell-readAt="{ value, text }">
        <el-tag v-if="value === null" type="primary" size="small">
          {{ t("notifications.unreadStatus") }}
        </el-tag>
        <span v-else>{{ text }}</span>
      </template>
      <template #row-actions="{ row }">
        <el-button
          v-if="row.readAt === null || messageDestination(row)"
          v-perm="permission('notifyMessageRead')"
          link
          type="primary"
          :disabled="busy"
          @click="open(row)"
          >{{
            t(
              messageDestination(row)
                ? "notifications.open"
                : "notifications.markRead"
            )
          }}</el-button
        >
      </template>
    </CrudPage>
    <WorkflowDocument
      v-if="detail"
      :instance-id="detail.instanceId"
      :task-id="detail.taskId"
      @close="detail = undefined"
      @changed="list?.refresh()"
    />
  </div>
</template>

<style scoped>
.notification-center__tabs {
  padding: 0 16px;
  background: var(--el-bg-color);
}

.notification-center__tabs :deep(.el-tabs__header) {
  margin: 0;
}
</style>
