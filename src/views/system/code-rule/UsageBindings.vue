<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { api, type OperationResponse } from "@/api/client";
import { permission } from "@/platform/system/resources";
import { onSessionReset } from "@/platform/lifecycle";
import { useUserStoreHook } from "@/store/modules/user";
import { ElMessage, ElMessageBox } from "element-plus";
import { ruleError } from "./messages";
const props = defineProps<{
  ruleId?: string;
  ruleName?: string;
  ruleUnavailable?: boolean;
}>();
const emit = defineEmits<{ changed: [] }>();
const { t } = useI18n();
const user = useUserStoreHook();
type Usage = OperationResponse<"codeRuleUsageList">["data"]["list"][number];
type Rule = OperationResponse<"systemCodeRulePage">["data"]["list"][number];
const usages = ref<Usage[]>([]);
const rules = ref<Rule[]>([]);
const selectedRuleId = ref(props.ruleId ?? "");
const selectedUsageKey = ref("");
const selectedRule = ref<Rule>();
const catalogReady = ref(false);
const busy = ref(false),
  searching = ref(false),
  error = ref("");
let pending: AbortController | undefined;
let searchRequest: AbortController | undefined;
let lastIntent = "",
  mutationKey = "";
const usage = computed(() =>
  usages.value.find(item => item.key === selectedUsageKey.value)
);
const boundUsage = computed(() =>
  usages.value.find(item => item.ruleId === selectedRuleId.value)
);
const ruleOptions = computed(() => {
  const options = [...rules.value];
  if (
    selectedRule.value &&
    !options.some(item => item.id === selectedRule.value?.id)
  )
    options.unshift(selectedRule.value);
  return options;
});
function ruleDisabled(rule: Rule) {
  // 未返回冻结信息时不猜测为全新规则，交由完整授权的管理员配置。
  return (
    rule.status !== "1" ||
    rule.firstBoundAt !== null ||
    usages.value.some(item => item.ruleId === rule.id)
  );
}
const unavailable = computed(() =>
  props.ruleId
    ? Boolean(props.ruleUnavailable) || Boolean(boundUsage.value)
    : !selectedRule.value || ruleDisabled(selectedRule.value)
);
function targetDisabled(item: Usage) {
  return (
    unavailable.value ||
    Boolean(
      item.ruleId &&
        item.ruleId !== selectedRuleId.value &&
        !item.allowRuleSwitch
    )
  );
}
const canSave = computed(() =>
  Boolean(
    selectedRuleId.value &&
      user.permissions.includes(permission("codeRuleBindingSet")) &&
      catalogReady.value &&
      !searching.value &&
      usage.value &&
      !targetDisabled(usage.value) &&
      usage.value.ruleId !== selectedRuleId.value
  )
);
function chooseRule(id: string) {
  selectedRule.value = ruleOptions.value.find(item => item.id === id);
  selectedUsageKey.value = boundUsage.value?.key ?? "";
  error.value = "";
}
async function searchRules(keyword = "") {
  searchRequest?.abort();
  const request = (searchRequest = new AbortController());
  searching.value = true;
  try {
    const response = await api.systemCodeRulePage(
      { body: { page: 1, size: 100, keyword, eq: { status: "1" } } },
      { signal: request.signal }
    );
    if (!request.signal.aborted) {
      rules.value = response.data.list;
      const current = rules.value.find(
        item => item.id === selectedRuleId.value
      );
      if (current) selectedRule.value = current;
    }
  } catch (reason) {
    if (!request.signal.aborted) error.value = ruleError(reason);
  } finally {
    if (!request.signal.aborted) searching.value = false;
  }
}
async function load() {
  pending?.abort();
  const request = (pending = new AbortController());
  busy.value = true;
  error.value = "";
  catalogReady.value = false;
  try {
    const response = await api.codeRuleUsageList(
      {},
      { signal: request.signal }
    );
    if (request.signal.aborted) return;
    usages.value = response.data.list;
    catalogReady.value = true;
    if (boundUsage.value) selectedUsageKey.value = boundUsage.value.key;
    else if (!usages.value.some(item => item.key === selectedUsageKey.value))
      selectedUsageKey.value = "";
    if (!props.ruleId) await searchRules();
  } catch (reason) {
    if (!request.signal.aborted) error.value = ruleError(reason);
  } finally {
    if (!request.signal.aborted) busy.value = false;
  }
}
async function bind() {
  if (!canSave.value || busy.value) return;
  const key = selectedUsageKey.value,
    ruleId = selectedRuleId.value;
  pending?.abort();
  const request = (pending = new AbortController());
  busy.value = true;
  try {
    await ElMessageBox.confirm(
      t("codeRules.bindSelectionConfirm", {
        rule: props.ruleName ?? selectedRule.value?.name ?? ruleId,
        target: usage.value?.name ?? key
      }),
      t("codeRules.bind"),
      { type: "warning" }
    );
  } catch {
    if (!request.signal.aborted) busy.value = false;
    return;
  }
  if (request.signal.aborted) return;
  error.value = "";
  try {
    const intent = JSON.stringify([key, ruleId]);
    if (intent !== lastIntent) {
      lastIntent = intent;
      mutationKey = crypto.randomUUID();
    }
    await api.codeRuleBindingSet(
      { body: { usageKey: key, ruleId } },
      { signal: request.signal, headers: { "Idempotency-Key": mutationKey } }
    );
    if (!request.signal.aborted) {
      lastIntent = "";
      mutationKey = "";
      ElMessage.success(t("codeRules.bindSaved"));
      emit("changed");
      await load();
    }
  } catch (reason) {
    if (!request.signal.aborted) error.value = ruleError(reason);
  } finally {
    if (!request.signal.aborted) busy.value = false;
  }
}
watch(
  () => props.ruleId,
  id => {
    selectedRuleId.value = id ?? "";
    selectedUsageKey.value = "";
    selectedRule.value = undefined;
    void load();
  }
);
const stop = onSessionReset(() => {
  pending?.abort();
  searchRequest?.abort();
  usages.value = [];
  rules.value = [];
  selectedRule.value = undefined;
  selectedRuleId.value = "";
  catalogReady.value = false;
  selectedUsageKey.value = "";
  error.value = "";
  busy.value = searching.value = false;
  lastIntent = mutationKey = "";
});
onMounted(load);
onBeforeUnmount(() => {
  stop();
  pending?.abort();
  searchRequest?.abort();
});
</script>
<template>
  <section v-loading="busy" class="bindings">
    <p class="binding-hint">{{ t("codeRules.bindHint") }}</p>
    <el-alert v-if="error" :title="t(error)" type="error" :closable="false" />
    <el-form label-position="top" @submit.prevent="bind">
      <el-form-item
        v-if="!ruleId"
        :label="t('codeRules.selectRuleLabel')"
        required
      >
        <el-select
          v-model="selectedRuleId"
          filterable
          remote
          :remote-method="searchRules"
          :loading="searching"
          :disabled="busy"
          :placeholder="t('codeRules.selectRule')"
          @change="chooseRule"
        >
          <el-option
            v-for="rule in ruleOptions"
            :key="rule.id"
            :label="`${rule.name} (${rule.code})`"
            :value="rule.id"
            :disabled="ruleDisabled(rule)"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        :label="t('autoCodes.target')"
        :error="usage?.issue"
        required
      >
        <el-select
          v-model="selectedUsageKey"
          filterable
          clearable
          :disabled="busy || !selectedRuleId || unavailable"
          :placeholder="t('codeRules.selectTarget')"
        >
          <el-option
            v-for="item in usages"
            :key="item.key"
            :label="`${item.name} (${item.resource} · ${item.field})`"
            :value="item.key"
            :disabled="targetDisabled(item)"
          />
        </el-select>
      </el-form-item>
      <p v-if="selectedRuleId && unavailable" class="binding-hint">
        {{
          boundUsage
            ? t("codeRules.ruleAlreadyBound", { target: boundUsage.name })
            : t("codeRules.ruleUnavailable")
        }}
      </p>
      <template v-if="usage">
        <p class="binding-hint">
          {{ t("codeRules.bound") }}：{{
            usage.ruleName ?? t("codeRules.unbound")
          }}
        </p>
        <p class="binding-hint">
          {{ t("codeRules.maxLength") }} {{ usage.maxLength }} ·
          {{ t(`autoCodes.charsets.${usage.charset}`) }}
        </p>
      </template>
      <el-empty
        v-if="!busy && !usages.length"
        :description="t('autoCodes.noFields')"
        :image-size="64"
      />
      <el-space class="binding-actions" :size="12" wrap>
        <el-button
          v-perm="permission('codeRuleBindingSet')"
          type="primary"
          :disabled="busy || !canSave"
          native-type="submit"
          >{{ t("codeRules.bind") }}</el-button
        >
        <el-button :disabled="busy" @click="load">{{
          t("crud.reload")
        }}</el-button>
      </el-space>
    </el-form>
  </section>
</template>
<style scoped>
.bindings {
  display: grid;
  gap: 16px;
  min-width: 0;
}

.bindings .el-select {
  width: 100%;
}

.binding-hint {
  margin: 0 0 12px;
  line-height: 1.6;
  color: var(--el-text-color-secondary);
}

.binding-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
</style>
