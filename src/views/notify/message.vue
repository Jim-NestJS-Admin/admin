<script setup lang="ts">
import { ref, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { api } from "@/api/client";
import { generatedCrud } from "@/platform/generated-crud";
import { permission } from "@/platform/system/resources";
import { onSessionReset } from "@/platform/lifecycle";
import type { CrudRecord } from "@/components/Crud/types";
import CrudPage from "@/components/Crud/CrudPage.vue";
import WorkflowDocument from "../workflow/WorkflowDocument.vue";
import { useRequestScope } from "../workflow/model";
const { t } = useI18n();
const router = useRouter();
const { busy, error, run } = useRequestScope();
const generated = generatedCrud("notifyMessage");
const list = ref<InstanceType<typeof CrudPage>>();
const detail = ref<string>();
async function open(row: CrudRecord) {
  await run(async (signal, key) => {
    const body = { id: String(row.id) };
    await api.notifyMessageRead(
      { body },
      { signal, headers: { "Idempotency-Key": key(body) } }
    );
    if (signal.aborted) return;
    if (row.event === "mcp.exempt")
      await router.push({
        path: "/automation/confirm",
        query: { operation: String(row.instanceId) }
      });
    else detail.value = String(row.instanceId);
    await list.value?.refresh();
  });
}
const stop = onSessionReset(() => {
  detail.value = undefined;
});
onBeforeUnmount(stop);
</script>
<template>
  <div>
    <el-alert v-if="error" :title="error" type="error" :closable="false" />
    <CrudPage ref="list" :port="generated.port" page-key="notify:message">
      <template #row-actions="{ row }"
        ><el-button
          v-perm="permission('notifyMessageInfo')"
          link
          type="primary"
          :disabled="busy"
          @click="open(row)"
          >{{ t("notifications.open") }}</el-button
        ></template
      >
    </CrudPage>
    <WorkflowDocument
      v-if="detail"
      :instance-id="detail"
      @close="detail = undefined"
      @changed="list?.refresh()"
    />
  </div>
</template>
