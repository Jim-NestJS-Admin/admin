<script setup lang="ts">
import SystemPage from "./SystemPage.vue";
import { useI18n } from "vue-i18n";
import { useUserStoreHook } from "@/store/modules/user";
import { permission } from "@/platform/system/resources";
const { t } = useI18n();
const user = useUserStoreHook();
</script>
<template>
  <SystemPage resource="dict-type">
    <template #editor-related="{ record }">
      <el-tabs
        v-if="user.permissions.includes(permission('systemDictItemPage'))"
        :key="String(record.id)"
      >
        <el-tab-pane :label="t('system.dictionaryItems')" lazy>
          <SystemPage
            resource="dict-item"
            :fixed="{ typeId: String(record.id) }"
            :fill="false"
          />
        </el-tab-pane>
      </el-tabs>
    </template>
  </SystemPage>
</template>
