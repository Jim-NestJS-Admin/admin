<script setup lang="ts">
/** 租户详情里的使用情况：用户数、存储用量和配额（平台只读查询，后端记审计） */
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { api } from "@/api/client";
import type { components } from "@/api/schema";

const props = defineProps<{ tenantId: string }>();
const { t } = useI18n();
const usage = ref<components["schemas"]["TenantUsageResult"]>();
const loading = ref(true);
const failed = ref(false);
const request = new AbortController();
onBeforeUnmount(() => request.abort());
onMounted(async () => {
  try {
    const result = await api.platformTenantUsage(
      { body: { id: props.tenantId } },
      { signal: request.signal }
    );
    if (!request.signal.aborted) usage.value = result.data;
  } catch {
    if (!request.signal.aborted) failed.value = true;
  } finally {
    loading.value = false;
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
const rows = computed(() => {
  const current = usage.value;
  if (!current) return [];
  return [
    {
      item: t("platform.users"),
      used: current.users,
      limit: limit(current.quotas.maxUsers)
    },
    {
      item: t("platform.storage"),
      used: `${megabytes(current.storageBytes)} MB`,
      limit: limit(current.quotas.storageMb, " MB")
    }
  ];
});
</script>

<template>
  <section class="tenant-usage" :aria-label="t('platform.usage')">
    <h3 class="tenant-usage-title">{{ t("platform.usage") }}</h3>
    <el-alert
      v-if="failed"
      :title="t('platform.loadFailed')"
      type="error"
      :closable="false"
    />
    <el-table v-else v-loading="loading" :data="rows" border size="small">
      <el-table-column prop="item" :label="t('platform.usageItem')" />
      <el-table-column prop="used" :label="t('platform.usageUsed')" />
      <el-table-column prop="limit" :label="t('platform.usageLimit')" />
    </el-table>
  </section>
</template>

<style scoped>
.tenant-usage {
  margin-top: 16px;
}

.tenant-usage-title {
  margin-bottom: 8px;
  font-size: var(--el-font-size-base);
  font-weight: 600;
}
</style>
