<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { ElConfigProvider } from "element-plus";
import { ReDialog } from "@/components/ReDialog";
import en from "element-plus/es/locale/lang/en";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import { useUserStoreHook } from "@/store/modules/user";
const user = useUserStoreHook();
const { locale } = useI18n();
const currentLocale = computed(() => (locale.value === "zh" ? zhCn : en));
</script>
<template>
  <el-config-provider :locale="currentLocale"
    ><router-view
      v-if="!user.transitioning"
      :key="user.isAuthenticated ? user.epoch : 'public'" /><el-skeleton
      v-else
      :rows="6"
      animated /><ReDialog
  /></el-config-provider>
</template>
