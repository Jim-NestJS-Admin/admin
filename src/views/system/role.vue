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
  <el-tabs v-model="tab"
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
