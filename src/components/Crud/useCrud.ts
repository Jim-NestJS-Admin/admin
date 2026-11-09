import { computed, onBeforeUnmount, reactive, ref, shallowRef } from "vue";
import { onSessionReset } from "@/platform/lifecycle";
import { RequestFailure } from "@/utils/http";
import { childDraft, childIssues, relatedChanges } from "./children.mjs";
import { treeRows } from "./tree.mjs";
import {
  columnChoices,
  applyPageView,
  pageSize,
  constrainFieldSchema,
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
  cell: (row: CrudRecord, field: string) => CrudCell = defaultCell,
  relatedCell: (
    resource: string,
    row: CrudRecord,
    field: string
  ) => CrudCell = (_resource, row, field) => defaultCell(row, field)
) {
  const schema = shallowRef<CrudSchema>();
  const rows = shallowRef<CrudRecord[]>([]),
    selected = ref<string[]>([]);
  const treeOptions = shallowRef<CrudRecord[]>([]);
  const total = ref(0),
    loading = ref(false),
    saving = ref(false),
    error = ref("");
  const fields = ref<Record<string, string[]>>({});
  const rowIssues = ref<
    { group: string; key: string; field: string; message: string }[]
  >([]);
  const recycledView = ref(false);
  const groupCell = (resource: string) => (row: CrudRecord, field: string) =>
    relatedCell(resource, row, field);
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
    readOnly: false,
    mode: "add" as "add" | "update",
    values: {} as CrudRecord,
    record: undefined as CrudRecord | undefined,
    related: [] as ReturnType<typeof childDraft>[]
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
    treeOptions.value = [];
    selected.value = [];
    choices.value = { columns: [], density: "default" };
    total.value = 0;
    editor.open = false;
    editor.values = {};
    editor.record = undefined;
    editor.related = [];
    rowIssues.value = [];
    recycledView.value = false;
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
            errors?: {
              field: string;
              messages: string[];
              resource?: string;
              id?: string;
              clientId?: string;
              index?: number;
            }[];
          })
        : undefined;
    fields.value = Object.fromEntries(
      (Array.isArray(data?.errors) ? data.errors : [])
        .filter(
          item =>
            !item?.resource &&
            typeof item?.field === "string" &&
            Array.isArray(item.messages)
        )
        .map(item => [
          item.field.replace(/^data\./, ""),
          item.messages.filter(message => typeof message === "string")
        ])
    );
    rowIssues.value = (Array.isArray(data?.errors) ? data.errors : []).flatMap(
      item => {
        if (
          typeof item?.resource !== "string" ||
          typeof item.field !== "string" ||
          !Array.isArray(item.messages)
        )
          return [];
        const changes = relatedChanges(
          schema.value?.children ?? [],
          editor.related,
          groupCell
        ).find(group => group.resource === item.resource);
        const key =
          item.id ??
          item.clientId ??
          (Number.isInteger(item.index)
            ? changes?.inserted[item.index]?.localKey
            : "");
        return item.messages
          .filter(message => typeof message === "string")
          .map(message => ({
            group: item.resource,
            key: typeof key === "string" ? key : "",
            field: item.field,
            message
          }));
      }
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
      const list = recycledView.value ? port.recycled : port.list;
      if (!list) throw Error("crud.requestFailed");
      const useTree =
        !recycledView.value &&
        schema.value.tree &&
        port.tree &&
        !query.search &&
        !query.advanced &&
        !Object.keys(query.equality).length;
      const flat = useTree ? await port.tree(request.signal) : undefined;
      const result = flat
        ? { rows: flat, totalRows: flat.length }
        : await list.call(
            port,
            JSON.parse(JSON.stringify(query)),
            request.signal
          );
      if (context !== generation || sequence !== listSequence) return;
      if (flat) treeOptions.value = flat;
      rows.value =
        schema.value.tree && !recycledView.value
          ? treeRows(result.rows, schema.value.tree.parentField)
          : result.rows;
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
      const description: CrudSchema = constrainFieldSchema(
        applyPageView(await port.describe(request.signal))
      );
      if (context !== generation) return;
      schema.value = description;
      query.pageNumber = 1;
      query.pageSize = pageSize(description);
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
    if (recycledView.value) return;
    if (order && !schema.value?.actions.page?.sortable.includes(field)) return;
    query.sorting = order
      ? [{ field, direction: order === "ascending" ? "asc" : "desc" }]
      : [];
    return search();
  }
  async function edit(row?: CrudRecord, readOnly = false) {
    if (saving.value || !schema.value || recycledView.value) return;
    error.value = "";
    fields.value = {};
    rowIssues.value = [];
    intent = undefined;
    editor.readOnly = readOnly;
    const sequence = ++detailSequence;
    if (!row) {
      editor.mode = "add";
      editor.record = undefined;
      editor.values = {};
      editor.related = (schema.value.children ?? []).map(child =>
        childDraft(child, [], true)
      );
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
      const groups = result.children as
        | Record<string, CrudRecord[]>
        | undefined;
      editor.related = (schema.value.children ?? []).map(child =>
        childDraft(
          child,
          groups?.[child.resource],
          port.relatedComplete?.(child.resource, result) === true
        )
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
      editor.related = [];
      rowIssues.value = [];
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
    if (recycledView.value || editor.readOnly) return;
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
    rowIssues.value = childIssues(
      schema.value.children ?? [],
      editor.related,
      groupCell
    );
    if (missing.length || rowIssues.value.length) return;
    const changes = JSON.parse(
      JSON.stringify(
        relatedChanges(schema.value.children ?? [], editor.related, groupCell)
      )
    );
    const values = editableValues(
      schema.value,
      editor.mode,
      editor.values,
      editor.record,
      cell
    );
    const current =
      editor.mode === "update" ? identity(editor.record) : undefined;
    const key = mutationKey(
      JSON.stringify([editor.mode, current, values, changes])
    );
    const context = generation,
      request = start();
    saving.value = true;
    error.value = "";
    try {
      const options = {
        signal: request.signal,
        idempotencyKey: key,
        relatedChanges: changes
      };
      if (current) await port.update(current, values, options);
      else await port.create(values, options);
      if (context !== generation) return;
      intent = undefined;
      editor.open = false;
      editor.values = {};
      editor.record = undefined;
      editor.related = [];
      rowIssues.value = [];
      await load();
    } catch (reason) {
      if (context === generation) failure(reason);
    } finally {
      pending.delete(request);
      if (context === generation) saving.value = false;
    }
  }
  async function remove(ids: string[]) {
    if (recycledView.value) return;
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
  async function showRecycled(value: boolean) {
    if (
      saving.value ||
      !schema.value ||
      (value && (!port.recycled || !schema.value.api.includes("recycle")))
    )
      return;
    closeEditor();
    recycledView.value = value;
    query.pageNumber = 1;
    query.equality = {};
    query.sorting = [];
    query.search = "";
    await load();
  }
  async function recycleAction(
    action: "restore" | "purge",
    records: CrudRecord[]
  ) {
    if (
      !recycledView.value ||
      saving.value ||
      Date.now() < retryUntil.value ||
      !schema.value?.api.includes(action) ||
      !port[action] ||
      !records.length
    )
      return;
    const items = records.map(record => identity(record));
    const key = mutationKey(
      JSON.stringify([
        action,
        [...items].sort((a, b) => a.id.localeCompare(b.id))
      ])
    );
    const context = generation,
      request = start();
    saving.value = true;
    error.value = "";
    try {
      await port[action](items, {
        signal: request.signal,
        idempotencyKey: key
      });
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
    treeOptions,
    schema,
    rows,
    selected,
    total,
    loading,
    saving,
    error,
    fields,
    rowIssues,
    recycledView,
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
    showRecycled,
    recycleAction,
    saveChoices
  };
}
