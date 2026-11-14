import type { CrudRecord } from "@/components/Crud/types";
type Translate = (
  key: string,
  params?: Record<string, string | number>
) => string;
/** 结构→字段参数→起始值→周期；与后端契约一致，不能替代后端校验。 */
export function validateRuleDraft(
  values: CrudRecord,
  t: Translate,
  identity = false
): Record<string, string[]> {
  const fail = (
    field: string,
    key: string,
    params?: Record<string, string | number>
  ) => ({ [field]: [t("codeRules.validation." + key, params)] });
  const segments = values.segments;
  if (!Array.isArray(segments) || !segments.length)
    return fail("segments", "emptySegments");
  if (segments.length > 4) return fail("segments", "tooManySegments");
  if (segments.some(s => !s || typeof s !== "object"))
    return fail("segments", "invalidSegment");
  const sequences = segments.filter(s => s.type === "sequence");
  if (sequences.length !== 1 || segments.at(-1)?.type !== "sequence")
    return fail("segments", "sequenceLast");
  if (
    segments.filter(s => s.type === "date").length > 1 ||
    segments.filter(s => s.type === "timestamp").length > 1
  )
    return fail("segments", "duplicateSegment");
  const formats = [
    "yyyy",
    "yyyyMM",
    "yyyy-MM",
    "yyyyMMdd",
    "yyyy-MM-dd",
    "yyyyMMddHHmmss",
    "yyyy-MM-dd_HH-mm-ss"
  ];
  let length = 0;
  for (const [index, segment] of segments.entries()) {
    const position = { index: index + 1 };
    if (segment.type === "literal") {
      if (
        typeof segment.value !== "string" ||
        !/^[A-Za-z0-9_-]{1,16}$/.test(segment.value)
      )
        return fail("segments", "literal", position);
      length += segment.value.length;
    } else if (segment.type === "date") {
      if (!formats.includes(segment.format))
        return fail("segments", "date", position);
      length += segment.format.length;
    } else if (segment.type === "timestamp") {
      if (!["seconds", "milliseconds"].includes(segment.unit))
        return fail("segments", "timestamp", position);
      length += segment.unit === "seconds" ? 13 : 16;
    } else if (segment.type === "sequence") {
      if (
        !Number.isInteger(segment.width) ||
        segment.width < 1 ||
        segment.width > 12
      )
        return fail("segments", "width");
      length += segment.width;
    } else return fail("segments", "invalidSegment");
  }
  if (length > 64) return fail("segments", "length");
  const start = String(values.start ?? "");
  if (!/^[1-9]\d{0,11}$/.test(start)) return fail("start", "start");
  const width = sequences[0].width;
  const maximum = 10n ** BigInt(width) - 1n;
  if (BigInt(start) > maximum)
    return fail("start", "overflow", { width, maximum: maximum.toString() });
  if (!["never", "year", "month", "day"].includes(String(values.resetPeriod)))
    return fail("resetPeriod", "period");
  const format = segments.find(s => s.type === "date")?.format ?? "";
  if (
    values.resetPeriod !== "never" &&
    (!format.includes("yyyy") ||
      (["month", "day"].includes(String(values.resetPeriod)) &&
        !format.includes("MM")) ||
      (values.resetPeriod === "day" && !format.includes("dd")))
  )
    return fail("segments", "coverage");
  try {
    if (typeof values.timezone !== "string" || !values.timezone) throw Error();
    new Intl.DateTimeFormat("en", { timeZone: values.timezone });
  } catch {
    return fail("timezone", "timezone");
  }
  if (identity) {
    if (
      Object.hasOwn(values, "code") &&
      !/^[a-z][a-z0-9_]{1,63}$/.test(String(values.code ?? ""))
    )
      return fail("code", "code");
    if (
      Object.hasOwn(values, "name") &&
      (typeof values.name !== "string" ||
        !values.name.trim() ||
        values.name.length > 100)
    )
      return fail("name", "name");
    if (
      typeof values.description === "string" &&
      values.description.length > 500
    )
      return fail("description", "description");
    if (
      Object.hasOwn(values, "status") &&
      !["1", "0"].includes(String(values.status))
    )
      return fail("status", "status");
  }
  return {};
}
