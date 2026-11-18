<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { api } from "@/api/client";
import type { components } from "@/api/schema";
import { onSessionReset } from "@/platform/lifecycle";
import { useRequestScope } from "../workflow/model";
const { t } = useI18n(),
  route = useRoute(),
  router = useRouter(),
  { busy, error, run, reset } = useRequestScope();
const detail = ref<components["schemas"]["OAuthInteractionResult"]>(),
  selected = ref<string[]>([]);
async function load() {
  const uid = String(route.query.uid ?? "");
  await run(async signal => {
    const response = await api.oauthInteractionDetails(
      { query: { uid } },
      { signal, withCredentials: true }
    );
    if (signal.aborted) return;
    detail.value = response.data;
    selected.value = response.data.scopes.filter(scope =>
      scope.endsWith(":read")
    );
  });
}
async function complete(approve: boolean) {
  if (!detail.value) return;
  await run(async (signal, key) => {
    const body = {
      uid: detail.value!.uid,
      approve,
      scopes: approve ? selected.value : []
    };
    const response = await api.oauthInteractionComplete(
      { body },
      {
        signal,
        withCredentials: true,
        headers: { "Idempotency-Key": key(body) }
      }
    );
    if (signal.aborted) return;
    const target = new URL(response.data.redirectTo);
    if (
      !["http:", "https:"].includes(target.protocol) ||
      !/^\/oauth\/authorize\//.test(target.pathname)
    )
      throw new Error(t("oauth.invalidResume"));
    window.location.assign(target.href);
  });
}
const stop = onSessionReset(() => {
  reset();
  detail.value = undefined;
  selected.value = [];
});
onBeforeUnmount(stop);
onMounted(load);
</script>
<template>
  <main class="mx-auto max-w-2xl p-6">
    <el-card :header="t('oauth.consent')"
      ><el-alert
        v-if="error"
        :title="error"
        type="error"
        :closable="false"
      /><template v-if="detail"
        ><p class="mb-3">
          {{
            t("oauth.request", {
              name: detail.clientName,
              tenant: detail.tenantName,
              org: detail.orgId
            })
          }}
        </p>
        <el-alert
          :title="t('oauth.consentHint')"
          type="info"
          :closable="false"
          class="mb-4"
        /><el-checkbox-group v-model="selected"
          ><el-checkbox
            v-for="scope in detail.scopes"
            :key="scope"
            :value="scope"
            >{{ scope }}</el-checkbox
          ></el-checkbox-group
        >
        <div class="mt-6">
          <el-button type="primary" :loading="busy" @click="complete(true)">{{
            t("oauth.approve")
          }}</el-button
          ><el-button :disabled="busy" @click="complete(false)">{{
            t("oauth.deny")
          }}</el-button>
        </div></template
      ><el-button class="mt-4" link @click="router.push('/authorizations')">{{
        t("oauth.myGrants")
      }}</el-button
      ><el-button :disabled="busy" @click="load">{{
        t("oauth.refresh")
      }}</el-button></el-card
    >
  </main>
</template>
