<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { api, type OperationResponse, type OperationBody } from "@/api/client";
import type { CrudRecord } from "@/components/Crud/types";
import { permission } from "@/platform/system/resources";
import { formatValue } from "@/components/Crud/model.mjs";
import type { RuleHistoryEntry } from "./rule-history";
import { validateRuleDraft } from "./validate-rule";
import { ruleError } from "./messages";
const props = withDefaults(
  defineProps<{
    ruleId?: string;
    draft?: CrudRecord;
    showActions?: boolean;
    historyOnly?: boolean;
    activeRevision?: number;
  }>(),
  { showActions: true }
);
const emit = defineEmits<{ select: [entry: RuleHistoryEntry] }>();
const { t } = useI18n();
const previewPeriod = ref("");
const codes = ref<string[]>([]),
  error = ref(""),
  busy = ref(false);
const history = ref<OperationResponse<"codeRuleHistory">["data"]["list"]>([]);
let pending: AbortController | undefined;
async function load(kind: "preview" | "history") {
  pending?.abort();
  if (kind === "preview" && props.draft) {
    const issues = validateRuleDraft(props.draft, (key, params) =>
      t(key, params ?? {})
    );
    if (Object.keys(issues).length) {
      error.value = Object.values(issues)[0][0];
      codes.value = [];
      previewPeriod.value = "";
      busy.value = false;
      return;
    }
  }
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
      }
    }
  } catch (reason) {
    if (!request.signal.aborted) error.value = ruleError(reason);
  } finally {
    if (!request.signal.aborted) busy.value = false;
  }
}
watch(
  () => props.ruleId,
  () => {
    pending?.abort();
    history.value = [];
    codes.value = [];
    previewPeriod.value = "";

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
        <el-button
          link
          type="primary"
          :aria-pressed="activeRevision === item.revision"
          :class="{ 'is-selected': activeRevision === item.revision }"
          @click="emit('select', item)"
          >v{{ item.revision }} · {{ item.snapshot.name }}</el-button
        >
      </el-timeline-item>
    </el-timeline>
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

.rule-tools.is-draft,
.rule-tools:has(h3) {
  margin-top: 0;
}

.rule-tools :deep(.el-timeline) {
  max-height: 60vh;
  padding-left: 16px;
  overflow-y: auto;
}

.rule-tools .is-selected {
  font-weight: 600;
  text-decoration: underline;
}

.rule-tools p {
  margin: 6px 0;
}
</style>
