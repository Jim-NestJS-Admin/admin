<script setup lang="ts">
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import CrudPage from "@/components/Crud/CrudPage.vue";
import { generatedCrud } from "@/platform/generated-crud";
import { permission } from "@/platform/system/resources";
import { ref } from "vue";
import type { CrudPort, CrudRecord } from "@/components/Crud/types";
import { useRequestScope } from "./model";
import { useWorkflowPublish } from "./useWorkflowPublish";
defineOptions({ name: "WorkflowDefinitionPage" });
const { t } = useI18n();
const generated = generatedCrud("workflowDefinition");
const port: CrudPort = {
  describe: generated.port.describe,
  list: generated.port.list,
  detail: generated.port.detail,
  preferences: generated.port.preferences
};
const router = useRouter();
const list = ref<InstanceType<typeof CrudPage>>();
const { busy, error, run } = useRequestScope();
const publishVersion = useWorkflowPublish(run);
async function publish(row: CrudRecord) {
  if (typeof row.id !== "string" || typeof row.version !== "number") return;
  if (await publishVersion({ id: row.id, version: row.version })) {
    await list.value?.refresh();
  }
}
</script>
<template>
  <div class="workflow-page">
    <el-alert
      v-if="error"
      :title="t(error)"
      type="error"
      role="alert"
      :closable="false"
    />
    <CrudPage
      ref="list"
      :port="port"
      page-key="workflow:definition"
      :row-actions-width="310"
      ><template #toolbar
        ><el-button
          v-perm="permission('workflowDefinitionAdd')"
          type="primary"
          @click="router.push({ name: 'WorkflowCreate' })"
          >+ {{ t("workflow.create") }}</el-button
        ></template
      ><template #cell-revision="{ value }"
        ><el-tag size="small" effect="plain">v{{ value }}</el-tag></template
      ><template #row-actions="{ row, disabled }"
        ><el-button
          v-perm="permission('workflowDefinitionInfo')"
          link
          type="primary"
          :disabled="disabled"
          @click="
            router.push({
              name: 'WorkflowView',
              params: { id: String(row.id) }
            })
          "
          >{{ t("workflow.viewDesign") }}</el-button
        ><el-button
          v-perm="permission('workflowDefinitionRevise')"
          link
          type="primary"
          :disabled="disabled"
          @click="
            router.push({
              name: 'WorkflowRevise',
              params: { id: String(row.id) }
            })
          "
          >{{ t("workflow.revise") }}</el-button
        ><el-button
          v-if="row.status === 'draft'"
          v-perm="permission('workflowDefinitionPublish')"
          link
          type="primary"
          :disabled="disabled || busy"
          @click="publish(row)"
          >{{ t("workflow.publish") }}</el-button
        ></template
      ></CrudPage
    >
  </div>
</template>
<style scoped>
.workflow-page {
  min-width: 0;
  min-height: 0;
}
</style>
