<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { api } from "@/api/client";
import { onSessionReset } from "@/platform/lifecycle";
import { RequestFailure } from "@/utils/http";
import { date } from "./model";
import MemberPicker from "@/components/MemberPicker/index.vue";
import { workflowMemberDirectory } from "./member-directory";
const props = defineProps<{
  modelValue?: string | string[];
  kind: "users" | "roles" | "orgs" | "forms" | "workflows" | "submissions";
  multiple?: boolean;
  definitionId?: string;
  disabled?: boolean;
  published?: boolean;
}>();
const emit = defineEmits<{ "update:modelValue": [value: string | string[]] }>();
const { t } = useI18n();
const options = ref<{ id: string; label: string }[]>([]),
  selected = ref<{ id: string; label: string }[]>([]);
const busy = ref(false),
  error = ref(""),
  more = ref(false);
let request: AbortController | undefined,
  selectedRequest: AbortController | undefined,
  page = 1,
  keyword = "",
  timer: ReturnType<typeof setTimeout> | undefined;
let loaded = false;
const ids = () =>
  Array.isArray(props.modelValue)
    ? props.modelValue
    : props.modelValue
      ? [props.modelValue]
      : [];
async function load(search: string, append = false, force = false) {
  if (props.kind === "users") return;
  if (!force && !append && search === keyword && (busy.value || loaded)) return;
  request?.abort();
  const current = (request = new AbortController());
  busy.value = true;
  error.value = "";
  if (!append) {
    page = 1;
    keyword = search;
  }
  try {
    let rows: { id: string; label: string }[], total: number;
    if (["users", "roles", "orgs"].includes(props.kind)) {
      const r = await api.workflowDirectoryPage(
        {
          body: {
            kind: props.kind as "users" | "roles" | "orgs",
            includeChildren: false,
            keyword,
            page,
            size: 20
          }
        },
        { signal: current.signal }
      );
      rows = r.data.list;
      total = r.data.total;
    } else if (props.kind === "forms") {
      const r = await api.formDefinitionPage(
        { body: { keyword, page, size: 20 } },
        { signal: current.signal }
      );
      rows = r.data.list.map(x => ({
        id: x.id,
        label: `${x.name ?? ""} · v${x.revision ?? ""}`
      }));
      total = r.data.total;
    } else if (props.kind === "workflows") {
      const r = props.published
        ? await api.workflowDefinitionAvailable(
            { body: { keyword, page, size: 20 } },
            { signal: current.signal }
          )
        : await api.workflowDefinitionPage(
            {
              body: {
                keyword,
                page,
                size: 20,
                eq: props.definitionId
                  ? { formDefinitionId: props.definitionId }
                  : {}
              }
            },
            { signal: current.signal }
          );
      rows = r.data.list.map(x => ({
        id: x.id,
        label: `${x.name ?? ""} · v${x.revision ?? ""}`
      }));
      total = r.data.total;
    } else {
      if (!props.definitionId) {
        options.value = [];
        more.value = false;
        return;
      }
      const r = await api.formSubmissionMine(
        { body: { definitionId: props.definitionId, keyword, page, size: 20 } },
        { signal: current.signal }
      );
      rows = r.data.list.map(x => ({
        id: x.id,
        label: `${x.name ?? ""} · ${date(x.createdAt)} · #${x.id}`
      }));
      total = r.data.total;
    }
    if (!current.signal.aborted) {
      options.value = append ? [...options.value, ...rows] : rows;
      more.value = page * 20 < total;
      loaded = true;
      cache();
    }
  } catch (e) {
    if (!current.signal.aborted)
      error.value =
        e instanceof RequestFailure ? e.message : "crud.requestFailed";
  } finally {
    if (!current.signal.aborted) busy.value = false;
  }
}
function cache() {
  selected.value = [
    ...new Map(
      [...selected.value, ...options.value]
        .filter(o => ids().includes(o.id))
        .map(o => [o.id, o])
    ).values()
  ];
}
function search(value: string) {
  clearTimeout(timer);
  timer = setTimeout(() => void load(value), 200);
}
async function hydrate() {
  if (props.kind === "users") return;
  cache();
  const missing = ids().filter(id => !selected.value.some(x => x.id === id));
  if (!missing.length) return;
  selectedRequest?.abort();
  const c = (selectedRequest = new AbortController());
  try {
    let rows: { id: string; label: string }[] = [];
    if (["users", "roles", "orgs"].includes(props.kind))
      rows = (
        await api.workflowDirectoryPage(
          {
            body: {
              kind: props.kind as "users" | "roles" | "orgs",
              includeChildren: false,
              ids: missing,
              keyword: "",
              page: 1,
              size: 50
            }
          },
          { signal: c.signal }
        )
      ).data.list;
    else if (props.kind === "forms")
      rows = await Promise.all(
        missing.map(async id => {
          const r = (
            await api.formDefinitionInfo({ body: { id } }, { signal: c.signal })
          ).data;
          return { id, label: `${r.name} · v${r.revision}` };
        })
      );
    else if (props.kind === "workflows")
      rows = await Promise.all(
        missing.map(async id => {
          const r = props.published
            ? (
                await api.workflowDefinitionAvailable(
                  { body: { id, keyword: "", page: 1, size: 1 } },
                  { signal: c.signal }
                )
              ).data.list[0]
            : (
                await api.workflowDefinitionInfo(
                  { body: { id } },
                  { signal: c.signal }
                )
              ).data;
          return {
            id,
            label: r
              ? `${r.name} · v${r.revision}`
              : t("workflow.unavailableChoice")
          };
        })
      );
    if (!c.signal.aborted)
      selected.value = [
        ...selected.value,
        ...missing.map(
          id =>
            rows.find(x => x.id === id) ?? {
              id,
              label: t("workflow.unavailableChoice")
            }
        )
      ];
  } catch (e) {
    if (!c.signal.aborted)
      error.value =
        e instanceof RequestFailure ? e.message : "crud.requestFailed";
  }
}
watch(
  () => [props.kind, props.definitionId, props.published],
  () => {
    request?.abort();
    selectedRequest?.abort();
    clearTimeout(timer);
    busy.value = false;
    loaded = false;
    options.value = [];
    selected.value = [];
    error.value = "";
    void load("");
    void hydrate();
  },
  { immediate: true }
);
watch(
  () => props.modelValue,
  () => void hydrate(),
  { deep: true }
);
function reset() {
  request?.abort();
  selectedRequest?.abort();
  clearTimeout(timer);
  options.value = [];
  selected.value = [];
  error.value = "";
  loaded = false;
  busy.value = false;
}
const stop = onSessionReset(reset);
onBeforeUnmount(() => {
  stop();
  reset();
});
</script>
<template>
  <div class="resource-select">
    <MemberPicker
      v-if="kind === 'users'"
      :model-value="modelValue"
      :source="workflowMemberDirectory"
      :multiple="multiple"
      :disabled="disabled"
      @update:model-value="emit('update:modelValue', $event)"
    />
    <el-select
      v-else
      :model-value="modelValue"
      :multiple="multiple"
      :multiple-limit="50"
      :disabled="disabled"
      filterable
      remote
      clearable
      :remote-method="search"
      :loading="busy"
      :placeholder="t('workflow.searchChoice')"
      @visible-change="$event && !loaded && load(keyword)"
      @update:model-value="
        emit('update:modelValue', $event || (multiple ? [] : ''))
      "
    >
      <el-option
        v-for="item in [
          ...new Map([...selected, ...options].map(o => [o.id, o])).values()
        ]"
        :key="item.id"
        :label="item.label"
        :value="item.id"
      />
      <template #footer
        ><el-button
          v-if="more"
          link
          :loading="busy"
          @click="
            page++;
            load(keyword, true);
          "
          >{{ t("workflow.loadMore") }}</el-button
        ></template
      >
    </el-select>
    <small v-if="error" class="resource-error" role="alert"
      >{{ t(error) }}
      <el-button link @click="load(keyword, false, true)">{{
        t("workflow.retry")
      }}</el-button></small
    >
  </div>
</template>
<style scoped>
.resource-select,
.resource-select :deep(.el-select) {
  width: 100%;
  min-width: 0;
}

.resource-error {
  color: var(--el-color-danger);
}
</style>
