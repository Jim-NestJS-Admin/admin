<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useTimeZoneDirectory } from "./time-zone-directory";
import { findTimeZone, timeZoneOptionLabel } from "./useTimeZones";
const props = defineProps<{ value?: unknown }>();
const { t, locale } = useI18n();
const directory = useTimeZoneDirectory();
const text = computed(() => {
  if (typeof props.value !== "string" || !props.value) return "—";
  const option = findTimeZone(directory.options.value, props.value);
  if (option) return timeZoneOptionLabel(option, locale.value);
  if (directory.loading.value) return t("codeRules.timeZoneNameLoading");
  if (directory.error.value)
    return t("codeRules.timeZoneNameFailed") + "：" + props.value;
  return props.value + "（" + t("codeRules.savedTimeZone") + "）";
});
</script>
<template>
  <span>{{ text }}</span>
</template>
