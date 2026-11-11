<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref } from "vue";
import { useI18n } from "vue-i18n";
import { ElMessage, ElMessageBox } from "element-plus";
import { api, type OperationBody, type OperationResponse } from "@/api/client";
import { generatedCrud } from "@/platform/generated-crud";
import { permission } from "@/platform/system/resources";
import { onSessionReset } from "@/platform/lifecycle";
import { notifyPageConfigChanged } from "@/platform/page-config-events";
import { RequestFailure } from "@/utils/http";
import type { CrudSchema } from "@/components/Crud/types";
import FieldPermissions from "./FieldPermissions.vue";
import {
  DEFAULT_FORM_MODE,
  DEFAULT_PAGE_SIZE,
  minimalPageConfig
} from "./page-config-diff.mjs";

const { t } = useI18n();
const modules = ref<
  OperationResponse<"systemFieldPermRegistry">["data"]["resources"]
>([]);
const selected = ref(""),
  tab = ref("list"),
  schema = ref<CrudSchema>(),
  version = ref(0),
  error = ref(""),
  busy = ref(false),
  loading = ref(false);
// 这些是编辑器视图状态；提交仍经正式生成客户端，由后端检查显示白名单。
const columns = ref<
  {
    field: string;
    label: string;
    /** 空着表示按字段类型自动 */
    width?: number | null;
    hidden: boolean;
    fixed: string;
  }[]
>([]);
const items = ref<
  {
    field: string;
    label: string;
    group: string;
    span: number;
    placeholder: string;
  }[]
>([]);
const options = reactive({
  pageSize: 20,
  tree: true,
  mode: DEFAULT_FORM_MODE as string,
  keyWords: [] as string[],
  filterable: [] as string[],
  sorting: [] as { field: string; order: string }[]
});
const histories = ref<
    { key: string; version: number; date: string; user: string }[]
  >([]),
  historyOpen = ref(false),
  historyPage = ref(1),
  historyTotal = ref(0),
  historyPreview = ref("");
let baseline = "",
  serial = 0,
  dragIndex = -1;
const requests = new Set<AbortController>();
let intent: { fingerprint: string; key: string } | undefined;
const record = (value: unknown): Record<string, unknown> =>
  value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
// 只保存和代码默认不同的部分；默认取自原始页面描述（schema 本身不含任何配置）
const config = () =>
  schema.value
    ? minimalPageConfig(
        { columns: columns.value, items: items.value, options },
        {
          columns: schema.value.columns,
          items: schema.value.form,
          keyWords: schema.value.actions.page?.keyWords ?? [],
          filterable: schema.value.actions.page?.filterable ?? [],
          sorting: schema.value.defaultSort
        }
      )
    : {};
