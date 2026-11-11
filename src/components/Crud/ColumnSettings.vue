<script setup lang="ts">
import { computed, nextTick, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import Sortable from "sortablejs";
import SettingIcon from "~icons/ri/list-settings-line";
import DragIcon from "~icons/ri/draggable";
import { columnChoices } from "./model.mjs";
import type { CrudChoices, CrudSchema } from "./types";

/**
 * 列设置（参考 xinliwei 后台的列设置）：勾选显示、拖动排序、表格紧凑程度，改了马上生效并按用户保存。
 * 列宽和固定列沿用已保存的值（拖表头可以调列宽）。
 */
const props = defineProps<{
  schema: CrudSchema;
  choices: CrudChoices;
  /** 模块配置下的列（不含用户列设置），「恢复默认」回到它 */
  baseline?: CrudChoices;
  disabled?: boolean;
}>();
const emit = defineEmits<{ save: [value: CrudChoices] }>();
const { t } = useI18n();
const visible = ref(false);
const draft = ref<CrudChoices>({ columns: [], density: "default" });
const listEl = ref<HTMLElement>();
let sortable: Sortable | undefined;

const label = (field: string) =>
  props.schema.columns.find(column => column.field === field)?.label ?? field;
const checked = computed(
  () => draft.value.columns.filter(column => column.visible).length
);
const allChecked = computed(
  () =>
    draft.value.columns.length > 0 &&
    checked.value === draft.value.columns.length
);

function load() {
  draft.value = columnChoices(props.schema, props.choices);
}
function apply() {
  emit("save", JSON.parse(JSON.stringify(draft.value)));
}
function toggleAll(value: unknown) {
  draft.value.columns.forEach(column => (column.visible = !!value));
  apply();
}
function reset() {
  draft.value = props.baseline?.columns.length
    ? JSON.parse(JSON.stringify(props.baseline))
    : columnChoices(props.schema);
  apply();
}
function density(value: CrudChoices["density"]) {
  draft.value.density = value;
  apply();
}

watch(visible, async open => {
  if (!open) {
    sortable?.destroy();
    sortable = undefined;
    return;
  }
  load();
  await nextTick();
  if (!listEl.value) return;
  sortable = Sortable.create(listEl.value, {
    handle: ".column-drag",
    animation: 150,
    onEnd: ({ oldIndex, newIndex }) => {
      if (oldIndex == null || newIndex == null || oldIndex === newIndex) return;
      const columns = [...draft.value.columns];
      const [moved] = columns.splice(oldIndex, 1);
      columns.splice(newIndex, 0, moved);
      draft.value.columns = columns;
      apply();
    }
  });
});
</script>
<template>
  <el-popover
    v-model:visible="visible"
    placement="bottom-end"
    trigger="click"
    :width="260"
    popper-class="crud-column-settings"
  >
    <template #reference>
      <button
        type="button"
        class="crud-addon"
        :aria-label="t('crud.columns')"
        :title="t('crud.columns')"
        :disabled="disabled"
      >
        <component :is="SettingIcon" class="crud-addon-icon" />
      </button>
    </template>
    <div class="column-settings">
      <div class="column-density">
        <span>{{ t("crud.density") }}</span>
        <el-radio-group
          :model-value="draft.density"
          size="small"
          @update:model-value="density($event as CrudChoices['density'])"
        >
          <el-radio-button value="small">{{ t("crud.small") }}</el-radio-button>
          <el-radio-button value="default">{{
            t("crud.default")
          }}</el-radio-button>
          <el-radio-button value="large">{{ t("crud.large") }}</el-radio-button>
        </el-radio-group>
      </div>
      <div class="column-head">
        <el-checkbox
          :model-value="allChecked"
          :indeterminate="!allChecked && checked > 0"
          @change="toggleAll"
          >{{
            t("crud.columnsShown", {
              count: checked,
              total: draft.columns.length
            })
          }}</el-checkbox
        >
        <el-button link type="primary" @click="reset">{{
          t("crud.reset")
        }}</el-button>
      </div>
      <el-scrollbar max-height="360px">
        <div ref="listEl">
          <div
            v-for="column in draft.columns"
            :key="column.field"
            class="column-item"
          >
            <component :is="DragIcon" class="column-drag" />
            <el-checkbox v-model="column.visible" @change="apply">{{
              label(column.field)
            }}</el-checkbox>
          </div>
        </div>
      </el-scrollbar>
      <p class="column-tip">{{ t("crud.columnsTip") }}</p>
    </div>
  </el-popover>
</template>
<style scoped>
.column-density {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 8px;
  margin-bottom: 6px;
  font-size: 13px;
  color: var(--el-text-color-regular);
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.column-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 6px;
  margin-bottom: 6px;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.column-item {
  display: flex;
  gap: 6px;
  align-items: center;
  height: 32px;
  padding: 0 4px;
  border-radius: 4px;
}

.column-item:hover {
  background: var(--el-fill-color-light);
}

.column-drag {
  flex-shrink: 0;
  width: 14px;
  height: 14px;
  color: var(--el-text-color-placeholder);
  cursor: move;
}

.column-tip {
  margin: 8px 0 0;
  font-size: 12px;
  line-height: 1.5;
  color: var(--el-text-color-secondary);
}
</style>
