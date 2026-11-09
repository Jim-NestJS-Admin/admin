<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref } from "vue";
import { useI18n } from "vue-i18n";
import { ElMessage, ElMessageBox } from "element-plus";
import { api, type OperationBody } from "@/api/client";
import { permission } from "@/platform/system/resources";
import { onSessionReset } from "@/platform/lifecycle";
import { RequestFailure } from "@/utils/http";
import CodegenFields from "./CodegenFields.vue";
import {
  newColumn,
  object,
  text,
  readColumns,
  writeColumns,
  type ColumnDraft
} from "./codegen-draft";
const { t } = useI18n();
const choices = ref<{ key: string; label: string }[]>([]),
  tables = ref<{ key: string; label: string }[]>([]);
const selected = ref(""),
  table = ref(""),
  version = ref<number>(),
  busy = ref(false),
  error = ref(""),
  tab = ref("fields");
const model = reactive({
  moduleName: "",
  businessName: "",
  title: "",
  permissionPrefix: "",
  tableName: "",
  shape: "single",
  deleteMode: "soft",
  formMode: "drawer",
  exportEnabled: true,
  scopeEnabled: true,
  parent: "",
  nodeName: "",
  sort: ""
});
const fields = ref<ColumnDraft[]>([]),
  children = ref<
    {
      key: string;
      table: string;
      foreignKey: string;
      label: string;
      columns: ColumnDraft[];
    }[]
  >([]);
const files = ref<
    {
      key: string;
      project: string;
      path: string;
      action: string;
      content: string;
    }[]
  >([]),
  fileKey = ref(""),
  overwrite = ref<string[]>([]),
  token = ref(""),
  resultText = ref(""),
  diffText = ref("");
const manualSteps = ref<string[]>([]),
  writeCompleted = ref(false);
function showManualSteps(value: unknown) {
  manualSteps.value = Array.isArray(value)
    ? value.filter(
        (step): step is string => typeof step === "string" && !!step.trim()
      )
    : [];
}
let original: Record<string, unknown> = {},
  baseline = "";
