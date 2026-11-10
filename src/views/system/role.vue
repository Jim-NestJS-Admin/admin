<script setup lang="ts">
import SystemPage from "./SystemPage.vue";
import FieldPermissions from "./FieldPermissions.vue";
import { useI18n } from "vue-i18n";
import { useUserStoreHook } from "@/store/modules/user";
import { permission } from "@/platform/system/resources";
const { t } = useI18n();
const user = useUserStoreHook();
</script>
<template>
  <SystemPage resource="role">
    <template #editor-related="{ record }">
      <el-tabs
        v-if="
          !record.allPermissions &&
          user.permissions.includes(permission('systemRoleFieldOverview'))
        "
        :key="String(record.id)"
      >
        <el-tab-pane :label="t('fieldPerm.title')" lazy>
          <FieldPermissions
            :key="String(record.id)"
            mode="role"
            :fixed-role-id="String(record.id)"
          />
        </el-tab-pane>
      </el-tabs>
    </template>
  </SystemPage>
</template>
