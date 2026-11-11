import { RequestFailure } from "@/utils/http";
import { failureView } from "@/platform/failure-view.mjs";
import type { SpecError } from "./spec";

type Translate = (key: string) => string;

/** 只展示后端公开说明；未知异常统一兜底，不回显内部信息 */
export function requestMessage(reason: unknown, t: Translate) {
  if (!(reason instanceof RequestFailure)) return t("crud.requestFailed");
  const text = failureView(reason.failure).message;
  return text.startsWith("admin.") || text.startsWith("crud.") ? t(text) : text;
}

/**
 * 后端「模块规格不合法」把逐项错误放在 data.errors：[{ field: 'fields[3].length', messages }]，
 * 转回 { path, message }，页面定位到对应单元格。
 */
export function specErrorsOf(reason: unknown): SpecError[] {
  if (!(reason instanceof RequestFailure)) return [];
  const errors = (reason.failure as { data?: { errors?: unknown } }).data
    ?.errors;
  if (!Array.isArray(errors)) return [];
  return errors.flatMap(error => {
    const item = error as { field?: unknown; messages?: unknown };
    return typeof item.field === "string" && Array.isArray(item.messages)
      ? item.messages
          .filter((message): message is string => typeof message === "string")
          .map(message => ({ path: item.field as string, message }))
      : [];
  });
}
