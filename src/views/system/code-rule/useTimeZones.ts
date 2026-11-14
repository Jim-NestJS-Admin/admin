import { ref } from "vue";
import { api, type OperationResponse } from "@/api/client";
import { onSessionReset } from "@/platform/lifecycle";
import { ruleError } from "./messages";
export type TimeZoneOption =
  OperationResponse<"codeRuleTimeZones">["data"]["list"][number];
/** 所有选择/只读入口复用同一别名匹配和名称格式。 */
export function findTimeZone(options: TimeZoneOption[], value: string) {
  const exact = options.find(item => item.value === value);
  if (exact) return exact;
  try {
    const canonical = new Intl.DateTimeFormat("en", {
      timeZone: value
    }).resolvedOptions().timeZone;
    return options.find(item => item.value === canonical);
  } catch {
    return undefined;
  }
}
export function timeZoneOptionLabel(option: TimeZoneOption, locale: string) {
  return locale.startsWith("zh") ? option.labelZh : option.labelEn;
}
export function matchesTimeZone(item: TimeZoneOption, query: string) {
  const normalize = (value: string) =>
    value.toLowerCase().replaceAll("_", " ").trim();
  return normalize(`${item.value} ${item.labelZh} ${item.labelEn}`).includes(
    normalize(query)
  );
}
export function useTimeZones(client = api) {
  const options = ref<TimeZoneOption[]>([]),
    loading = ref(false),
    error = ref("");
  let request: AbortController | undefined;
  function reset() {
    request?.abort();
    options.value = [];
    loading.value = false;
    error.value = "";
  }
  const stop = onSessionReset(reset);
  async function load() {
    request?.abort();
    const current = (request = new AbortController());
    loading.value = true;
    error.value = "";
    try {
      const response = await client.codeRuleTimeZones(
        {},
        { signal: current.signal }
      );
      if (!current.signal.aborted) options.value = response.data.list;
    } catch (reason) {
      if (!current.signal.aborted) error.value = ruleError(reason);
    } finally {
      if (!current.signal.aborted) loading.value = false;
    }
  }
  return {
    options,
    loading,
    error,
    load,
    dispose: () => {
      stop();
      reset();
    }
  };
}
