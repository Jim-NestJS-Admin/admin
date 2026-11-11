<script setup lang="ts">
/**
 * 字段编辑（像 Navicat 设计表）：左边一行一个字段，只放数据库层面的列（列名、类型、长度、可空、默认值、注释）；
 * 选中一行，右边属性面板设属性名、显示名称、字典、唯一、字段权限。类型只给后端字段类型目录里的那十几种。
 * 错误按后端返回的路径挂到单元格上：格子标红，悬停看原因。
 */
import { computed, nextTick, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import AddIcon from "~icons/ri/add-line";
import InsertIcon from "~icons/ri/insert-row-bottom";
import DeleteIcon from "~icons/ri/delete-bin-line";
import UpIcon from "~icons/ri/arrow-up-line";
import DownIcon from "~icons/ri/arrow-down-line";
import DragIcon from "~icons/ri/draggable";
import ErrorIcon from "~icons/ri/error-warning-fill";
import {
  MASK_RULES,
  PERM_STATES,
  applyColumn,
  applyComment,
  changeType,
  newField,
  type FieldDraft,
  type FieldType,
  type FieldTypeInfo
} from "./spec";

const fields = defineModel<FieldDraft[]>({ required: true });
const props = defineProps<{
  catalog: FieldTypeInfo[];
  dictionaries: { code: string; name: string; builtin: boolean }[];
  /** { [fieldKey]: { [cell]: message } } */
  errors: Record<string, Record<string, string>>;
  /** 子表的外键由框架维护，在表头下方提示，不在字段里出现 */
  foreignKey?: string;
  /** 外部要求选中某一行（错误定位） */
  focusKey?: string;
}>();
const { t } = useI18n();

const selectedKey = ref(fields.value[0]?.key ?? "");
const selected = computed(() =>
  fields.value.find(field => field.key === selectedKey.value)
);
const selectedIndex = computed(() =>
  fields.value.findIndex(field => field.key === selectedKey.value)
);
watch(
  () => props.focusKey,
  key => {
    if (key && fields.value.some(field => field.key === key))
      selectedKey.value = key;
  },
  { immediate: true }
);
watch(
  () => fields.value.length,
  () => {
    if (!selected.value) selectedKey.value = fields.value[0]?.key ?? "";
  }
);

const info = (type: FieldType) =>
  props.catalog.find(item => item.type === type);
const has = (field: FieldDraft, option: string) =>
  info(field.type)?.options.includes(option) ?? false;
const numeric = (field: FieldDraft) =>
  field.type === "decimal" || field.type === "money";
const rowError = (field: FieldDraft) =>
  Object.values(props.errors[field.key] ?? {})[0];
const cellError = (field: FieldDraft, cell: string) =>
  props.errors[field.key]?.[cell];

const gridEl = ref<HTMLElement>();
async function focusColumn(key: string) {
  selectedKey.value = key;
  await nextTick();
  gridEl.value
    ?.querySelector<HTMLInputElement>(`[data-key="${key}"] input`)
    ?.focus();
}
function add() {
  const field = newField("string", props.catalog);
  fields.value.push(field);
  void focusColumn(field.key);
}
function insert() {
  const field = newField("string", props.catalog);
  const at =
    selectedIndex.value < 0 ? fields.value.length : selectedIndex.value;
  fields.value.splice(at, 0, field);
  void focusColumn(field.key);
}
function remove() {
  const at = selectedIndex.value;
  if (at < 0) return;
  fields.value.splice(at, 1);
  selectedKey.value =
    fields.value[Math.min(at, fields.value.length - 1)]?.key ?? "";
}
function move(offset: number) {
  const at = selectedIndex.value,
    to = at + offset;
  if (at < 0 || to < 0 || to >= fields.value.length) return;
  const [field] = fields.value.splice(at, 1);
  fields.value.splice(to, 0, field);
}
/** 原生拖动换行；按 key 找位置，不信任拖动开始时的下标 */
let dragging = "";
function drop(targetKey: string) {
  const from = fields.value.findIndex(field => field.key === dragging),
    to = fields.value.findIndex(field => field.key === targetKey);
  dragging = "";
  if (from < 0 || to < 0 || from === to) return;
  const [field] = fields.value.splice(from, 1);
  fields.value.splice(to, 0, field);
}
const lengthText = (field: FieldDraft) =>
  numeric(field)
    ? `${field.precision ?? ""},${field.scale ?? ""}`
    : has(field, "length")
      ? String(field.length ?? "")
      : "";
function setLength(field: FieldDraft, value: string) {
  if (numeric(field)) {
    const [precision, scale] = value.split(/[,，]/).map(part => part.trim());
    field.precision = /^\d+$/.test(precision ?? "")
      ? Number(precision)
      : undefined;
    field.scale = /^\d+$/.test(scale ?? "") ? Number(scale) : undefined;
  } else
    field.length = /^\d+$/.test(value.trim())
      ? Number(value.trim())
      : undefined;
}
const permLabel = (state: string) => t(`codegen.perm.${state}`);
const typeHint = computed(() => {
  const item = selected.value && info(selected.value.type);
  return item
    ? t("codegen.typeHint", {
        database: item.databaseType,
        component: t(`codegen.components.${item.component}`)
      })
    : "";
});
const dictName = (code: string) =>
  props.dictionaries.find(item => item.code === code)?.name;
</script>

<template>
  <div class="field-editor">
    <div class="field-main">
      <div class="field-toolbar">
        <el-button type="primary" :icon="useRenderIcon(AddIcon)" @click="add">{{
          t("codegen.addField")
        }}</el-button>
        <el-button :icon="useRenderIcon(InsertIcon)" @click="insert">{{
          t("codegen.insertField")
        }}</el-button>
        <el-button
          :icon="useRenderIcon(DeleteIcon)"
          :disabled="!selected"
          @click="remove"
          >{{ t("codegen.removeField") }}</el-button
        >
        <el-button-group>
          <el-button
            :icon="useRenderIcon(UpIcon)"
            :disabled="selectedIndex <= 0"
            :aria-label="t('codegen.moveUp')"
            @click="move(-1)"
          />
          <el-button
            :icon="useRenderIcon(DownIcon)"
            :disabled="selectedIndex < 0 || selectedIndex >= fields.length - 1"
            :aria-label="t('codegen.moveDown')"
            @click="move(1)"
          />
        </el-button-group>
        <span v-if="foreignKey" class="field-fk">{{
          t("codegen.foreignKeyHint", { name: foreignKey })
        }}</span>
        <div class="field-flex" />
        <span class="field-count">{{
          t("codegen.fieldTotal", { count: fields.length })
        }}</span>
      </div>
      <div ref="gridEl" class="field-grid" role="grid">
        <div class="grid-row grid-head" role="row">
          <span class="c-index" role="columnheader">#</span>
          <span class="c-column" role="columnheader">{{
            t("codegen.column")
          }}</span>
          <span class="c-type" role="columnheader">{{
            t("codegen.kind")
          }}</span>
          <span class="c-length" role="columnheader">{{
            t("codegen.length")
          }}</span>
          <span class="c-null" role="columnheader">{{
            t("codegen.nullable")
          }}</span>
          <span class="c-default" role="columnheader">{{
            t("codegen.defaultValue")
          }}</span>
          <span class="c-comment" role="columnheader">{{
            t("codegen.comment")
          }}</span>
        </div>
        <el-scrollbar class="grid-body">
          <div
            v-for="(field, index) in fields"
            :key="field.key"
            class="grid-row"
            :class="{
              'is-selected': field.key === selectedKey,
              'has-error': rowError(field)
            }"
            :data-key="field.key"
            role="row"
            @click="selectedKey = field.key"
            @focusin="selectedKey = field.key"
            @dragover.prevent
            @drop.prevent="drop(field.key)"
          >
            <span
              class="c-index"
              draggable="true"
              :title="t('codegen.dragHint')"
              @dragstart="dragging = field.key"
            >
              <el-tooltip
                v-if="rowError(field)"
                :content="rowError(field)"
                placement="top"
              >
                <component :is="ErrorIcon" class="row-error-icon" />
              </el-tooltip>
              <template v-else>
                <span class="row-number">{{ index + 1 }}</span>
                <component :is="DragIcon" class="row-drag" />
              </template>
            </span>
            <span class="c-column">
              <el-tooltip
                :disabled="!cellError(field, 'column')"
                :content="cellError(field, 'column')"
                placement="top"
              >
                <el-input
                  :model-value="field.column"
                  :class="{ 'is-invalid': cellError(field, 'column') }"
                  :placeholder="t('codegen.columnPlaceholder')"
                  maxlength="48"
                  @update:model-value="applyColumn(field, $event.trim())"
                />
              </el-tooltip>
            </span>
            <span class="c-type">
              <el-tooltip
                :disabled="!cellError(field, 'type')"
                :content="cellError(field, 'type')"
                placement="top"
              >
                <el-select
                  :model-value="field.type"
                  :class="{ 'is-invalid': cellError(field, 'type') }"
                  :aria-label="t('codegen.kind')"
                  @update:model-value="changeType(field, $event, catalog)"
                >
                  <el-option
                    v-for="item in catalog"
                    :key="item.type"
                    :value="item.type"
                    :label="item.label"
                  >
                    <span>{{ item.label }}</span>
                    <span class="option-sub">{{ item.databaseType }}</span>
                  </el-option>
                </el-select>
              </el-tooltip>
            </span>
            <span class="c-length">
              <el-tooltip
                :disabled="
                  !(
                    cellError(field, 'length') ||
                    cellError(field, 'precision') ||
                    cellError(field, 'scale')
                  )
                "
                :content="
                  cellError(field, 'length') ||
                  cellError(field, 'precision') ||
                  cellError(field, 'scale')
                "
                placement="top"
              >
                <el-input
                  v-if="has(field, 'length') || numeric(field)"
                  :model-value="lengthText(field)"
                  :class="{
                    'is-invalid':
                      cellError(field, 'length') ||
                      cellError(field, 'precision') ||
                      cellError(field, 'scale')
                  }"
                  :placeholder="numeric(field) ? '14,2' : '255'"
                  @update:model-value="setLength(field, $event)"
                />
                <span v-else class="cell-none">—</span>
              </el-tooltip>
            </span>
            <span class="c-null">
              <el-checkbox
                v-model="field.nullable"
                :aria-label="t('codegen.nullable')"
              />
            </span>
            <span class="c-default">
              <el-tooltip
                :disabled="!cellError(field, 'defaultValue')"
                :content="cellError(field, 'defaultValue')"
                placement="top"
              >
                <el-select
                  v-if="field.type === 'boolean'"
                  v-model="field.defaultText"
                  clearable
                  :class="{ 'is-invalid': cellError(field, 'defaultValue') }"
                  :placeholder="t('codegen.noDefault')"
                >
                  <el-option value="true" :label="t('codegen.boolYes')" />
                  <el-option value="false" :label="t('codegen.boolNo')" />
                  <el-option v-if="field.nullable" value="NULL" label="NULL" />
                </el-select>
                <el-input
                  v-else
                  v-model="field.defaultText"
                  :disabled="
                    (field.type === 'text' || field.type === 'json') &&
                    !field.nullable
                  "
                  :class="{ 'is-invalid': cellError(field, 'defaultValue') }"
                  :placeholder="
                    field.type === 'date'
                      ? 'YYYY-MM-DD'
                      : field.type === 'datetime'
                        ? 'YYYY-MM-DD HH:mm:ss'
                        : ''
                  "
                />
              </el-tooltip>
            </span>
            <span class="c-comment">
              <el-tooltip
                :disabled="!cellError(field, 'comment')"
                :content="cellError(field, 'comment')"
                placement="top"
              >
                <el-input
                  :model-value="field.comment"
                  :class="{ 'is-invalid': cellError(field, 'comment') }"
                  maxlength="500"
                  @update:model-value="applyComment(field, $event)"
                />
              </el-tooltip>
            </span>
          </div>
          <div v-if="!fields.length" class="grid-empty">
            <el-empty :description="t('codegen.noFields')" :image-size="72">
              <el-button type="primary" @click="add">{{
                t("codegen.addField")
              }}</el-button>
            </el-empty>
          </div>
        </el-scrollbar>
      </div>
    </div>

    <aside class="field-panel">
      <div class="panel-head">
        {{ t("codegen.fieldProperties") }}
        <span v-if="selected" class="panel-sub">{{
          selected.column || t("codegen.unnamed")
        }}</span>
      </div>
      <el-scrollbar v-if="selected" class="panel-body">
        <el-form label-position="top" class="panel-form">
          <el-form-item
            :label="t('codegen.property')"
            :error="cellError(selected, 'property')"
          >
            <el-input
              v-model="selected.property"
              maxlength="48"
              @input="selected.autoProperty = false"
            />
            <div class="panel-tip">{{ t("codegen.propertyTip") }}</div>
          </el-form-item>
          <el-form-item
            :label="t('codegen.label')"
            :error="cellError(selected, 'label')"
          >
            <el-input
              v-model="selected.label"
              maxlength="30"
              show-word-limit
              @input="selected.autoLabel = false"
            />
          </el-form-item>
          <el-form-item :label="t('codegen.kind')">
            <div class="panel-tip is-block">{{ typeHint }}</div>
          </el-form-item>
          <template v-if="numeric(selected)">
            <div class="panel-pair">
              <el-form-item
                :label="t('codegen.precision')"
                :error="cellError(selected, 'precision')"
              >
                <el-input-number
                  v-model="selected.precision"
                  :min="1"
                  :max="65"
                  controls-position="right"
                />
              </el-form-item>
              <el-form-item
                :label="t('codegen.scale')"
                :error="cellError(selected, 'scale')"
              >
                <el-input-number
                  v-model="selected.scale"
                  :min="0"
                  :max="30"
                  controls-position="right"
                />
              </el-form-item>
            </div>
          </template>
          <el-form-item
            :label="t('codegen.dictionary')"
            :error="cellError(selected, 'dictCode')"
          >
            <el-select
              v-model="selected.dictCode"
              filterable
              allow-create
              clearable
              :placeholder="
                selected.type === 'dictionary'
                  ? t('codegen.dictRequired')
                  : t('codegen.dictOptional')
              "
            >
              <el-option
                v-for="item in dictionaries"
                :key="item.code"
                :value="item.code"
                :label="`${item.name}（${item.code}）`"
              >
                <span>{{ item.name }}</span>
                <span class="option-sub">{{ item.code }}</span>
              </el-option>
            </el-select>
            <div
              v-if="selected.dictCode && !dictName(selected.dictCode)"
              class="panel-tip"
            >
              {{ t("codegen.dictUnknown") }}
            </div>
          </el-form-item>
          <el-form-item :error="cellError(selected, 'unique')">
            <el-checkbox
              v-model="selected.unique"
              :disabled="selected.type === 'text' || selected.type === 'json'"
              >{{ t("codegen.unique") }}</el-checkbox
            >
            <div class="panel-tip is-block">{{ t("codegen.uniqueTip") }}</div>
          </el-form-item>
          <el-form-item
            :label="t('codegen.fieldPerm')"
            :error="cellError(selected, 'fieldPerm')"
          >
            <el-select v-model="selected.permDefault">
              <el-option
                v-for="state in PERM_STATES"
                :key="state"
                :value="state"
                :label="permLabel(state)"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="selected.permDefault === 'masked' || selected.mask"
            :label="t('codegen.mask')"
            :error="cellError(selected, 'fieldPerm')"
          >
            <el-select v-model="selected.mask" clearable>
              <el-option
                v-for="rule in MASK_RULES"
                :key="rule"
                :value="rule"
                :label="t(`codegen.masks.${rule}`)"
              />
            </el-select>
          </el-form-item>
          <div class="panel-tip is-block">{{ t("codegen.displayLater") }}</div>
        </el-form>
      </el-scrollbar>
      <el-empty
        v-else
        :description="t('codegen.pickField')"
        :image-size="64"
        class="panel-empty"
      />
    </aside>
  </div>
