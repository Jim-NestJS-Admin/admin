<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount, watch } from "vue";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { ElMessageBox } from "element-plus";
import { api } from "@/api/client";
import type { components } from "@/api/schema";
import { generatedCrud } from "@/platform/generated-crud";
import CrudPage from "@/components/Crud/CrudPage.vue";
import { onSessionReset } from "@/platform/lifecycle";
import { useRequestScope } from "../workflow/model";
const { t } = useI18n(),
  route = useRoute(),
  { busy, error, run, reset } = useRequestScope();
const rows = ref<components["schemas"]["McpReceipt"][]>([]),
  detail = ref<components["schemas"]["McpOperationResult"]>();
const list = ref<InstanceType<typeof CrudPage>>(),
  generated = generatedCrud("mcpOperation"),
  personal = computed(() => route.path === "/automation/confirm");
async function load() {
  await run(async signal => {
    const result = await api.mcpOperations({}, { signal });
    if (!signal.aborted) rows.value = result.data.list;
  });
}
async function open(id: string) {
  await run(async signal => {
    const result = await api.mcpOperationDetails({ query: { id } }, { signal });
    if (!signal.aborted) detail.value = result.data;
  });
}
async function decide(approve: boolean) {
  const id = detail.value?.operationId;
  if (!id) return;
  const confirmed = await ElMessageBox.confirm(
    t(approve ? "mcp.confirmWarning" : "mcp.rejectWarning"),
    t("mcp.pending"),
    { type: "warning" }
  ).catch(() => false);
  if (!confirmed) return;
  const saved = await run(async (signal, key) => {
    const body = { id, approve };
    await api.mcpOperationDecide(
      { body },
      { signal, headers: { "Idempotency-Key": key(body) } }
    );
    return !signal.aborted;
  });
  if (saved) {
    if (personal.value) await load();
    else await list.value?.refresh();
    await open(id);
  }
}
const stop = onSessionReset(() => {
  reset();
  rows.value = [];
  detail.value = undefined;
});
onBeforeUnmount(stop);
watch(
  () => route.query.operation,
  value => {
    if (typeof value === "string" && /^[1-9]\d{0,19}$/.test(value))
      void open(value);
  }
);
onMounted(async () => {
  if (personal.value) await load();
  const id = route.query.operation;
  if (typeof id === "string" && /^[1-9]\d{0,19}$/.test(id)) await open(id);
});
</script>
<template>
  <div>
    <el-alert v-if="error" :title="error" type="error" :closable="false" />
    <CrudPage
      v-if="!personal"
      ref="list"
      :port="generated.port"
      page-key="mcp:operation-list"
    >
      <template #row-actions="{ row }">
        <el-button link :disabled="busy" @click="open(String(row.id))">{{
          t("mcp.review")
        }}</el-button>
      </template>
    </CrudPage>
    <!-- 通知确认深链保持 LoginOnly，不要求确认人具有 MCP 工具准入权限。 -->
    <el-card v-else :header="t('mcp.pending')">
      <el-button :disabled="busy" @click="load">{{
        t("oauth.refresh")
      }}</el-button>
      <el-table :data="rows"
        ><el-table-column
          prop="operationId"
          :label="t('mcp.operationId')"
        /><el-table-column
          prop="status"
          :label="t('oauth.state')"
        /><el-table-column
          ><template #default="{ row }"
            ><el-button link :disabled="busy" @click="open(row.operationId)">{{
              t("mcp.review")
            }}</el-button></template
          ></el-table-column
        ></el-table
      >
    </el-card>
    <el-dialog
      :model-value="!!detail"
      :title="t('mcp.review')"
      width="min(760px, 96vw)"
      @close="detail = undefined"
    >
      <template v-if="detail"
        ><el-alert
          :title="t('mcp.fixedContext')"
          type="warning"
          :closable="false"
        />
        <el-descriptions :column="1" border
          ><el-descriptions-item :label="t('mcp.operationId')">{{
            detail.operationId
          }}</el-descriptions-item
          ><el-descriptions-item :label="t('mcp.resource')">{{
            detail.summary
          }}</el-descriptions-item
          ><el-descriptions-item :label="t('oauth.clientId')">{{
            detail.applicationName + " (" + detail.clientId + ")"
          }}</el-descriptions-item
          ><el-descriptions-item :label="t('oauth.org')">{{
            detail.orgId
          }}</el-descriptions-item
          ><el-descriptions-item :label="t('mcp.owner')">{{
            detail.ownerId
          }}</el-descriptions-item
          ><el-descriptions-item :label="t('mcp.approver')">{{
            detail.approverId
          }}</el-descriptions-item
          ><el-descriptions-item :label="t('oauth.state')">{{
            detail.status
          }}</el-descriptions-item
          ><el-descriptions-item :label="t('mcp.expires')">{{
            detail.expiresAt
          }}</el-descriptions-item></el-descriptions
        >
        <p>{{ t("mcp.parameters") }}</p>
        <pre class="mcp-preview">{{
          JSON.stringify(detail.parameters, null, 2)
        }}</pre>
        <p>{{ t("mcp.targets") }}</p>
        <pre class="mcp-preview">{{
          JSON.stringify(detail.targets, null, 2)
        }}</pre>
      </template>
      <template #footer
        ><el-button
          :disabled="busy || detail?.status !== 'pending'"
          @click="decide(false)"
          >{{ t("mcp.reject") }}</el-button
        ><el-button
          type="danger"
          :disabled="busy || detail?.status !== 'pending'"
          @click="decide(true)"
          >{{ t("mcp.confirm") }}</el-button
        ></template
      >
    </el-dialog>
  </div>
</template>
<style scoped>
.mcp-preview {
  max-height: 260px;
  overflow: auto;
  overflow-wrap: anywhere;
  white-space: pre-wrap;
}
</style>
