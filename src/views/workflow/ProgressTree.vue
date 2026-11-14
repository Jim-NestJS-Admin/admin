<script setup lang="ts">
import { useI18n } from "vue-i18n";
import type { Document } from "./model";
defineOptions({ name: "WorkflowProgressTree" });
defineProps<{ nodes: Document["progress"] }>();
const { t } = useI18n();
</script>
<template>
  <el-timeline class="progress-tree"
    ><el-timeline-item
      v-for="node in nodes"
      :key="node.id"
      :type="
        node.status === 'approved'
          ? 'success'
          : node.status === 'pending'
            ? 'primary'
            : node.status === 'returned'
              ? 'danger'
              : 'info'
      "
      :hollow="node.status === 'waiting'"
      ><el-space wrap
        ><strong>{{ node.name }}</strong
        ><el-tag size="small" effect="plain">{{
          t(`workflow.progress.${node.status}`)
        }}</el-tag></el-space
      >
      <section
        v-for="branch in node.branches ?? []"
        :key="branch.id"
        class="progress-branch"
      >
        <p>
          <el-tag
            v-if="node.chosenBranch === branch.id"
            size="small"
            type="success"
            >{{ t("workflow.chosenBranch") }}</el-tag
          >
          {{ branch.name }}
        </p>
        <ProgressTree :nodes="branch.nodes" /></section></el-timeline-item
  ></el-timeline>
</template>
<style scoped>
.progress-tree {
  padding-left: 12px;
}

.progress-branch {
  padding: 12px 8px;
  margin-top: 14px;
  background: var(--el-fill-color-lighter);
  border-radius: 4px;
}

.progress-branch p {
  margin: 0 0 12px;
  font-size: 13px;
  color: var(--el-text-color-secondary);
}
</style>