const dirty = computed(
  () => !!schema.value && JSON.stringify(config()) !== baseline
);
const previewColumns = computed(() =>
  columns.value.filter(column => !column.hidden)
);
function fail(reason: unknown) {
  error.value =
    reason instanceof RequestFailure
      ? reason.failure.message
      : t("crud.requestFailed");
}
function fill(value: unknown) {
  const data = record(value),
    list = record(data.list),
    form = record(data.form);
  const order = Array.isArray(list.columns) ? list.columns.map(record) : [];
  const baseColumns = schema.value.columns;
  const names = [
    ...new Set([
      ...order.map(item => String(item.field)),
      ...baseColumns.map(item => item.field)
    ])
  ];
  columns.value = names.flatMap(field => {
    const original = baseColumns.find(item => item.field === field);
    if (!original) return [];
    const saved = order.find(item => item.field === field) ?? {};
    return [
      {
        field,
        label: original.label,
        width:
          typeof saved.width === "number" && saved.width !== 160
            ? saved.width
            : original.width,
        // 没配置过的列沿用代码默认（系统字段默认隐藏）
        hidden:
          typeof saved.hidden === "boolean"
            ? saved.hidden
            : original.hidden === true,
        fixed: ["left", "right"].includes(String(saved.fixed))
          ? String(saved.fixed)
          : ""
      }
    ];
  });
  const savedItems = Array.isArray(form.items) ? form.items.map(record) : [];
  const writable = new Set([
    ...(schema.value.actions.add?.writable ?? []),
    ...(schema.value.actions.update?.writable ?? [])
  ]);
  const itemNames = [
    ...new Set([
      ...savedItems.map(item => String(item.field)),
      ...schema.value.form.map(item => item.field)
    ])
  ];
  items.value = itemNames.flatMap(field => {
    const original = schema.value.form.find(item => item.field === field);
    if (!original || !writable.has(field)) return [];
    const saved = savedItems.find(item => item.field === field) ?? {};
    return [
      {
        field,
        label: original.label,
        group: typeof saved.group === "string" ? saved.group : "",
        span: saved.span === 12 ? 12 : 24,
        placeholder:
          typeof saved.placeholder === "string"
            ? saved.placeholder
            : (original.placeholder ?? "")
      }
    ];
  });
  options.pageSize =
    typeof list.pageSize === "number" ? list.pageSize : DEFAULT_PAGE_SIZE;
  options.tree = list.tree !== false;
  options.mode =
    form.mode === "dialog" || form.mode === "drawer"
      ? form.mode
      : DEFAULT_FORM_MODE;
  options.keyWords = Array.isArray(list.keyWords)
    ? list.keyWords.filter(
        (value): value is string => typeof value === "string"
      )
    : [...(schema.value.actions.page?.keyWords ?? [])];
  options.filterable = Array.isArray(list.filterable)
    ? list.filterable.filter(
        (value): value is string => typeof value === "string"
      )
    : [...(schema.value.actions.page?.filterable ?? [])];
  options.sorting = Array.isArray(list.defaultSort)
    ? list.defaultSort
        .map(record)
        .map(item => ({ field: String(item.field), order: String(item.order) }))
    : schema.value.defaultSort.map(item => ({ ...item }));
}
function resetSession() {
  intent = undefined;
  serial++;
  requests.forEach(request => request.abort());
  requests.clear();
  modules.value = [];
  schema.value = undefined;
  selected.value = "";
  columns.value = [];
  items.value = [];
  histories.value = [];
  historyOpen.value = false;
  historyPreview.value = "";
  baseline = "";
}
const stop = onSessionReset(resetSession);
onBeforeUnmount(() => {
  stop();
  resetSession();
});
onMounted(async () => {
  const request = new AbortController();
  requests.add(request);
  try {
    const result = await api.systemFieldPermRegistry(
      {},
      { signal: request.signal }
    );
    if (!request.signal.aborted) modules.value = result.data.resources;
  } catch (reason) {
    if (!request.signal.aborted) fail(reason);
  } finally {
    requests.delete(request);
  }
});
async function load() {
  if (!selected.value || busy.value) return;
  const turn = ++serial,
    request = new AbortController();
  requests.add(request);
  loading.value = true;
  error.value = "";
  try {
    const prefix = selected.value
      .split(/[:-]/)
      .map(part => part[0].toUpperCase() + part.slice(1))
      .join("");
    const [description, response] = await Promise.all([
      generatedCrud(prefix[0].toLowerCase() + prefix.slice(1)).port.describe(
        request.signal
      ),
      api.systemPageConfigInfo(
        { query: { resource: selected.value } },
        { signal: request.signal }
      )
    ]);
    if (request.signal.aborted || turn !== serial) return;
    const data = record(response.data);
    if (!Number.isSafeInteger(data.version)) throw Error("invalid version");
    schema.value = description;
    version.value = data.version as number;
    fill(data.config);
    baseline = JSON.stringify(config());
  } catch (reason) {
    if (!request.signal.aborted && turn === serial) {
      schema.value = undefined;
      fail(reason);
    }
  } finally {
    requests.delete(request);
    if (turn === serial) loading.value = false;
  }
}
function move(rows: unknown[], index: number, target: number) {
  if (
    busy.value ||
    index < 0 ||
    index >= rows.length ||
    target < 0 ||
    target >= rows.length
  )
    return;
  const [row] = rows.splice(index, 1);
  rows.splice(target, 0, row);
}
async function mutation(
  action: "save" | "reset" | "restore",
  historyId?: string
) {
  if (busy.value || !schema.value) return;
  if (action !== "save") {
    try {
      await ElMessageBox.confirm(
        t("pageConfig.confirmChange"),
        t("pageConfig.title")
      );
    } catch {
      return;
    }
  }
  const request = new AbortController();
  requests.add(request);
  busy.value = true;
  error.value = "";
  const fingerprint = JSON.stringify([
    action,
    selected.value,
    version.value,
    historyId,
    config()
  ]);
  if (intent?.fingerprint !== fingerprint)
    intent = { fingerprint, key: crypto.randomUUID() };
  const context = {
    signal: request.signal,
    headers: { "Idempotency-Key": intent.key }
  };
  try {
    if (action === "save")
      await api.systemPageConfigSave(
        {
          body: {
            resource: selected.value,
            version: version.value,
            config: config()
          } as unknown as OperationBody<"systemPageConfigSave">
        },
        context
      );
    else if (action === "reset")
      await api.systemPageConfigReset(
        { body: { resource: selected.value, version: version.value } },
        context
      );
    else
      await api.systemPageConfigRestore(
        {
          body: { resource: selected.value, version: version.value, historyId }
        },
        context
      );
    if (!request.signal.aborted) {
      intent = undefined;
      notifyPageConfigChanged(selected.value);
      ElMessage.success(t("system.saved"));
      busy.value = false;
      await load();
      if (historyOpen.value) await loadHistory();
    }
  } catch (reason) {
    if (!request.signal.aborted) fail(reason);
  } finally {
    requests.delete(request);
    busy.value = false;
  }
}
async function loadHistory() {
  const turn = serial;
  const request = new AbortController();
  requests.add(request);
  try {
    const result = record(
      (
        await api.systemPageConfigHistory(
          {
            body: {
              resource: selected.value,
              page: historyPage.value,
              size: 20
            }
          },
          { signal: request.signal }
        )
      ).data
    );
    if (request.signal.aborted || turn !== serial) return;
    histories.value = Array.isArray(result.list)
      ? result.list.map(record).map(item => ({
          key: String(item.id),
          version: Number(item.configVersion),
          user: String(item.createdBy ?? "—"),
          date: String(item.createdAt ?? "")
        }))
      : [];
    historyTotal.value = Number(result.total) || 0;
  } catch (reason) {
    if (!request.signal.aborted) fail(reason);
  } finally {
    requests.delete(request);
  }
}
async function previewHistory(id: string) {
  const turn = serial;
  const request = new AbortController();
  requests.add(request);
  try {
    const result = await api.systemPageConfigHistoryInfo(
      { body: { resource: selected.value, historyId: id } },
      { signal: request.signal }
    );
    if (!request.signal.aborted && turn === serial)
      historyPreview.value = JSON.stringify(result.data, null, 2);
  } catch (reason) {
    if (!request.signal.aborted) fail(reason);
  } finally {
    requests.delete(request);
  }
}
</script>
<template>
  <section class="page-config">
    <header class="config-toolbar">
      <h2>{{ t("pageConfig.title") }}</h2>
      <el-select
        v-model="selected"
        filterable
        :aria-label="t('fieldPerm.module')"
        :placeholder="t('fieldPerm.module')"
        :disabled="busy || dirty"
        @change="load"
        ><el-option
          v-for="module in modules"
          :key="module.resource"
          :value="module.resource"
          :label="module.label"
      /></el-select>
      <el-tag v-if="schema">{{ t("pageConfig.version", { version }) }}</el-tag>
      <el-button :disabled="!selected || busy" @click="load">{{
        t("crud.reload")
      }}</el-button>
      <el-button
        v-perm="permission('systemPageConfigHistory')"
        :disabled="!schema || busy"
        @click="
          historyOpen = true;
          loadHistory();
        "
        >{{ t("pageConfig.history") }}</el-button
      >
      <el-button
        v-perm="permission('systemPageConfigReset')"
        :disabled="!schema || busy"
        @click="mutation('reset')"
        >{{ t("crud.reset") }}</el-button
      >
      <el-button
        v-perm="permission('systemPageConfigSave')"
        type="primary"
        :disabled="!dirty"
        :loading="busy"
        @click="mutation('save')"
        >{{ t("crud.save") }}</el-button
      >
    </header>
    <el-alert v-if="error" :title="error" type="error" :closable="false" />
    <el-tabs v-if="schema" v-model="tab" v-loading="loading">
      <el-tab-pane name="fields" :label="t('fieldPerm.title')" lazy
        ><FieldPermissions
          v-if="tab === 'fields'"
          :key="selected"
          mode="default"
          :resource-filter="selected"
      /></el-tab-pane>
      <el-tab-pane name="list" :label="t('pageConfig.list')">
        <el-form inline label-position="top">
          <el-form-item :label="t('pageConfig.pageSize')"
            ><el-input-number
              v-model="options.pageSize"
              :min="1"
              :max="schema.maxSize"
              :disabled="busy"
          /></el-form-item>
          <el-form-item :label="t('pageConfig.keyWords')"
            ><el-select v-model="options.keyWords" multiple :disabled="busy"
              ><el-option
                v-for="field in schema.actions.page?.keyWords ?? []"
                :key="field"
                :value="field"
                :label="
                  schema.columns.find(item => item.field === field)?.label ??
                  field
                " /></el-select
          ></el-form-item>
          <el-form-item :label="t('pageConfig.filterable')"
            ><el-select v-model="options.filterable" multiple :disabled="busy"
              ><el-option
                v-for="field in schema.query"
                :key="field.field"
                :value="field.field"
                :label="field.label" /></el-select
          ></el-form-item>
          <el-form-item v-if="schema.tree" :label="t('pageConfig.tree')"
            ><el-switch v-model="options.tree" :disabled="busy"
          /></el-form-item>
        </el-form>
        <div
          v-for="(sort, index) in options.sorting"
          :key="index"
          class="config-toolbar"
        >
          <el-select
            v-model="sort.field"
            :aria-label="t('pageConfig.sort')"
            :disabled="busy"
            ><el-option
              v-for="field in schema.actions.page?.sortable ?? []"
              :key="field"
              :value="field"
              :label="field" /></el-select
          ><el-select
            v-model="sort.order"
            :aria-label="t('pageConfig.order')"
            :disabled="busy"
            ><el-option value="asc" :label="t('pageConfig.asc')" /><el-option
              value="desc"
              :label="t('pageConfig.desc')" /></el-select
          ><el-button
            :disabled="busy"
            @click="options.sorting.splice(index, 1)"
            >{{ t("crud.remove") }}</el-button
          >
        </div>
        <el-button
          :disabled="busy || options.sorting.length >= 5"
          @click="
            options.sorting.push({
              field: schema.actions.page?.sortable[0] ?? 'id',
              order: 'asc'
            })
          "
          >{{ t("pageConfig.addSort") }}</el-button
        >
        <el-table :data="columns" row-key="field" border>
          <el-table-column :label="t('pageConfig.reorder')" width="150"
            ><template #default="{ $index }"
              ><el-button
                :disabled="busy || !$index"
                @click="move(columns, $index, $index - 1)"
                >↑</el-button
              ><el-button
                :disabled="busy || $index === columns.length - 1"
                @click="move(columns, $index, $index + 1)"
                >↓</el-button
              ></template
            ></el-table-column
          >
          <el-table-column :label="t('fieldPerm.field')" min-width="140"
            ><template #default="{ row, $index }"
              ><span
                :draggable="!busy"
                @dragstart="dragIndex = $index"
                @dragover.prevent
                @drop.prevent="move(columns, dragIndex, $index)"
                >{{ row.label }}</span
              ></template
            ></el-table-column
          >
          <el-table-column :label="t('crud.width')" min-width="180"
            ><template #default="{ row }"
              ><el-input-number
                v-model="row.width"
                :min="40"
                :max="800"
                :value-on-clear="null"
                :placeholder="t('crud.widthAuto')"
                controls-position="right"
                :disabled="busy" /></template
          ></el-table-column>
          <el-table-column :label="t('pageConfig.hidden')" width="95"
            ><template #default="{ row }"
              ><el-switch v-model="row.hidden" :disabled="busy" /></template
          ></el-table-column>
          <el-table-column :label="t('crud.fixed')" min-width="160"
            ><template #default="{ row }"
              ><el-select v-model="row.fixed" :disabled="busy"
                ><el-option value="" :label="t('crud.unfixed')" /><el-option
                  value="left"
                  :label="t('crud.left')" /><el-option
                  value="right"
                  :label="t('crud.right')" /></el-select></template
          ></el-table-column>
        </el-table>
        <h3>{{ t("pageConfig.preview") }}</h3>
        <el-table :data="[]" border
          ><el-table-column
            v-for="column in previewColumns"
            :key="column.field"
            :label="column.label"
            :width="column.width"
        /></el-table>
      </el-tab-pane>
      <el-tab-pane name="form" :label="t('pageConfig.form')">
        <el-radio-group v-model="options.mode" :disabled="busy"
          ><el-radio value="dialog">{{ t("pageConfig.dialog") }}</el-radio
          ><el-radio value="drawer">{{
            t("pageConfig.drawer")
          }}</el-radio></el-radio-group
        >
        <el-table :data="items" row-key="field" border>
          <el-table-column :label="t('pageConfig.reorder')" width="150"
            ><template #default="{ $index }"
              ><el-button
                :disabled="busy || !$index"
                @click="move(items, $index, $index - 1)"
                >↑</el-button
              ><el-button
                :disabled="busy || $index === items.length - 1"
                @click="move(items, $index, $index + 1)"
                >↓</el-button
              ></template
            ></el-table-column
          >
          <el-table-column :label="t('fieldPerm.field')" min-width="130"
            ><template #default="{ row, $index }"
              ><span
                :draggable="!busy"
                @dragstart="dragIndex = $index"
                @dragover.prevent
                @drop.prevent="move(items, dragIndex, $index)"
                >{{ row.label }}</span
              ></template
            ></el-table-column
          >
          <el-table-column :label="t('pageConfig.group')"
            ><template #default="{ row }"
              ><el-input
                v-model="row.group"
                :disabled="busy"
                maxlength="100" /></template
          ></el-table-column>
          <el-table-column :label="t('pageConfig.span')"
            ><template #default="{ row }"
              ><el-select v-model="row.span" :disabled="busy"
                ><el-option
                  :value="12"
                  :label="t('pageConfig.half')" /><el-option
                  :value="24"
                  :label="t('pageConfig.full')" /></el-select></template
          ></el-table-column>
          <el-table-column :label="t('pageConfig.placeholder')"
            ><template #default="{ row }"
              ><el-input
                v-model="row.placeholder"
                :disabled="busy"
                maxlength="200" /></template
          ></el-table-column>
        </el-table>
        <h3>{{ t("pageConfig.preview") }}</h3>
        <el-row :gutter="16"
          ><el-col
            v-for="item in items"
            :key="item.field"
            :span="item.span"
            :xs="24"
            ><el-form label-position="top"
              ><el-form-item
                :label="
                  item.group ? `${item.group} / ${item.label}` : item.label
                "
                ><el-input
                  :placeholder="item.placeholder"
                  disabled /></el-form-item></el-form></el-col
        ></el-row>
      </el-tab-pane>
    </el-tabs>
    <el-drawer
      v-model="historyOpen"
      :title="t('pageConfig.history')"
      size="min(800px, 100vw)"
      ><el-table :data="histories"
        ><el-table-column
          prop="version"
          :label="t('pageConfig.versionLabel')"
        /><el-table-column
          prop="user"
          :label="t('pageConfig.changedBy')"
        /><el-table-column
          prop="date"
          :label="t('pageConfig.date')"
        /><el-table-column :label="t('crud.actions')"
          ><template #default="{ row }"
            ><el-button link @click="previewHistory(row.key)">{{
              t("pageConfig.preview")
            }}</el-button
            ><el-button
              v-perm="permission('systemPageConfigRestore')"
              link
              :disabled="busy"
              @click="mutation('restore', row.key)"
              >{{ t("crud.restore") }}</el-button
            ></template
          ></el-table-column
        ></el-table
      ><el-pagination
        v-model:current-page="historyPage"
        :page-size="20"
        :total="historyTotal"
        @current-change="loadHistory"
      />
      <pre>{{ historyPreview }}</pre>
    </el-drawer>
  </section>
</template>
<style scoped>
.page-config {
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
  padding: 16px 20px;
  background: var(--el-bg-color);
  border-radius: 4px;
}

.config-toolbar h2 {
  margin: 0 8px 0 0;
  font-size: 16px;
  font-weight: 700;
  color: var(--el-text-color-primary);
}

.config-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}

.config-toolbar :deep(.el-select),
.page-config :deep(.el-form--inline .el-select) {
  width: 220px;
}

pre {
  overflow: auto;
  white-space: pre-wrap;
}
</style>
