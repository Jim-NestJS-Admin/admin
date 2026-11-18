<script setup lang="ts">
import { ref, reactive, onMounted, onBeforeUnmount } from "vue";
import { useI18n } from "vue-i18n";
import { ElMessageBox } from "element-plus";
import { api } from "@/api/client";
import type { components } from "@/api/schema";
import { permission } from "@/platform/system/resources";
import { onSessionReset } from "@/platform/lifecycle";
import ResourceSelect from "../workflow/ResourceSelect.vue";
import { useRequestScope } from "../workflow/model";
const { t } = useI18n(),
  { busy, error, run, reset } = useRequestScope();
const configuration = ref<components["schemas"]["McpConfigResult"]>(),
  delegations = ref<components["schemas"]["McpDelegationResult"]>();
const form = reactive<components["schemas"]["McpConfigBody"]>({
  enabled: false,
  blocked: [],
  confirmPermissions: []
});
const grant = reactive<components["schemas"]["McpDelegationBody"]>({
  clientId: "",
  approverId: "",
  enabled: false
});
async function load() {
  await run(async signal => {
    const result = await api.mcpConfiguration({}, { signal });
    if (!signal.aborted) {
      configuration.value = result.data;
      Object.assign(form, {
        enabled: result.data.enabled,
        blocked: result.data.blocked,
        confirmPermissions: result.data.confirmPermissions
      });
    }
  });
}
async function save() {
  const confirmed = await ElMessageBox.confirm(
    t("mcp.configWarning"),
    t("mcp.settings"),
    { type: "warning" }
  ).catch(() => false);
  if (!confirmed) return;
  const saved = await run(async (signal, key) => {
    const body = { ...form };
    await api.mcpConfigurationSave(
      { body },
      { signal, headers: { "Idempotency-Key": key(body) } }
    );
    return !signal.aborted;
  });
  if (saved) await load();
}
async function readDelegations() {
  await run(async signal => {
    const result = await api.mcpDelegations({}, { signal });
    if (!signal.aborted) delegations.value = result.data;
  });
}
async function saveGrant() {
  const confirmed = await ElMessageBox.confirm(
    t("mcp.delegationWarning"),
    t("mcp.delegations"),
    { type: "warning" }
  ).catch(() => false);
  if (!confirmed) return;
  const saved = await run(async (signal, key) => {
    const body = { ...grant };
    if (!body.permission) delete body.permission;
    await api.mcpDelegationSave(
      { body },
      { signal, headers: { "Idempotency-Key": key(body) } }
    );
    return !signal.aborted;
  });
  if (saved) await readDelegations();
}
const stop = onSessionReset(() => {
  reset();
  configuration.value = undefined;
  delegations.value = undefined;
  Object.assign(form, { enabled: false, blocked: [], confirmPermissions: [] });
  Object.assign(grant, {
    clientId: "",
    approverId: "",
    permission: undefined,
    enabled: false
  });
});
onBeforeUnmount(stop);
onMounted(load);
</script>
<template>
  <div>
    <el-alert
      v-if="error"
      :title="error"
      type="error"
      :closable="false"
    /><el-alert
      v-if="configuration && !configuration.deployed"
      :title="t('mcp.disabled')"
      type="warning"
      :closable="false"
    />
    <el-card :header="t('mcp.settings')"
      ><el-form label-position="top" @submit.prevent="save"
        ><el-form-item :label="t('mcp.enabled')"
          ><el-switch v-model="form.enabled" /></el-form-item
        ><el-form-item :label="t('mcp.blocked')"
          ><el-select v-model="form.blocked" multiple filterable allow-create
            ><el-option
              v-for="resource in configuration?.resources ?? []"
              :key="resource"
              :label="resource"
              :value="resource" /></el-select></el-form-item
        ><el-form-item :label="t('mcp.extraConfirm')"
          ><el-select v-model="form.confirmPermissions" multiple filterable
            ><el-option
              v-for="code in configuration?.permissions ?? []"
              :key="code"
              :label="code"
              :value="code" /></el-select></el-form-item
        ><el-button
          v-perm="permission('mcpConfigurationSave')"
          type="primary"
          native-type="submit"
          :disabled="busy"
          >{{ t("oauth.save") }}</el-button
        ></el-form
      ></el-card
    >
    <el-card :header="t('mcp.delegations')" class="mt-4"
      ><el-alert
        :title="t('mcp.delegationWarning')"
        type="warning"
        :closable="false"
      /><el-button
        v-perm="permission('mcpDelegations')"
        :disabled="busy"
        @click="readDelegations"
        >{{ t("oauth.refresh") }}</el-button
      >
      <el-table :data="delegations?.approvers ?? []"
        ><el-table-column
          prop="clientId"
          :label="t('oauth.clientId')" /><el-table-column
          prop="approverId"
          :label="t('mcp.approver')"
      /></el-table>
      <el-table :data="delegations?.exemptions ?? []"
        ><el-table-column
          prop="clientId"
          :label="t('oauth.clientId')" /><el-table-column
          prop="orgId"
          :label="t('oauth.org')" /><el-table-column
          prop="permission"
          :label="t('mcp.exemptPermission')" /><el-table-column
          prop="enabled"
          :label="t('mcp.exemptEnabled')"
      /></el-table>
      <el-form label-position="top" @submit.prevent="saveGrant"
        ><el-form-item :label="t('oauth.clientId')"
          ><el-input v-model="grant.clientId" /></el-form-item
        ><el-form-item :label="t('mcp.approver')"
          ><ResourceSelect
            v-model="grant.approverId"
            kind="users" /></el-form-item
        ><el-form-item :label="t('mcp.exemptPermission')"
          ><el-select v-model="grant.permission" filterable clearable
            ><el-option
              v-for="code in configuration?.permissions ?? []"
              :key="code"
              :label="code"
              :value="code" /></el-select></el-form-item
        ><el-form-item :label="t('mcp.exemptEnabled')"
          ><el-switch v-model="grant.enabled" /></el-form-item
        ><el-button
          v-perm="permission('mcpDelegationSave')"
          type="primary"
          native-type="submit"
          :disabled="busy"
          >{{ t("oauth.save") }}</el-button
        ></el-form
      ></el-card
    >
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
