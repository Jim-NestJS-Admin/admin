import { computed, onBeforeUnmount, reactive, ref, shallowRef } from "vue";
import { onSessionReset } from "@/platform/lifecycle";
import { RequestFailure } from "@/utils/http";
import {
  columnChoices,
  defaultCell,
  editableValues,
  identity,
  requiredFields
} from "./model.mjs";
import type {
  CrudPort,
  CrudSchema,
  CrudQuery,
  CrudRecord,
  CrudChoices,
  CrudCell
} from "./types";

/** 所有异步回填都校验当前上下文；适配器即使忽略 abort 也不能写回旧页面。 */
export function useCrud(
  port: CrudPort,
  pageKey: string,
  cell: (row: CrudRecord, field: string) => CrudCell = defaultCell
) {
  const schema = shallowRef<CrudSchema>();
  const rows = shallowRef<CrudRecord[]>([]),
    selected = ref<string[]>([]);
  const total = ref(0),
    loading = ref(false),
    saving = ref(false),
    error = ref("");
  const fields = ref<Record<string, string[]>>({});
  const retryUntil = ref(0);
  const choices = ref<CrudChoices>({ columns: [], density: "default" });
  const query = reactive<CrudQuery>({
    pageNumber: 1,
    pageSize: 20,
    search: "",
    sorting: [],
    equality: {}
  });
  const editor = reactive({
    open: false,
    mode: "add" as "add" | "update",
    values: {} as CrudRecord,
    record: undefined as CrudRecord | undefined
  });
  let generation = 0,
    listSequence = 0,
    detailSequence = 0;
  let intent: { fingerprint: string; key: string } | undefined;
  const pending = new Set<AbortController>();
  function start() {
    const controller = new AbortController();
    pending.add(controller);
    return controller;
  }
  function reset() {
    generation++;
    listSequence++;
    detailSequence++;
    for (const request of pending) request.abort();
    pending.clear();
    schema.value = undefined;
    rows.value = [];
    selected.value = [];
    choices.value = { columns: [], density: "default" };
    total.value = 0;
    editor.open = false;
    editor.values = {};
    editor.record = undefined;
    query.search = "";
    query.equality = {};
    query.sorting = [];
    query.advanced = undefined;
    loading.value = false;
    saving.value = false;
    fields.value = {};
    error.value = "";
    intent = undefined;
    retryUntil.value = 0;
  }
  const unsubscribe = onSessionReset(reset);
  onBeforeUnmount(() => {
    unsubscribe();
    reset();
  });
  function failure(reason: unknown) {
    error.value =
      reason instanceof RequestFailure ? reason.message : "crud.requestFailed";
    const data =
      reason instanceof RequestFailure
        ? (reason.failure.data as {
            errors?: { field: string; messages: string[] }[];
          })
        : undefined;
    fields.value = Object.fromEntries(
      (Array.isArray(data?.errors) ? data.errors : [])
        .filter(
          item =>
            typeof item?.field === "string" && Array.isArray(item.messages)
        )
        .map(item => [
          item.field.replace(/^data\./, ""),
          item.messages.filter(message => typeof message === "string")
        ])
    );
    if (reason instanceof RequestFailure && reason.failure.status === 429) {
      const seconds = Number(
        (reason.failure.data as { retryAfterSeconds?: number })
          ?.retryAfterSeconds
      );
      retryUntil.value =
        Date.now() +
        (Number.isFinite(seconds)
          ? Math.min(3600, Math.max(1, Math.ceil(seconds)))
          : 1) *
          1000;
    }
  }
  async function load() {
    if (!schema.value) return;
    const context = generation,
      sequence = ++listSequence,
      request = start();
    loading.value = true;
    error.value = "";
    selected.value = [];
    try {
      const result = await port.list(
        JSON.parse(JSON.stringify(query)),
        request.signal
      );
      if (context !== generation || sequence !== listSequence) return;
      rows.value = result.rows;
      total.value = result.totalRows;
    } catch (reason) {
      if (context === generation && sequence === listSequence) {
        rows.value = [];
        total.value = 0;
        failure(reason);
      }
    } finally {
      pending.delete(request);
      if (context === generation && sequence === listSequence)
        loading.value = false;
    }
  }
  async function initialize() {
    reset();
    const context = generation,
      request = start();
    loading.value = true;
    try {
      const description = await port.describe(request.signal);
      if (context !== generation) return;
      schema.value = description;
      query.pageNumber = 1;
      query.pageSize = Math.min(20, description.maxSize);
      query.sorting = description.defaultSort
        .filter(sort => description.actions.page?.sortable.includes(sort.field))
        .map(sort => ({ field: sort.field, direction: sort.order }));
      choices.value = columnChoices(description);
      let preferenceFailed = false,
        preferenceFailure: unknown;
      // 偏好失败不妨碍读列表，但必须提示；偏好不能增加后端未开放的列。
      if (port.preferences) {
        try {
          const saved = await port.preferences.load(pageKey, request.signal);
          if (context === generation)
            choices.value = columnChoices(description, saved);
        } catch (reason) {
          preferenceFailed = true;
          preferenceFailure = reason;
        }
      }
      if (context === generation) await load();
      if (context === generation && preferenceFailed && !error.value)
        failure(preferenceFailure);
    } catch (reason) {
      if (context === generation) failure(reason);
    } finally {
      pending.delete(request);
      if (context === generation) loading.value = false;
    }
  }
  function search() {
    query.pageNumber = 1;
    return load();
  }
  function filter(field: string, value: unknown) {
    if (!schema.value?.actions.page?.filterable.includes(field)) return;
    query.equality =
      value === undefined
        ? Object.fromEntries(
            Object.entries(query.equality).filter(([key]) => key !== field)
          )
        : { ...query.equality, [field]: value };
    return search();
  }
  function sort(field: string, order: "ascending" | "descending" | null) {
    if (order && !schema.value?.actions.page?.sortable.includes(field)) return;
    query.sorting = order
      ? [{ field, direction: order === "ascending" ? "asc" : "desc" }]
      : [];
    return search();
  }
  async function edit(row?: CrudRecord) {
    if (saving.value || !schema.value) return;
    error.value = "";
    fields.value = {};
    intent = undefined;
    const sequence = ++detailSequence;
    if (!row) {
      editor.mode = "add";
      editor.record = undefined;
      editor.values = {};
      editor.open = true;
      return;
    }
    const context = generation,
      request = start();
    try {
      const result = await port.detail(identity(row).id, request.signal);
      if (context !== generation || sequence !== detailSequence) return;
      identity(result);
      editor.mode = "update";
      editor.record = result;
      editor.values = editableValues(
        schema.value,
        "update",
        result,
        result,
        cell
      );
      editor.open = true;
    } catch (reason) {
      if (context === generation && sequence === detailSequence)
        failure(reason);
    } finally {
      pending.delete(request);
    }
  }
  function closeEditor() {
    if (!saving.value) {
      detailSequence++;
      editor.open = false;
      editor.values = {};
      editor.record = undefined;
      intent = undefined;
    }
  }
  function mutationKey(fingerprint: string) {
    if (intent?.fingerprint !== fingerprint)
      intent = { fingerprint, key: crypto.randomUUID() };
    return intent.key;
  }
  async function save() {
    if (
      saving.value ||
      Date.now() < retryUntil.value ||
      !schema.value ||
      !editor.open
    )
      return;
    const method = editor.mode === "add" ? port.create : port.update;
    if (!method) return;
    const missing = requiredFields(
      schema.value,
      editor.mode,
      editor.values,
      editor.record,
      cell
    );
    fields.value = Object.fromEntries(
      missing.map(field => [field, ["crud.required"]])
    );
    if (missing.length) return;
    const values = editableValues(
      schema.value,
      editor.mode,
      editor.values,
      editor.record,
      cell
    );
    const current =
      editor.mode === "update" ? identity(editor.record) : undefined;
    const key = mutationKey(JSON.stringify([editor.mode, current, values]));
    const context = generation,
      request = start();
    saving.value = true;
    error.value = "";
    try {
      const options = { signal: request.signal, idempotencyKey: key };
      if (current) await port.update(current, values, options);
      else await port.create(values, options);
      if (context !== generation) return;
      intent = undefined;
      editor.open = false;
      editor.values = {};
      editor.record = undefined;
      await load();
    } catch (reason) {
      if (context === generation) failure(reason);
    } finally {
      pending.delete(request);
      if (context === generation) saving.value = false;
    }
  }
  async function remove(ids: string[]) {
    if (
      !port.remove ||
      saving.value ||
      Date.now() < retryUntil.value ||
      !ids.length
    )
      return;
    const key = mutationKey(JSON.stringify(["delete", [...ids].sort()]));
    const context = generation,
      request = start();
    saving.value = true;
    error.value = "";
    try {
      await port.remove(ids, { signal: request.signal, idempotencyKey: key });
      if (context !== generation) return;
      intent = undefined;
      await load();
    } catch (reason) {
      if (context === generation) failure(reason);
    } finally {
      pending.delete(request);
      if (context === generation) saving.value = false;
    }
  }
  async function saveChoices(value: CrudChoices) {
    if (!schema.value) return false;
    const sanitized = columnChoices(schema.value, value),
      context = generation,
      request = start();
    try {
      if (port.preferences)
        await port.preferences.save(pageKey, sanitized, request.signal);
      if (context !== generation) return false;
      choices.value = sanitized;
      return true;
    } catch (reason) {
      if (context === generation) failure(reason);
      return false;
    } finally {
      pending.delete(request);
    }
  }
  const visibleColumns = computed(() =>
    choices.value.columns
      .filter(column => column.visible)
      .map(choice => ({
        ...schema.value.columns.find(column => column.field === choice.field),
        ...choice
      }))
  );
  return {
    schema,
    rows,
    selected,
    total,
    loading,
    saving,
    error,
    fields,
    retryUntil,
    choices,
    query,
    editor,
    visibleColumns,
    initialize,
    load,
    search,
    filter,
    sort,
    edit,
    closeEditor,
    save,
    remove,
    saveChoices
  };
}
