<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { useUserStoreHook } from "@/store/modules/user";
const user = useUserStoreHook();
const router = useRouter();
const { t } = useI18n();
async function switchOrganization(id: string) {
  if (!id || id === user.organizationId || user.transitioning) return;
  try {
    await user.switchOrganization(id);
    await router.replace("/welcome");
  } catch {
    ElMessage.error(t("system.switchFailed"));
    await router.replace("/login");
  }
}
</script>
<template>
  <el-select
    class="organization-switch"
    :model-value="user.organizationId || undefined"
    :aria-label="t('system.currentOrganization')"
    :placeholder="t('system.noOrganization')"
    :disabled="user.transitioning || !user.organizations.length"
    :loading="user.transitioning"
    size="small"
    @change="switchOrganization"
  >
    <el-option
      v-for="org in user.organizations"
      :key="org.id"
      :value="org.id"
      :label="org.path.join(' / ') || org.name"
    />
  </el-select>
</template>
<style scoped>
.organization-switch {
  width: clamp(90px, 18vw, 180px);
  margin-right: 8px;
}
</style>
