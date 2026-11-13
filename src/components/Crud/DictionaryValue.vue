<script setup lang="ts">
import { computed } from "vue";
import type { CrudCell, CrudSchema } from "./types";
const props = defineProps<{
  cell: CrudCell;
  options?: CrudSchema["dictionaries"][string];
  text: unknown;
}>();
const tagType = computed(() => {
  if (props.cell.state === "hidden" || props.cell.state === "masked")
    return undefined;
  const type = props.options?.find(
    item => item.value === props.cell.display
  )?.tagType;
  if (
    type &&
    ["primary", "success", "info", "warning", "danger"].includes(type)
  )
    return type;
  return typeof props.cell.display === "boolean"
    ? props.cell.display
      ? "success"
      : "info"
    : undefined;
});
</script>
<template>
  <el-tag v-if="tagType" :type="tagType" size="small" effect="light">{{
    text
  }}</el-tag
  ><template v-else>{{ text }}</template>
</template>
