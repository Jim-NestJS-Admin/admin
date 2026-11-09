<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { gatewayReady } from "@/platform/gateway";
import { useUserStoreHook } from "@/store/modules/user";
import Verification from "./verification.vue";
import { RequestFailure } from "@/utils/http";
import { failureView } from "@/platform/failure-view.mjs";
import bg from "@/assets/login/bg.png";
import Avatar from "@/assets/login/avatar.svg?component";
import Illustration from "@/assets/login/illustration.svg?component";
import User from "~icons/ri/user-3-fill";
import Lock from "~icons/ri/lock-fill";
import { getConfig } from "@/config";
const TITLE = getConfig("Title");
const { t, locale } = useI18n();
const router = useRouter();
const account = ref("");
const password = ref("");
const proof = ref("");
const captchaId = ref("");
const revision = ref(0);
const busy = ref(false);
const error = ref("");
const fields = ref<string[]>([]);
const retry = ref(0);
const timer = setInterval(() => {
  if (retry.value > 0) retry.value--;
}, 1000);
onBeforeUnmount(() => clearInterval(timer));
watch([account, locale], () => {
  proof.value = "";
  captchaId.value = "";
  revision.value++;
  error.value = "";
  fields.value = [];
});
async function signIn() {
  if (busy.value || retry.value > 0) return;
  error.value = "";
  fields.value = [];
  if (!gatewayReady()) {
    error.value = t("admin.serviceUnavailable");
    return;
  }
  if (
    !account.value.trim() ||
    !password.value ||
    !proof.value ||
    !captchaId.value
  ) {
    error.value = t("admin.verificationRequired");
    return;
  }
  busy.value = true;
  try {
    await useUserStoreHook().loginByUsername({
      account: account.value.trim(),
      password: password.value,
      captchaId: captchaId.value,
      captchaCode: proof.value
    });
    await router.replace("/welcome");
  } catch (reason) {
    const view = failureView(
      reason instanceof RequestFailure ? reason.failure : null
    );
    error.value = view.message.startsWith("admin.")
      ? t(view.message)
      : view.message;
    fields.value = view.fields;
    retry.value = view.retrySeconds;
  } finally {
    busy.value = false;
    password.value = "";
    proof.value = "";
    captchaId.value = "";
    revision.value++;
  }
}
</script>
<template>
  <main class="pure-login">
    <img :src="bg" class="wave" alt="" aria-hidden="true" />
    <div class="login-language">
      <el-select v-model="locale" aria-label="Language" size="small">
        <el-option label="简体中文" value="zh" />
        <el-option label="English" value="en" />
      </el-select>
    </div>
    <div class="login-container">
      <div class="img" aria-hidden="true">
        <Illustration class="login-illustration" />
      </div>
      <section class="login-box" aria-labelledby="login-title">
        <div class="login-form">
          <Avatar class="avatar" aria-hidden="true" />
          <h2 id="login-title">{{ TITLE }}</h2>
          <el-alert
            v-if="!gatewayReady()"
            :title="t('admin.serviceUnavailable')"
            type="info"
            :closable="false"
            show-icon
          />
          <form @submit.prevent="signIn">
            <el-input
              id="account"
              v-model="account"
              :aria-label="t('admin.account')"
              :placeholder="t('admin.account')"
              :prefix-icon="User"
              autocomplete="username"
              :disabled="busy"
              maxlength="64"
              size="large"
              clearable
            />
            <el-input
              id="password"
              v-model="password"
              :aria-label="t('admin.password')"
              :placeholder="t('admin.password')"
              :prefix-icon="Lock"
              type="password"
              autocomplete="current-password"
              show-password
              :disabled="busy"
              size="large"
            />
            <Verification
              :key="revision"
              :account="account.trim()"
              :language="locale"
              @proof="proof = $event"
              @challenge="captchaId = $event"
            />
            <div v-if="error" class="login-error" role="alert">
              <p>{{ error }}</p>
              <p v-for="(field, index) in fields" :key="index">{{ field }}</p>
            </div>
            <p v-if="retry > 0" role="status">
              {{ t("admin.retryAfter", { seconds: retry }) }}
            </p>
            <el-button
              class="login-submit"
              native-type="submit"
              type="primary"
              :loading="busy"
              :disabled="
                !gatewayReady() ||
                !proof ||
                !captchaId ||
                !account.trim() ||
                !password ||
                retry > 0
              "
              >{{ t("admin.signIn") }}</el-button
            >
          </form>
        </div>
      </section>
    </div>
  </main>
</template>

<style scoped>
@import url("@/style/login.css");
</style>

<style scoped lang="scss">
.pure-login {
  position: relative;
  min-height: 100dvh;
  background: var(--el-bg-color);
  isolation: isolate;
}

.login-language {
  position: absolute;
  top: 20px;
  right: 24px;
  width: 110px;
}

.login-illustration {
  width: min(100%, 500px);
  height: auto;
}

form {
  display: grid;
  gap: 22px;
}

.login-submit {
  width: 100%;
}

.login-error {
  color: var(--el-color-danger);
  text-align: left;
}

@media screen and (height <= 600px) {
  .login-container {
    min-height: 600px;
  }
}
</style>
