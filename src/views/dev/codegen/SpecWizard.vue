<script setup lang="ts">
/**
 * 代码生成 · 六步字段创建器：① 选来源 ② 表信息 ③ 字段 ④ 关系 ⑤ 选项 ⑥ 预览生成。
 * 页面只编辑「模块规格」（数据结构）；校验、预览、写入都交给后端同一套接口，和本地 AI 工具共用。
 * 底部固定上一步 / 下一步 / 保存草稿；有未保存的修改时离开会提示。
 */
import {
  computed,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
  watch
} from "vue";
import { useI18n } from "vue-i18n";
import { onBeforeRouteLeave } from "vue-router";
import { useEventListener } from "@vueuse/core";
import { ElMessage, ElMessageBox } from "element-plus";
import { api } from "@/api/client";
import { permission, resources } from "@/platform/system/resources";
import { onSessionReset } from "@/platform/lifecycle";
import { useUserStoreHook } from "@/store/modules/user";
import { useFillHeight } from "@/components/Crud/useFillHeight";
import { useHeadStyle } from "@/components/Crud/useHeadStyle";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import BackIcon from "~icons/ri/arrow-left-line";
import EyeIcon from "~icons/ri/eye-line";
import SaveIcon from "~icons/ri/save-3-line";
import AddIcon from "~icons/ri/add-line";
import DeleteIcon from "~icons/ri/delete-bin-line";
import TableIcon from "~icons/ri/table-line";
import TreeIcon from "~icons/ri/node-tree";
import MasterIcon from "~icons/ri/layout-row-line";
import NewIcon from "~icons/ri/file-add-line";
import ImportIcon from "~icons/ri/database-2-line";
import RefreshIcon from "~icons/ri/refresh-line";
import ErrorIcon from "~icons/ri/error-warning-line";
import OkIcon from "~icons/ri/checkbox-circle-line";
import FieldEditor from "./FieldEditor.vue";
import PagePreview from "./PagePreview.vue";
import CodePreview from "./CodePreview.vue";
import { requestMessage, specErrorsOf } from "./request";
import {
  STEPS,
  applyTableName,
  defaultForeignKey,
  emptyDraft,
  fieldErrors,
  newChild,
  newField,
  placeOf,
  readSpec,
  snake,
  stepOf,
  syncPermission,
  writeSpec,
  type FieldTypeInfo,
  type SpecDraft,
  type SpecError,
  type Template
} from "./spec";
import type { components } from "@/api/schema";

type SpecRecord = components["schemas"]["SpecRecord"];
type SpecTable = components["schemas"]["SpecTable"];
type Preview = components["schemas"]["SpecPreviewResult"];
type WriteResult = components["schemas"]["SpecWriteResult"];

const props = defineProps<{ record: SpecRecord | null }>();
const emit = defineEmits<{ back: [] }>();
const { t } = useI18n();
const user = useUserStoreHook();
const pageEl = ref<HTMLElement>();
const fillHeight = useFillHeight(pageEl);
const headStyle = useHeadStyle();

/* ---------- 草稿与记录 ---------- */
const draft = reactive<SpecDraft>(
  props.record?.spec ? readSpec(props.record.spec) : emptyDraft()
);
const recordId = ref(props.record?.id ?? ""),
  version = ref<number | undefined>(props.record?.version),
  status = ref<SpecRecord["status"] | "">(props.record?.status ?? "");
const spec = computed(() => writeSpec(draft));
const specText = computed(() => JSON.stringify(spec.value));
/** 打开时的规格；新建时是空白规格，所以没动过不算未保存（导入或填写后才算） */
const baseline = ref(specText.value);
const dirty = computed(() => specText.value !== baseline.value);

/** 已保存且能读出规格的记录直接从表信息开始；读不出的（invalid）当新建重填，保存时覆盖原记录 */
const hasSpec = !!props.record?.spec;
const step = ref(hasSpec ? 1 : 0),
  reached = ref(hasSpec ? STEPS.length - 1 : 0);
const busy = ref(""),
  error = ref("");

/* ---------- 请求 ---------- */
const requests = new Set<AbortController>();
async function track<T>(work: (signal: AbortSignal) => Promise<T>) {
  const request = new AbortController();
  requests.add(request);
  try {
    return await work(request.signal);
  } finally {
    requests.delete(request);
  }
}
function abortAll() {
  requests.forEach(request => request.abort());
  requests.clear();
}
const stop = onSessionReset(() => {
  abortAll();
  baseline.value = specText.value;
  emit("back");
});
onBeforeUnmount(() => {
  stop();
  abortAll();
  if (validateTimer) clearTimeout(validateTimer);
});

/* ---------- 字段类型目录、字典 ---------- */
const catalog = ref<FieldTypeInfo[]>([]);
const dictionaries = ref<{ code: string; name: string; builtin: boolean }[]>(
  []
);
async function loadCatalog() {
  try {
    const response = await track(signal =>
      api.devCodegenFieldTypes({}, { signal })
    );
    catalog.value = Array.isArray(response.data) ? response.data : [];
  } catch (reason) {
    error.value = requestMessage(reason, t);
  }
}
/** 字典下拉：业务字典 + （超级管理员）系统字典；读不到也不影响填写，可以手输编码 */
async function loadDictionaries() {
  const port = resources["dict-type"].port;
  // 系统字典列表只给平台超级管理员（阶段 2）；其他人只列业务字典
  const kinds =
    user.superAdmin && user.tenant?.platform === true ? [false, true] : [false];
  const result: { code: string; name: string; builtin: boolean }[] = [];
  for (const builtin of kinds) {
    try {
      const page = await track(signal =>
        port.list(
          {
            pageNumber: 1,
            pageSize: 500,
            search: "",
            sorting: [],
            equality: { builtin }
          },
          signal
        )
      );
      for (const row of page.rows)
        if (typeof row.code === "string")
          result.push({
            code: row.code,
            name: String(row.name ?? row.code),
            builtin
          });
    } catch {
      /* 没有字典权限时只能手输编码 */
    }
  }
  dictionaries.value = result;
}
onMounted(() => {
  void loadCatalog();
  void loadDictionaries();
  if (!hasSpec) void loadTables();
});

/* ---------- ① 选来源 ---------- */
const source = ref<"new" | "import">("new");
const tables = ref<SpecTable[]>([]),
  tableWord = ref(""),
  picked = ref<string[]>([]);
