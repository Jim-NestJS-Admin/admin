<script setup lang="ts">
import { onBeforeUnmount, reactive, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { api, type OperationBody } from "@/api/client";
import { useUserStoreHook } from "@/store/modules/user";
import { RequestFailure } from "@/utils/http";
import { failureView } from "@/platform/failure-view.mjs";
import { onSessionReset } from "@/platform/lifecycle";
const props = defineProps<{ modelValue: boolean }>();
const emit = defineEmits<{ "update:modelValue": [value: boolean] }>();
const { t } = useI18n(),
  router = useRouter();
const user = useUserStoreHook();
const form = reactive<OperationBody<"systemUserChangePassword">>({
  version: 0,
  oldPassword: "",
  password: ""
});
const error = ref(""),
  busy = ref(false),
  loading = ref(false);
let controller: AbortController | undefined;
function clear() {
  controller?.abort();
  form.version = 0;
  form.oldPassword = "";
  form.password = "";
  error.value = "";
}
watch(
  () => props.modelValue,
  async open => {
    clear();
    if (!open) return;
    controller = new AbortController();
    const request = controller;
    loading.value = true;
    try {
      const result = await api.systemUserMe({}, { signal: request.signal });
      if (!request.signal.aborted) form.version = result.data.version;
    } catch {
      if (!request.signal.aborted) error.value = t("admin.serviceUnavailable");
    } finally {
      if (!request.signal.aborted) loading.value = false;
    }
  }
);
const stop = onSessionReset(() => {
  clear();
  emit("update:modelValue", false);
});
onBeforeUnmount(() => {
  stop();
  clear();
});
async function save() {
  if (busy.value || !form.version || !form.oldPassword || !form.password)
    return;
  controller?.abort();
  controller = new AbortController();
  const request = controller;
  busy.value = true;
  error.value = "";
  try {
    await api.systemUserChangePassword(
      { body: { ...form } },
      {
        signal: request.signal,
        headers: { "Idempotency-Key": crypto.randomUUID() }
      }
    );
    if (request.signal.aborted) return;
    clear();
    emit("update:modelValue", false);
    await user.logOut();
    await router.replace("/login");
  } catch (reason) {
    if (!request.signal.aborted) {
      const view = failureView(
        reason instanceof RequestFailure ? reason.failure : null
      );
      error.value = view.message.startsWith("admin.")
        ? t(view.message)
        : view.message;
    }
  } finally {
    busy.value = false;
  }
}
</script>
<template>
  <el-dialog
    :model-value="modelValue"
    :title="t('system.changePassword')"
    width="min(460px, 94vw)"
    :close-on-click-modal="!busy"
    :close-on-press-escape="!busy"
    :show-close="!busy"
    @close="emit('update:modelValue', false)"
  >
    <el-alert v-if="error" :title="error" type="error" :closable="false" />
    <el-form label-position="top" @submit.prevent="save">
      <el-form-item :label="t('system.oldPassword')" required
        ><el-input
          v-model="form.oldPassword"
          type="password"
          autocomplete="current-password"
          show-password
          :disabled="busy || loading"
      /></el-form-item>
      <el-form-item :label="t('system.newPassword')" required
        ><el-input
          v-model="form.password"
          type="password"
          autocomplete="new-password"
          show-password
          :disabled="busy || loading"
      /></el-form-item>
    </el-form>
    <template #footer
      ><el-button :disabled="busy" @click="emit('update:modelValue', false)">{{
        t("crud.cancel")
      }}</el-button
      ><el-button
        type="primary"
        :loading="busy || loading"
        :disabled="!form.version || !form.password || !form.oldPassword"
        @click="save"
        >{{ t("crud.save") }}</el-button
      ></template
    >
  </el-dialog>
</template>
