<script setup lang="ts">
import { computed, ref, reactive, onMounted, onBeforeUnmount } from "vue";
import { useI18n } from "vue-i18n";
import { api } from "@/api/client";
import type { components } from "@/api/schema";
import { useUserStoreHook } from "@/store/modules/user";
import { generatedCrud } from "@/platform/generated-crud";
import { permission } from "@/platform/system/resources";
import { onSessionReset } from "@/platform/lifecycle";
import CrudPage from "@/components/Crud/CrudPage.vue";
import type { CrudRecord } from "@/components/Crud/types";
import ResourceSelect from "../workflow/ResourceSelect.vue";
import IntegrationDialog from "./IntegrationDialog.vue";
import { useRequestScope } from "../workflow/model";
const { t } = useI18n(),
  { busy, error, run, reset } = useRequestScope();
const account = useUserStoreHook(),
  businessTenant = computed(() => account.tenant?.platform === false);
type Save = components["schemas"]["OAuthClientSaveBody"];
const defaults = (): Save => ({
  name: "",
  enabled: true,
  authMethod: "none",
  redirectUris: [],
  scopes: [],
  serviceUserId: null,
  serviceOrgId: null
});
const form = reactive<Save>(defaults()),
  open = ref(false),
  redirects = ref(""),
  publicKeys = ref("");
const scopes = ref<components["schemas"]["OAuthScopeItem"][]>([]),
  status = ref<components["schemas"]["OAuthStatusResult"]>();
const list = ref<InstanceType<typeof CrudPage>>(),
  generated = generatedCrud("oauthClient");
const integrationOpen = ref(false),
  integrationId = ref<string>();
