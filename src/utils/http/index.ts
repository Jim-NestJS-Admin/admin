import Axios, { type AxiosInstance, type AxiosRequestConfig } from "axios";
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
const canceled = () => Object.assign(new Error(), { code: "ERR_CANCELED" });
export class PureHttp {
  constructor(private readonly client: AxiosInstance = instance) {}
  async request<T>(
    method: RequestMethods,
    url: string,
    params: AxiosRequestConfig = {},
    config: PureHttpRequestConfig = {}
  ): Promise<T> {
    const user = useUserStoreHook();
    const epoch = user.epoch;
    const origin =
      typeof window === "undefined"
        ? "http://localhost"
        : window.location.origin;
    const target = new URL(url, origin);
    if (
      !url.startsWith("/admin/") ||
      target.origin !== origin ||
      !target.pathname.startsWith("/admin/") ||
      /[\\]/.test(decodeURIComponent(target.pathname)) ||
      params.baseURL ||
      config.baseURL
    )
      throw new RequestFailure(normalizeFailure(null));
    const controller = new AbortController();
    active.add(controller);
    const signal = config.signal ?? params.signal;
    const abort = () => controller.abort();
    if (signal?.aborted) abort();
    else signal?.addEventListener?.("abort", abort);
    const session = config.authPolicy !== "none";
    const check = () => {
      if (
        epoch !== user.epoch ||
        controller.signal.aborted ||
        (session && user.transitioning)
      )
        throw canceled();
    };
    let sentToken = "";
    const send = () => {
      check();
      const headers = new Axios.AxiosHeaders(config.headers ?? params.headers);
      sentToken = user.accessToken;
      if (session && user.accessToken)
        headers.set("Authorization", "Bearer " + user.accessToken);
      else headers.delete("Authorization");
      return this.client.request({
        ...params,
        ...config,
        method,
        url,
        headers,
        signal: controller.signal
      });
    };
    try {
      if (session && !config.skipSessionRefresh)
        await user.ensureFreshSession();
      let response;
      try {
        response = await send();
      } catch (error) {
        check();
        const failure = normalizeFailure(error);
        if (
          !(
            session &&
            !config.skipSessionRefresh &&
            user.accessToken &&
            failure.status === 401 &&
            failure.code === 4001
          )
        )
          throw error;
        // 较晚到达的旧令牌 401 可复用同批已经刷新的令牌，避免连续轮换。
        if (user.accessToken === sentToken) await user.ensureFreshSession(true);
        check();
        response = await send(); // 只有明确的认证失败可以重放一次，保持原请求体和幂等键。
      }
      check();
      if (config.responseMode !== "raw" && response.data?.code !== 1000)
        throw { response };
      return response.data as T;
    } catch (error) {
      const failure =
        error instanceof RequestFailure
          ? error.failure
          : normalizeFailure(error);
      if (failure.status === 401 && session && epoch === user.epoch)
        user.clearSession();
      throw new RequestFailure(failure);
    } finally {
      signal?.removeEventListener?.("abort", abort);
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
