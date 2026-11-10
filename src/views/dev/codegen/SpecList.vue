<script setup lang="ts">
/**
 * 代码生成 · 生成记录列表（入口）。状态：未生成 / 已生成 / 配置有改动（规格指纹和上次生成时不同）。
 * 布局和通用列表页一致：一张卡片，工具栏左边按钮、右边搜索 + 刷新，表格内部滚动。
 */
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { ElMessage, ElMessageBox } from "element-plus";
import { api } from "@/api/client";
import { permission } from "@/platform/system/resources";
import { onSessionReset } from "@/platform/lifecycle";
import { useFillHeight } from "@/components/Crud/useFillHeight";
import { useHeadStyle } from "@/components/Crud/useHeadStyle";
import { formatValue } from "@/components/Crud/model.mjs";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import AddIcon from "~icons/ri/add-circle-line";
import SearchIcon from "~icons/ri/search-line";
import EditIcon from "~icons/ri/edit-line";
import DeleteIcon from "~icons/ri/delete-bin-line";
import RefreshIcon from "@/assets/table-bar/refresh.svg?component";
import { requestMessage } from "./request";
import type { components } from "@/api/schema";

type SpecRecord = components["schemas"]["SpecRecord"];
const emit = defineEmits<{
  open: [record: SpecRecord | null];
}>();
const { t } = useI18n();
const pageEl = ref<HTMLElement>();
const fillHeight = useFillHeight(pageEl);
const headStyle = useHeadStyle();

const records = ref<SpecRecord[]>([]),
  loading = ref(false),
  error = ref(""),
  keyword = ref("");
const shown = computed(() => {
  const word = keyword.value.trim().toLowerCase();
  return word
    ? records.value.filter(record =>
        [record.label, record.name, record.spec?.tableName]
          .filter(Boolean)
          .some(text => String(text).toLowerCase().includes(word))
      )
    : records.value;
});
const fieldCount = (record: SpecRecord) =>
  (record.spec?.fields?.length ?? 0) +
  (record.spec?.children ?? []).reduce(
    (sum, child) => sum + (child.fields?.length ?? 0),
    0
  );
const statusType = (status: SpecRecord["status"]) =>
  status === "generated"
    ? "success"
    : status === "modified"
      ? "warning"
      : status === "invalid"
        ? "danger"
        : "info";

const requests = new Set<AbortController>();
function abortAll() {
  requests.forEach(request => request.abort());
  requests.clear();
}
async function load() {
  const request = new AbortController();
  requests.add(request);
  loading.value = true;
  error.value = "";
  try {
    const response = await api.devCodegenList({}, { signal: request.signal });
    if (!request.signal.aborted)
      records.value = Array.isArray(response.data) ? response.data : [];
  } catch (reason) {
    if (!request.signal.aborted) error.value = requestMessage(reason, t);
  } finally {
    requests.delete(request);
    if (!request.signal.aborted) loading.value = false;
  }
}
async function remove(record: SpecRecord) {
  try {
    await ElMessageBox.confirm(
      t("codegen.confirmDelete", { name: record.label }),
      t("crud.remove"),
      { type: "warning" }
    );
  } catch {
    return;
  }
  const request = new AbortController();
  requests.add(request);
  try {
    await api.devCodegenDelete(
      { body: { id: record.id } },
      {
        signal: request.signal,
        headers: { "Idempotency-Key": crypto.randomUUID() }
      }
    );
    if (request.signal.aborted) return;
    ElMessage.success(t("codegen.deleted"));
    await load();
  } catch (reason) {
    if (!request.signal.aborted) ElMessage.error(requestMessage(reason, t));
  } finally {
    requests.delete(request);
  }
}
const stop = onSessionReset(() => {
  abortAll();
  records.value = [];
});
onMounted(load);
onBeforeUnmount(() => {
  stop();
  abortAll();
});
</script>