function newIntegration() {
  if (!businessTenant.value) return;
  integrationId.value = undefined;
  integrationOpen.value = true;
}
async function initialize() {
  await run(async signal => {
    const [catalog, state] = await Promise.all([
      api.oauthScopes({}, { signal }),
      api.oauthStatus({}, { signal })
    ]);
    if (!signal.aborted) {
      scopes.value = catalog.data.list;
      status.value = state.data;
    }
  });
}
async function edit(row?: CrudRecord) {
  if (!businessTenant.value) return;
  if (
    row?.serviceUserId &&
    Array.isArray(row.redirectUris) &&
    row.redirectUris.length === 0
  ) {
    integrationId.value = String(row.id);
    integrationOpen.value = true;
    return;
  }
  Object.assign(form, defaults(), {
    id: undefined,
    version: undefined,
    secret: undefined,
    jwks: undefined
  });
  redirects.value = "";
  publicKeys.value = "";
  if (row)
    await run(async signal => {
      const response = await api.oauthClientInfo(
        { body: { id: String(row.id) } },
        { signal }
      );
      if (signal.aborted) return;
      const value = response.data;
      Object.assign(form, {
        id: value.id,
        version: value.version,
        name: value.name,
        enabled: value.enabled,
        authMethod: value.authMethod,
        scopes: value.scopes,
        serviceUserId: value.serviceUserId,
        serviceOrgId: value.serviceOrgId
      });
      redirects.value = (value.redirectUris ?? []).join("\n");
      publicKeys.value = value.jwks ? JSON.stringify(value.jwks, null, 2) : "";
      open.value = true;
    });
  else open.value = true;
}
function generateSecret() {
  form.secret = Array.from(crypto.getRandomValues(new Uint8Array(32)), value =>
    value.toString(16).padStart(2, "0")
  ).join("");
}
async function save() {
  await run(async (signal, key) => {
    const body: Save = {
      ...form,
      redirectUris: redirects.value
        .split("\n")
        .map(s => s.trim())
        .filter(Boolean)
    };
    if (!body.secret) delete body.secret;
    if (body.authMethod === "private_key_jwt")
      body.jwks = JSON.parse(publicKeys.value);
    else delete body.jwks;
    await api.oauthClientSave(
      { body },
      { signal, headers: { "Idempotency-Key": key(body) } }
    );
    if (signal.aborted) return;
    open.value = false;
    form.secret = undefined;
    await list.value?.refresh();
  });
}
const stop = onSessionReset(() => {
  reset();
  open.value = false;
  integrationOpen.value = false;
  form.secret = undefined;
  scopes.value = [];
  status.value = undefined;
});
onBeforeUnmount(stop);
onMounted(initialize);
</script>
<template>
  <div>
    <el-alert
      v-if="account.tenant?.platform"
      :title="t('oauth.businessTenantRequired')"
      type="info"
      :closable="false"
      class="mb-3"
    />
    <el-alert
      v-if="status && !status.enabled"
      :title="t('oauth.disabled')"
      type="warning"
      :closable="false"
      class="mb-3"
    />
    <el-alert v-if="error" :title="error" type="error" :closable="false" />
    <CrudPage ref="list" :port="generated.port" page-key="oauth:client"
      ><template #toolbar
        ><el-button
          v-if="businessTenant"
          v-perm="permission('oauthClientSave')"
          type="primary"
          @click="newIntegration()"
          >{{ t("oauth.newIntegration") }}</el-button
        ><el-button
          v-if="businessTenant"
          v-perm="permission('oauthClientSave')"
          @click="edit()"
          >{{ t("oauth.newUserApp") }}</el-button
        ></template
      ><template #row-actions="{ row }"
        ><el-button
          v-if="businessTenant"
          v-perm="permission('oauthClientSave')"
          link
          :disabled="busy"
          @click="edit(row)"
          >{{ t("oauth.edit") }}</el-button
        ></template
      ></CrudPage
    >
    <el-dialog
      v-model="open"
      :title="t('oauth.client')"
      width="min(800px,96vw)"
      :close-on-click-modal="false"
      @closed="form.secret = undefined"
    >
      <el-form label-position="top" @submit.prevent="save">
        <el-form-item :label="t('oauth.name')"
          ><el-input v-model="form.name" maxlength="100" /></el-form-item
        ><el-form-item :label="t('oauth.enabled')"
          ><el-switch v-model="form.enabled"
        /></el-form-item>
        <el-form-item :label="t('oauth.authMethod')"
          ><el-select v-model="form.authMethod"
            ><el-option value="none" :label="t('oauth.public')" /><el-option
              value="private_key_jwt"
              :label="t('oauth.privateKey')" /><el-option
              value="client_secret_basic"
              :label="t('oauth.secretBasic')" /></el-select
        ></el-form-item>
        <el-form-item :label="t('oauth.redirects')"
          ><el-input v-model="redirects" type="textarea" :rows="3"
        /></el-form-item>
        <template v-if="form.authMethod === 'client_secret_basic'"
          ><el-form-item :label="t('oauth.secret')"
            ><el-input
              v-model="form.secret"
              type="password"
              show-password
              autocomplete="off"
              :placeholder="t('oauth.secretHint')" /></el-form-item
          ><el-button @click="generateSecret">{{
            t("oauth.generateSecret")
          }}</el-button>
          <p class="mb-3">{{ t("oauth.copySecret") }}</p></template
        >
        <el-form-item
          v-if="form.authMethod === 'private_key_jwt'"
          :label="t('oauth.jwks')"
          ><el-input v-model="publicKeys" type="textarea" :rows="6"
        /></el-form-item>
        <el-form-item :label="t('oauth.scopes')"
          ><el-select v-model="form.scopes" multiple
            ><el-option
              v-for="scope in scopes"
              :key="scope.code"
              :value="scope.code"
              :label="scope.code" /></el-select
        ></el-form-item>
        <template
          v-if="form.id && form.serviceUserId && form.authMethod !== 'none'"
          ><el-form-item :label="t('oauth.serviceUser')"
            ><ResourceSelect
              :model-value="form.serviceUserId ?? ''"
              kind="users"
              @update:model-value="
                form.serviceUserId = String($event) || null
              " /></el-form-item
          ><el-form-item :label="t('oauth.serviceOrg')"
            ><ResourceSelect
              :model-value="form.serviceOrgId ?? ''"
              kind="orgs"
              @update:model-value="
                form.serviceOrgId = String($event) || null
              " /></el-form-item
        ></template>
        <el-button type="primary" native-type="submit" :loading="busy">{{
          t("oauth.save")
        }}</el-button>
      </el-form>
    </el-dialog>
    <IntegrationDialog
      :id="integrationId"
      :open="integrationOpen"
      @close="integrationOpen = false"
      @saved="list?.refresh()"
    />
  </div>
</template>
