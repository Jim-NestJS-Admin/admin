<script setup lang="ts">
import { computed, ref, watch, onBeforeUnmount } from "vue";
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
  { busy, error, run, reset } = useRequestScope();
const generated = generatedCrud("oauthGrant"),
  list = ref<InstanceType<typeof CrudPage>>();
const route = useRoute(),
  personal = computed(() => route.path === "/authorizations"),
  rows = ref<components["schemas"]["OAuthMyGrant"][]>([]);
// 同意页进入的个人工作台只要求登录，不能改用需要 CRUD 页面权限的接口。
async function loadPersonal() {
  await run(async signal => {
    const response = await api.oauthMyGrants({}, { signal });
    if (!signal.aborted) rows.value = response.data.list;
  });
}
async function revoke(id: string) {
  const confirmed = await ElMessageBox.confirm(
    t("oauth.revokeConfirm"),
    t("oauth.myGrants"),
    { type: "warning" }
  ).catch(() => false);
  if (!confirmed) return;
  const saved = await run(async (signal, key) => {
    const body = { id };
    await api.oauthMyGrantRevoke(
      { body },
      { signal, headers: { "Idempotency-Key": key(body) } }
    );
    return !signal.aborted;
  });
  if (saved) {
    if (personal.value) await loadPersonal();
    else await list.value?.refresh();
  }
}
const stop = onSessionReset(() => {
  reset();
  rows.value = [];
});
onBeforeUnmount(stop);
watch(
  personal,
  value => {
    if (value) void loadPersonal();
  },
  { immediate: true }
);
</script>
<template>
  <div>
    <el-alert v-if="error" :title="error" type="error" :closable="false" />
    <CrudPage
      v-if="!personal"
      ref="list"
      :port="generated.port"
      page-key="oauth:grant"
    >
      <template #row-actions="{ row }">
        <!-- 本人撤销沿用 LoginOnly 接口，不额外要求应用管理权限。 -->
        <el-button
          link
          type="danger"
          :disabled="busy || !row.active"
          @click="revoke(String(row.id))"
          >{{ t("oauth.revoke") }}</el-button
        >
      </template>
    </CrudPage>
    <el-card v-else :header="t('oauth.myGrants')">
      <el-button :disabled="busy" @click="loadPersonal">{{
        t("oauth.refresh")
      }}</el-button>
      <el-table :data="rows">
        <el-table-column prop="clientId" :label="t('oauth.clientId')" />
        <el-table-column prop="orgId" :label="t('oauth.org')" />
        <el-table-column prop="audience" :label="t('oauth.audience')" />
        <el-table-column prop="scopes" :label="t('oauth.scopes')" />
        <el-table-column :label="t('oauth.state')">
          <template #default="{ row }">{{
            t(row.active ? "oauth.active" : "oauth.revoked")
          }}</template>
        </el-table-column>
        <el-table-column>
          <template #default="{ row }">
            <el-button
              link
              type="danger"
              :disabled="busy || !row.active"
              @click="revoke(row.id)"
              >{{ t("oauth.revoke") }}</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
