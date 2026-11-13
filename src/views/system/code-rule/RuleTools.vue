<script setup lang="ts">
import { onBeforeUnmount, computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { api, type OperationResponse, type OperationBody } from "@/api/client";
import type { CrudRecord } from "@/components/Crud/types";
import { permission } from "@/platform/system/resources";
import { formatValue } from "@/components/Crud/model.mjs";
import { ruleError } from "./messages";
const props = withDefaults(
  defineProps<{
    ruleId?: string;
    draft?: CrudRecord;
    showActions?: boolean;
    historyOnly?: boolean;
  }>(),
  { showActions: true }
);
const { t } = useI18n();
const previewPeriod = ref("");
const codes = ref<string[]>([]),
  error = ref(""),
  busy = ref(false);
const history = ref<OperationResponse<"codeRuleHistory">["data"]["list"]>([]);
const selectedRevision = ref<number>();
const selectedSnapshot = computed(() =>
  history.value.find(item => item.revision === selectedRevision.value)
);
let pending: AbortController | undefined;
async function load(kind: "preview" | "history") {
  pending?.abort();
  const request = (pending = new AbortController());
  busy.value = true;
  error.value = "";
  try {
    if (kind === "preview") {
      const res = props.draft
        ? await api.codeRuleValidate(
            {
              body: {
                data: {
                  timezone: String(props.draft.timezone ?? ""),
                  resetPeriod: String(props.draft.resetPeriod ?? ""),
                  start: String(props.draft.start ?? ""),
                  segments: (Array.isArray(props.draft.segments)
                    ? props.draft.segments
                    : []) as OperationBody<"codeRuleValidate">["data"]["segments"]
                }
              }
            },
            { signal: request.signal }
          )
        : await api.codeRulePreview(
            { body: { ruleId: props.ruleId! } },
            { signal: request.signal }
          );
      if (!request.signal.aborted) {
        codes.value = res.data.codes;
        previewPeriod.value = res.data.periodKey;
      }
    } else {
      const res = await api.codeRuleHistory(
        { body: { ruleId: props.ruleId! } },
        { signal: request.signal }
      );
      if (!request.signal.aborted) {
        history.value = res.data.list;
        selectedRevision.value = history.value[0]?.revision;
      }
    }
  } catch (reason) {
    if (!request.signal.aborted) error.value = ruleError(reason);
  } finally {
    if (!request.signal.aborted) busy.value = false;
  }
}
const snapshotFields = [
  "code",
  "name",
  "description",
  "timezone",
  "resetPeriod",
  "start",
  "status",
  "segments"
] as const;
const visibleSnapshotFields = computed(() =>
  snapshotFields.filter(field =>
    Object.hasOwn(selectedSnapshot.value?.snapshot ?? {}, field)
  )
);
function periodText(value: unknown) {
  return ["never", "year", "month", "day"].includes(String(value))
    ? t("codeRules.period." + value)
    : (value ?? "—");
}
function snapshotValue(field: (typeof snapshotFields)[number]) {
  const value = selectedSnapshot.value?.snapshot[field];
  if (Array.isArray(value))
    return value
      .map(s =>
        s.type === "literal"
          ? s.value
          : s.type === "date"
            ? s.format
            : s.type === "timestamp"
              ? t(
                  s.unit === "seconds"
                    ? "codeRules.seconds"
                    : "codeRules.milliseconds"
                )
              : "#".repeat(Number(s.width))
      )
      .join("");
  if (field === "status" && (value === "enabled" || value === "disabled"))
    return t(value === "enabled" ? "codeRules.enabled" : "codeRules.disabled");
  if (field === "resetPeriod") return periodText(value);
  return value ?? "—";
}
watch(
  () => props.ruleId,
  () => {
    pending?.abort();
    history.value = [];
    codes.value = [];
    previewPeriod.value = "";
    selectedRevision.value = undefined;
    if (props.historyOnly && props.ruleId) void load("history");
  },
  { immediate: true }
);
onBeforeUnmount(() => pending?.abort());
defineExpose({ preview: () => load("preview"), busy });
watch(
  () => props.draft,
  () => {
    pending?.abort();
    codes.value = [];
    previewPeriod.value = "";
    error.value = "";
    busy.value = false;
  },
  { deep: true }
);
</script>
<template>
  <section class="rule-tools" :class="{ 'is-draft': draft }">
    <h3 v-if="historyOnly">{{ t("codeRules.history") }}</h3>
    <el-alert
      v-if="!historyOnly"
      :title="
        t(draft ? 'codeRules.configPreviewHint' : 'codeRules.previewHint')
      "
      type="info"
      :closable="false"
    />
    <div v-if="showActions && !historyOnly">
      <el-button
        v-perm="permission('codeRulePreview')"
        :loading="busy"
        @click="load('preview')"
        >{{
          t(draft ? "codeRules.configPreview" : "codeRules.preview")
        }}</el-button
      >
    </div>
    <el-alert v-if="error" :title="t(error)" type="error" :closable="false" />
    <p v-if="codes.length">
      {{ t("codeRules.previewPeriod") }}：{{
        previewPeriod === "all" ? t("codeRules.period.never") : previewPeriod
      }}
    </p>
    <el-space v-if="codes.length" wrap
      ><el-tag v-for="code in codes" :key="code" size="large">{{
        code
      }}</el-tag></el-space
    >
    <el-timeline v-if="history.length">
      <el-timeline-item
        v-for="item in history"
        :key="item.revision"
        :timestamp="formatValue(item.createdAt, 'datetime')"
      >
        <el-button link type="primary" @click="selectedRevision = item.revision"
          >v{{ item.revision }} · {{ item.snapshot.name }}</el-button
        >
        <p>
          {{ item.snapshot.timezone }} ·
          {{ periodText(item.snapshot.resetPeriod) }} ·
          {{ t("codeRules.start") }} {{ item.snapshot.start }}
        </p>
        <p>
          {{
            Array.isArray(item.snapshot.segments)
              ? item.snapshot.segments
                  .map(s =>
                    s.type === "literal"
                      ? s.value
                      : s.type === "date"
                        ? s.format
                        : s.type === "timestamp"
                          ? t(
                              s.unit === "seconds"
                                ? "codeRules.seconds"
                                : "codeRules.milliseconds"
                            )
                          : "#".repeat(Number(s.width))
                  )
                  .join("")
              : "—"
          }}
        </p>
      </el-timeline-item>
    </el-timeline>
    <el-button v-if="historyOnly" :loading="busy" @click="load('history')">{{
      t("crud.reload")
    }}</el-button>
    <template v-if="historyOnly && selectedSnapshot">
      <el-tag
        >v{{ selectedSnapshot.revision }} ·
        {{ t("codeRules.snapshotReadonly") }}</el-tag
      >
      <el-descriptions :column="1" border>
        <el-descriptions-item
          v-for="field in visibleSnapshotFields"
          :key="field"
          :label="t('codeRules.snapshot.' + field)"
        >
          {{ snapshotValue(field) }}
        </el-descriptions-item>
      </el-descriptions>
    </template>
  </section>
</template>
<style scoped>
.rule-tools {
  display: grid;
  gap: 16px;
  width: 100%;
  min-width: 0;
  margin-top: 20px;
}

.rule-tools.is-draft {
  margin-top: 0;
}

.rule-tools :deep(.el-timeline) {
  max-height: 280px;
  padding-left: 16px;
  overflow-y: auto;
}

.rule-tools p {
  margin: 6px 0;
}
</style>
