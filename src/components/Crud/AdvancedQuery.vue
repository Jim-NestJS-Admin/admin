<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from "vue";
import { useI18n } from "vue-i18n";
import { api, type OperationBody } from "@/api/client";
import type { CrudSchema } from "./types";
import QueryGroupEditor from "./QueryGroupEditor.vue";
import FilterIcon from "~icons/ri/filter-3-line";
import DeleteIcon from "~icons/ri/delete-bin-line";
import SaveIcon from "~icons/ri/save-3-line";
import ResetIcon from "~icons/ri/refresh-line";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import {
  countConditions,
  newGroup,
  restoreQuery,
  serializeQuery,
  type QueryGroup
} from "./query-draft";
import { onSessionReset } from "@/platform/lifecycle";
import { RequestFailure } from "@/utils/http";
const props = defineProps<{ schema: CrudSchema }>();
const emit = defineEmits<{ apply: [where: QueryGroup | undefined] }>();
const { t } = useI18n();
const open = ref(false),
  draft = ref(newGroup()),
  error = ref(""),
  busy = ref(false),
  name = ref("");
const saved = ref<{ name: string; where: QueryGroup }[]>([]),
  selected = ref("");
const fields = computed(() =>
  props.schema.query.filter(
    field =>
      !["masked", "hidden"].includes(
        props.schema.fieldPerms?.[field.field]?.state
      )
  )
);
const count = computed(() => countConditions(draft.value));
let request: AbortController | undefined;
const key = () => `query:${props.schema.permPrefix}`;
function fail(reason: unknown) {
  error.value =
    reason instanceof RequestFailure
      ? reason.failure.message
      : reason instanceof Error && reason.message.startsWith("query.")
        ? t(reason.message)
        : t("crud.requestFailed");
}
async function show() {
  open.value = true;
  error.value = "";
  request?.abort();
  request = new AbortController();
  const current = request;
  try {
    const result = await api.sessionPreferenceGet(
      { query: { key: key() } },
      { signal: current.signal }
    );
    if (current.signal.aborted) return;
    const value: unknown = result.data.value;
    saved.value = Array.isArray(value)
      ? value.slice(0, 30).flatMap(item => {
          try {
            if (
              typeof item?.name !== "string" ||
              !item.name ||
              item.name.length > 60
            )
              return [];
            const where = serializeQuery(
              restoreQuery(item.where, fields.value),
              fields.value
            );
            return [{ name: item.name, where }];
          } catch {
            return [];
          }
        })
      : [];
  } catch (reason) {
    if (!current.signal.aborted) fail(reason);
  }
}
function apply() {
  error.value = "";
  try {
    emit(
      "apply",
      count.value ? serializeQuery(draft.value, fields.value) : undefined
    );
    open.value = false;
  } catch (reason) {
    fail(reason);
  }
}
function loadSaved() {
  try {
    const item = saved.value.find(item => item.name === selected.value);
    if (item) draft.value = restoreQuery(item.where, fields.value);
  } catch (reason) {
    fail(reason);
  }
}
async function persist(remove = false) {
  if (busy.value) return;
  try {
    const title = (remove ? selected.value : name.value).trim();
    if (!title || title.length > 60) throw Error("query.invalidName");
    const next = saved.value.filter(item => item.name !== title);
    if (!remove)
      next.push({
        name: title,
        where: serializeQuery(draft.value, fields.value)
      });
    if (next.length > 30) throw Error("query.savedLimit");
    busy.value = true;
    error.value = "";
    request?.abort();
    request = new AbortController();
    const current = request;
    const body = {
      key: key(),
      value: next
    } as unknown as OperationBody<"sessionPreferenceSave">;
    await api.sessionPreferenceSave(
      { body },
      {
        signal: current.signal,
        headers: { "Idempotency-Key": crypto.randomUUID() }
      }
    );
    if (!current.signal.aborted) {
      saved.value = next;
      name.value = "";
      selected.value = "";
    }
  } catch (reason) {
    fail(reason);
  } finally {
    busy.value = false;
  }
}
function clear() {
  request?.abort();
  open.value = false;
  saved.value = [];
  draft.value = newGroup();
  name.value = "";
  selected.value = "";
  error.value = "";
}
const stop = onSessionReset(clear);
onBeforeUnmount(() => {
  stop();
  clear();
});
</script>
<template>
  <el-tooltip
    v-if="fields.length"
    :content="count ? `${t('query.title')}（${count}）` : t('query.title')"
    placement="top"
  >
    <button
      type="button"
      class="crud-addon"
      :class="{ 'is-active': count }"
      :aria-label="t('query.title')"
      @click="show"
    >
      <component :is="FilterIcon" class="crud-addon-icon" /><span
        v-if="count"
        class="crud-addon-count"
        >{{ count }}</span
      >
    </button>
  </el-tooltip>
  <el-drawer
    v-model="open"
    :title="t('query.title')"
    size="min(760px, 100vw)"
    append-to-body
    class="query-drawer"
  >
    <el-alert
      v-if="error"
      :title="error"
      type="error"
      show-icon
      :closable="false"
      class="query-error"
    />
    <!-- 常用查询：左边选用 / 删除，右边把当前条件存成常用查询 -->
    <section class="query-section">
      <h4 class="query-section-title">{{ t("query.saved") }}</h4>
      <div class="query-saved">
        <div class="query-saved-group">
          <el-select
            v-model="selected"
            class="query-saved-select"
            :aria-label="t('query.saved')"
            :placeholder="t('query.pickSaved')"
            :disabled="busy"
            @change="loadSaved"
            ><el-option
              v-for="item in saved"
              :key="item.name"
              :value="item.name"
              :label="item.name"
          /></el-select>
          <el-button
            :icon="useRenderIcon(DeleteIcon)"
            :disabled="!selected || busy"
            @click="persist(true)"
            >{{ t("crud.remove") }}</el-button
          >
        </div>
        <div class="query-saved-group">
          <el-input
            v-model="name"
            class="query-saved-name"
            maxlength="60"
            :placeholder="t('query.name')"
            :aria-label="t('query.name')"
            :disabled="busy"
          />
          <el-button
            :icon="useRenderIcon(SaveIcon)"
            :disabled="!count || busy"
            @click="persist()"
            >{{ t("query.save") }}</el-button
          >
        </div>
      </div>
    </section>
    <section class="query-section">
      <h4 class="query-section-title">
        {{ t("query.conditions") }}
        <span class="query-section-hint">{{ t("query.limit") }}</span>
      </h4>
      <QueryGroupEditor
        v-model:group="draft"
        :fields="fields"
        :depth="1"
        :count="count"
      />
    </section>
    <template #footer>
      <div class="query-footer">
        <el-button
          :icon="useRenderIcon(ResetIcon)"
          @click="draft = newGroup()"
          >{{ t("crud.reset") }}</el-button
        >
        <div class="query-footer-actions">
          <el-button @click="open = false">{{ t("crud.cancel") }}</el-button
          ><el-button type="primary" @click="apply">{{
            t("query.apply")
          }}</el-button>
        </div>
      </div>
    </template>
  </el-drawer>
</template>
<style scoped>
.query-error {
  margin-bottom: 16px;
}

.query-section + .query-section {
  margin-top: 20px;
}

.query-section-title {
  display: flex;
  gap: 8px;
  align-items: baseline;
  margin: 0 0 10px;
  font-size: var(--el-font-size-base);
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.query-section-hint {
  font-size: var(--el-font-size-extra-small);
  font-weight: normal;
  color: var(--el-text-color-secondary);
}

.query-saved {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: space-between;
}

.query-saved-group {
  display: flex;
  gap: 8px;
}

.query-saved-group :deep(.el-button + .el-button) {
  margin-left: 0;
}

.query-saved-select,
.query-saved-name {
  width: 200px;
}

.query-footer {
  display: flex;
  gap: 8px;
  justify-content: space-between;
}
</style>
