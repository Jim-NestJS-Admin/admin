<script setup lang="ts">
import "altcha";
import "altcha/i18n";
import { ref, watch, onBeforeUnmount } from "vue";
import { useI18n } from "vue-i18n";
import { gatewayReady, getAdminGateway } from "@/platform/gateway";
const props = defineProps<{ account: string; language: string }>();
const emit = defineEmits<{ proof: [value: string] }>();
const { t } = useI18n();
const challenge = ref("");
const failed = ref(false);
let controller: AbortController | undefined;
let generation = 0;
watch(
  () => [props.account, props.language],
  async () => {
    const current = ++generation;
    controller?.abort();
    controller = new AbortController();
    emit("proof", "");
    challenge.value = "";
    failed.value = false;
    if (!gatewayReady() || !props.account) return;
    try {
      const value = await getAdminGateway().challenge(
        props.account,
        props.language,
        controller.signal
      );
      if (current === generation) challenge.value = JSON.stringify(value);
    } catch {
      if (current === generation) failed.value = true;
    }
  },
  { immediate: true }
);
onBeforeUnmount(() => {
  generation++;
  controller?.abort();
});
function stateChanged(event: CustomEvent<{ state: string; payload?: string }>) {
  emit(
    "proof",
    event.detail.state === "verified" ? (event.detail.payload ?? "") : ""
  );
}
</script>
<template>
  <altcha-widget
    v-if="challenge"
    :key="challenge"
    :challenge="challenge"
    :language="language === 'zh' ? 'zh-cn' : 'en'"
    @statechange="stateChanged"
  />
  <p v-else-if="failed" role="alert">
    {{ t("admin.verificationUnavailable") }}
  </p>
</template>
