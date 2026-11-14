import { RequestFailure } from "@/utils/http";
/** 展示缺失项或不兼容原因，内部字段路径仍留在响应中供表单定位。 */
export function ruleError(reason: unknown) {
  if (!(reason instanceof RequestFailure)) return "crud.requestFailed";
  const errors = reason.failure.data?.errors;
  const details = Array.isArray(errors)
    ? errors.flatMap(e =>
        Array.isArray(e.messages)
          ? e.messages.filter(m => typeof m === "string")
          : []
      )
    : [];
  return [reason.failure.message, ...new Set(details)].join("：");
}