</template>

<style scoped lang="scss">
@media (width <= 1100px) {
  .field-editor {
    flex-direction: column;
  }

  .field-panel {
    width: 100%;
    max-height: 360px;
  }
}

.field-editor {
  display: flex;
  gap: 12px;
  height: 100%;
  min-height: 0;
}

.field-main {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
}

.field-toolbar {
  display: flex;
  flex-shrink: 0;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  margin-bottom: 10px;
}

.field-toolbar :deep(.el-button + .el-button) {
  margin-left: 0;
}

.field-flex {
  flex: 1;
}

.field-fk {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.field-fk,
.field-count {
  font-size: var(--el-font-size-small);
  color: var(--el-text-color-secondary);
}

/* 字段表格：用 grid 排，每格里直接放输入框（像设计表），比 el-table 里塞输入框更整齐 */
.field-grid {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 4px;
}

.grid-row {
  display: grid;
  grid-template-columns:
    52px minmax(140px, 1.2fr) 132px 92px 56px minmax(110px, 0.9fr)
    minmax(140px, 1.4fr);
  align-items: center;
  min-height: 40px;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.grid-row > span {
  display: flex;
  align-items: center;
  min-width: 0;
  padding: 0 6px;
}

.grid-head {
  flex-shrink: 0;
  min-height: 38px;
  font-size: var(--el-font-size-small);
  font-weight: 600;
  color: var(--el-text-color-secondary);
  background: var(--el-fill-color-light);
}

.grid-body {
  flex: 1;
  min-height: 0;
}

.grid-body .grid-row:hover {
  background: var(--el-fill-color-lighter);
}

.grid-body .grid-row.is-selected {
  background: var(--el-color-primary-light-9);
}

.grid-body .grid-row.is-selected .c-index {
  box-shadow: inset 2px 0 0 var(--el-color-primary);
}

.c-index {
  justify-content: center;
  height: 100%;
  font-size: var(--el-font-size-small);
  color: var(--el-text-color-secondary);
  cursor: grab;
}

.row-drag {
  display: none;
  font-size: 16px;
}

.grid-row:hover .row-number {
  display: none;
}

.grid-row:hover .row-drag {
  display: inline-block;
}

.row-error-icon {
  font-size: 16px;
  color: var(--el-color-danger);
}

.c-null {
  justify-content: center;
}

.grid-head .c-null {
  justify-content: center;
}

.grid-row :deep(.el-input),
.grid-row :deep(.el-select) {
  width: 100%;
}

/* 格子里的输入框：平时无边框像表格，悬停 / 聚焦 / 出错时显示边框 */
.grid-body :deep(.el-input__wrapper),
.grid-body :deep(.el-select__wrapper) {
  background: transparent;
  box-shadow: none;
}

.grid-body .grid-row:hover :deep(.el-input__wrapper),
.grid-body .grid-row:hover :deep(.el-select__wrapper),
.grid-body .grid-row.is-selected :deep(.el-input__wrapper),
.grid-body .grid-row.is-selected :deep(.el-select__wrapper) {
  background: var(--el-bg-color);
  box-shadow: 0 0 0 1px var(--el-border-color) inset;
}

.grid-body :deep(.el-input__wrapper.is-focus),
.grid-body :deep(.el-select__wrapper.is-focused) {
  background: var(--el-bg-color);
  box-shadow: 0 0 0 1px var(--el-color-primary) inset !important;
}

.grid-body :deep(.is-invalid .el-input__wrapper),
.grid-body :deep(.is-invalid.el-input .el-input__wrapper),
.grid-body :deep(.is-invalid .el-select__wrapper),
.grid-body :deep(.el-select.is-invalid .el-select__wrapper) {
  background: var(--el-color-danger-light-9);
  box-shadow: 0 0 0 1px var(--el-color-danger) inset !important;
}

.cell-none {
  padding-left: 11px;
  color: var(--el-text-color-placeholder);
}

.grid-empty {
  padding: 32px 0;
}

.option-sub {
  float: right;
  margin-left: 16px;
  font-size: var(--el-font-size-small);
  color: var(--el-text-color-secondary);
}

/* 右侧属性面板 */
.field-panel {
  display: flex;
  flex-shrink: 0;
  flex-direction: column;
  width: 300px;
  min-height: 0;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 4px;
}

.panel-head {
  display: flex;
  flex-shrink: 0;
  gap: 8px;
  align-items: center;
  height: 38px;
  padding: 0 12px;
  font-size: var(--el-font-size-small);
  font-weight: 600;
  color: var(--el-text-color-secondary);
  background: var(--el-fill-color-light);
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.panel-sub {
  overflow: hidden;
  text-overflow: ellipsis;
  font-family: var(--el-font-family-mono, monospace);
  font-weight: normal;
  color: var(--el-text-color-regular);
  white-space: nowrap;
}

.panel-body {
  flex: 1;
  min-height: 0;
}

.panel-form {
  padding: 12px;
}

.panel-form :deep(.el-select),
.panel-form :deep(.el-input-number) {
  width: 100%;
}

.panel-form :deep(.el-form-item) {
  margin-bottom: 16px;
}

/* 错误放在文档流里，不压住说明文字 */
.panel-form :deep(.el-form-item__error) {
  position: static;
  width: 100%;
  padding-top: 2px;
}

.panel-pair {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0 12px;
}

.panel-tip {
  width: 100%;
  margin-top: 4px;
  font-size: var(--el-font-size-extra-small);
  line-height: 18px;
  color: var(--el-text-color-secondary);
}

.panel-tip.is-block {
  margin-top: 0;
}

.panel-empty {
  flex: 1;
}
</style>