const shownTables = computed(() => {
  const word = tableWord.value.trim().toLowerCase();
  return word
    ? tables.value.filter(
        item =>
          item.table.includes(word) || item.comment.toLowerCase().includes(word)
      )
    : tables.value;
});
async function loadTables() {
  busy.value = "tables";
  try {
    const response = await track(signal =>
      api.devCodegenTables({}, { signal })
    );
    tables.value = Array.isArray(response.data) ? response.data : [];
  } catch (reason) {
    error.value = requestMessage(reason, t);
  } finally {
    busy.value = "";
  }
}
function togglePick(table: string) {
  const at = picked.value.indexOf(table);
  if (at >= 0) picked.value.splice(at, 1);
  else if (picked.value.length < 6) picked.value.push(table);
  else ElMessage.warning(t("codegen.pickLimit"));
}
async function importTables() {
  if (!picked.value.length) return;
  busy.value = "import";
  error.value = "";
  try {
    const response = await track(signal =>
      api.devCodegenImportSpec(
        { body: { tables: [...picked.value] } },
        { signal }
      )
    );
    Object.assign(draft, readSpec(response.data.spec));
    errors.value = response.data.errors ?? [];
    step.value = 1;
    reached.value = Math.max(reached.value, 1);
  } catch (reason) {
    error.value = requestMessage(reason, t);
  } finally {
    busy.value = "";
  }
}

/* ---------- ② 表信息 ---------- */
const templates: { value: Template; icon: unknown }[] = [
  { value: "single", icon: TableIcon },
  { value: "tree", icon: TreeIcon },
  { value: "masterDetail", icon: MasterIcon }
];
function setTemplate(value: Template) {
  draft.template = value;
  if (value === "masterDetail" && !draft.children.length)
    draft.children.push({ ...newChild(draft), title: t("codegen.detail") });
}
function onTableName(value: string) {
  applyTableName(draft, value.trim());
  for (const child of draft.children)
    if (!child.foreignKey) child.foreignKey = defaultForeignKey(draft);
}
function manual(key: "moduleName" | "businessName" | "permissionPrefix") {
  draft.auto[key] = false;
  if (key !== "permissionPrefix") syncPermission(draft);
}
function resetAuto() {
  draft.auto = {
    moduleName: true,
    businessName: true,
    permissionPrefix: true
  };
  applyTableName(draft, draft.tableName);
}

/* ---------- ③ 字段 ---------- */
const fieldTab = ref<"main" | number>("main");
watch(
  () => draft.children.length,
  length => {
    if (typeof fieldTab.value === "number" && fieldTab.value >= length)
      fieldTab.value = "main";
  }
);
const focusKey = ref("");

/* ---------- ④ 关系 ---------- */
const treeCandidates = computed(() => ({
  parent: draft.fields.filter(f => f.type === "int" || f.type === "reference"),
  name: draft.fields.filter(f => f.type === "string"),
  sort: draft.fields.filter(f => f.type === "int")
}));
/** 树表缺字段时一键补：parent_id（关联编号）、name（文本）、sort（整数） */
function addTreeFields() {
  const ensure = (
    column: string,
    type: "reference" | "string" | "int",
    label: string
  ) => {
    let field = draft.fields.find(item => item.column === column);
    if (!field) {
      field = newField(type, catalog.value);
      field.column = column;
      field.property = column.replace(/_([a-z])/g, (_, c: string) =>
        c.toUpperCase()
      );
      field.label = label;
      field.comment = label;
      field.nullable = type !== "string";
      draft.fields.push(field);
    }
    return field.property;
  };
  draft.tree.parentField ||= ensure(
    "parent_id",
    "reference",
    t("codegen.treeParent")
  );
  draft.tree.nameField ||= ensure("name", "string", t("codegen.treeName"));
  draft.tree.sortField ||= ensure("sort", "int", t("codegen.treeSort"));
}
function addChildTable() {
  draft.children.push(newChild(draft));
  if (draft.children.length > 5) draft.children.pop();
}

/* ---------- 校验（后端 validate-spec，改动后 0.6 秒自动跑） ---------- */
const errors = ref<SpecError[]>([]),
  validated = ref(false),
  validating = ref(false);
let validateTimer: ReturnType<typeof setTimeout> | undefined;
let validateRequest: AbortController | undefined;
async function validate() {
  validateRequest?.abort();
  const request = new AbortController();
  validateRequest = request;
  validating.value = true;
  try {
    const response = await api.devCodegenValidateSpec(
      { body: { spec: spec.value } },
      { signal: request.signal }
    );
    if (request.signal.aborted) return;
    errors.value = response.data.errors ?? [];
    validated.value = true;
  } catch (reason) {
    if (request.signal.aborted) return;
    const list = specErrorsOf(reason);
    if (list.length) errors.value = list;
    else error.value = requestMessage(reason, t);
  } finally {
    if (validateRequest === request) validating.value = false;
  }
}
watch(specText, () => {
  validated.value = false;
  if (validateTimer) clearTimeout(validateTimer);
  validateTimer = setTimeout(validate, 600);
});
onMounted(() => {
  if (hasSpec) void validate();
});
/**
 * 错误只在用户「试过」的步骤里显示：点过下一步、保存过、或已保存的记录；
 * 刚打开的空白表单不满屏标红。
 */
const revealed = ref(new Set<number>(hasSpec ? STEPS.map((_, i) => i) : []));
function reveal(upTo: number) {
  const next = new Set(revealed.value);
  for (let i = 0; i <= upTo; i++) next.add(i);
  revealed.value = next;
}
const shownErrors = computed(() =>
  errors.value.filter(item => revealed.value.has(stepOf(item.path)))
);
const cellErrors = computed(() => fieldErrors(draft, shownErrors.value));
/** 不在字段格子上的错误（表信息、关系、选项，或整张表的字段数） */
const errorAt = (path: string) =>
  shownErrors.value.find(item => item.path === path)?.message;
const errorsOfStep = (index: number) =>
  shownErrors.value.filter(item => stepOf(item.path) === index);
const tableErrors = (table: "main" | number) =>
  shownErrors.value.filter(item => {
    const place = placeOf(item.path);
    return place?.table === table;
  }).length;
/** 前面步骤（含当前）没有错误才能继续往后 */
const blocking = computed(() =>
  errors.value.filter(item => stepOf(item.path) <= step.value)
);

/** 点错误列表里的一项：跳到对应步骤，字段错误选中那一行 */
function locate(item: SpecError) {
  const target = stepOf(item.path);
  reveal(target);
  step.value = target;
  reached.value = Math.max(reached.value, target);
  const place = placeOf(item.path);
  if (place) {
    fieldTab.value = place.table;
    const fields =
      place.table === "main"
        ? draft.fields
        : draft.children[place.table]?.fields;
    if (place.row !== undefined && fields?.[place.row])
      focusKey.value = fields[place.row].key;
  }
  errorsOpen.value = false;
}
const errorsOpen = ref(false);
const pathLabel = (path: string) => {
  const place = placeOf(path);
  if (place && place.row !== undefined) {
    const table =
      place.table === "main"
        ? t("codegen.mainTable")
        : draft.children[place.table]?.title ||
          draft.children[place.table]?.tableName ||
          t("codegen.childTable");
    const fields =
      place.table === "main"
        ? draft.fields
        : draft.children[place.table]?.fields;
    const name = fields?.[place.row]?.column || `#${place.row + 1}`;
    return `${t(`codegen.steps.${STEPS[2]}`)} · ${table} · ${name}`;
  }
  return `${t(`codegen.steps.${STEPS[stepOf(path)]}`)} · ${path}`;
};

