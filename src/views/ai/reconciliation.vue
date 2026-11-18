<script setup lang="ts">
import { ref, reactive, onMounted, onBeforeUnmount } from "vue";
import { useI18n } from "vue-i18n";
import { ElMessageBox } from "element-plus";
import { api } from "@/api/client";
import type { components } from "@/api/schema";
import { generatedCrud } from "@/platform/generated-crud";
import { permission } from "@/platform/system/resources";
import { onSessionReset } from "@/platform/lifecycle";
import CrudPage from "@/components/Crud/CrudPage.vue";
import { useRequestScope } from "../workflow/model";
const { t } = useI18n(),
  { busy, error, run, reset } = useRequestScope();
type Item = components["schemas"]["AiUncertainItem"];
type Save = components["schemas"]["AiReconcileBody"];
const rows = ref<Item[]>([]),
  open = ref(false),
  list = ref<InstanceType<typeof CrudPage>>();
const form = reactive<Save>({
  id: "",
  version: 1,
  charged: false,
  inputTokens: 0,
  outputTokens: 0,
  evidence: ""
});
const generated = generatedCrud("aiReconciliation");
async function load() {
  await run(async signal => {
    const result = await api.aiUncertainTasks({}, { signal });
    if (!signal.aborted) rows.value = result.data.list;
  });
}
function edit(row: Record<string, unknown>) {
  Object.assign(form, {
    id: String(row.id),
    version: Number(row.version),
    charged: false,
    inputTokens: 0,
    outputTokens: 0,
    evidence: ""
  });
  open.value = true;
}
async function save() {
  await ElMessageBox.confirm(
    t("aiCapability.reconcileConfirm"),
    t("aiCapability.reconciliation"),
    { type: "warning" }
  )
    .catch(() => false)
    .then(async confirmed => {
      if (!confirmed) return;
      const saved = await run(async (signal, key) => {
        const body = { ...form };
        if (!body.charged) {
          body.inputTokens = 0;
          body.outputTokens = 0;
        }
        await api.aiReconcile(
          { body },
          { signal, headers: { "Idempotency-Key": key(body) } }
        );
        if (!signal.aborted) {
          open.value = false;
          return true;
        }
      });
      if (saved) {
        await load();
        await list.value?.refresh();
      }
    });
}
const stop = onSessionReset(() => {
  reset();
  rows.value = [];
  open.value = false;
  form.evidence = "";
});
onBeforeUnmount(stop);
onMounted(load);
</script>
<template>
  <div>
    <el-alert v-if="error" :title="error" type="error" :closable="false" />
    <el-card class="mb-4" :header="t('aiCapability.uncertainTasks')"
      ><el-button :disabled="busy" @click="load">{{
        t("aiCapability.refresh")
      }}</el-button>
      <el-table :data="rows"
        ><el-table-column
          prop="id"
          :label="t('aiCapability.taskId')"
        /><el-table-column
          prop="model"
          :label="t('aiCapability.model')"
        /><el-table-column
          prop="reservedTokens"
          :label="t('aiCapability.reserved')"
        /><el-table-column
          ><template #default="{ row }"
            ><el-button
              v-perm="permission('aiReconcile')"
              link
              @click="edit(row)"
              >{{ t("aiCapability.reconciliation") }}</el-button
            ></template
          ></el-table-column
        ></el-table
      >
    </el-card>
    <CrudPage ref="list" :port="generated.port" page-key="ai:reconciliation" />
    <el-dialog
      v-model="open"
      :title="t('aiCapability.reconciliation')"
      width="min(600px,96vw)"
    >
      <el-form label-position="top" @submit.prevent="save"
        ><el-form-item
          ><el-checkbox v-model="form.charged">{{
            t("aiCapability.charged")
          }}</el-checkbox></el-form-item
        >
        <template v-if="form.charged"
          ><el-form-item :label="t('aiCapability.inputTokens')"
            ><el-input-number
              v-model="form.inputTokens"
              :min="0"
              :max="10000000" /></el-form-item
          ><el-form-item :label="t('aiCapability.outputTokens')"
            ><el-input-number
              v-model="form.outputTokens"
              :min="0"
              :max="10000000" /></el-form-item
        ></template>
        <el-form-item :label="t('aiCapability.evidence')"
          ><el-input
            v-model="form.evidence"
            maxlength="200"
            type="textarea" /></el-form-item
        ><el-button
          type="primary"
          native-type="submit"
          :loading="busy"
          :disabled="form.evidence.trim().length < 5"
          >{{ t("aiCapability.save") }}</el-button
        ></el-form
      >
    </el-dialog>
  </div>
</template>
