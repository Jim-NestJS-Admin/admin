/** 只展示统一响应中的公开说明，未知异常统一兜底，不回显原始 Error。 */
export function failureView(failure) {
  const errors = Array.isArray(failure?.data?.errors)
    ? failure.data.errors
    : [];
  const fields = errors.flatMap(error =>
    Array.isArray(error?.messages)
      ? error.messages.filter(message => typeof message === "string")
      : []
  );
  const seconds =
    failure?.status === 429 ? Number(failure?.data?.retryAfterSeconds) : 0;
  return {
    message:
      typeof failure?.message === "string"
        ? failure.message
        : "admin.serviceUnavailable",
    fields,
    retrySeconds: Number.isFinite(seconds)
      ? Math.min(3600, Math.max(0, Math.ceil(seconds)))
      : 0
  };
}
