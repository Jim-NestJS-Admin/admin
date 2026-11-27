<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { permission } from "@/platform/system/resources";
import { useUserStoreHook } from "@/store/modules/user";
import { useWorkflowCounts } from "@/store/modules/workflow-counts";

const { t } = useI18n();
const user = useUserStoreHook();
const router = useRouter();
const counts = useWorkflowCounts();
const workbench = "/workflow/instance";
const canOpenWorkbench = computed(() => {
  return (
    user.isAuthenticated &&
    router.getRoutes().some(route => route.path === workbench)
  );
});
const canViewPending = computed(
  () =>
    canOpenWorkbench.value &&
    user.permissions.includes(permission("workflowTaskPage"))
);
const canApply = computed(
  () =>
    canOpenWorkbench.value &&
    user.permissions.includes(permission("workflowInstanceStart"))
);
const pending = computed(() => counts.pendingByPath[workbench]);
</script>
<template>
  <el-card>
    <h1>{{ t("admin.welcome") }}</h1>
    <p>{{ user.nickname || user.username }}</p>
    <el-space v-if="canViewPending || canApply" wrap class="workbench-actions">
      <el-badge
        v-if="canViewPending"
        :value="pending"
        :max="99"
        :hidden="!pending"
      >
        <el-button
          :aria-label="`${t('workflow.tabs.pending')} · ${t('notifications.pending', { count: pending })}`"
          @click="router.push({ path: workbench, query: { pending: '1' } })"
          >{{ t("workflow.tabs.pending") }}</el-button
        >
      </el-badge>
      <el-button
        v-if="canApply"
        type="primary"
        @click="router.push({ path: workbench, query: { apply: '1' } })"
        >{{ t("workflow.startApplication") }}</el-button
      >
    </el-space>
    <el-empty v-else :description="t('admin.selectMenu')" />
  </el-card>
</template>

<style scoped>
.workbench-actions {
  margin-top: 16px;
}
</style>
