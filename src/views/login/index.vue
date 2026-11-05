<script setup lang="ts">
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { gatewayReady } from "@/platform/gateway";
import { useUserStoreHook } from "@/store/modules/user";
import Verification from "./verification.vue";
const { t, locale } = useI18n();
const router = useRouter();
const account = ref("");
const password = ref("");
const proof = ref("");
const revision = ref(0);
const busy = ref(false);
const error = ref("");
watch([account, locale], () => {
  proof.value = "";
  revision.value++;
  error.value = "";
});
async function signIn() {
  error.value = "";
  if (!gatewayReady()) {
    error.value = t("admin.serviceUnavailable");
    return;
  }
  if (!account.value.trim() || !password.value || !proof.value) {
    error.value = t("admin.verificationRequired");
    return;
  }
  busy.value = true;
  try {
    await useUserStoreHook().loginByUsername({
      account: account.value.trim(),
      password: password.value,
      proof: proof.value
    });
    await router.replace("/welcome");
  } catch {
    error.value = t("admin.serviceUnavailable");
  } finally {
    busy.value = false;
    password.value = "";
    proof.value = "";
    revision.value++;
  }
}
</script>
<template>
  <main class="login-page">
    <section class="login-card" aria-labelledby="login-title">
      <div class="login-language">
        <el-select v-model="locale" aria-label="Language"
          ><el-option label="简体中文" value="zh" /><el-option
            label="English"
            value="en"
        /></el-select>
      </div>
      <h1 id="login-title">jim-nestjs-admin</h1>
      <p>{{ t("admin.title") }}</p>
      <el-alert
        v-if="!gatewayReady()"
        :title="t('admin.serviceUnavailable')"
        type="info"
        :closable="false"
        show-icon
      />
      <form @submit.prevent="signIn">
        <label for="account">{{ t("admin.account") }}</label>
        <el-input
          id="account"
          v-model="account"
          autocomplete="username"
          :disabled="busy"
          maxlength="128"
        />
        <label for="password">{{ t("admin.password") }}</label>
        <el-input
          id="password"
          v-model="password"
          type="password"
          autocomplete="current-password"
          show-password
          :disabled="busy"
        />
        <Verification
          :key="revision"
          :account="account.trim()"
          :language="locale"
          @proof="proof = $event"
        />
        <p v-if="error" role="alert">{{ error }}</p>
        <el-button
          native-type="submit"
          type="primary"
          :loading="busy"
          :disabled="!gatewayReady() || !proof || !account.trim() || !password"
          >{{ t("admin.signIn") }}</el-button
        >
      </form>
    </section>
  </main>
</template>
<style scoped lang="scss">
.login-page {
  display: grid;
  place-items: center;
  min-height: 100dvh;
  padding: 24px;
  background: var(--el-fill-color-light);
}

.login-card {
  width: min(100%, 420px);
  padding: 28px;
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color-light);
  border-radius: 12px;
}

.login-language {
  width: 130px;
  margin-left: auto;
}

h1 {
  margin-top: 28px;
  font-size: 24px;
  font-weight: 600;
  overflow-wrap: anywhere;
}

p {
  margin: 12px 0 24px;
  color: var(--el-text-color-secondary);
}

form {
  display: grid;
  gap: 12px;
  margin-top: 24px;
}

label {
  margin-top: 8px;
}
</style>