/* ---------- 步骤切换 ---------- */
const canNext = computed(() => {
  if (step.value === 0)
    return (
      source.value === "new" ||
      hasSpec ||
      reached.value > 0 ||
      picked.value.length > 0
    );
  return !blocking.value.length;
});
async function next() {
  if (step.value === 0 && source.value === "import" && !reached.value) {
    await importTables();
    return;
  }
  if (step.value === 0 && source.value === "new" && !draft.fields.length) {
    // 新建表先放一行空字段；没填任何东西不算「未保存」
    const untouched = !dirty.value;
    draft.fields.push(newField("string", catalog.value));
    if (untouched) baseline.value = specText.value;
  }
  if (step.value >= 1) {
    reveal(step.value);
    if (validateTimer) clearTimeout(validateTimer);
    await validate();
    if (blocking.value.length) {
      ElMessage.warning(t("codegen.fixFirst"));
      locate(blocking.value[0]);
      return;
    }
  }
  step.value = Math.min(STEPS.length - 1, step.value + 1);
  reached.value = Math.max(reached.value, step.value);
}
function go(index: number) {
  if (index <= reached.value) step.value = index;
}
watch(step, value => {
  if (value === STEPS.length - 1) void runPreview();
});

/* ---------- 保存草稿 ---------- */
async function refreshRecord() {
  const response = await track(signal => api.devCodegenList({}, { signal }));
  const list = Array.isArray(response.data) ? response.data : [];
  const found =
    list.find(item => item.id === recordId.value) ??
    list.find(
      item => item.name === `${draft.moduleName}.${draft.businessName}`
    );
  if (found) {
    recordId.value = found.id;
    version.value = found.version;
    status.value = found.status;
  }
}
async function save() {
  reveal(reached.value);
  busy.value = "save";
  error.value = "";
  try {
    const text = specText.value;
    const response = await track(signal =>
      api.devCodegenSaveSpec(
        {
          body: {
            ...(recordId.value
              ? { id: recordId.value, version: version.value }
              : {}),
            spec: JSON.parse(text)
          }
        },
        {
          signal,
          headers: { "Idempotency-Key": crypto.randomUUID() }
        }
      )
    );
    recordId.value = response.data.id;
    await refreshRecord();
    baseline.value = text;
    ElMessage.success(t("codegen.draftSaved"));
    return true;
  } catch (reason) {
    const list = specErrorsOf(reason);
    if (list.length) {
      errors.value = list;
      ElMessage.warning(t("codegen.fixFirst"));
    } else error.value = requestMessage(reason, t);
    return false;
  } finally {
    busy.value = "";
  }
}

/* ---------- 离开提示 ---------- */
async function confirmLeave() {
  if (!dirty.value) return true;
  try {
    await ElMessageBox.confirm(t("codegen.leaveConfirm"), t("codegen.leave"), {
      type: "warning",
      confirmButtonText: t("codegen.leaveDiscard"),
      cancelButtonText: t("codegen.leaveStay")
    });
    return true;
  } catch {
    return false;
  }
}
async function back() {
  if (await confirmLeave()) {
    baseline.value = specText.value;
    emit("back");
  }
}
onBeforeRouteLeave(confirmLeave);
useEventListener(window, "beforeunload", (event: BeforeUnloadEvent) => {
  if (dirty.value) event.preventDefault();
});

/* ---------- 页面预览 ---------- */
const previewOpen = ref(false);
/** 打开时冻结一份规格，编辑中不反复重算 */
const previewSpec = ref(spec.value);
function openPreview() {
  previewSpec.value = JSON.parse(specText.value);
  previewOpen.value = true;
}

/* ---------- ⑥ 预览生成与写入 ---------- */
const preview = ref<Preview>(),
  previewFor = ref(""),
  previewError = ref("");
const previewStale = computed(
  () => !!preview.value && previewFor.value !== specText.value
);
async function runPreview() {
  busy.value = "preview";
  previewError.value = "";
  const text = specText.value;
  try {
    const response = await track(signal =>
      api.devCodegenPreviewSpec(
        { body: { spec: JSON.parse(text) } },
        { signal }
      )
    );
    preview.value = response.data;
    previewFor.value = text;
    overwrite.value = overwrite.value.filter(key =>
      response.data.files.some(
        file => file.key === key && file.action === "skip-modified"
      )
    );
    writeResult.value = undefined;
  } catch (reason) {
    const list = specErrorsOf(reason);
    if (list.length) {
      errors.value = list;
      reveal(STEPS.length - 1);
      previewError.value = t("codegen.fixFirst");
    } else previewError.value = requestMessage(reason, t);
  } finally {
    busy.value = "";
  }
}
/** 手改过的文件默认跳过；在代码预览或确认框里逐个勾选才覆盖 */
const overwrite = ref<string[]>([]);
const writable = computed(
  () =>
    preview.value?.files.filter(
      file =>
        file.action === "create" ||
        file.action === "overwrite" ||
        (file.action === "skip-modified" && overwrite.value.includes(file.key))
    ) ?? []
);
const modifiedFiles = computed(
  () =>
    preview.value?.files.filter(file => file.action === "skip-modified") ?? []
);
const confirmOpen = ref(false);
const writeResult = ref<WriteResult>();
async function write() {
  if (!preview.value || previewStale.value) return;
  confirmOpen.value = false;
  busy.value = "write";
  error.value = "";
  try {
    const response = await track(signal =>
      api.devCodegenWriteSpec(
        {
          body: {
            spec: JSON.parse(previewFor.value),
            fingerprint: preview.value!.fingerprint,
            ...(overwrite.value.length
              ? { overwrite: [...overwrite.value] }
              : {})
          }
        },
        { signal, headers: { "Idempotency-Key": crypto.randomUUID() } }
      )
    );
    writeResult.value = response.data;
    // 写入会同时保存规格，记录的版本和状态都变了
    baseline.value = previewFor.value;
    await refreshRecord();
    if (response.data.failed.length) ElMessage.error(t("codegen.writePartial"));
    else ElMessage.success(t("codegen.written"));
  } catch (reason) {
    error.value = requestMessage(reason, t);
  } finally {
    busy.value = "";
  }
}
const statusType = computed(() =>
  status.value === "generated"
    ? "success"
    : status.value === "modified"
      ? "warning"
      : status.value === "invalid"
        ? "danger"
        : "info"
);
</script>

