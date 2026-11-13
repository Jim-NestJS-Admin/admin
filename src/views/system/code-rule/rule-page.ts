import type { CrudPort, CrudRecord } from "@/components/Crud/types";
export function scopedSequencePort(port: CrudPort, ruleId: string): CrudPort {
  return {
    ...port,
    list: (query, signal) =>
      port.list({ ...query, equality: { ...query.equality, ruleId } }, signal)
  };
}
/** 只复制可配置内容；身份、修订、绑定和计数器永不复制。 */
export function copyRuleDraft(record: CrudRecord): CrudRecord {
  return structuredClone(
    Object.fromEntries(
      ["description", "timezone", "resetPeriod", "start", "segments"]
        .filter(key => Object.hasOwn(record, key))
        .map(key => [key, record[key]])
    )
  );
}
