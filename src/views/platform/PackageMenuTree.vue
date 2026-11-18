<script setup lang="ts">
/**
 * 套餐可用菜单的勾选树。保存时把「全选」和「半选」的节点都写进去：
 * 只勾了目录下的部分页面时，目录本身也要在套餐里，租户才看得到这个目录。
 * 回显时只勾叶子节点，避免父节点被勾后自动带上全部子节点。
 */
import { computed, nextTick, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import type { ElTree } from "element-plus";
import { filterPackageMenuTree } from "./package-menu-tree.mjs";

export interface MenuOption {
  id: string;
  parentId: string | null;
  type: string;
  title: string;
  permission?: string | null;
  children?: MenuOption[];
}

const props = defineProps<{
  options: MenuOption[];
  modelValue: string[];
  disabled?: boolean;
  readOnly?: boolean;
}>();
const emit = defineEmits<{ "update:modelValue": [value: string[]] }>();
const { t } = useI18n();
const tree = ref<InstanceType<typeof ElTree>>();
const options = computed<MenuOption[]>(() =>
  props.readOnly
    ? filterPackageMenuTree(props.options, props.modelValue)
    : props.options
);

const leaves = computed(() => {
  const set = new Set<string>();
  const walk = (items: MenuOption[]) => {
    for (const item of items)
      if (item.children?.length) walk(item.children);
      else set.add(String(item.id));
  };
  walk(props.options);
  return set;
});
const checkedLeaves = computed(() =>
  props.readOnly
    ? []
    : props.modelValue.map(String).filter(id => leaves.value.has(id))
);
/** 选项或外部值变化时重新回显（树自己勾选产生的变化不需要） */
let echo = "";
watch(
  [() => props.options, () => props.modelValue],
  async () => {
    if (props.readOnly) return;
    const key = JSON.stringify(props.modelValue);
    if (key === echo) return;
    await nextTick();
    tree.value?.setCheckedKeys(checkedLeaves.value);
  },
  { deep: true }
);
function onCheck() {
  if (props.readOnly) return;
  const value = [
    ...(tree.value?.getCheckedKeys(false) ?? []),
    ...(tree.value?.getHalfCheckedKeys() ?? [])
  ].map(String);
  echo = JSON.stringify(value);
  emit("update:modelValue", value);
}
const label = (data: MenuOption) =>
  data.permission ? `${data.title}（${data.permission}）` : data.title;
</script>

<template>
  <div class="package-menus" :class="{ 'package-menus-readonly': readOnly }">
    <div v-if="!readOnly" class="package-menus-count">
      {{ t("platform.menuCount", { count: modelValue.length }) }}
    </div>
    <el-tree
      ref="tree"
      :data="options"
      node-key="id"
      :show-checkbox="!readOnly"
      :default-expand-all="!readOnly"
      :default-checked-keys="checkedLeaves"
      :props="{
        label: label,
        children: 'children',
        disabled: () => !!disabled
      }"
      :aria-label="
        t(readOnly ? 'platform.availableMenus' : 'platform.menuHint')
      "
      @check="onCheck"
    >
      <template v-if="readOnly" #default="{ data }">
        <span class="package-menu-title">{{ label(data) }}</span>
      </template>
    </el-tree>
  </div>
</template>

<style scoped>
.package-menus {
  width: 100%;
  max-height: 360px;
  padding: 4px 8px;
  overflow: auto;
  border: 1px solid var(--el-border-color);
  border-radius: var(--el-border-radius-base);
}

.package-menus-count {
  margin: 2px 0 4px;
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.package-menus-readonly {
  height: min(360px, 50dvh);
}

.package-menus-readonly :deep(.el-tree-node__content) {
  height: auto;
  min-height: var(--el-tree-node-content-height);
  white-space: normal;
}

.package-menu-title {
  min-width: 0;
  overflow-wrap: anywhere;
}
</style>
