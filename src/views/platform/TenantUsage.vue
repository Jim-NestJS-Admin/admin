<script setup lang="ts">
/** 租户详情里的使用情况：用户数、存储用量和配额（平台只读查询，后端记审计） */
import { onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { api } from "@/api/client";

const props = defineProps<{ tenantId: string }>();
const { t } = useI18n();
type Usage = {
  users: number;
  storageBytes: string;
  quotas: { maxUsers?: number | null; storageMb?: number | null };
};
const usage = ref<Usage | null>(null);
const failed = ref(false);
onMounted(async () => {
  try {
    usage.value = (
      await api.platformTenantUsage({ body: { id: props.tenantId } })
    ).data as unknown as Usage;
  } catch {
    failed.value = true;
  }
});
const megabytes = (bytes: string) => {
  const n = Number(bytes);
  return Number.isFinite(n) ? (n / 1024 / 1024).toFixed(1) : bytes;
};
const limit = (value: number | null | undefined, unit = "") =>
  value === null || value === undefined
    ? t("platform.unlimited")
    : `${value}${unit}`;
</script>

<template>
  <el-descriptions
    :title="t('platform.usage')"
    :column="2"
    border
    class="tenant-usage"
  >
    <template v-if="usage">
      <el-descriptions-item :label="t('platform.users')">
        {{ usage.users }} / {{ limit(usage.quotas?.maxUsers) }}
      </el-descriptions-item>
      <el-descriptions-item :label="t('platform.storage')">
        {{ megabytes(usage.storageBytes) }} MB /
        {{ limit(usage.quotas?.storageMb, " MB") }}
      </el-descriptions-item>
    </template>
    <el-descriptions-item v-else-if="failed" :span="2">
      {{ t("platform.loadFailed") }}
    </el-descriptions-item>
  </el-descriptions>
</template>

<style scoped>
.tenant-usage {
  margin-top: 16px;
}
</style>
