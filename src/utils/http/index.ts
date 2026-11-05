import Axios, { type AxiosRequestConfig } from "axios";
import { normalizeFailure } from "@/platform/policy.mjs";
import { onSessionReset } from "@/platform/lifecycle";
import { useUserStoreHook } from "@/store/modules/user";
import type { PureHttpRequestConfig, RequestMethods } from "./types";
const instance = Axios.create({
  timeout: 15000,
  headers: { Accept: "application/json" }
});
const active = new Set<AbortController>();
onSessionReset(() => {
  active.forEach(controller => controller.abort());
  active.clear();
});
export class RequestFailure extends Error {
  constructor(readonly failure: ReturnType<typeof normalizeFailure>) {
    super(failure.message);
  }
}
class PureHttp {
  async request<T>(
    method: RequestMethods,
    url: string,
    params: AxiosRequestConfig = {},
    config: PureHttpRequestConfig = {}
  ): Promise<T> {
    const user = useUserStoreHook();
    const epoch = user.epoch;
    if (!url.startsWith("/admin/") || url.includes("..") || url.includes("\\"))
      throw new Error("admin.serviceUnavailable");
    const controller = new AbortController();
    active.add(controller);
    const canceled = () => controller.abort();
    const signal = config.signal ?? params.signal;
    if (signal?.aborted) controller.abort();
    else signal?.addEventListener?.("abort", canceled);
    try {
      if (!config.skipSessionRefresh) {
        if (user.transitioning)
          throw Object.assign(new Error(), { code: "ERR_CANCELED" });
        await user.ensureFreshSession();
      }
      const headers = Axios.AxiosHeaders.from(config.headers ?? params.headers);
      if (user.accessToken)
        headers.set("Authorization", "Bearer " + user.accessToken);
      const response = await instance.request({
        ...params,
        ...config,
        method,
        url,
        headers,
        signal: controller.signal
      });
      if (epoch !== user.epoch)
        throw Object.assign(new Error(), { code: "ERR_CANCELED" });
      if (response.data?.code !== 1000) throw { response };
      return response.data as T;
    } catch (error) {
      const failure = normalizeFailure(error);
      if (failure.status === 401 && epoch === user.epoch) user.clearSession();
      throw new RequestFailure(failure);
    } finally {
      signal?.removeEventListener?.("abort", canceled);
      active.delete(controller);
    }
  }
  get<T, P>(
    url: string,
    params?: AxiosRequestConfig<P>,
    config?: PureHttpRequestConfig
  ) {
    return this.request<T>("get", url, params, config);
  }
  post<T, P>(
    url: string,
    params?: AxiosRequestConfig<P>,
    config?: PureHttpRequestConfig
  ) {
    return this.request<T>("post", url, params, config);
  }
}
export const http = new PureHttp();