const requests = new Set<AbortController>();
const draftValue = () => ({
  model,
  fields: fields.value,
  children: children.value
});
const dirty = computed(() => JSON.stringify(draftValue()) !== baseline);
const currentFile = computed(() =>
  files.value.find(file => file.key === fileKey.value)
);
function fail(reason: unknown) {
  error.value =
    reason instanceof RequestFailure
      ? reason.failure.message
      : reason instanceof Error && reason.message.startsWith("codegen.")
        ? t(reason.message)
        : t("crud.requestFailed");
}
function fill(raw: unknown) {
  original = object(raw);
  const options = object(original.options),
    tree = object(original.tree);
  Object.assign(model, {
    moduleName: text(original.module),
    businessName: text(original.business),
    title: text(original.label),
    permissionPrefix: text(original.permPrefix),
    tableName: text(original.table),
    shape: text(original.template, "single"),
    deleteMode: text(options.deleteMode, "soft"),
    formMode: text(options.formMode, "drawer"),
    exportEnabled: options.export !== false,
    scopeEnabled: options.dataScope !== false,
    parent: text(tree.parentField),
    nodeName: text(tree.nameField),
    sort: text(tree.sortField)
  });
  fields.value = readColumns(original.fields);
  children.value = Array.isArray(original.children)
    ? original.children.map(object).map(child => ({
        key: crypto.randomUUID(),
        table: text(child.table),
        foreignKey: text(child.foreignKey),
        label: text(child.label),
        columns: readColumns(child.fields)
      }))
    : [];
  files.value = [];
  token.value = "";
  overwrite.value = [];
  resultText.value = "";
  manualSteps.value = [];
  writeCompleted.value = false;
  diffText.value = "";
  baseline = JSON.stringify(draftValue());
}
function serialize() {
  return {
    ...original,
    module: model.moduleName,
    business: model.businessName,
    label: model.title,
    permPrefix: model.permissionPrefix,
    table: model.tableName,
    template: model.shape,
    options: {
      ...object(original.options),
      deleteMode: model.deleteMode,
      formMode: model.formMode,
      export: model.exportEnabled,
      dataScope: model.scopeEnabled
    },
    tree:
      model.shape === "tree"
        ? {
            parentField: model.parent,
            nameField: model.nodeName,
            ...(model.sort ? { sortField: model.sort } : {})
          }
        : null,
    fields: writeColumns(fields.value),
    children:
      model.shape === "master-detail"
        ? children.value.map(child => ({
            table: child.table,
            foreignKey: child.foreignKey,
            label: child.label,
            fields: writeColumns(child.columns)
          }))
        : []
  };
}
function addChild() {
  children.value.push({
    key: crypto.randomUUID(),
    table: "",
    foreignKey: "",
    label: "",
    columns: [newColumn()]
  });
}
function clear() {
  manualSteps.value = [];
  writeCompleted.value = false;
  intents.clear();
  requests.forEach(request => request.abort());
  requests.clear();
  choices.value = [];
  tables.value = [];
  selected.value = "";
  version.value = undefined;
  fields.value = [];
  children.value = [];
  files.value = [];
  token.value = "";
  resultText.value = "";
  diffText.value = "";
}
const stop = onSessionReset(clear);
onBeforeUnmount(() => {
  stop();
  clear();
});
async function run(work: (request: AbortController) => Promise<void>) {
  if (busy.value) return;
  const request = new AbortController();
  requests.add(request);
  busy.value = true;
  error.value = "";
  try {
    await work(request);
    intents.clear();
  } catch (reason) {
    if (!request.signal.aborted) fail(reason);
  } finally {
    requests.delete(request);
    busy.value = false;
  }
}
const intents = new Map<string, { fingerprint: string; key: string }>();
const headers = (action: string) => {
  const fingerprint = JSON.stringify([
    selected.value,
    version.value,
    draftValue(),
    token.value,
    table.value,
    overwrite.value
  ]);
  if (intents.get(action)?.fingerprint !== fingerprint)
    intents.set(action, { fingerprint, key: crypto.randomUUID() });
  return { "Idempotency-Key": intents.get(action).key };
};
async function list() {
  const request = new AbortController();
  requests.add(request);
  try {
    const response = await api.devCodegenList({}, { signal: request.signal });
    if (!request.signal.aborted)
      choices.value = Array.isArray(response.data)
        ? response.data
            .map(object)
            .map(item => ({
              key: text(item.id),
              label: text(item.label, text(item.name))
            }))
            .filter(item => item.key)
        : [];
  } catch (reason) {
    if (!request.signal.aborted) fail(reason);
  } finally {
    requests.delete(request);
  }
}
onMounted(() => {
  fill({ fields: [] });
  void list();
});
async function load() {
  await run(async request => {
    const response = object(
      (
        await api.devCodegenInfo(
          { body: { id: selected.value } },
          { signal: request.signal }
        )
      ).data
    );
    if (!request.signal.aborted) {
      version.value = Number(response.version);
      fill(response.config);
    }
  });
}
function newConfig() {
  if (busy.value) return;
  selected.value = "";
  version.value = undefined;
  fill({ fields: [] });
}
async function loadTables() {
  await run(async request => {
    const response = await api.devCodegenTables(
      {},
      { signal: request.signal, headers: headers("tables") }
    );
    if (!request.signal.aborted)
      tables.value = Array.isArray(response.data)
        ? response.data.map(object).map(item => ({
            key: text(item.table),
            label: `${text(item.table)} · ${text(item.comment)}`
          }))
        : [];
  });
}
async function importTable() {
  if (!table.value) return;
  await run(async request => {
    const response = await api.devCodegenImport(
      { body: { table: table.value } },
      { signal: request.signal, headers: headers("import") }
    );
    if (!request.signal.aborted) {
      selected.value = "";
      version.value = undefined;
      fill(response.data);
      baseline = "";
    }
  });
}
async function save() {
  await run(async request => {
    const response = object(
      (
        await api.devCodegenSave(
          {
            body: {
              ...(selected.value
                ? { id: selected.value, version: version.value }
                : {}),
              config: serialize()
            } as unknown as OperationBody<"devCodegenSave">
          },
          { signal: request.signal, headers: headers("save") }
        )
      ).data
    );
    if (request.signal.aborted || !text(response.id)) return;
    selected.value = text(response.id);
    const current = object(
      (
        await api.devCodegenInfo(
          { body: { id: selected.value } },
          { signal: request.signal }
        )
      ).data
    );
    if (!request.signal.aborted) {
      version.value = Number(current.version);
      fill(current.config);
      ElMessage.success(t("system.saved"));
      await list();
    }
  });
}
async function preview() {
  if (!selected.value || dirty.value) return;
  await run(async request => {
    const response = object(
      (
        await api.devCodegenPreview(
          { body: { id: selected.value } },
          { signal: request.signal, headers: headers("preview") }
        )
      ).data
    );
    if (request.signal.aborted) return;
    files.value = Array.isArray(response.files)
      ? response.files.map(object).map(file => ({
          key: `${text(file.project)}:${text(file.path)}`,
          project: text(file.project),
          path: text(file.path),
          action: text(file.action),
          content: text(file.content)
        }))
      : [];
    token.value = text(response.token);
    showManualSteps(response.manualSteps);
    writeCompleted.value = false;
    resultText.value = "";
    fileKey.value = files.value[0]?.key ?? "";
    overwrite.value = [];
    tab.value = "preview";
  });
}
async function write() {
  if (!selected.value || dirty.value || !token.value || busy.value) return;
  try {
    await ElMessageBox.confirm(
      `${t("codegen.confirmWrite")}\n${files.value
        .filter(file => file.action !== "unchanged")
        .map(file => `${file.project}/${file.path} (${file.action})`)
        .join("\n")}`,
      t("codegen.write")
    );
  } catch {
    return;
  }
  await run(async request => {
    const response = await api.devCodegenWrite(
      {
        body: {
          id: selected.value,
          token: token.value,
          overwrite: overwrite.value
        }
      },
      { signal: request.signal, headers: headers("write") }
    );
    if (!request.signal.aborted) {
      resultText.value = JSON.stringify(response.data, null, 2);
      showManualSteps(object(response.data).manualSteps);
      writeCompleted.value = true;
      token.value = "";
    }
  });
}
async function sync() {
  if (!selected.value) return;
  await run(async request => {
    const response = await api.devCodegenSync(
      { body: { id: selected.value } },
      { signal: request.signal, headers: headers("sync") }
    );
    if (!request.signal.aborted) {
      diffText.value = JSON.stringify(response.data, null, 2);
      tab.value = "sync";
    }
  });
}
async function download() {
  if (!selected.value || dirty.value) return;
  await run(async request => {
    const response: unknown = await api.devCodegenDownload(
      { body: { id: selected.value } },
      {
        signal: request.signal,
        headers: headers("download")
      }
    );
    if (request.signal.aborted) return;
    if (!(response instanceof Blob)) throw Error("codegen.invalidDownload");
    const url = URL.createObjectURL(response),
      link = document.createElement("a");
    link.href = url;
    link.download = `${model.moduleName}-${model.businessName}.zip`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
}
async function remove() {
  if (!selected.value || busy.value) return;
  try {
    await ElMessageBox.confirm(t("codegen.confirmDelete"), t("crud.remove"));
  } catch {
    return;
  }
  await run(async request => {
    await api.devCodegenDelete(
      { body: { id: selected.value } },
      { signal: request.signal, headers: headers("delete") }
    );
    if (!request.signal.aborted) {
      selected.value = "";
      version.value = undefined;
      fill({ fields: [] });
      await list();
    }
  });
}
</script>
<template>
  <section class="codegen-page">
    <header class="codegen-toolbar">
      <h2>{{ t("codegen.title") }}</h2>
      <el-select
        v-model="selected"
        :disabled="busy || dirty"
        filterable
        :placeholder="t('codegen.choose')"
        :aria-label="t('codegen.choose')"
        @change="load"
        ><el-option
          v-for="choice in choices"
          :key="choice.key"
          :value="choice.key"
          :label="choice.label" /></el-select
      ><el-button :disabled="busy" @click="newConfig">{{
        t("crud.add")
      }}</el-button
      ><el-button :disabled="busy" @click="list">{{
        t("crud.reload")
      }}</el-button
      ><el-button
        v-perm="permission('devCodegenSave')"
        :disabled="!dirty"
        :loading="busy"
        type="primary"
        @click="save"
        >{{ t("crud.save") }}</el-button
      ><el-button
        v-perm="permission('devCodegenDelete')"
        :disabled="!selected || busy"
        @click="remove"
        >{{ t("crud.remove") }}</el-button
      >
    </header>
    <el-alert
      :title="t('codegen.developmentOnly')"
      type="info"
      :closable="false"
    /><el-alert v-if="error" :title="error" type="error" :closable="false" />
    <el-alert
      v-if="manualSteps.length && !dirty"
      type="warning"
      show-icon
      :closable="false"
      :title="
        t(
          writeCompleted
            ? 'codegen.manualStepsAfterWrite'
            : 'codegen.manualStepsPreview'
        )
      "
    >
      <ol class="list-decimal pl-5">
        <li v-for="(step, index) in manualSteps" :key="index">{{ step }}</li>
      </ol>
    </el-alert>
    <el-tabs v-model="tab">
      <el-tab-pane name="fields" :label="t('codegen.configuration')">
        <div class="codegen-toolbar">
          <el-button
            v-perm="permission('devCodegenTables')"
            :disabled="busy"
            @click="loadTables"
            >{{ t("codegen.readTables") }}</el-button
          ><el-select
            v-model="table"
            filterable
            :disabled="busy"
            :aria-label="t('codegen.importTable')"
            ><el-option
              v-for="item in tables"
              :key="item.key"
              :value="item.key"
              :label="item.label" /></el-select
          ><el-button
            v-perm="permission('devCodegenImport')"
            :disabled="!table || busy"
            @click="importTable"
            >{{ t("codegen.importTable") }}</el-button
          >
        </div>
        <el-form label-position="top" class="codegen-basics"
          ><el-form-item
            v-for="key in [
              'moduleName',
              'businessName',
              'title',
              'permissionPrefix',
              'tableName'
            ]"
            :key="key"
            :label="
              t(key === 'title' ? 'codegen.titleLabel' : `codegen.${key}`)
            "
            ><el-input
              v-model="model[key]"
              :disabled="busy"
              maxlength="160" /></el-form-item
        ></el-form>
        <el-radio-group
          v-model="model.shape"
          :disabled="busy"
          class="template-cards"
          ><el-radio-button value="single"
            ><strong>{{ t("codegen.single") }}</strong
            ><small>▤</small></el-radio-button
          ><el-radio-button value="tree"
            ><strong>{{ t("codegen.tree") }}</strong
            ><small>├─ └─</small></el-radio-button
          ><el-radio-button value="master-detail"
            ><strong>{{ t("codegen.masterDetail") }}</strong
            ><small>▤ → ▦</small></el-radio-button
          ></el-radio-group
        >
        <div class="codegen-toolbar">
          <el-radio-group v-model="model.deleteMode" :disabled="busy"
            ><el-radio value="soft">{{ t("codegen.soft") }}</el-radio
            ><el-radio value="hard">{{
              t("codegen.hard")
            }}</el-radio></el-radio-group
          ><el-radio-group v-model="model.formMode" :disabled="busy"
            ><el-radio value="dialog">{{ t("codegen.dialog") }}</el-radio
            ><el-radio value="drawer">{{
              t("codegen.drawer")
            }}</el-radio></el-radio-group
          ><el-checkbox v-model="model.exportEnabled" :disabled="busy">{{
            t("query.export")
          }}</el-checkbox
          ><el-checkbox v-model="model.scopeEnabled" :disabled="busy">{{
            t("codegen.scope")
          }}</el-checkbox>
        </div>
        <div v-if="model.shape === 'tree'" class="codegen-toolbar">
          <el-input
            v-model="model.parent"
            :placeholder="t('codegen.parent')"
            :disabled="busy"
          /><el-input
            v-model="model.nodeName"
            :placeholder="t('codegen.nodeName')"
            :disabled="busy"
          /><el-input
            v-model="model.sort"
            :placeholder="t('codegen.sort')"
            :disabled="busy"
          />
        </div>
        <el-alert
          :title="t('codegen.fieldHelp')"
          :closable="false"
          type="info"
        /><CodegenFields v-model="fields" :disabled="busy" />
        <template v-if="model.shape === 'master-detail'"
          ><el-button
            :disabled="busy || children.length >= 10"
            @click="addChild()"
            >{{ t("codegen.addChild") }}</el-button
          ><el-card v-for="(child, index) in children" :key="child.key"
            ><div class="codegen-toolbar">
              <el-input
                v-model="child.table"
                :placeholder="t('codegen.childTable')"
                :disabled="busy"
              /><el-input
                v-model="child.foreignKey"
                :placeholder="t('codegen.foreignKey')"
                :disabled="busy"
              /><el-input
                v-model="child.label"
                :placeholder="t('codegen.label')"
                :disabled="busy"
              /><el-button
                :disabled="busy"
                @click="children.splice(index, 1)"
                >{{ t("crud.remove") }}</el-button
              >
            </div>
            <CodegenFields v-model="child.columns" :disabled="busy" /></el-card
        ></template>
        <h3>{{ t("codegen.pagePreview") }}</h3>
        <el-table :data="[]" border
          ><el-table-column
            v-for="field in fields.filter(item => item.listed)"
            :key="field.key"
            :label="field.label || field.property"
            min-width="140"
        /></el-table>
      </el-tab-pane>
      <el-tab-pane name="preview" :label="t('codegen.preview')"
        ><el-alert
          :title="t('codegen.previewRequired')"
          type="info"
          :closable="false"
        />
        <div class="codegen-toolbar">
          <el-select v-model="fileKey" :aria-label="t('codegen.file')"
            ><el-option
              v-for="file in files"
              :key="file.key"
              :value="file.key"
              :label="`${file.project}/${file.path} · ${file.action}`" /></el-select
          ><el-checkbox-group v-model="overwrite"
            ><el-checkbox
              v-for="file in files.filter(
                file => file.action === 'skip-modified'
              )"
              :key="file.key"
              :value="file.path"
              :disabled="busy"
              >{{ t("codegen.overwrite") }} {{ file.project }}/{{
                file.path
              }}</el-checkbox
            ></el-checkbox-group
          >
        </div>
        <pre>{{ currentFile?.content }}</pre>
        <pre v-if="resultText">{{ resultText }}</pre>
      </el-tab-pane>
      <el-tab-pane name="sync" :label="t('codegen.sync')"
        ><el-alert
          :title="t('codegen.syncNotice')"
          type="info"
          :closable="false"
        />
        <pre>{{ diffText }}</pre>
      </el-tab-pane>
    </el-tabs>
    <footer class="codegen-toolbar">
      <el-button
        v-perm="permission('devCodegenSync')"
        :disabled="!selected || busy || dirty"
        @click="sync"
        >{{ t("codegen.sync") }}</el-button
      ><el-button
        v-perm="permission('devCodegenPreview')"
        :disabled="!selected || busy || dirty"
        @click="preview"
        >{{ t("codegen.preview") }}</el-button
      ><el-button
        v-perm="permission('devCodegenDownload')"
        :disabled="!selected || busy || dirty"
        @click="download"
        >{{ t("codegen.download") }}</el-button
      ><el-button
        v-perm="permission('devCodegenWrite')"
        type="primary"
        :disabled="!selected || !token || busy || dirty"
        @click="write"
        >{{ t("codegen.write") }}</el-button
      >
    </footer>
  </section>
</template>
<style scoped>
.codegen-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
}

.codegen-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  margin-bottom: 12px;
}

.codegen-toolbar :deep(.el-select),
.codegen-toolbar :deep(.el-input) {
  width: 220px;
}

.codegen-basics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
}

.template-cards {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.template-cards small {
  display: block;
  margin-top: 8px;
  font-family: monospace;
}

pre {
  max-height: 560px;
  padding: 16px;
  overflow: auto;
  white-space: pre-wrap;
  background: var(--el-fill-color-light);
}
</style>
