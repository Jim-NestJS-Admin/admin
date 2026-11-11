<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from "vue";
import { useI18n } from "vue-i18n";
import { gatewayReady, getAdminGateway } from "@/platform/gateway";
import KeyholeIcon from "~icons/ri/shield-keyhole-fill";
import RefreshIcon from "~icons/ri/refresh-line";
import LoadingIcon from "~icons/ri/loader-4-line";
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
  <!-- 和 Pure / cool 一样：验证码图片放在输入框右侧，点图片换一张 -->
  <el-input
    v-model="code"
    class="captcha-input"
    :aria-label="t('admin.captcha')"
    :placeholder="t('admin.captcha')"
    :prefix-icon="KeyholeIcon"
    size="large"
    maxlength="6"
    autocomplete="off"
    @input="emit('proof', code)"
  >
    <template #append>
      <button
        type="button"
        class="captcha-image"
        :aria-label="t('admin.refreshCaptcha')"
        :title="
          t(account ? 'admin.refreshCaptcha' : 'admin.captchaAfterAccount')
        "
        :disabled="!account || loading"
        @click="reload"
      >
        <img v-if="image" :src="image" :alt="t('admin.captcha')" />
        <LoadingIcon v-else-if="loading" class="captcha-icon is-loading" />
        <RefreshIcon v-else class="captcha-icon" />
      </button>
    </template>
  </el-input>
  <p v-if="failed" class="captcha-error" role="alert">
    {{ t("admin.verificationUnavailable") }}
  </p>
</template>
<style scoped lang="scss">
.captcha-input :deep(.el-input-group__append) {
  padding: 0;
  overflow: hidden;
  background: var(--el-fill-color-blank);
}

.captcha-image {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 118px;
  height: 38px;
  padding: 0;

  /* 留出输入框外框（内阴影画的 1px 边线），图片不压住边框 */
  margin: 1px 1px 1px 0;
  cursor: pointer;
  background: transparent;
  border: none;

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  &:disabled {
    cursor: default;
  }
}

.captcha-icon {
  width: 18px;
  height: 18px;
  color: var(--el-text-color-placeholder);
}

.captcha-icon.is-loading {
  animation: captcha-spin 1s linear infinite;
}

@keyframes captcha-spin {
  to {
    transform: rotate(360deg);
  }
}

.captcha-error {
  margin: -14px 0 0;
  font-size: var(--el-font-size-small);
  color: var(--el-color-danger);
  text-align: left;
}
</style>
