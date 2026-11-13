<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { api, type OperationResponse } from "@/api/client";
import { permission } from "@/platform/system/resources";
import { onSessionReset } from "@/platform/lifecycle";
import { ElMessageBox } from "element-plus";
import { ruleError } from "./messages";
const props = defineProps<{
  ruleId?: string;
  ruleName?: string;
  ruleUnavailable?: boolean;
}>();
const emit = defineEmits<{ changed: [] }>();
const { t } = useI18n();
const usages = ref<OperationResponse<"codeRuleUsageList">["data"]["list"]>([]);
const rules = ref<OperationResponse<"systemCodeRulePage">["data"]["list"]>([]);
const selected = ref<Record<string, string>>({}),
  busy = ref(false),
  error = ref("");
let pending: AbortController | undefined;
let lastIntent = "",
  mutationKey = "";
async function load(keyword = "") {
  pending?.abort();
  const request = (pending = new AbortController());
  busy.value = true;
  error.value = "";
  try {
    const [a, b] = await Promise.all([
      api.codeRuleUsageList({}, { signal: request.signal }),
      props.ruleId
        ? Promise.resolve({ data: { list: [] } })
        : api.systemCodeRulePage(
            {
              body: { page: 1, size: 100, keyword, eq: { status: "1" } }
            },
            { signal: request.signal }
          )
    ]);
    if (request.signal.aborted) return;
    usages.value = a.data.list;
    rules.value = b.data.list;
    if (!keyword)
      selected.value = Object.fromEntries(
        usages.value.map(u => [u.key, props.ruleId ?? u.ruleId ?? ""])
      );
  } catch (reason) {
    if (!request.signal.aborted) error.value = ruleError(reason);
  } finally {
    if (!request.signal.aborted) busy.value = false;
  }
}
type Usage = OperationResponse<"codeRuleUsageList">["data"]["list"][number];
type Rule = OperationResponse<"systemCodeRulePage">["data"]["list"][number];
function ruleDisabled(rule: Rule) {
  return (
    rule.firstBoundAt !== null ||
    usages.value.some(usage => usage.ruleId === rule.id)
  );
}
function selectionDisabled(usage: Usage) {
  if (usage.ruleId && !usage.allowRuleSwitch) return true;
  if (props.ruleId)
    return (
      Boolean(props.ruleUnavailable) ||
      usages.value.some(item => item.ruleId === props.ruleId)
    );
  const rule = rules.value.find(item => item.id === selected.value[usage.key]);
  return !rule || ruleDisabled(rule);
}
async function bind(key: string) {
  const ruleId = selected.value[key];
  if (!ruleId || busy.value) return;
  const usage = usages.value.find(item => item.key === key);
  if (!usage || selectionDisabled(usage)) return;
  pending?.abort();
  const request = (pending = new AbortController());
  busy.value = true;
  try {
    await ElMessageBox.confirm(
      t("codeRules.bindConfirm"),
      t("codeRules.bind"),
      { type: "warning" }
    );
  } catch {
    if (!request.signal.aborted) busy.value = false;
    return;
  }
  if (request.signal.aborted) return;
  busy.value = true;
  error.value = "";
  try {
    const intent = JSON.stringify([key, ruleId]);
    if (intent !== lastIntent) {
      lastIntent = intent;
      mutationKey = crypto.randomUUID();
    }
    await api.codeRuleBindingSet(
      { body: { usageKey: key, ruleId } },
      {
        signal: request.signal,
        headers: { "Idempotency-Key": mutationKey }
      }
    );
    if (!request.signal.aborted) {
      await load();
      emit("changed");
    }
  } catch (reason) {
    if (!request.signal.aborted) error.value = ruleError(reason);
  } finally {
    if (!request.signal.aborted) busy.value = false;
  }
}
const stop = onSessionReset(() => {
  pending?.abort();
  usages.value = [];
  rules.value = [];
  selected.value = {};
  error.value = "";
  busy.value = false;
  lastIntent = "";
  mutationKey = "";
});
onMounted(() => load());
onBeforeUnmount(() => {
  stop();
  pending?.abort();
});
</script>
<template>
  <section v-loading="busy" class="bindings">
    <p class="binding-hint">{{ t("codeRules.bindHint") }}</p>
    <el-alert v-if="error" :title="t(error)" type="error" :closable="false" />
    <el-form label-position="top">
      <el-form-item
        v-for="usage in usages"
        :key="usage.key"
        :label="usage.name"
        :error="usage.issue"
      >
        <div class="usage-row">
          <el-select
            v-model="selected[usage.key]"
            filterable
            remote
            :remote-method="load"
            :disabled="
              busy ||
              Boolean(ruleId) ||
              Boolean(usage.ruleId && !usage.allowRuleSwitch)
            "
            :placeholder="t('codeRules.selectRule')"
          >
            <el-option
              v-if="ruleId"
              :label="ruleName ?? ruleId"
              :value="ruleId"
            />
            <el-option
              v-if="
                !ruleId &&
                usage.ruleId &&
                !rules.some(r => r.id === usage.ruleId)
              "
              :label="usage.ruleName ?? usage.ruleId"
              :value="usage.ruleId"
              disabled
            />
            <el-option
              v-for="rule in rules"
              :key="rule.id"
              :label="`${rule.name} (${rule.code})`"
              :value="rule.id"
              :disabled="ruleDisabled(rule)"
            />
          </el-select>
          <el-space :size="12" wrap>
            <el-button
              v-perm="permission('codeRuleBindingSet')"
              type="primary"
              :disabled="
                busy ||
                !selected[usage.key] ||
                selected[usage.key] === usage.ruleId ||
                selectionDisabled(usage)
              "
              @click="bind(usage.key)"
              >{{ t("codeRules.bind") }}</el-button
            >
            <el-button :disabled="busy" @click="load()">{{
              t("crud.reload")
            }}</el-button>
          </el-space>
        </div>
        <p>
          {{ t("codeRules.bound") }}：{{
            usage.ruleName ?? t("codeRules.unbound")
          }}
          · {{ t("codeRules.maxLength") }} {{ usage.maxLength }} ·
          {{ usage.charset }}
        </p>
      </el-form-item>
    </el-form>
    <div v-if="!usages.length">
      <el-button :disabled="busy" @click="load()">{{
        t("crud.reload")
      }}</el-button>
    </div>
  </section>
</template>
<style scoped>
.bindings {
  display: grid;
  gap: 16px;
  padding: 0;
  background: var(--el-bg-color);
}

.bindings .el-form {
  max-width: 760px;
}

.usage-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  width: 100%;
}

.usage-row .el-select {
  flex: 1 1 240px;
  min-width: 0;
}

.bindings p {
  width: 100%;
  margin: 8px 0 0;
  color: var(--el-text-color-secondary);
}
</style>
