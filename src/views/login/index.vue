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
/** 记住账号：只在本机保存账号，不保存密码（密码交给浏览器自带的密码管理） */
const REMEMBER_KEY = "jna-remember-account";
function readRemembered() {
  try {
    return localStorage.getItem(REMEMBER_KEY) ?? "";
  } catch {
    return "";
  }
}
function writeRemembered(value: string) {
  try {
    if (value) localStorage.setItem(REMEMBER_KEY, value);
    else localStorage.removeItem(REMEMBER_KEY);
  } catch {
    // 浏览器禁用本地存储时忽略
  }
}
const { t, locale } = useI18n();
const router = useRouter();
const account = ref(readRemembered());
const remember = ref(!!account.value);
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
// 重新输入验证码时清掉上一次的错误提示
watch(proof, value => {
  if (!value) return;
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
  let keepPassword = false;
  try {
    await useUserStoreHook().loginByUsername({
      account: account.value.trim(),
      password: password.value,
      captchaId: captchaId.value,
      captchaCode: proof.value
    });
    writeRemembered(remember.value ? account.value.trim() : "");
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
    // 只是验证码错了：保留密码，只重新输入验证码
    const data: { errors?: unknown } | null =
      reason instanceof RequestFailure ? reason.failure.data : null;
    const errors = Array.isArray(data?.errors)
      ? (data.errors as { field?: unknown }[])
      : [];
    keepPassword =
      errors.length > 0 && errors.every(item => item?.field === "captchaCode");
  } finally {
    busy.value = false;
    if (!keepPassword) password.value = "";
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
            <el-checkbox v-model="remember" class="login-remember">{{
              t("admin.rememberAccount")
            }}</el-checkbox>
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
@media screen and (height <= 600px) {
  .login-container {
    min-height: 600px;
  }
}

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

/* 记住账号：靠左，和上下输入框的间距保持一致 */
.login-remember {
  justify-self: start;
  height: auto;
  margin-top: -8px;
}

.login-error {
  color: var(--el-color-danger);
  text-align: left;
}
</style>
