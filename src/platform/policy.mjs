// 与后端 DTO 无关的前端规则，可用 Node 自带运行器验证。
export function allows(grants, requested) {
  const required = typeof requested === "string" ? [requested] : requested;
  return (
    Array.isArray(required) &&
    required.length > 0 &&
    required.every(
      code =>
        typeof code === "string" && code !== "*:*:*" && grants.includes(code)
    )
  );
}

export function normalizeFailure(error) {
  const body = error?.response?.data;
  if (
    body &&
    typeof body === "object" &&
    typeof body.code === "number" &&
    typeof body.message === "string"
  ) {
    return {
      code: body.code,
      message: body.message,
      data: body.data ?? null,
      status: error.response.status
    };
  }
  return {
    code: null,
    data: null,
    message:
      error?.code === "ERR_CANCELED"
        ? "admin.requestCanceled"
        : "admin.serviceUnavailable",
    status: error?.response?.status ?? null
  };
}

export function adaptNavigation(
  items,
  grants,
  allowedViews,
  report = () => {}
) {
  const seenKeys = new Set(),
    seenPaths = new Set();
  const walk = (nodes, depth = 0) => {
    if (!Array.isArray(nodes) || depth > 6) return [];
    return nodes.flatMap(item => {
      if (
        !item ||
        typeof item !== "object" ||
        typeof item.key !== "string" ||
        !/^[A-Za-z][A-Za-z0-9_-]{0,63}$/.test(item.key) ||
        typeof item.path !== "string" ||
        !/^\/[A-Za-z0-9_-]+(?:\/[A-Za-z0-9_-]+)*$/.test(item.path) ||
        ["/login", "/welcome", "/error", "/redirect"].some(
          path => item.path === path || item.path.startsWith(path + "/")
        ) ||
        typeof item.title !== "string" ||
        seenKeys.has(item.key) ||
        seenPaths.has(item.path)
      ) {
        report("invalid-navigation");
        return [];
      }
      if (item.permission && !allows(grants, item.permission)) return [];
      if (item.kind === "page" && !allowedViews.has(item.view)) {
        report("unknown-view");
        return [];
      }
      if (!["page", "directory"].includes(item.kind)) return [];
      seenKeys.add(item.key);
      seenPaths.add(item.path);
      const children =
        item.kind === "directory"
          ? walk(item.children ?? [], depth + 1)
          : undefined;
      if (item.kind === "directory" && children.length === 0) return [];
      return [
        {
          path: item.path,
          name: `Resource_${item.key}`,
          ...(item.kind === "page" ? { component: item.view } : {}),
          meta: {
            title: item.title,
            rank: Number.isFinite(item.rank) ? item.rank : 10,
            showLink: !item.hidden,
            keepAlive: !!item.keepAlive,
            icon: item.icon ?? undefined
          },
          ...(children ? { children } : {})
        }
      ];
    });
  };
  return walk(items);
}

/** 单次刷新共享 Promise，失败时所有等待者一起拒绝，不留下悬挂请求。 */
export function singleFlight(action) {
  let pending;
  return () => {
    if (!pending)
      pending = Promise.resolve()
        .then(action)
        .finally(() => {
          pending = undefined;
        });
    return pending;
  };
}
