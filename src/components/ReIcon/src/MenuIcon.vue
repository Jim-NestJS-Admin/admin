<script setup lang="ts">
import { computed } from "vue";
import { useRenderIcon } from "./hooks";
import { findMenuIcon } from "./offlineIcon";

const props = defineProps<{ value?: string | null }>();
const icon = computed(() => {
  const value = props.value;
  const known = findMenuIcon(value);
  if (known) return useRenderIcon(known.value, { width: 18, height: 18 });
  if (
    value &&
    (value.startsWith("IF-") || /^(@[\w-]+:)?[\w-]+:[\w-]+$/.test(value))
  )
    return useRenderIcon(value, { width: 18, height: 18 });
  return undefined;
});
</script>

<template>
  <span class="menu-icon" aria-hidden="true">
    <component :is="icon" v-if="icon" aria-hidden="true" />
    <span v-else class="menu-icon-empty">—</span>
  </span>
</template>

<style scoped>
.menu-icon {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  width: 1.25em;
  min-height: 1.25em;
  vertical-align: middle;
}

.menu-icon :deep(.iconfont) {
  font-size: 18px;
}

.menu-icon-empty {
  color: var(--el-text-color-placeholder);
}
</style>
