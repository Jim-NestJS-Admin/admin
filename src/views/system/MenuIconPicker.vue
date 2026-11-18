<script setup lang="ts">
import { computed, nextTick, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import type { ButtonInstance, InputInstance } from "element-plus";
import ArrowDown from "~icons/ri/arrow-down-s-line";
import ImageIcon from "~icons/ri/image-line";
import SearchIcon from "~icons/ri/search-line";
import MenuIcon from "@/components/ReIcon/src/MenuIcon.vue";
import {
  findMenuIcon,
  menuIconOptions,
  type MenuIconOption,
  type MenuIconSource
} from "@/components/ReIcon/src/offlineIcon";
import { getConfig } from "@/config";

const props = defineProps<{ disabled?: boolean; menuTitle?: string }>();
const model = defineModel<string | null>({ default: null });
const { t } = useI18n();
const visible = ref(false);
const query = ref("");
const source = ref<MenuIconSource>("local");
const localLibrary = ref<"ep" | "ri">("ep");
const page = ref(1);
const pageSize = 40;
const trigger = ref<ButtonInstance>();
const search = ref<InputInstance>();
const sources: MenuIconSource[] = ["local", "project"];
if (getConfig().EnableOnlineMenuIcons === true) sources.push("online");

const current = computed(() => findMenuIcon(model.value));
function labelOf(option: MenuIconOption) {
  if (option.label) return t(`system.menuIconPicker.names.${option.label}`);
  return option.value.slice(option.value.indexOf("/") + 1).replaceAll("-", " ");
}
const currentLabel = computed(() =>
  current.value
    ? labelOf(current.value)
    : model.value || t("system.menuIconPicker.none")
);
const options = computed(() => {
  const keyword = query.value.trim().toLowerCase();
  return menuIconOptions.filter(
    option =>
      option.source === source.value &&
      (source.value !== "local" ||
        option.value.startsWith(`${localLibrary.value}/`)) &&
      `${labelOf(option)} ${option.value}`.toLowerCase().includes(keyword)
  );
});
const pageOptions = computed(() => {
  const start = (page.value - 1) * pageSize;
  return options.value.slice(start, start + pageSize);
});

watch([source, localLibrary, query], () => (page.value = 1), { flush: "sync" });
watch(visible, open => {
  if (!open) return;
  query.value = "";
  const currentSource = current.value?.source;
  source.value = sources.includes(currentSource) ? currentSource : "local";
  localLibrary.value = current.value?.value.startsWith("ri/") ? "ri" : "ep";
  const selectedIndex = options.value.findIndex(
    option => option.value === current.value?.value
  );
  page.value = selectedIndex < 0 ? 1 : Math.floor(selectedIndex / pageSize) + 1;
});
watch(
  () => props.disabled,
  disabled => {
    if (disabled) visible.value = false;
  }
);

async function close() {
  visible.value = false;
  await nextTick();
  trigger.value?.ref?.focus();
}

async function clear() {
  model.value = null;
  await nextTick();
  trigger.value?.ref?.focus();
}
</script>

<template>
  <div class="menu-icon-field">
    <el-popover
      v-model:visible="visible"
      trigger="click"
      placement="bottom-start"
      width="min(420px, calc(100vw - 32px))"
      :disabled="disabled"
      @after-enter="search?.focus()"
    >
      <template #reference>
        <el-button
          ref="trigger"
          class="menu-icon-trigger"
          :disabled="disabled"
          :aria-expanded="visible"
          :aria-label="
            model
              ? t('system.menuIconPicker.fieldLabel', { value: currentLabel })
              : t('system.menuIconPicker.choose')
          "
        >
          <MenuIcon v-if="model" :value="model" />
          <el-icon v-else><ImageIcon /></el-icon>
          <span v-if="!model">{{ t("system.menuIconPicker.choose") }}</span>
          <el-icon><ArrowDown /></el-icon>
        </el-button>
      </template>

      <div class="menu-icon-picker" @keydown.esc.stop.prevent="close">
        <el-radio-group
          v-model="source"
          size="small"
          :aria-label="t('system.menuIconPicker.source')"
        >
          <el-radio-button
            v-for="option in sources"
            :key="option"
            :value="option"
          >
            {{ t(`system.menuIconPicker.sources.${option}`) }}
          </el-radio-button>
        </el-radio-group>
        <div class="menu-icon-filters">
          <el-select
            v-if="source === 'local'"
            v-model="localLibrary"
            class="menu-icon-library"
            :aria-label="t('system.menuIconPicker.library')"
            :teleported="false"
          >
            <el-option label="Element Plus" value="ep" />
            <el-option label="Remix Icon" value="ri" />
          </el-select>
          <el-input
            ref="search"
            v-model="query"
            :placeholder="t('system.menuIconPicker.search')"
            :aria-label="t('system.menuIconPicker.search')"
            :prefix-icon="SearchIcon"
            clearable
            @keydown.enter.prevent
          />
        </div>
        <p v-if="source === 'online'" class="menu-icon-note">
          {{ t("system.menuIconPicker.onlineNote") }}
        </p>
        <div v-if="options.length" class="menu-icon-options">
          <el-button
            v-for="option in pageOptions"
            :key="option.value"
            plain
            :type="option.value === current?.value ? 'primary' : 'default'"
            :aria-label="labelOf(option)"
            :aria-pressed="option.value === current?.value"
            :disabled="disabled"
            @click="model = option.value"
          >
            <MenuIcon :value="option.value" />
          </el-button>
        </div>
        <el-empty
          v-else
          :image-size="36"
          :description="t('system.menuIconPicker.empty')"
        />
        <el-pagination
          v-if="options.length > pageSize"
          v-model:current-page="page"
          :page-size="pageSize"
          :total="options.length"
          :pager-count="5"
          layout="prev, pager, next"
          small
        />
        <div class="menu-icon-preview">
          <span class="menu-icon-note">{{
            t("system.menuIconPicker.preview")
          }}</span>
          <span class="menu-icon-preview-entry" aria-live="polite">
            <MenuIcon v-if="model" :value="model" />
            <span class="menu-icon-preview-title">
              {{ menuTitle || t("system.menuIconPicker.menuTitle") }}
            </span>
            <span class="sr-only">{{ currentLabel }}</span>
          </span>
        </div>
      </div>
    </el-popover>
    <el-button
      v-if="model"
      link
      type="primary"
      :disabled="disabled"
      @click="clear"
    >
      {{ t("crud.clear") }}
    </el-button>
  </div>
</template>

<style scoped>
.menu-icon-field {
  display: flex;
  gap: 8px;
  align-items: center;
  width: 100%;
  min-width: 0;
}

.menu-icon-trigger {
  min-width: 0;
  max-width: 100%;
}

.menu-icon-trigger :deep(> span) {
  gap: 6px;
  min-width: 0;
}

.menu-icon-preview-title {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.menu-icon-field :deep(.el-button + .el-button),
.menu-icon-options :deep(.el-button + .el-button) {
  margin-left: 0;
}

.menu-icon-picker {
  display: grid;
  gap: 10px;
  min-width: 0;
}

.menu-icon-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.menu-icon-library {
  width: 132px;
}

.menu-icon-filters :deep(.el-input) {
  flex: 1;
  min-width: 140px;
}

.menu-icon-options {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(40px, 1fr));
  gap: 6px;
  max-height: min(260px, 38dvh);
  padding: 1px;
  overflow: auto;
}

.menu-icon-options :deep(.el-button) {
  height: 40px;
  padding: 0;
}

.menu-icon-note {
  margin: 0;
  font-size: var(--el-font-size-small);
  color: var(--el-text-color-secondary);
}

.menu-icon-preview {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  padding-top: 8px;
  border-top: 1px solid var(--el-border-color-lighter);
}

.menu-icon-preview-entry {
  display: inline-flex;
  gap: 8px;
  align-items: center;
  max-width: 100%;
  padding: 4px 8px;
  color: var(--pure-theme-menu-text, var(--el-text-color-primary));
  background: var(--pure-theme-menu-bg, var(--el-fill-color-light));
  border-radius: var(--el-border-radius-base);
}
</style>
