<script setup lang="ts">
import { onBeforeUnmount, onMounted, reactive, ref } from "vue";
import { useI18n } from "vue-i18n";
import type { components } from "@/api/schema";
import { api } from "@/api/client";
import { generatedCrud } from "@/platform/generated-crud";
import { permission } from "@/platform/system/resources";
import { onSessionReset } from "@/platform/lifecycle";
import CrudPage from "@/components/Crud/CrudPage.vue";
import type { CrudRecord } from "@/components/Crud/types";
import { useRequestScope } from "../workflow/model";
const { t } = useI18n(),
  { busy, error, run, reset } = useRequestScope();
type Submit = components["schemas"]["AiSubmitBody"];
type Result = components["schemas"]["AiTaskResult"];
const defaults = (): Submit => ({
  feature: "generate",
  text: "",
  instruction: "",
  language: ""
});
const form = reactive<Submit>(defaults()),
  result = ref<Result>(),
  open = ref(false),
  taskId = ref("");
const usage = ref<components["schemas"]["AiUsageResult"]>(),
  list = ref<InstanceType<typeof CrudPage>>();
const generated = generatedCrud("aiTask");
const batch = ref(false),
  batchIds = ref<string[]>([]);
let timer: ReturnType<typeof setTimeout> | undefined;
let polls = 0;
function clear() {
  if (timer) clearTimeout(timer);
  timer = undefined;
  reset();
  taskId.value = "";
  result.value = undefined;
  Object.assign(form, defaults());
  polls = 0;
  batchIds.value = [];
  batch.value = false;
}
async function loadUsage() {
  await run(async signal => {
    const response = await api.aiUsage({}, { signal });
    if (!signal.aborted) usage.value = response.data;
  });
}
async function refreshResult(id: string) {
  if (timer) clearTimeout(timer);
  timer = undefined;
  await run(async signal => {
    await api.aiTaskEvents(
      { query: { id } },
      {
        signal,
        responseMode: "raw",
        responseType: "text",
        timeout: 310000,
        onDownloadProgress: event => {
          const raw = event.event?.target?.responseText;
          if (
            typeof raw !== "string" ||
            signal.aborted ||
            taskId.value !== id ||
            !open.value
          )
            return;
          const records = raw
            .split("\n\n")
            .filter((line: string) => line.startsWith("data: "));
          const latest = records.at(-1);
          if (latest)
            try {
              result.value = JSON.parse(latest.slice(6)) as Result;
            } catch {
              /* 等待完整事件 */
            }
        }
      }
    );
    const response = await api.aiTaskResult({ body: { id } }, { signal });
    if (signal.aborted || taskId.value !== id || !open.value) return;
    result.value = response.data;
    if (["queued", "running"].includes(response.data.status) && ++polls < 200)
      timer = setTimeout(() => void refreshResult(id), 1500);
    else {
      await list.value?.refresh();
    }
  });
}
function create() {
  clear();
  open.value = true;
}
async function view(row: CrudRecord) {
  clear();
  taskId.value = String(row.id);
  open.value = true;
  await refreshResult(taskId.value);
}
async function submit() {
  const receipt = await run(async (signal, key) => {
    const body = { ...form };
    if (!body.language) delete body.language;
    if (batch.value) {
      const items = body.text
        .split(/\n\s*\n/)
        .map(text => ({ ...body, text: text.trim() }))
        .filter(item => item.text);
      if (items.length > 20) throw new Error(t("aiCapability.batchLimit"));
      const response = await api.aiTaskBatch(
        { body: { items } },
        { signal, headers: { "Idempotency-Key": key(items) } }
      );
      if (signal.aborted) return;
      batchIds.value = response.data.ids;
      return { id: response.data.ids[0] };
    }
    const response = await api.aiTaskSubmit(
      { body },
      { signal, headers: { "Idempotency-Key": key(body) } }
    );
    if (signal.aborted) return;
    return response.data;
  });
  if (receipt && open.value) {
    taskId.value = receipt.id;
    Object.assign(form, defaults());
    await refreshResult(receipt.id);
  }
}
const stop = onSessionReset(() => {
  open.value = false;
  usage.value = undefined;
  clear();
});
onBeforeUnmount(() => {
  stop();
  clear();
});
onMounted(loadUsage);
</script>
<template>
  <div>
    <el-alert
      v-if="usage"
      :title="
        t('aiCapability.usage', {
          month: usage.month,
          used: usage.usedTokens,
          reserved: usage.reservedTokens,
          limit: usage.limit ?? t('aiCapability.unlimited')
        })
      "
      type="info"
      :closable="false"
      class="mb-3"
    />
    <el-alert
      v-if="error && !open"
      :title="error"
      type="error"
      :closable="false"
    />
    <CrudPage ref="list" :port="generated.port" page-key="ai:task">
      <template #toolbar
        ><el-button
          v-perm="permission('aiTaskSubmit')"
          type="primary"
          @click="create"
          >{{ t("aiCapability.newTask") }}</el-button
        ><el-button :disabled="busy" @click="loadUsage">{{
          t("aiCapability.refreshUsage")
        }}</el-button></template
      >
      <template #row-actions="{ row }"
        ><el-button
          v-perm="permission('aiTaskResult')"
          link
          type="primary"
          :disabled="busy"
          @click="view(row)"
          >{{ t("aiCapability.viewResult") }}</el-button
        ></template
      >
    </CrudPage>
    <el-dialog
      v-model="open"
      :title="t('aiCapability.draft')"
      width="min(900px,96vw)"
      :close-on-click-modal="false"
      @closed="clear"
    >
      <el-alert
        :title="t('aiCapability.draftNotice')"
        type="warning"
        :closable="false"
        class="mb-4"
      />
      <el-alert v-if="error" :title="error" type="error" :closable="false" />
      <el-checkbox v-if="!taskId" v-model="batch">{{
        t("aiCapability.batch")
      }}</el-checkbox>
      <el-form v-if="!taskId" label-position="top" @submit.prevent="submit">
        <el-form-item :label="t('aiCapability.feature')"
          ><el-select v-model="form.feature" :disabled="busy"
            ><el-option
              v-for="code in ['generate', 'rewrite', 'translate']"
              :key="code"
              :value="code"
              :label="t(`aiCapability.${code}`)" /></el-select
        ></el-form-item>
        <el-form-item
          v-if="form.feature === 'translate'"
          :label="t('aiCapability.language')"
          ><el-input v-model="form.language" maxlength="100" :disabled="busy"
        /></el-form-item>
        <el-form-item :label="t('aiCapability.source')"
          ><el-input
            v-model="form.text"
            type="textarea"
            :rows="8"
            maxlength="16000"
            show-word-limit
            :disabled="busy"
        /></el-form-item>
        <el-form-item :label="t('aiCapability.instruction')"
          ><el-input
            v-model="form.instruction"
            type="textarea"
            :rows="3"
            maxlength="2000"
            :disabled="busy"
        /></el-form-item>
        <el-button
          v-perm="permission('aiTaskSubmit')"
          native-type="submit"
          type="primary"
          :loading="busy"
          :disabled="
            !form.text.trim() ||
            (form.feature === 'translate' && !form.language?.trim())
          "
          >{{ t("aiCapability.submit") }}</el-button
        >
      </el-form>
      <template v-else>
        <el-button
          v-for="id in batchIds"
          :key="id"
          :disabled="busy"
          @click="
            taskId = id;
            refreshResult(id);
          "
          >{{ id }}</el-button
        >
        <p role="status" class="mb-3">
          {{
            t("aiCapability.taskState", {
              id: taskId,
              status: result
                ? t(`aiCapability.${result.status}`)
                : t("aiCapability.loading")
            })
          }}
        </p>
        <el-alert
          v-if="result?.error"
          :title="result.error"
          type="warning"
          :closable="false"
          class="mb-3"
        />
        <el-input
          v-if="result?.text"
          :model-value="result.text"
          type="textarea"
          :rows="16"
          readonly
          :aria-label="t('aiCapability.draft')"
        />
        <el-button
          :disabled="busy"
          class="mt-3"
          @click="refreshResult(taskId)"
          >{{ t("aiCapability.refresh") }}</el-button
        >
      </template>
    </el-dialog>
  </div>
</template>
