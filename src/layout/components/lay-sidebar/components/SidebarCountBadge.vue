<script setup lang="ts">
import { useI18n } from "vue-i18n";

defineProps<{ count: number }>();
const { t } = useI18n();
</script>

<template>
  <el-badge
    v-if="count > 0"
    class="sidebar-count"
    type="danger"
    :value="count"
    :max="99"
    :aria-label="t('notifications.pending', { count })"
    :title="t('notifications.pending', { count })"
  />
</template>

<style scoped>
.sidebar-count {
  display: inline-flex;
  flex: none;
  align-items: center;
  margin-inline-start: 8px;
}

.sidebar-count :deep(.el-badge__content) {
  position: static;
  min-width: 18px;
  height: 18px;
  padding-inline: 4px;
  font-size: 11px;
  font-variant-numeric: tabular-nums;
  line-height: 18px;
  border: 0;
  border-radius: 5px;
}
</style>
