<script setup lang="ts">
import SystemPage from "./SystemPage.vue";
import { useI18n } from "vue-i18n";
import { useUserStoreHook } from "@/store/modules/user";
import { permission } from "@/platform/system/resources";
const { t } = useI18n();
const user = useUserStoreHook();
</script>
<template>
  <SystemPage resource="user">
    <template #editor-related="{ record }">
      <el-tabs :key="String(record.id)">
        <el-tab-pane
          v-if="user.permissions.includes(permission('systemUserRolePage'))"
          :label="t('system.roleAssignments')"
          lazy
        >
          <SystemPage
            resource="user-role"
            :fixed="{ userId: String(record.id) }"
            :fill="false"
          />
        </el-tab-pane>
        <el-tab-pane
          v-if="
            user.permissions.includes(permission('systemUserSupervisorPage'))
          "
          :label="t('system.supervisors')"
          lazy
        >
          <SystemPage
            resource="user-supervisor"
            :fixed="{ userId: String(record.id) }"
            :fill="false"
          />
        </el-tab-pane>
      </el-tabs>
    </template>
  </SystemPage>
</template>