<template>
  <section
    ref="pageEl"
    class="spec-list"
    :style="[headStyle, { height: `${fillHeight}px` }]"
  >
    <div class="spec-card">
      <div class="spec-toolbar">
        <el-button
          v-perm="permission('devCodegenSaveSpec')"
          type="primary"
          :icon="useRenderIcon(AddIcon)"
          @click="emit('open', null)"
          >{{ t("codegen.newModule") }}</el-button
        >
        <span class="spec-hint">{{ t("codegen.developmentOnly") }}</span>
        <div class="spec-flex" />
        <div class="spec-search">
          <el-input
            v-model="keyword"
            clearable
            :placeholder="t('codegen.searchHint')"
            :prefix-icon="useRenderIcon(SearchIcon)"
            :aria-label="t('crud.search')"
          />
          <el-tooltip :content="t('crud.reload')" placement="top">
            <el-button
              :icon="useRenderIcon(RefreshIcon)"
              :loading="loading"
              :aria-label="t('crud.reload')"
              @click="load"
            />
          </el-tooltip>
        </div>
      </div>
      <el-alert
        v-if="error"
        :title="error"
        type="error"
        :closable="false"
        class="spec-error"
      />
      <el-table
        v-loading="loading"
        :data="shown"
        row-key="id"
        height="100%"
        class="spec-table"
        :empty-text="t('codegen.emptyList')"
        @row-dblclick="(row: SpecRecord) => emit('open', row as SpecRecord)"
      >
        <el-table-column
          :label="t('codegen.titleLabel')"
          min-width="160"
          show-overflow-tooltip
        >
          <template #default="{ row }">
            <el-button
              link
              type="primary"
              @click="emit('open', row as SpecRecord)"
              >{{ row.label }}</el-button
            >
          </template>
        </el-table-column>
        <el-table-column
          :label="t('codegen.moduleKey')"
          prop="name"
          min-width="160"
          show-overflow-tooltip
        />
        <el-table-column
          :label="t('codegen.tableName')"
          min-width="160"
          show-overflow-tooltip
        >
          <template #default="{ row }">{{ row.spec?.tableName }}</template>
        </el-table-column>
        <el-table-column :label="t('codegen.template')" width="100">
          <template #default="{ row }">{{
            t(`codegen.templates.${row.spec?.template ?? "single"}`)
          }}</template>
        </el-table-column>
        <el-table-column
          :label="t('codegen.fieldCount')"
          width="90"
          align="right"
        >
          <template #default="{ row }">{{
            fieldCount(row as SpecRecord)
          }}</template>
        </el-table-column>
        <el-table-column :label="t('codegen.status')" width="120">
          <template #default="{ row }">
            <el-tooltip
              :disabled="!row.error"
              :content="row.error"
              placement="top"
            >
              <el-tag :type="statusType(row.status)" effect="light">{{
                t(`codegen.statuses.${row.status}`)
              }}</el-tag>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column :label="t('codegen.updatedAt')" width="170">
          <template #default="{ row }">{{
            formatValue(row.updatedAt, "datetime")
          }}</template>
        </el-table-column>
        <el-table-column
          :label="t('crud.actions')"
          width="170"
          fixed="right"
          align="center"
        >
          <template #default="{ row }">
            <el-button
              link
              type="primary"
              :icon="useRenderIcon(EditIcon)"
              @click="emit('open', row as SpecRecord)"
              >{{ t("crud.edit") }}</el-button
            >
            <el-button
              v-perm="permission('devCodegenDelete')"
              link
              type="danger"
              :icon="useRenderIcon(DeleteIcon)"
              @click="remove(row as SpecRecord)"
              >{{ t("crud.remove") }}</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
  </section>
</template>

<style scoped lang="scss">
.spec-list {
  min-height: 0;
  overflow: hidden;
}

.spec-card {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  padding: 0 16px 12px;
  background: var(--el-bg-color);
  border-radius: 4px;
}

/* 和通用列表页工具栏同高同边线（--crud-head-height） */
.spec-toolbar {
  display: flex;
  flex-shrink: 0;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  min-height: var(--crud-head-height, 49px);
  padding: 8px 16px;
  margin: 0 -16px 12px;
  border-bottom: 1px solid var(--el-border-color-extra-light);
}

.spec-hint {
  font-size: var(--el-font-size-small);
  color: var(--el-text-color-secondary);
}

.spec-flex {
  flex: 1;
}

.spec-search {
  display: flex;
  gap: 8px;
  align-items: center;
}

.spec-search :deep(.el-input) {
  width: 240px;
}

.spec-search :deep(.el-button + .el-button) {
  margin-left: 0;
}

.spec-error {
  flex-shrink: 0;
  margin-bottom: 12px;
}

.spec-table {
  flex: 1;
  min-height: 0;
}
</style>
