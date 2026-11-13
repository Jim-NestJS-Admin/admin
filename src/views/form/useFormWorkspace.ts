import { computed, reactive, ref } from "vue";
import { api } from "@/api/client";
import { RequestFailure } from "@/utils/http";
import { onSessionReset } from "@/platform/lifecycle";
import {
  copy,
  emptyDesigner,
  fingerprint,
  issuesFrom,
  type Designer,
  type Field,
  type FieldIssue,
  type FormRecord
} from "./model";

export function requestText(error: unknown) {
  return error instanceof RequestFailure
    ? error.failure.message
    : "crud.requestFailed";
}

export function useFormWorkspace(client = api) {
  const records = ref<FormRecord[]>([]),
    total = ref(0),
    page = ref(1),
    size = ref(10),
    search = ref("");
  const loading = ref(false),
    busy = ref(false),
    listError = ref("");
  const editor = reactive({
    open: false,
    mode: "create" as "create" | "revise" | "view",
    record: null as FormRecord | null,
    code: "",
    name: "",
    designer: emptyDesigner(),
    fields: [] as Field[],
    error: "",
    issues: [] as FieldIssue[],
    conflict: false
  });
  let listRequest: AbortController | undefined,
    taskRequest: AbortController | undefined;
  let signature = "",
    mutationKey = "";
  let generation = 0;
  const canDesign = computed(() => editor.mode !== "view");
  const reset = () => {
    ++generation;
    page.value = 1;
    search.value = "";
    listRequest?.abort();
    taskRequest?.abort();
    records.value = [];
    total.value = 0;
    busy.value = false;
    loading.value = false;
    listError.value = "";
    Object.assign(editor, {
      open: false,
      record: null,
      code: "",
      name: "",
      designer: emptyDesigner(),
      fields: [],
      error: "",
      issues: [],
      conflict: false
    });
    signature = "";
    mutationKey = "";
  };
  const stop = onSessionReset(reset);
  const dispose = () => {
    stop();
    reset();
  };
  async function load() {
    listRequest?.abort();
    const request = (listRequest = new AbortController());
    loading.value = true;
    listError.value = "";
    try {
      const response = await client.formDefinitionPage(
        {
          body: {
            page: page.value,
            size: size.value,
            keyword: search.value,
            sort: [{ field: "createdAt", order: "desc" }]
          }
        },
        { signal: request.signal }
      );
      if (!request.signal.aborted) {
        records.value = response.data.list;
        total.value = response.data.total;
      }
    } catch (error) {
      if (!request.signal.aborted) listError.value = requestText(error);
    } finally {
      if (!request.signal.aborted) loading.value = false;
    }
  }
  async function open(
    record: Pick<FormRecord, "id"> | null,
    mode: typeof editor.mode
  ) {
    ++generation;
    taskRequest?.abort();
    const request = (taskRequest = new AbortController());
    busy.value = true;
    listError.value = "";
    try {
      const full = record
        ? (
            await client.formDefinitionInfo(
              { body: { id: record.id } },
              { signal: request.signal }
            )
          ).data
        : null;
      if (request.signal.aborted) return;
      if (
        full &&
        (!full.designer ||
          !full.code ||
          !full.name ||
          !full.revision ||
          !Array.isArray(full.fields) ||
          !Array.isArray(full.designer.rule) ||
          full.designer.schemaVersion !== 1 ||
          (mode === "revise" &&
            ["code", "name", "designer"].some(field =>
              Boolean(full._fieldState?.[field])
            )))
      )
        throw new Error("forms.unavailable");
      Object.assign(editor, {
        open: true,
        mode,
        record: full,
        code: full?.code ?? "",
        name: full?.name ?? "",
        designer: copy(full?.designer ?? emptyDesigner()),
        fields: copy(full?.fields ?? []),
        error: "",
        issues: [],
        conflict: false
      });
      signature = "";
      mutationKey = "";
    } catch (error) {
      if (!request.signal.aborted)
        listError.value =
          error instanceof Error && error.message === "forms.unavailable"
            ? error.message
            : requestText(error);
    } finally {
      if (!request.signal.aborted) busy.value = false;
    }
  }
  async function inspect(designer: Designer) {
    const request = (taskRequest = new AbortController());
    const response = await client.formDefinitionInspect(
      { body: { designer } },
      { signal: request.signal }
    );
    if (request.signal.aborted) return null;
    editor.designer = response.data.designer;
    editor.fields = response.data.fields;
    return response.data;
  }
  async function check(designer: Designer) {
    if (busy.value) return null;
    const run = ++generation;
    busy.value = true;
    editor.error = "";
    editor.issues = [];
    try {
      return await inspect(designer);
    } catch (error) {
      if (run === generation && !taskRequest?.signal.aborted) {
        editor.error = requestText(error);
        editor.issues = issuesFrom(error);
      }
      return null;
    } finally {
      if (run === generation && !taskRequest?.signal.aborted)
        busy.value = false;
    }
  }
  async function save(designer: Designer) {
    if (!canDesign.value || busy.value) return false;
    const run = ++generation;
    busy.value = true;
    editor.error = "";
    editor.issues = [];
    editor.conflict = false;
    const capture = {
      code: editor.code.trim(),
      name: editor.name.trim(),
      designer: copy(designer)
    };
    const expected = editor.record?.revision;
    const mode = editor.mode;
    try {
      const checked = await inspect(capture.designer);
      if (!checked) return false;
      capture.designer = checked.designer;
      const next = fingerprint({ mode, expected, capture });
      if (next !== signature) {
        signature = next;
        mutationKey = crypto.randomUUID();
      }
      const request = (taskRequest = new AbortController());
      const options = {
        signal: request.signal,
        headers: { "Idempotency-Key": mutationKey }
      };
      const result =
        mode === "create"
          ? await client.formDefinitionAdd({ body: { data: capture } }, options)
          : await client.formDefinitionRevise(
              { body: { baseRevision: expected!, data: capture } },
              options
            );
      if (request.signal.aborted) return false;
      Object.assign(editor, {
        mode: "view",
        record: result.data,
        code: result.data.code,
        name: result.data.name,
        designer: copy(result.data.designer),
        fields: copy(result.data.fields)
      });
      signature = "";
      mutationKey = "";
      return true;
    } catch (error) {
      if (run === generation && !taskRequest?.signal.aborted) {
        editor.error = requestText(error);
        editor.issues = issuesFrom(error);
        editor.conflict =
          error instanceof RequestFailure && error.failure.status === 409;
      }
      return false;
    } finally {
      if (run === generation && !taskRequest?.signal.aborted)
        busy.value = false;
    }
  }
  async function latest() {
    const request = (taskRequest = new AbortController());
    busy.value = true;
    try {
      const response = await client.formDefinitionPage(
        {
          body: {
            page: 1,
            size: 1,
            eq: { code: editor.code },
            sort: [{ field: "revision", order: "desc" }]
          }
        },
        { signal: request.signal }
      );
      if (!request.signal.aborted && response.data.list[0]) {
        await open(response.data.list[0], "revise");
        const opened =
          editor.record?.id === response.data.list[0].id &&
          editor.mode === "revise";
        if (!opened && listError.value) editor.error = listError.value;
        return opened;
      }
      if (!request.signal.aborted) editor.error = "forms.unavailable";
      return false;
    } catch (error) {
      if (!request.signal.aborted) editor.error = requestText(error);
      return false;
    } finally {
      if (!request.signal.aborted) busy.value = false;
    }
  }
  return {
    records,
    total,
    page,
    size,
    search,
    loading,
    busy,
    listError,
    editor,
    canDesign,
    load,
    open,
    check,
    save,
    latest,
    reset,
    dispose
  };
}
