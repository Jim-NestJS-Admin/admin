<script setup lang="ts">
import { onBeforeUnmount, onMounted, reactive, ref } from "vue";
import { useI18n } from "vue-i18n";
import type { components } from "@/api/schema";
import { api } from "@/api/client";
import { permission } from "@/platform/system/resources";
import { onSessionReset } from "@/platform/lifecycle";
import { useRequestScope } from "../workflow/model";
const { t } = useI18n();
type Save = components["schemas"]["AiConfigSaveBody"];
type State = components["schemas"]["AiConfigResult"];
const defaults = (): Save => ({
  enabled: false,
  model: "",
  maxOutputTokens: 2048,
  version: 0,
  apiKey: undefined,
  usePlatformKey: false
});
const form = reactive<Save>(defaults()),
  state = ref<State>();
const { busy, error, run, reset } = useRequestScope();
async function load() {
  await run(async signal => {
    const response = await api.aiConfigRead({}, { signal });
    if (signal.aborted) return;
    state.value = response.data;
    Object.assign(form, defaults(), {
      enabled: state.value.enabled,
      model: state.value.model,
      maxOutputTokens: state.value.maxOutputTokens,
      version: state.value.version
    });
  });
}
async function save() {
  const saved = await run(async (signal, key) => {
    const body = { ...form };
    if (!body.apiKey) delete body.apiKey;
    await api.aiConfigSave(
      { body },
      { signal, headers: { "Idempotency-Key": key(body) } }
    );
    form.apiKey = undefined;
    return true;
  });
  if (saved) await load();
}
const stop = onSessionReset(() => {
  reset();
  Object.assign(form, defaults());
  state.value = undefined;
});
onBeforeUnmount(stop);
onMounted(load);
</script>
<template>
  <el-card class="max-w-3xl" :header="t('aiCapability.config')">
    <el-alert v-if="error" :title="error" type="error" :closable="false" />
    <el-alert
      v-if="state && !state.encryptionReady"
      :title="t('aiCapability.encryptionMissing')"
      type="warning"
      :closable="false"
      class="mb-4"
    />
    <el-form label-position="top" @submit.prevent="save">
      <el-form-item :label="t('aiCapability.enabled')"
        ><el-switch v-model="form.enabled" :disabled="busy"
      /></el-form-item>
      <el-form-item :label="t('aiCapability.model')"
        ><el-input v-model="form.model" maxlength="150" :disabled="busy"
      /></el-form-item>
      <el-form-item :label="t('aiCapability.outputLimit')"
        ><el-input-number
          v-model="form.maxOutputTokens"
          :min="1"
          :max="8192"
          :disabled="busy"
      /></el-form-item>
      <el-form-item :label="t('aiCapability.apiKey')"
        ><el-input
          v-model="form.apiKey"
          type="password"
          show-password
          autocomplete="off"
          :placeholder="t('aiCapability.keyPlaceholder')"
          :disabled="busy || form.usePlatformKey"
      /></el-form-item>
      <p v-if="state" class="mb-4 text-sm">
        {{
          t("aiCapability.keyState", {
            tenant: t(
              state.hasTenantKey
                ? "aiCapability.configured"
                : "aiCapability.unconfigured"
            ),
            platform: t(
              state.hasPlatformKey
                ? "aiCapability.configured"
                : "aiCapability.unconfigured"
            )
          })
        }}
      </p>
      <el-form-item
        ><el-checkbox
          v-model="form.usePlatformKey"
          :disabled="busy"
          @change="form.apiKey = undefined"
          >{{ t("aiCapability.platformKey") }}</el-checkbox
        ></el-form-item
      >
      <el-button
        v-perm="permission('aiConfigSave')"
        type="primary"
        native-type="submit"
        :loading="busy"
        :disabled="!state?.encryptionReady"
        >{{ t("aiCapability.save") }}</el-button
      >
      <el-button :disabled="busy" @click="load">{{
        t("aiCapability.refresh")
      }}</el-button>
    </el-form>
  </el-card>
</template>
