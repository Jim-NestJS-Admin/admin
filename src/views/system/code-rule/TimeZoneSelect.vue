<script setup lang="ts">
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import {
  matchesTimeZone,
  findTimeZone,
  timeZoneOptionLabel
} from "./useTimeZones";
import { useTimeZoneDirectory } from "./time-zone-directory";
const props = defineProps<{ modelValue?: string; disabled?: boolean }>();
const emit = defineEmits<{ "update:modelValue": [value: string] }>();
const { t, locale } = useI18n();
const query = ref("");
const directory = useTimeZoneDirectory();
const { options, loading, error } = directory;
const filtered = computed(() =>
  options.value.filter(item => matchesTimeZone(item, query.value))
);
const legacy = computed(
  () =>
    props.modelValue &&
    !options.value.some(item => item.value === props.modelValue)
);
const legacyLabel = computed(() => {
  const item = findTimeZone(options.value, props.modelValue ?? "");
  return item
    ? timeZoneOptionLabel(item, locale.value)
    : `${props.modelValue}（${t("codeRules.savedTimeZone")}）`;
});
</script>
<template>
  <div class="timezone-field">
    <el-select
      :model-value="modelValue"
      filterable
      :filter-method="value => (query = value)"
      :loading="loading"
      :disabled="disabled || loading || Boolean(error)"
      :placeholder="t('codeRules.timeZoneSearch')"
      :aria-label="t('codeRules.timeZoneSearch')"
      @visible-change="query = ''"
      @update:model-value="emit('update:modelValue', $event)"
    >
      <el-option v-if="legacy" :value="modelValue!" :label="legacyLabel" />
      <el-option-group
        v-for="common in [true, false]"
        :key="String(common)"
        :label="
          t(common ? 'codeRules.commonTimeZones' : 'codeRules.allTimeZones')
        "
      >
        <el-option
          v-for="item in filtered.filter(item => item.common === common)"
          :key="item.value"
          :value="item.value"
          :label="timeZoneOptionLabel(item, locale)"
        />
      </el-option-group>
    </el-select>
    <p v-if="legacy && !loading && !error" class="timezone-note">
      {{ t("codeRules.legacyTimeZone") }}
    </p>
    <div v-if="error" class="timezone-error">
      <span role="alert">{{ t(error) }}</span
      ><el-button
        link
        type="primary"
        :disabled="disabled"
        @click="directory.load"
        >{{ t("codeRules.retryTimeZones") }}</el-button
      >
    </div>
  </div>
</template>
<style scoped>
.timezone-field {
  display: grid;
  gap: 8px;
  width: 100%;
  min-width: 0;
}

.timezone-note {
  margin: 0;
  font-size: 12px;
  line-height: 1.5;
  color: var(--el-text-color-secondary);
}

.timezone-error {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  color: var(--el-color-danger);
}
</style>