<template>
  <section
    ref="pageEl"
    class="wizard"
    :style="[headStyle, { height: `${fillHeight}px` }]"
  >
    <div class="wizard-card">
      <!-- 标题栏：返回、标题、状态，右侧页面预览 -->
      <header class="wizard-head">
        <el-button
          link
          :icon="useRenderIcon(BackIcon)"
          :aria-label="t('codegen.backToList')"
          @click="back"
          >{{ t("codegen.backToList") }}</el-button
        >
        <el-divider direction="vertical" />
        <span class="wizard-title">{{
          draft.title ||
          (recordId ? t("codegen.editModule") : t("codegen.newModule"))
        }}</span>
        <span v-if="draft.moduleName" class="wizard-key"
          >{{ draft.moduleName }}.{{ draft.businessName }}</span
        >
        <el-tag v-if="status" :type="statusType" size="small" effect="light">{{
          t(`codegen.statuses.${status}`)
        }}</el-tag>
        <el-tag v-if="dirty" type="warning" size="small" effect="plain">{{
          t("codegen.unsaved")
        }}</el-tag>
        <div class="wizard-flex" />
        <el-button
          v-if="step >= 2"
          :icon="useRenderIcon(EyeIcon)"
          :disabled="!!errorsOfStep(1).length || !draft.fields.length"
          @click="openPreview"
          >{{ t("codegen.pagePreview") }}</el-button
        >
      </header>

      <el-steps
        :active="step"
        finish-status="success"
        simple
        class="wizard-steps"
      >
        <el-step
          v-for="(name, index) in STEPS"
          :key="name"
          :title="t(`codegen.steps.${name}`)"
          :status="
            index === step
              ? 'process'
              : errorsOfStep(index).length && index <= reached && validated
                ? 'error'
                : index < step || index <= reached
                  ? 'success'
                  : 'wait'
          "
          :class="{ 'is-reachable': index <= reached }"
          @click="go(index)"
        />
      </el-steps>

      <el-alert
        v-if="error"
        :title="error"
        type="error"
        show-icon
        class="wizard-alert"
        @close="error = ''"
      />

      <div class="wizard-body">
        <!-- ① 选来源 -->
        <div v-if="step === 0" class="step step-source">
          <div class="source-cards">
            <button
              type="button"
              class="choice-card"
              :class="{ 'is-active': source === 'new' }"
              :disabled="hasSpec"
              @click="source = 'new'"
            >
              <component :is="NewIcon" class="choice-icon" />
              <strong>{{ t("codegen.sourceNew") }}</strong>
              <small>{{ t("codegen.sourceNewTip") }}</small>
            </button>
            <button
              type="button"
              class="choice-card"
              :class="{ 'is-active': source === 'import' }"
              :disabled="hasSpec"
              @click="source = 'import'"
            >
              <component :is="ImportIcon" class="choice-icon" />
              <strong>{{ t("codegen.sourceImport") }}</strong>
              <small>{{ t("codegen.sourceImportTip") }}</small>
            </button>
          </div>
          <el-alert
            v-if="hasSpec"
            :title="t('codegen.sourceLocked')"
            type="info"
            :closable="false"
            show-icon
          />
          <el-alert
            v-if="record && !hasSpec"
            :title="t('codegen.invalidRecord')"
            :description="record.error"
            type="error"
            :closable="false"
            show-icon
          />
          <div v-if="source === 'import' && !hasSpec" class="import-panel">
            <div class="import-toolbar">
              <el-input
                v-model="tableWord"
                clearable
                :placeholder="t('codegen.searchTable')"
                class="import-search"
              />
              <el-button
                :icon="useRenderIcon(RefreshIcon)"
                :loading="busy === 'tables'"
                @click="loadTables"
                >{{ t("crud.reload") }}</el-button
              >
              <span class="import-tip">{{ t("codegen.importTip") }}</span>
            </div>
            <el-table
              :data="shownTables"
              height="100%"
              row-key="table"
              class="import-table"
              :empty-text="t('codegen.noTables')"
              @row-click="(row: SpecTable) => togglePick(row.table)"
            >
              <el-table-column width="56" align="center">
                <template #default="{ row }">
                  <el-checkbox
                    :model-value="picked.includes(row.table)"
                    @click.stop
                    @change="togglePick(row.table)"
                  />
                </template>
              </el-table-column>
              <el-table-column
                :label="t('codegen.tableName')"
                prop="table"
                min-width="200"
              />
              <el-table-column
                :label="t('codegen.tableComment')"
                prop="comment"
                min-width="200"
                show-overflow-tooltip
              />
              <el-table-column
                :label="t('codegen.fieldCount')"
                prop="fieldCount"
                width="100"
                align="right"
              />
              <el-table-column :label="t('codegen.importAs')" width="120">
                <template #default="{ row }">
                  <el-tag
                    v-if="picked.indexOf(row.table) === 0"
                    type="primary"
                    size="small"
                    >{{ t("codegen.mainTable") }}</el-tag
                  >
                  <el-tag
                    v-else-if="picked.includes(row.table)"
                    type="info"
                    size="small"
                    >{{ t("codegen.childTable") }}</el-tag
                  >
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>

        <!-- ② 表信息 -->
        <div v-else-if="step === 1" class="step step-table">
          <el-scrollbar>
            <div class="form-narrow">
              <h4 class="section-title">{{ t("codegen.sectionTable") }}</h4>
              <el-form label-width="110px" class="table-form">
                <el-form-item
                  :label="t('codegen.tableName')"
                  :error="errorAt('tableName')"
                  required
                >
                  <el-input
                    :model-value="draft.tableName"
                    maxlength="48"
                    placeholder="crm_customer"
                    @update:model-value="onTableName"
                  />
                  <div class="form-tip">{{ t("codegen.tableNameTip") }}</div>
                </el-form-item>
                <el-form-item
                  :label="t('codegen.titleLabel')"
                  :error="errorAt('title')"
                  required
                >
                  <el-input
                    v-model="draft.title"
                    maxlength="30"
                    show-word-limit
                    :placeholder="t('codegen.titlePlaceholder')"
                  />
                </el-form-item>
                <div class="form-pair">
                  <el-form-item
                    :label="t('codegen.moduleName')"
                    :error="errorAt('moduleName')"
                    required
                  >
                    <el-input
                      v-model="draft.moduleName"
                      maxlength="48"
                      @input="manual('moduleName')"
                    />
                  </el-form-item>
                  <el-form-item
                    :label="t('codegen.businessName')"
                    :error="errorAt('businessName')"
                    required
                  >
                    <el-input
                      v-model="draft.businessName"
                      maxlength="48"
                      @input="manual('businessName')"
                    />
                  </el-form-item>
                </div>
                <el-form-item
                  :label="t('codegen.permissionPrefix')"
                  :error="errorAt('permissionPrefix')"
                  required
                >
                  <el-input
                    v-model="draft.permissionPrefix"
                    maxlength="100"
                    @input="manual('permissionPrefix')"
                  />
                  <div class="form-tip">
                    {{ t("codegen.namesTip") }}
                    <el-button
                      v-if="
                        !draft.auto.moduleName ||
                        !draft.auto.businessName ||
                        !draft.auto.permissionPrefix
                      "
                      link
                      type="primary"
                      size="small"
                      @click="resetAuto"
                      >{{ t("codegen.resetNames") }}</el-button
                    >
                  </div>
                </el-form-item>
              </el-form>
              <h4 class="section-title">{{ t("codegen.template") }}</h4>
              <div class="template-cards">
                <button
                  v-for="item in templates"
                  :key="item.value"
                  type="button"
                  class="choice-card"
                  :class="{ 'is-active': draft.template === item.value }"
                  @click="setTemplate(item.value)"
                >
                  <component :is="item.icon" class="choice-icon" />
                  <strong>{{ t(`codegen.templates.${item.value}`) }}</strong>
                  <small>{{ t(`codegen.templateTips.${item.value}`) }}</small>
                  <!-- 示意图：几条灰线画出列表 / 树 / 主表 + 明细 -->
                  <span class="template-sketch" :class="`is-${item.value}`">
                    <i v-for="n in 4" :key="n" />
                  </span>
                </button>
              </div>
              <div v-if="errorAt('template')" class="form-error">
                {{ errorAt("template") }}
              </div>
            </div>
          </el-scrollbar>
        </div>

        <!-- ③ 字段 -->
        <div v-else-if="step === 2" class="step step-fields">
          <div
            v-if="draft.template === 'masterDetail'"
            class="table-tabs"
            role="tablist"
          >
            <button
              type="button"
              role="tab"
              class="table-tab"
              :class="{ 'is-active': fieldTab === 'main' }"
              :aria-selected="fieldTab === 'main'"
              @click="fieldTab = 'main'"
            >
              {{ t("codegen.mainTable") }}
              <span class="tab-sub">{{ draft.tableName }}</span>
              <el-badge
                v-if="tableErrors('main')"
                :value="tableErrors('main')"
                type="danger"
              />
            </button>
            <button
              v-for="(child, index) in draft.children"
              :key="child.key"
              type="button"
              role="tab"
              class="table-tab"
              :class="{ 'is-active': fieldTab === index }"
              :aria-selected="fieldTab === index"
              @click="fieldTab = index"
            >
              {{ child.title || t("codegen.childTable") }}
              <span class="tab-sub">{{ child.tableName }}</span>
              <el-badge
                v-if="tableErrors(index)"
                :value="tableErrors(index)"
                type="danger"
              />
            </button>
            <el-tooltip
              :content="t('codegen.childInRelations')"
              placement="top"
            >
              <el-button
                link
                type="primary"
                :icon="useRenderIcon(AddIcon)"
                :disabled="draft.children.length >= 5"
                @click="
                  (addChildTable(), (fieldTab = draft.children.length - 1))
                "
                >{{ t("codegen.addChild") }}</el-button
              >
            </el-tooltip>
          </div>
          <div
            v-if="
              errorAt(
                fieldTab === 'main' ? 'fields' : `children[${fieldTab}].fields`
              )
            "
            class="form-error"
          >
            {{
              errorAt(
                fieldTab === "main" ? "fields" : `children[${fieldTab}].fields`
              )
            }}
          </div>
          <div class="fields-frame">
            <FieldEditor
              v-if="fieldTab === 'main'"
              key="main"
              v-model="draft.fields"
              :catalog="catalog"
              :dictionaries="dictionaries"
              :errors="cellErrors"
              :focus-key="focusKey"
            />
            <FieldEditor
              v-else-if="draft.children[fieldTab]"
              :key="draft.children[fieldTab].key"
              v-model="draft.children[fieldTab].fields"
              :catalog="catalog"
              :dictionaries="dictionaries"
              :errors="cellErrors"
              :focus-key="focusKey"
              :foreign-key="
                draft.children[fieldTab].foreignKey
                  ? `${draft.children[fieldTab].foreignKey}（${snake(draft.children[fieldTab].foreignKey)}）`
                  : ''
              "
            />
          </div>
        </div>

        <!-- ④ 关系 -->
        <div v-else-if="step === 3" class="step step-relations">
          <el-scrollbar>
            <div class="form-narrow is-wide">
              <template v-if="draft.template === 'single'">
                <el-empty :description="t('codegen.singleNoRelation')" />
              </template>
              <template v-else-if="draft.template === 'tree'">
                <h4 class="section-title">{{ t("codegen.treeSection") }}</h4>
                <p class="section-tip">{{ t("codegen.treeTip") }}</p>
                <el-form label-width="110px" class="table-form">
                  <el-form-item
                    :label="t('codegen.treeParent')"
                    :error="errorAt('tree.parentField') || errorAt('tree')"
                    required
                  >
                    <el-select v-model="draft.tree.parentField" clearable>
                      <el-option
                        v-for="field in treeCandidates.parent"
                        :key="field.key"
                        :value="field.property"
                        :label="`${field.label || field.column}（${field.column}）`"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item
                    :label="t('codegen.treeName')"
                    :error="errorAt('tree.nameField')"
                    required
                  >
                    <el-select v-model="draft.tree.nameField" clearable>
                      <el-option
                        v-for="field in treeCandidates.name"
                        :key="field.key"
                        :value="field.property"
                        :label="`${field.label || field.column}（${field.column}）`"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item
                    :label="t('codegen.treeSort')"
                    :error="errorAt('tree.sortField')"
                  >
                    <el-select v-model="draft.tree.sortField" clearable>
                      <el-option
                        v-for="field in treeCandidates.sort"
                        :key="field.key"
                        :value="field.property"
                        :label="`${field.label || field.column}（${field.column}）`"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item>
                    <el-button
                      :icon="useRenderIcon(AddIcon)"
                      @click="addTreeFields"
                      >{{ t("codegen.addTreeFields") }}</el-button
                    >
                  </el-form-item>
                </el-form>
              </template>
              <template v-else>
                <h4 class="section-title">{{ t("codegen.childSection") }}</h4>
                <p class="section-tip">{{ t("codegen.childTip") }}</p>
                <div v-if="errorAt('children')" class="form-error">
                  {{ errorAt("children") }}
                </div>
                <div class="child-list">
                  <div
                    v-for="(child, index) in draft.children"
                    :key="child.key"
                    class="child-row"
                  >
                    <span class="child-index">{{ index + 1 }}</span>
                    <el-form label-position="top" class="child-form">
                      <el-form-item
                        :label="t('codegen.childTable')"
                        :error="errorAt(`children[${index}].tableName`)"
                      >
                        <el-input v-model="child.tableName" maxlength="48" />
                      </el-form-item>
                      <el-form-item
                        :label="t('codegen.titleLabel')"
                        :error="errorAt(`children[${index}].title`)"
                      >
                        <el-input v-model="child.title" maxlength="30" />
                      </el-form-item>
                      <el-form-item
                        :label="t('codegen.foreignKey')"
                        :error="errorAt(`children[${index}].foreignKey`)"
                      >
                        <el-input v-model="child.foreignKey" maxlength="48">
                          <template #append>{{
                            child.foreignKey ? snake(child.foreignKey) : "—"
                          }}</template>
                        </el-input>
                      </el-form-item>
                      <el-form-item :label="t('codegen.fieldCount')">
                        <el-button
                          link
                          type="primary"
                          @click="((fieldTab = index), (step = 2))"
                          >{{
                            t("codegen.childFields", {
                              count: child.fields.length
                            })
                          }}</el-button
                        >
                      </el-form-item>
                    </el-form>
                    <el-button
                      link
                      type="danger"
                      :icon="useRenderIcon(DeleteIcon)"
                      :aria-label="t('crud.remove')"
                      @click="draft.children.splice(index, 1)"
                    />
                  </div>
                </div>
                <el-button
                  :icon="useRenderIcon(AddIcon)"
                  :disabled="draft.children.length >= 5"
                  @click="addChildTable"
                  >{{ t("codegen.addChild") }}</el-button
                >
              </template>
            </div>
          </el-scrollbar>
        </div>

        <!-- ⑤ 选项 -->
        <div v-else-if="step === 4" class="step step-options">
          <el-scrollbar>
            <div class="form-narrow">
              <h4 class="section-title">{{ t("codegen.deleteMode") }}</h4>
              <div class="option-cards">
                <button
                  v-for="mode in ['soft', 'hard'] as const"
                  :key="mode"
                  type="button"
                  class="choice-card is-row"
                  :class="{ 'is-active': draft.options.deleteMode === mode }"
                  @click="draft.options.deleteMode = mode"
                >
                  <el-radio
                    :model-value="draft.options.deleteMode"
                    :value="mode"
                    tabindex="-1"
                  />
                  <span>
                    <strong>{{ t(`codegen.${mode}`) }}</strong>
                    <small>{{ t(`codegen.${mode}Tip`) }}</small>
                  </span>
                </button>
              </div>
              <h4 class="section-title">{{ t("codegen.otherOptions") }}</h4>
              <div class="switch-row">
                <span>
                  <strong>{{ t("codegen.scope") }}</strong>
                  <small>{{ t("codegen.scopeTip") }}</small>
                </span>
                <el-switch v-model="draft.options.scopeEnabled" />
              </div>
              <div class="switch-row">
                <span>
                  <strong>{{ t("codegen.exportEnabled") }}</strong>
                  <small>{{ t("codegen.exportTip") }}</small>
                </span>
                <el-switch v-model="draft.options.exportEnabled" />
              </div>
              <el-alert
                :title="t('codegen.displayLater')"
                type="info"
                :closable="false"
                show-icon
                class="option-note"
              />
            </div>
          </el-scrollbar>
        </div>

        <!-- ⑥ 预览生成 -->
        <div v-else class="step step-generate">
          <el-alert
            v-if="previewError"
            :title="previewError"
            type="error"
            :closable="false"
            show-icon
            class="wizard-alert"
          />
          <el-alert
            v-if="previewStale"
            :title="t('codegen.previewStale')"
            type="warning"
            :closable="false"
            show-icon
            class="wizard-alert"
          />
          <template v-if="writeResult">
            <el-result
              :icon="writeResult.failed.length ? 'warning' : 'success'"
              :title="
                t(
                  writeResult.failed.length
                    ? 'codegen.writePartial'
                    : 'codegen.written'
                )
              "
              class="write-result"
            >
              <template #sub-title>
                {{
                  t("codegen.writeSummary", {
                    written: writeResult.written.length,
                    skipped: writeResult.skipped.length,
                    failed: writeResult.failed.length
                  })
                }}
              </template>
            </el-result>
            <el-scrollbar class="write-detail">
              <div v-if="writeResult.failed.length" class="write-block">
                <h4>{{ t("codegen.writeFailed") }}</h4>
                <p
                  v-for="item in writeResult.failed"
                  :key="item.path"
                  class="write-line is-danger"
                >
                  {{ item.path }} — {{ item.message }}
                </p>
                <p class="write-line">{{ writeResult.recovery }}</p>
              </div>
              <div v-if="writeResult.skipped.length" class="write-block">
                <h4>{{ t("codegen.writeSkipped") }}</h4>
                <p
                  v-for="item in writeResult.skipped"
                  :key="item"
                  class="write-line"
                >
                  {{ item }}
                </p>
              </div>
              <div class="write-block">
                <h4>{{ t("codegen.manualSteps") }}</h4>
                <ol>
                  <li
                    v-for="(item, index) in writeResult.manualSteps"
                    :key="index"
                  >
                    {{ item }}
                  </li>
                </ol>
              </div>
            </el-scrollbar>
          </template>
          <div v-else-if="preview" class="generate-frame">
            <CodePreview v-model:overwrite="overwrite" :preview="preview" />
          </div>
          <div v-else v-loading="busy === 'preview'" class="generate-frame" />
        </div>
      </div>

      <!-- 底部固定：左保存草稿 + 校验状态，右上一步 / 下一步 -->
      <footer class="wizard-foot">
        <el-button
          v-perm="permission('devCodegenSaveSpec')"
          :icon="useRenderIcon(SaveIcon)"
          :loading="busy === 'save'"
          :disabled="step === 0 && !reached && !hasSpec"
          @click="save"
          >{{ t("codegen.saveDraft") }}</el-button
        >
        <el-popover
          v-if="step > 0"
          v-model:visible="errorsOpen"
          placement="top-start"
          :width="420"
          trigger="click"
          :disabled="!shownErrors.length"
        >
          <template #reference>
            <span
              class="check-state"
              :class="{
                'is-error': shownErrors.length,
                'is-ok': validated && !errors.length
              }"
              role="button"
              tabindex="0"
            >
              <component
                :is="shownErrors.length ? ErrorIcon : OkIcon"
                v-if="shownErrors.length || (validated && !errors.length)"
              />
              {{
                validating
                  ? t("codegen.checking")
                  : shownErrors.length
                    ? t("codegen.problems", { count: shownErrors.length })
                    : validated && !errors.length
                      ? t("codegen.checkPassed")
                      : t("codegen.checkPending")
              }}
            </span>
          </template>
          <ul class="error-list">
            <li v-for="(item, index) in shownErrors" :key="index">
              <el-button link type="primary" @click="locate(item)">{{
                pathLabel(item.path)
              }}</el-button>
              <span>{{ item.message }}</span>
            </li>
          </ul>
        </el-popover>
        <div class="wizard-flex" />
        <el-button v-if="step > 0" @click="step--">{{
          t("codegen.prev")
        }}</el-button>
        <el-button
          v-if="step < STEPS.length - 1"
          type="primary"
          :loading="busy === 'import'"
          :disabled="step === 0 && !canNext"
          @click="next"
          >{{
            step === 0 && source === "import" && !reached
              ? t("codegen.importAndNext", { count: picked.length })
              : t("codegen.next")
          }}</el-button
        >
        <template v-else>
          <el-button
            :icon="useRenderIcon(RefreshIcon)"
            :loading="busy === 'preview'"
            @click="runPreview"
            >{{ t("codegen.repreview") }}</el-button
          >
          <el-button
            v-perm="permission('devCodegenWriteSpec')"
            type="primary"
            :loading="busy === 'write'"
            :disabled="!preview || previewStale || !!writeResult"
            @click="confirmOpen = true"
            >{{ t("codegen.write") }}</el-button
          >
        </template>
      </footer>
    </div>

    <el-drawer
      v-model="previewOpen"
      :title="t('codegen.pagePreview')"
      size="78%"
      destroy-on-close
      class="preview-drawer"
    >
      <PagePreview :spec="previewSpec" />
    </el-drawer>

    <el-dialog
      v-model="confirmOpen"
      :title="t('codegen.write')"
      width="min(640px, 96vw)"
      :close-on-click-modal="false"
    >
      <p class="confirm-text">{{ t("codegen.confirmWrite") }}</p>
      <el-scrollbar max-height="320px" class="confirm-files">
        <p v-for="file in writable" :key="`${file.project}/${file.path}`">
          <el-tag
            :type="file.action === 'create' ? 'success' : 'warning'"
            size="small"
            effect="light"
            >{{ t(`codegen.actions.${file.action}`) }}</el-tag
          >
          <span>{{ file.project }}/{{ file.path }}</span>
        </p>
        <template v-if="modifiedFiles.length">
          <p class="confirm-sub">{{ t("codegen.modifiedChoose") }}</p>
          <p v-for="file in modifiedFiles" :key="`skip:${file.key}`">
            <el-checkbox
              :model-value="overwrite.includes(file.key)"
              @change="
                overwrite = $event
                  ? [...overwrite, file.key]
                  : overwrite.filter(key => key !== file.key)
              "
            />
            <el-tag
              :type="overwrite.includes(file.key) ? 'warning' : 'danger'"
              size="small"
              effect="light"
              >{{
                t(
                  overwrite.includes(file.key)
                    ? "codegen.actions.overwrite"
                    : "codegen.actions.skip-modified"
                )
              }}</el-tag
            >
            <span>{{ file.project }}/{{ file.path }}</span>
          </p>
        </template>
      </el-scrollbar>
      <template #footer>
        <el-button @click="confirmOpen = false">{{
          t("crud.cancel")
        }}</el-button>
        <el-button type="primary" :disabled="!writable.length" @click="write">{{
          t("codegen.writeCount", { count: writable.length })
        }}</el-button>
      </template>
    </el-dialog>
  </section>
