/** 只广播资源标识；页面重新读取服务端描述，不从跨标签消息取得任何权限或配置。 */
const listeners = new Set<(resource: string) => void>();
const valid = (value: unknown): value is string =>
  typeof value === "string" &&
  value.length <= 160 &&
  /^[a-z][a-z0-9-]*(:[a-z][a-z0-9-]*)+$/.test(value);
let channel: BroadcastChannel | undefined;
try {
  if (typeof window !== "undefined" && "BroadcastChannel" in window)
    channel = new BroadcastChannel("jna:page-config-changed");
} catch {
  /* 浏览器不支持时仍刷新当前标签页。 */
}
function dispatch(resource: string) {
  for (const listener of listeners) listener(resource);
}
if (channel)
  channel.onmessage = event => {
    if (valid(event.data)) dispatch(event.data);
  };
export function notifyPageConfigChanged(resource: string) {
  if (!valid(resource)) return;
  dispatch(resource);
  channel?.postMessage(resource);
}
export function onPageConfigChanged(listener: (resource: string) => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
if (import.meta.hot)
  import.meta.hot.dispose(() => {
    channel?.close();
    listeners.clear();
  });
