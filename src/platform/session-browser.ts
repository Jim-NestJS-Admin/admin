import { createSessionCoordinator } from "./session-coordinator.mjs";
let coordinator: ReturnType<typeof createSessionCoordinator> | undefined;
const invalidations = new Set<() => void>();
export function onRemoteSessionReset(callback: () => void) {
  invalidations.add(callback);
}
function getCoordinator() {
  // Node 测试和构建没有浏览器会话；浏览器缺少必要能力时必须拒绝认证。
  if (typeof window === "undefined") return undefined;
  if (coordinator) return coordinator;
  if (!navigator.locks || typeof BroadcastChannel === "undefined")
    throw new Error("admin.serviceUnavailable");
  const channel = new BroadcastChannel("jim-admin-session");
  coordinator = createSessionCoordinator({
    randomId: () => crypto.randomUUID(),
    readVersion: () => localStorage.getItem("jim-admin-session-version") ?? "",
    writeVersion: (value: string) =>
      localStorage.setItem("jim-admin-session-version", value),
    lock: <T>(run: () => Promise<T>) =>
      navigator.locks.request("jim-admin-session", run),
    send: (message: unknown) => channel.postMessage(message),
    subscribe: (listener: (message: any) => void) => {
      const receive = (event: MessageEvent) => listener(event.data);
      channel.addEventListener("message", receive);
      return () => {
        channel.removeEventListener("message", receive);
        channel.close();
      };
    },
    onInvalidate: () => invalidations.forEach(callback => callback())
  });
  return coordinator;
}
export const coordinatedRefresh = <T>(run: () => Promise<T>): Promise<T> => {
  const current = getCoordinator();
  return current ? (current.refresh(run) as Promise<T>) : run();
};
export const coordinatedMutation = <T>(run: () => Promise<T>): Promise<T> => {
  const current = getCoordinator();
  return current ? (current.exclusive(run) as Promise<T>) : run();
};
export function invalidateOtherSessions() {
  getCoordinator()?.invalidate();
}
