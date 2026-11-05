<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { useUserStoreHook } from "@/store/modules/user";
const { t } = useI18n();
const user = useUserStoreHook();
</script>
<template>
  <el-card
    ><h1>{{ t("admin.welcome") }}</h1>
    <p>{{ user.nickname || user.username }}</p>
    <el-empty :description="t('admin.selectMenu')"
  /></el-card>
</template>
