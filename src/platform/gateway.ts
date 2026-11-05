import { shallowRef } from "vue";
import type { AdminGateway } from "./contracts";

const adapter = shallowRef<AdminGateway | null>(null);
export const gatewayReady = () => adapter.value !== null;

/** 只由正式生成客户端适配层在启动时安装，不从 window、URL 或持久化存储装载。 */
export function configureAdminGateway(value: AdminGateway) {
  adapter.value = value;
}

export function getAdminGateway(): AdminGateway {
  if (!adapter.value) throw new Error("admin.serviceUnavailable");
  return adapter.value;
}
