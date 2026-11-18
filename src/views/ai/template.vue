<script setup lang="ts">
import { onBeforeUnmount, reactive, ref } from "vue";
import { useI18n } from "vue-i18n";
import type { components } from "@/api/schema";
import { api } from "@/api/client";
import { generatedCrud } from "@/platform/generated-crud";
import { permission } from "@/platform/system/resources";
import { onSessionReset } from "@/platform/lifecycle";
import CrudPage from "@/components/Crud/CrudPage.vue";
import { useRequestScope } from "../workflow/model";
const { t } = useI18n(),
  { busy, error, run, reset } = useRequestScope();
type Choice = components["schemas"]["AiTemplateChoice"];
type Save = components["schemas"]["AiTemplateSaveBody"];
const generated = generatedCrud("aiTemplate"),
  list = ref<InstanceType<typeof CrudPage>>();
const open = ref(false),
  choices = ref<Choice[]>([]),
  form = reactive<Save>({ code: "generate", content: "", revision: 0 });
function choose() {
  const item = choices.value.find(item => item.code === form.code);
  form.content = item?.content ?? "";
  form.revision = item?.tenantRevision ?? 0;
}
async function edit() {
  await run(async signal => {
    const result = await api.aiTemplatesAvailable({}, { signal });
    if (signal.aborted) return;
    choices.value = result.data.list;
    choose();
    open.value = true;
  });
}
async function save() {
  await run(async (signal, key) => {
    const body = { ...form };
    await api.aiTemplateSave(
      { body },
      { signal, headers: { "Idempotency-Key": key(body) } }
    );
    if (signal.aborted) return;
    open.value = false;
    await list.value?.refresh();
  });
}
function clear() {
  reset();
  open.value = false;
  choices.value = [];
  form.content = "";
  form.revision = 0;
}
const stop = onSessionReset(clear);
onBeforeUnmount(stop);
</script>
<template>
  <div>
    <el-alert
      v-if="error && !open"
      :title="error"
      type="error"
      :closable="false"
    />
    <CrudPage ref="list" :port="generated.port" page-key="ai:template">
      <template #toolbar
        ><el-button
          v-perm="permission('aiTemplateSave')"
          type="primary"
          :disabled="busy"
          @click="edit"
          >{{ t("aiCapability.newRevision") }}</el-button
        ></template
      >
    </CrudPage>
    <el-dialog
      v-model="open"
      :title="t('aiCapability.templates')"
      width="min(800px,96vw)"
      :close-on-click-modal="false"
      @closed="clear"
    >
      <el-alert v-if="error" :title="error" type="error" :closable="false" />
      <el-alert
        :title="t('aiCapability.variables')"
        type="info"
        :closable="false"
        class="mb-4"
      />
      <el-form label-position="top" @submit.prevent="save">
        <el-form-item :label="t('aiCapability.feature')"
          ><el-select v-model="form.code" :disabled="busy" @change="choose"
            ><el-option
              v-for="code in ['generate', 'rewrite', 'translate']"
              :key="code"
              :value="code"
              :label="t(`aiCapability.${code}`)" /></el-select
        ></el-form-item>
        <el-form-item :label="t('aiCapability.prompt')"
          ><el-input
            v-model="form.content"
            type="textarea"
            :rows="12"
            maxlength="12000"
            show-word-limit
            :disabled="busy"
        /></el-form-item>
        <p class="mb-4">
          {{ t("aiCapability.currentRevision", { revision: form.revision }) }}
        </p>
        <el-button
          v-perm="permission('aiTemplateSave')"
          native-type="submit"
          type="primary"
          :loading="busy"
          >{{ t("aiCapability.newRevision") }}</el-button
        >
      </el-form>
    </el-dialog>
  </div>
</template>
