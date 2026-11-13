<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { api, type OperationResponse, type OperationBody } from "@/api/client";
import type { CrudRecord } from "@/components/Crud/types";
import { permission } from "@/platform/system/resources";
import { formatValue } from "@/components/Crud/model.mjs";
import { ruleError } from "./messages";
const props = defineProps<{ ruleId?: string; draft?: CrudRecord }>();
const { t } = useI18n();
const codes = ref<string[]>([]),
  error = ref(""),
  busy = ref(false);
const history = ref<OperationResponse<"codeRuleHistory">["data"]["list"]>([]);
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
      if (!request.signal.aborted) codes.value = res.data.codes;
    } else {
      const res = await api.codeRuleHistory(
        { body: { ruleId: props.ruleId! } },
        { signal: request.signal }
      );
      if (!request.signal.aborted) history.value = res.data.list;
    }
  } catch (reason) {
    if (!request.signal.aborted) error.value = ruleError(reason);
  } finally {
    if (!request.signal.aborted) busy.value = false;
  }
}
onBeforeUnmount(() => pending?.abort());
watch(
  () => props.draft,
  () => {
    pending?.abort();
    codes.value = [];
    error.value = "";
    busy.value = false;
  },
  { deep: true }
);
</script>
<template>
  <section class="rule-tools">
    <el-alert
      :title="
        t(draft ? 'codeRules.configPreviewHint' : 'codeRules.previewHint')
      "
      type="info"
      :closable="false"
    />
    <div>
      <el-button
        v-perm="permission('codeRulePreview')"
        :loading="busy"
        @click="load('preview')"
        >{{
          t(draft ? "codeRules.configPreview" : "codeRules.preview")
        }}</el-button
      >
      <el-button
        v-if="ruleId"
        v-perm="permission('codeRuleHistory')"
        :disabled="busy"
        @click="load('history')"
        >{{ t("codeRules.history") }}</el-button
      >
    </div>
    <el-alert v-if="error" :title="t(error)" type="error" :closable="false" />
    <el-space wrap
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
        <strong>v{{ item.revision }} · {{ item.snapshot.name }}</strong>
        <p>
          {{ item.snapshot.timezone }} · {{ item.snapshot.resetPeriod }} ·
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
                        : "#".repeat(Number(s.width))
                  )
                  .join("")
              : "—"
          }}
        </p>
      </el-timeline-item>
    </el-timeline>
  </section>
</template>
<style scoped>
.rule-tools {
  display: grid;
  gap: 16px;
  margin-top: 20px;
}

.rule-tools p {
  margin: 6px 0;
}
</style>
