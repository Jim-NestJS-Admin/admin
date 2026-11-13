import { computed, ref, watch } from "vue";
import type { CrudRecord } from "@/components/Crud/types";
import type { OperationResponse } from "@/api/client";
export type RuleHistoryEntry =
  OperationResponse<"codeRuleHistory">["data"]["list"][number];
/** 只切换详情投影，不修改当前规则，不把当前元数据混入历史。 */
export function useRuleHistoryView(current: () => CrudRecord) {
  const selected = ref<RuleHistoryEntry>();
  const record = computed<CrudRecord>(() => {
    if (!selected.value) return current();
    return {
      ...Object.fromEntries(
        Object.entries(selected.value.snapshot).filter(([field]) =>
          Object.hasOwn(current(), field)
        )
      ),
      revision: selected.value.revision,
      ...(current()._fieldState ? { _fieldState: current()._fieldState } : {})
    };
  });
  function select(entry?: RuleHistoryEntry) {
    selected.value =
      entry && entry.revision !== Number(current().revision)
        ? entry
        : undefined;
  }
  watch(
    () => [current().id, current().version, current().revision],
    () => select(),
    { flush: "sync" }
  );
  return { selected, record, select };
}
