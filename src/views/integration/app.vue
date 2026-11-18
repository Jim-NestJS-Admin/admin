<script setup lang="ts">
import { ref, reactive, onBeforeUnmount } from "vue";
import { useI18n } from "vue-i18n";
import { ElMessageBox, ElMessage } from "element-plus";
import type { components } from "@/api/schema";
import { api } from "@/api/client";
import { generatedCrud } from "@/platform/generated-crud";
import { permission } from "@/platform/system/resources";
import { onSessionReset } from "@/platform/lifecycle";
import CrudPage from "@/components/Crud/CrudPage.vue";
import type { CrudRecord } from "@/components/Crud/types";
import ResourceSelect from "../workflow/ResourceSelect.vue";
import { useRequestScope } from "../workflow/model";
const { t } = useI18n();
type Save = components["schemas"]["IntegrationSaveBody"];
const { busy, error, run } = useRequestScope();
const generated = generatedCrud("integrationApp");
const list = ref<InstanceType<typeof CrudPage>>();
const open = ref(false);
const logs = ref(false);
const logPort = generatedCrud("integrationSyncLog").port;
const defaults = (): Save => ({
  corpId: "",
  agentId: "",
  mountOrgId: "",
  defaultRoleId: null,
  enabled: false,
  adminUrl: "",
  secret: undefined,
  callbackToken: undefined,
  encodingAESKey: undefined
});
const form = reactive<Save>(defaults());
async function edit(row?: CrudRecord) {
  Object.assign(form, defaults(), { id: undefined, version: undefined });
  if (row)
    await run(async signal => {
      const response = await api.integrationAppInfo(
        { body: { id: String(row.id) } },
        { signal }
      );
      if (signal.aborted) return;
      const data = response.data;
      Object.assign(form, {
        id: data.id,
        version: data.version,
        corpId: data.corpId,
        agentId: data.agentId,
        mountOrgId: data.mountOrgId,
        defaultRoleId: data.defaultRoleId,
        enabled: data.enabled,
        adminUrl: data.adminUrl
      });
      open.value = true;
    });
  else open.value = true;
}
async function save() {
  await run(async (signal, key) => {
    const body = { ...form };
    for (const field of ["secret", "callbackToken", "encodingAESKey"] as const)
      if (!body[field]) delete body[field];
    await api.integrationAppSave(
      { body },
      { signal, headers: { "Idempotency-Key": key(body) } }
    );
    if (signal.aborted) return;
    open.value = false;
    Object.assign(form, defaults());
    await list.value?.refresh();
  });
}
async function sync(row: CrudRecord) {
  try {
    await ElMessageBox.confirm(
      t("notifications.syncConfirm"),
      t("notifications.sync")
    );
  } catch {
    return;
  }
  await run(async (signal, key) => {
    const body = { id: String(row.id) };
    await api.integrationAppSync(
      { body },
      { signal, headers: { "Idempotency-Key": key(body) } }
    );
    if (!signal.aborted) {
      ElMessage.success(t("notifications.queued"));
      await list.value?.refresh();
    }
  });
}
const stop = onSessionReset(() => {
  logs.value = false;
  open.value = false;
  Object.assign(form, defaults());
});
onBeforeUnmount(stop);
</script>
<template>
  <div>
    <el-alert v-if="error" :title="error" type="error" :closable="false" />
    <CrudPage ref="list" :port="generated.port" page-key="integration:app">
      <template #toolbar
        ><el-button
          v-perm="permission('integrationAppSave')"
          :disabled="busy"
          type="primary"
          @click="edit()"
          >{{ t("notifications.configure") }}</el-button
        ><el-button
          v-perm="permission('integrationSyncLogPage')"
          @click="logs = true"
          >{{ t("notifications.logs") }}</el-button
        ></template
      >
      <template #row-actions="{ row }"
        ><el-button
          v-perm="permission('integrationAppSave')"
          link
          :disabled="busy"
          @click="edit(row)"
          >{{ t("notifications.configure") }}</el-button
        ><el-button
          v-perm="permission('integrationAppSync')"
          link
          :disabled="busy || !row.enabled"
          @click="sync(row)"
          >{{ t("notifications.sync") }}</el-button
        ></template
      >
    </CrudPage>
    <el-dialog
      v-model="logs"
      :title="t('notifications.logs')"
      width="min(1080px, 96vw)"
      destroy-on-close
    >
      <CrudPage v-if="logs" :port="logPort" page-key="integration:sync-log" />
    </el-dialog>
    <el-dialog
      v-model="open"
      :title="t('notifications.configure')"
      width="min(680px, 96vw)"
      :close-on-click-modal="false"
      destroy-on-close
      @closed="Object.assign(form, defaults())"
    >
      <el-alert v-if="error" :title="error" type="error" :closable="false" />
      <el-form label-position="top" @submit.prevent="save">
        <el-form-item :label="t('notifications.corpId')" required
          ><el-input v-model="form.corpId"
        /></el-form-item>
        <el-form-item :label="t('notifications.agentId')" required
          ><el-input v-model="form.agentId"
        /></el-form-item>
        <el-form-item :label="t('notifications.mount')" required
          ><ResourceSelect
            :model-value="form.mountOrgId"
            kind="orgs"
            @update:model-value="form.mountOrgId = String($event)"
        /></el-form-item>
        <el-form-item :label="t('notifications.defaultRole')"
          ><ResourceSelect
            :model-value="form.defaultRoleId ?? ''"
            kind="roles"
            @update:model-value="form.defaultRoleId = String($event) || null"
        /></el-form-item>
        <el-form-item :label="t('notifications.adminUrl')" required
          ><el-input v-model="form.adminUrl"
        /></el-form-item>
        <el-form-item :label="t('notifications.secret')"
          ><el-input
            v-model="form.secret"
            type="password"
            autocomplete="new-password"
            show-password
        /></el-form-item>
        <el-form-item label="Callback Token"
          ><el-input
            v-model="form.callbackToken"
            type="password"
            autocomplete="new-password"
        /></el-form-item>
        <el-form-item label="EncodingAESKey"
          ><el-input
            v-model="form.encodingAESKey"
            type="password"
            autocomplete="new-password"
        /></el-form-item>
        <el-form-item :label="t('notifications.enabled')"
          ><el-switch v-model="form.enabled"
        /></el-form-item>
      </el-form>
      <template #footer
        ><el-button :disabled="busy" @click="open = false">{{
          t("notifications.cancel")
        }}</el-button
        ><el-button type="primary" :loading="busy" @click="save">{{
          t("notifications.save")
        }}</el-button></template
      >
    </el-dialog>
  </div>
</template>
