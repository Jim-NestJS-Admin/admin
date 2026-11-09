<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { useUserStoreHook } from "@/store/modules/user";
import CheckIcon from "~icons/ri/check-line";
import OrgIcon from "~icons/ri/building-line";

/** 切换当前组织：从头像菜单打开的弹窗，列出用户所属的全部组织，点一下即切换 */
const open = defineModel<boolean>({ default: false });
const user = useUserStoreHook();
const router = useRouter();
const { t } = useI18n();
const current = computed(
  () => user.organizations.find(org => org.id === user.organizationId) ?? null
);
const label = (org: { name: string; path: string[] }) =>
  org.path.join(" / ") || org.name;
async function choose(id: string) {
  if (!id || id === user.organizationId || user.transitioning) return;
  try {
    await user.switchOrganization(id);
    open.value = false;
    await router.replace("/welcome");
  } catch {
    ElMessage.error(t("system.switchFailed"));
    await router.replace("/login");
  }
}
</script>
<template>
  <el-dialog
    v-model="open"
    :title="t('system.switchOrganization')"
    width="min(420px, 92vw)"
    append-to-body
  >
    <p class="org-current">
      {{ t("system.currentOrganization") }}：<strong>{{
        current ? label(current) : t("system.noOrganization")
      }}</strong>
    </p>
    <el-scrollbar max-height="50vh">
      <ul class="org-list" :aria-label="t('system.switchOrganization')">
        <li
          v-for="org in user.organizations"
          :key="org.id"
          :class="{ active: org.id === user.organizationId }"
          role="button"
          tabindex="0"
          @click="choose(org.id)"
          @keyup.enter="choose(org.id)"
        >
          <component :is="OrgIcon" class="org-icon" />
          <span class="org-name">{{ label(org) }}</span>
          <component
            :is="CheckIcon"
            v-if="org.id === user.organizationId"
            class="org-check"
          />
        </li>
      </ul>
    </el-scrollbar>
    <div v-if="user.transitioning" class="org-busy">
      {{ t("system.switching") }}
    </div>
  </el-dialog>
</template>
<style scoped>
.org-current {
  margin: 0 0 12px;
  color: var(--el-text-color-regular);
}

.org-list {
  padding: 0;
  margin: 0;
  list-style: none;
}

.org-list li {
  display: flex;
  gap: 8px;
  align-items: center;
  height: 40px;
  padding: 0 12px;
  cursor: pointer;
  border-radius: 6px;
}

.org-list li:hover {
  background: var(--el-fill-color-light);
}

.org-list li.active {
  color: var(--el-color-primary);
  background: var(--el-color-primary-light-9);
}

.org-icon,
.org-check {
  flex-shrink: 0;
  width: 16px;
  height: 16px;
}

.org-name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.org-busy {
  margin-top: 8px;
  font-size: 12px;
  color: var(--el-text-color-secondary);
}
</style>
