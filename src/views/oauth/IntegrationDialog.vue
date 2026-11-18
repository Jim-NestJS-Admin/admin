<script setup lang="ts">
import { ref, reactive, watch, onBeforeUnmount } from "vue";
import { useI18n } from "vue-i18n";
import { ElMessage } from "element-plus";
import { api } from "@/api/client";
import type { components } from "@/api/schema";
import { useUserStoreHook } from "@/store/modules/user";
import { onSessionReset } from "@/platform/lifecycle";
import ResourceSelect from "../workflow/ResourceSelect.vue";
import { useRequestScope } from "../workflow/model";
const props = defineProps<{ open: boolean; id?: string }>();
const emit = defineEmits<{ close: []; saved: [] }>();
const { t } = useI18n(),
  { busy, error, run, reset } = useRequestScope();
const account = useUserStoreHook();
type Save = components["schemas"]["OAuthIntegrationSaveBody"];
const form = reactive<Save>({
  name: "",
  enabled: true,
  orgId: "",
  roleIds: []
});
const credentials = ref<{
  clientId: string;
  secret: string;
  scopes: string[];
}>();
const randomSecret = () =>
  Array.from(crypto.getRandomValues(new Uint8Array(32)), value =>
    value.toString(16).padStart(2, "0")
  ).join("");
async function initialize() {
  reset();
  credentials.value = undefined;
  Object.assign(form, {
    id: undefined,
    version: undefined,
    name: "",
    enabled: true,
    orgId: useUserStoreHook().organizationId,
    roleIds: [],
    secret: props.id ? undefined : randomSecret()
  });
  if (props.id)
    await run(async signal => {
      const result = await api.oauthIntegrationInfo(
        { query: { id: props.id! } },
        { signal }
      );
      if (!signal.aborted)
        Object.assign(form, {
          id: result.data.id,
          version: result.data.version,
          name: result.data.name,
          enabled: result.data.enabled,
          orgId: result.data.orgId,
          roleIds: result.data.roleIds
        });
    });
}
async function save() {
  if (account.tenant?.platform !== false) {
    close();
    return;
  }
  const done = await run(async (signal, key) => {
    const body = { ...form };
    if (!body.secret) delete body.secret;
    const saved = await api.oauthIntegrationSave(
      { body },
      { signal, headers: { "Idempotency-Key": key(body) } }
    );
    const info = await api.oauthIntegrationInfo(
      { query: { id: saved.data.id } },
      { signal }
    );
    if (signal.aborted) return false;
    credentials.value = {
      clientId: info.data.clientId,
      secret: body.secret ?? "",
      scopes: info.data.scopes
    };
    form.secret = undefined;
    return true;
  });
  if (done) emit("saved");
}
async function copy(value: string) {
  try {
    await navigator.clipboard.writeText(value);
    ElMessage.success(t("oauth.copied"));
  } catch {
    ElMessage.warning(t("oauth.copyManually"));
  }
}
function close() {
  reset();
  form.secret = undefined;
  credentials.value = undefined;
  emit("close");
}
const stop = onSessionReset(close);
onBeforeUnmount(() => {
  stop();
  reset();
  form.secret = undefined;
  credentials.value = undefined;
});
watch(
  [() => props.open, () => account.tenant?.platform],
  ([open]) => {
    if (open && account.tenant?.platform !== false) close();
    else if (open) void initialize();
    else {
      reset();
      form.secret = undefined;
      credentials.value = undefined;
    }
  },
  { immediate: true }
);
</script>
<template>
  <el-dialog
    :model-value="open"
    :title="t('oauth.integration')"
    width="min(640px, 96vw)"
    :close-on-click-modal="false"
    @close="close"
  >
    <el-alert v-if="error" :title="error" type="error" :closable="false" />
    <template v-if="credentials">
      <el-alert
        :title="t('oauth.credentialsHint')"
        type="warning"
        :closable="false"
      />
      <el-form label-position="top"
        ><el-form-item :label="t('oauth.clientId')"
          ><el-input :model-value="credentials.clientId" readonly /><el-button
            @click="copy(credentials.clientId)"
            >{{ t("oauth.copy") }}</el-button
          ></el-form-item
        ><el-form-item :label="t('oauth.secret')"
          ><el-input
            v-if="credentials.secret"
            :model-value="credentials.secret"
            type="password"
            show-password
            readonly
            autocomplete="off"
          /><el-alert
            v-else
            :title="t('oauth.secretUnchanged')"
            type="info"
            :closable="false"
          /><el-button
            v-if="credentials.secret"
            @click="copy(credentials.secret)"
            >{{ t("oauth.copy") }}</el-button
          ></el-form-item
        ><el-form-item :label="t('oauth.allowedScopes')">{{
          credentials.scopes.join(", ")
        }}</el-form-item></el-form
      >
    </template>
    <el-form v-else label-position="top" @submit.prevent="save">
      <el-alert
        :title="t('oauth.integrationHint')"
        type="info"
        :closable="false"
      />
      <el-form-item :label="t('oauth.name')" required
        ><el-input v-model="form.name" maxlength="100"
      /></el-form-item>
      <el-form-item :label="t('oauth.org')" required
        ><ResourceSelect v-model="form.orgId" kind="orgs" :disabled="busy"
      /></el-form-item>
      <el-form-item :label="t('oauth.permissionRoles')" required
        ><ResourceSelect
          v-model="form.roleIds"
          kind="roles"
          multiple
          :disabled="busy"
        />
        <p>{{ t("oauth.roleHint") }}</p></el-form-item
      >
      <el-form-item :label="t('oauth.enabled')"
        ><el-switch v-model="form.enabled"
      /></el-form-item>
      <el-alert
        v-if="form.id"
        :title="t('oauth.updateIntegrationHint')"
        type="warning"
        :closable="false"
      />
      <el-button
        v-if="form.id"
        :disabled="busy"
        @click="form.secret = randomSecret()"
        >{{ t("oauth.rotateSecret") }}</el-button
      >
      <el-alert
        v-if="form.id && form.secret"
        :title="t('oauth.rotateSelected')"
        type="warning"
        :closable="false"
      />
      <el-button
        type="primary"
        native-type="submit"
        :loading="busy"
        :disabled="!form.name.trim() || !form.orgId || !form.roleIds.length"
        >{{ t(form.id ? "oauth.save" : "oauth.createCredentials") }}</el-button
      >
    </el-form>
  </el-dialog>
</template>
