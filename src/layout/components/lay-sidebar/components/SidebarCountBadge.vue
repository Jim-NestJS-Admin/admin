<script setup lang="ts">
import { useI18n } from "vue-i18n";

defineProps<{ count: number; group?: boolean }>();
defineEmits<{ activate: [] }>();
const { t } = useI18n();
</script>

<template>
  <component
    :is="group ? 'button' : 'span'"
    v-if="count > 0"
    class="sidebar-count"
    :type="group ? 'button' : undefined"
    :aria-label="t('notifications.pending', { count })"
    :title="t('notifications.pending', { count })"
    @click.stop.prevent="$emit('activate')"
    @keydown.enter.stop
    @keydown.space.stop
  >
    <el-badge
      class="sidebar-count-value"
      type="danger"
      :value="count"
      :max="99"
    />
  </component>
</template>

<style scoped>
.sidebar-count {
  display: inline-flex;
  flex: none;
  align-items: center;
  margin-inline-start: 8px;
  cursor: pointer;
  background: transparent;
  border: 0;
}

.sidebar-count-value {
  display: flex;
  align-items: center;
}

.sidebar-count :deep(.el-badge__content) {
  position: static;
}
</style>