</template>

<style scoped lang="scss">
@media (width <= 900px) {
  .source-cards,
  .template-cards,
  .option-cards,
  .form-pair,
  .child-form {
    grid-template-columns: 1fr;
  }
}

.wizard {
  min-height: 0;
  overflow: hidden;
}

.wizard-card {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  background: var(--el-bg-color);
  border-radius: 4px;
}

/* 标题栏和通用列表页工具栏同高同边线 */
.wizard-head {
  display: flex;
  flex-shrink: 0;
  gap: 8px;
  align-items: center;
  min-height: var(--crud-head-height, 49px);
  padding: 8px 16px;
  border-bottom: 1px solid var(--el-border-color-extra-light);
}

.wizard-title {
  font-size: var(--el-font-size-medium);
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.wizard-key {
  font-family: var(--el-font-family-mono, monospace);
  font-size: var(--el-font-size-small);
  color: var(--el-text-color-secondary);
}

.wizard-flex {
  flex: 1;
}

.wizard-steps {
  flex-shrink: 0;
  margin: 12px 16px 0;
}

.wizard-steps :deep(.el-step.is-reachable) {
  cursor: pointer;
}

.wizard-alert {
  flex-shrink: 0;
  width: auto;
  margin: 12px 16px 0;
}

.wizard-body {
  flex: 1;
  min-height: 0;
  padding: 16px;
}

.step {
  height: 100%;
  min-height: 0;
}

/* 底部固定操作栏 */
.wizard-foot {
  display: flex;
  flex-shrink: 0;
  gap: 8px;
  align-items: center;
  height: 56px;
  padding: 0 16px;
  border-top: 1px solid var(--el-border-color-extra-light);
}

.wizard-foot :deep(.el-button + .el-button) {
  margin-left: 0;
}

.check-state {
  display: inline-flex;
  gap: 4px;
  align-items: center;
  margin-left: 8px;
  font-size: var(--el-font-size-small);
  color: var(--el-text-color-secondary);
  cursor: default;
}

.check-state.is-error {
  color: var(--el-color-danger);
  cursor: pointer;
}

.check-state.is-ok {
  color: var(--el-color-success);
}

.error-list {
  max-height: 320px;
  padding: 0;
  margin: 0;
  overflow: auto;
  list-style: none;
}

.error-list li {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 6px 0;
  font-size: var(--el-font-size-small);
  color: var(--el-text-color-regular);
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.error-list li:last-child {
  border-bottom: none;
}

/* 选择卡片：来源、模板、删除方式共用 */
.choice-card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: flex-start;
  padding: 16px;
  font: inherit;
  color: var(--el-text-color-regular);
  text-align: left;
  cursor: pointer;
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color);
  border-radius: 6px;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
}

