<script setup lang="ts">
import SystemPage from "./SystemPage.vue";
import FieldPermissions from "./FieldPermissions.vue";
import { useI18n } from "vue-i18n";
import { ref } from "vue";
import { useUserStoreHook } from "@/store/modules/user";
import { permission } from "@/platform/system/resources";
const { t } = useI18n();
const user = useUserStoreHook();
const tab = ref("roles");
</script>
<template>
  <el-tabs v-model="tab" class="role-tabs"
    ><el-tab-pane name="roles" :label="t('fieldPerm.roles')" lazy
      ><SystemPage v-if="tab === 'roles'" resource="role" /></el-tab-pane
    ><el-tab-pane
      v-if="user.permissions.includes(permission('systemRoleFieldOverview'))"
      name="fields"
      :label="t('fieldPerm.title')"
      lazy
      ><FieldPermissions v-if="tab === 'fields'" mode="role" /></el-tab-pane
  ></el-tabs>
</template>

<style scoped>
/* 页签条和字段权限内容都放在白底卡片里，和列表卡片对齐 */
.role-tabs :deep(> .el-tabs__header) {
  padding: 0 16px;
  margin-bottom: 8px;
  background: var(--el-bg-color);
  border-radius: 4px;
}

.role-tabs :deep(> .el-tabs__header .el-tabs__nav-wrap::after) {
  display: none;
}

.role-tabs :deep(.field-permissions) {
  padding: 16px 20px;
  background: var(--el-bg-color);
  border-radius: 4px;
}
</style>
