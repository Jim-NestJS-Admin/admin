<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from "vue";
import { useI18n } from "vue-i18n";
import { gatewayReady, getAdminGateway } from "@/platform/gateway";
const props = defineProps<{ account: string; language: string }>();
const emit = defineEmits<{ proof: [value: string]; challenge: [id: string] }>();
const { t } = useI18n();
const image = ref("");
const code = ref("");
const failed = ref(false);
const loading = ref(false);
let controller: AbortController | undefined;
let generation = 0;
let timer: ReturnType<typeof setTimeout> | undefined;
async function reload() {
  clearTimeout(timer);
  const current = ++generation;
  controller?.abort();
  controller = new AbortController();
  code.value = "";
  image.value = "";
  emit("proof", "");
  emit("challenge", "");
  failed.value = false;
  loading.value = false;
  if (!gatewayReady() || !props.account) return;
  loading.value = true;
  try {
    const value = await getAdminGateway().challenge(
      props.account,
      props.language,
      controller.signal
    );
    if (current !== generation) return;
    image.value = value.image;
    emit("challenge", value.id);
  } catch {
    if (current === generation) failed.value = true;
  } finally {
    if (current === generation) loading.value = false;
  }
}
watch(
  () => [props.account, props.language],
  () => {
    clearTimeout(timer);
    generation++;
    controller?.abort();
    image.value = "";
    code.value = "";
    emit("proof", "");
    emit("challenge", "");
    timer = setTimeout(reload, 250);
  },
  { immediate: true }
);
onBeforeUnmount(() => {
  clearTimeout(timer);
  generation++;
  controller?.abort();
});
</script>
<template>
  <div class="captcha-row">
    <el-input
      v-model="code"
      :aria-label="t('admin.captcha')"
      :placeholder="t('admin.captcha')"
      size="large"
      maxlength="6"
      autocomplete="off"
      :disabled="!image || loading"
      @input="emit('proof', code)"
    />
    <button
      type="button"
      class="captcha-image"
      :aria-label="t('admin.refreshCaptcha')"
      :title="t('admin.refreshCaptcha')"
      :disabled="!account || loading"
      @click="reload"
    >
      <img v-if="image" :src="image" :alt="t('admin.captcha')" />
      <span v-else class="captcha-hint">{{
        t(
          loading
            ? "admin.captchaLoading"
            : !account
              ? "admin.captchaAfterAccount"
              : "admin.refreshCaptcha"
        )
      }}</span>
    </button>
  </div>
  <p v-if="failed" class="captcha-error" role="alert">
    {{ t("admin.verificationUnavailable") }}
  </p>
</template>
<style scoped lang="scss">
.captcha-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 120px;
  gap: 12px;
}

.captcha-image {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  padding: 0;
  overflow: hidden;
  cursor: pointer;
  background: var(--el-fill-color-blank);
  border: 1px solid var(--el-border-color);
  border-radius: var(--el-border-radius-base);
  transition: border-color var(--el-transition-duration);

  &:hover:not(:disabled) {
    border-color: var(--el-color-primary);
  }

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  &:disabled {
    cursor: default;
    background: var(--el-fill-color-light);
  }
}

/* 还没有图片时的提示文字：和输入框占位文字同样大小、颜色，放不下时省略 */
.captcha-hint {
  padding: 0 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: var(--el-font-size-small);
  color: var(--el-text-color-placeholder);
  white-space: nowrap;
}

.captcha-error {
  color: var(--el-color-danger);
}
</style>