.choice-card:hover:not(:disabled) {
  border-color: var(--el-color-primary-light-5);
}

.choice-card.is-active {
  background: var(--el-color-primary-light-9);
  border-color: var(--el-color-primary);
  box-shadow: 0 0 0 1px var(--el-color-primary) inset;
}

.choice-card:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.choice-card strong {
  font-size: var(--el-font-size-base);
  color: var(--el-text-color-primary);
}

.choice-card small {
  font-size: var(--el-font-size-small);
  line-height: 18px;
  color: var(--el-text-color-secondary);
}

.choice-card.is-row {
  flex-direction: row;
  gap: 10px;
  align-items: flex-start;
}

.choice-card.is-row span {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.choice-card.is-row :deep(.el-radio) {
  height: auto;
  margin-right: 0;
  pointer-events: none;
}

.choice-icon {
  font-size: 24px;
  color: var(--el-color-primary);
}

/* ① 来源 */
.step-source {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.source-cards {
  display: grid;
  flex-shrink: 0;
  grid-template-columns: repeat(2, minmax(0, 320px));
  gap: 16px;
}

.import-panel {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;
}

.import-toolbar {
  display: flex;
  flex-shrink: 0;
  gap: 8px;
  align-items: center;
  margin-bottom: 10px;
}

.import-search {
  width: 260px;
}

.import-tip {
  font-size: var(--el-font-size-small);
  color: var(--el-text-color-secondary);
}

.import-table {
  flex: 1;
  min-height: 0;
}

.import-table :deep(.el-table__row) {
  cursor: pointer;
}

/* ② 表信息 / ④ 关系 / ⑤ 选项：内容居左、限宽 */
.form-narrow {
  max-width: 760px;
  padding-right: 12px;
}

.form-narrow.is-wide {
  max-width: 980px;
}

.section-title {
  margin: 0 0 12px;
  font-size: var(--el-font-size-base);
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.section-title:not(:first-child) {
  margin-top: 24px;
}

.section-tip {
  margin: -4px 0 16px;
  font-size: var(--el-font-size-small);
  color: var(--el-text-color-secondary);
}

.table-form :deep(.el-select) {
  width: 100%;
}

.form-pair {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0 16px;
}

/* 表单项错误放在文档流里（默认是绝对定位，会压住下面的说明文字） */
.wizard-body :deep(.el-form-item__error) {
  position: static;
  width: 100%;
  padding-top: 2px;
}

.form-tip {
  width: 100%;
  margin-top: 2px;
  font-size: var(--el-font-size-extra-small);
  line-height: 18px;
  color: var(--el-text-color-secondary);
}

.form-error {
  margin: 0 0 8px;
  font-size: var(--el-font-size-small);
  color: var(--el-color-danger);
}

.template-cards {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.template-sketch {
  display: flex;
  flex-direction: column;
  gap: 5px;
  width: 100%;
  margin-top: 8px;
}

.template-sketch i {
  display: block;
  height: 6px;
  background: var(--el-fill-color-dark);
  border-radius: 3px;
}

.choice-card.is-active .template-sketch i {
  background: var(--el-color-primary-light-5);
}

.template-sketch.is-tree i:nth-child(2) {
  margin-left: 16px;
}

.template-sketch.is-tree i:nth-child(3) {
  margin-left: 32px;
}

.template-sketch.is-tree i:nth-child(4) {
  margin-left: 16px;
}

.template-sketch.is-masterDetail i:nth-child(1) {
  height: 12px;
}

.template-sketch.is-masterDetail i:nth-child(n + 2) {
  width: 80%;
  margin-left: 20%;
}

/* ③ 字段 */
.step-fields {
  display: flex;
  flex-direction: column;
}

.table-tabs {
  display: flex;
  flex-shrink: 0;
  gap: 20px;
  align-items: stretch;
  margin-bottom: 12px;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.table-tab {
  display: inline-flex;
  gap: 6px;
  align-items: center;
  padding: 0 2px 8px;
  margin-bottom: -1px;
  font: inherit;
  font-size: var(--el-font-size-base);
  color: var(--el-text-color-regular);
  cursor: pointer;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
}

.table-tab:hover,
.table-tab.is-active {
  color: var(--el-color-primary);
}

.table-tab.is-active {
  border-bottom-color: var(--el-color-primary);
}

.tab-sub {
  font-family: var(--el-font-family-mono, monospace);
  font-size: var(--el-font-size-small);
  color: var(--el-text-color-secondary);
}

.table-tabs :deep(.el-button) {
  padding-bottom: 8px;
}

.fields-frame {
  flex: 1;
  min-height: 0;
}

/* ④ 子表 */
.child-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 12px;
}

.child-row {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  padding: 12px 12px 0;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 6px;
}

.child-index {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  margin-top: 30px;
  font-size: var(--el-font-size-small);
  color: var(--el-color-primary);
  background: var(--el-color-primary-light-9);
  border-radius: 50%;
}

.child-row > .el-button {
  margin-top: 34px;
}

.child-form {
  display: grid;
  flex: 1;
  grid-template-columns: 1.2fr 1fr 1.4fr 0.6fr;
  gap: 0 12px;
}

/* ⑤ 选项 */
.option-cards {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.switch-row {
  display: flex;
  gap: 16px;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  margin-bottom: 12px;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 6px;
}

.switch-row span {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.switch-row strong {
  font-size: var(--el-font-size-base);
  color: var(--el-text-color-primary);
}

.switch-row small {
  font-size: var(--el-font-size-small);
  color: var(--el-text-color-secondary);
}

.option-note {
  margin-top: 8px;
}

/* ⑥ 预览生成 */
.step-generate {
  display: flex;
  flex-direction: column;
}

.step-generate .wizard-alert {
  margin: 0 0 12px;
}

.generate-frame {
  flex: 1;
  min-height: 0;
}

.write-result {
  flex-shrink: 0;
  padding: 16px 0 8px;
}

.write-detail {
  flex: 1;
  min-height: 0;
}

.write-block {
  max-width: 860px;
  margin: 0 auto 16px;
}

.write-block h4 {
  margin: 0 0 8px;
  font-size: var(--el-font-size-base);
}

.write-block ol {
  padding-left: 20px;
  margin: 0;
  line-height: 24px;
}

.write-line {
  margin: 0 0 4px;
  font-family: var(--el-font-family-mono, monospace);
  font-size: var(--el-font-size-small);
  word-break: break-all;
}

.write-line.is-danger {
  color: var(--el-color-danger);
}

.confirm-text {
  margin: 0 0 12px;
}

.confirm-sub {
  margin: 12px 0 6px;
  font-family: inherit;
  color: var(--el-text-color-secondary);
}

.confirm-files p {
  display: flex;
  gap: 8px;
  align-items: center;
  margin: 0 0 6px;
  font-family: var(--el-font-family-mono, monospace);
  font-size: var(--el-font-size-small);
}
</style>
