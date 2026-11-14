<script setup lang="ts">
import { ref, onBeforeUnmount } from "vue";
import { useI18n } from "vue-i18n";
import { api } from "@/api/client";
import CrudPage from "@/components/Crud/CrudPage.vue";
import { generatedCrud } from "@/platform/generated-crud";
import { permission } from "@/platform/system/resources";
import { onSessionReset } from "@/platform/lifecycle";
import type { CrudRecord, CrudPort } from "@/components/Crud/types";
import { useRequestScope, type Definition } from "./model";
import WorkflowEditor from "./WorkflowEditor.vue";
defineOptions({ name: "WorkflowDefinitionPage" });
const { t } = useI18n();
const generated = generatedCrud("workflowDefinition");
const port: CrudPort = {
  describe: generated.port.describe,
  list: generated.port.list,
  detail: generated.port.detail,
  preferences: generated.port.preferences
};
const list = ref<InstanceType<typeof CrudPage>>(),
  editor = ref<{
    record: Definition | null;
    mode: "create" | "revise" | "view";
  }>();
const { busy, error, run } = useRequestScope();
async function open(
  row: CrudRecord | null,
  mode: "create" | "revise" | "view"
) {
  if (!row) {
    editor.value = { record: null, mode };
    return;
  }
  await run(async signal => {
    const record = (
      await api.workflowDefinitionInfo(
        { body: { id: String(row.id) } },
        { signal }
      )
    ).data;
    if (!record.designer) throw Error(t("workflow.designHidden"));
    editor.value = { record, mode };
  });
}
function saved() {
  editor.value = undefined;
  void list.value?.refresh();
}
const stop = onSessionReset(() => (editor.value = undefined));
onBeforeUnmount(stop);
</script>
<template>
  <div class="workflow-page">
    <el-alert
      v-if="error"
      :title="t(error)"
      type="error"
      :closable="false"
    /><CrudPage
      ref="list"
      :port="port"
      page-key="workflow:definition"
      :row-actions-width="310"
      ><template #toolbar
        ><el-button
          v-perm="permission('workflowDefinitionAdd')"
          type="primary"
          :disabled="busy"
          @click="open(null, 'create')"
          >+ {{ t("workflow.create") }}</el-button
        ></template
      ><template #cell-revision="{ value }"
        ><el-tag size="small" effect="plain">v{{ value }}</el-tag></template
      ><template #row-actions="{ row, disabled }"
        ><el-button
          v-perm="permission('workflowDefinitionInfo')"
          link
          type="primary"
          :disabled="disabled || busy"
          @click="open(row, 'view')"
          >{{ t("workflow.viewDesign") }}</el-button
        ><el-button
          v-perm="permission('workflowDefinitionRevise')"
          link
          type="primary"
          :disabled="disabled || busy"
          @click="open(row, 'revise')"
          >{{ t("workflow.revise") }}</el-button
        ><el-button
          v-if="row.status === 'draft'"
          v-perm="permission('workflowDefinitionPublish')"
          link
          type="primary"
          :disabled="disabled || busy"
          @click="open(row, 'view')"
          >{{ t("workflow.publish") }}</el-button
        ></template
      ></CrudPage
    ><WorkflowEditor
      v-if="editor"
      :record="editor.record"
      :mode="editor.mode"
      @close="editor = undefined"
      @saved="saved"
    />
  </div>
</template>
<style scoped>
.workflow-page {
  min-width: 0;
  min-height: 0;
}

.workflow-page > .el-alert {
  margin-bottom: 12px;
}
</style>
