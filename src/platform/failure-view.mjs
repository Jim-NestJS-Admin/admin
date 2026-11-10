/** 只展示统一响应中的公开说明，未知异常统一兜底，不回显原始 Error。 */
export function failureView(failure) {
  const errors = Array.isArray(failure?.data?.errors)
    ? failure.data.errors
    : [];
  const message =
    typeof failure?.message === "string"
      ? failure.message
      : "admin.serviceUnavailable";
  // 字段说明和总说明相同（如验证码错误）或彼此重复时只显示一次
  const fields = [
    ...new Set(
      errors.flatMap(error =>
        Array.isArray(error?.messages)
          ? error.messages.filter(item => typeof item === "string")
          : []
      )
    )
  ].filter(item => item !== message);
  const seconds =
    failure?.status === 429 ? Number(failure?.data?.retryAfterSeconds) : 0;
  return {
    message,
    fields,
    retrySeconds: Number.isFinite(seconds)
      ? Math.min(3600, Math.max(0, Math.ceil(seconds)))
      : 0
  };
}
