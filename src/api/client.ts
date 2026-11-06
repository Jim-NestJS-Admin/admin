// 此文件由 pnpm gen:api 生成，禁止手改。

import type { operations } from "./schema";
import { http } from "@/utils/http";
import type { PureHttpRequestConfig } from "@/utils/http/types";
type Content<T> = T extends { content: infer C }
  ? C extends { "application/json": infer J }
    ? J
    : C[keyof C]
  : void;
export type OperationBody<K extends keyof operations> = operations[K] extends {
  requestBody?: infer B;
}
  ? Content<NonNullable<B>>
  : never;
export type OperationParameter<
  K extends keyof operations,
  P extends string
> = operations[K] extends { parameters: infer V }
  ? P extends keyof V
    ? V[P]
    : never
  : never;
export type OperationResponse<K extends keyof operations> =
  operations[K] extends { responses: infer R }
    ? Content<
        R[Extract<
          keyof R,
          | 200
          | 201
          | 202
          | 203
          | 204
          | 205
          | 206
          | "200"
          | "201"
          | "202"
          | "204"
        >]
      >
    : never;
export type OperationInput<K extends keyof operations> = {
  body?: OperationBody<K>;
  path?: OperationParameter<K, "path">;
  query?: OperationParameter<K, "query">;
  headers?: OperationParameter<K, "header">;
};
function interpolate(path: string, params: unknown): string {
  return path.replace(/\{([^}]+)\}/g, (_match, key: string) => {
    const value = (params as Record<string, unknown> | undefined)?.[key];
    if (value === undefined || value === null)
      throw new Error("缺少接口路径参数");
    return encodeURIComponent(String(value));
  });
}

export function createApiClient(
  transport: Pick<typeof http, "request"> = http
) {
  void transport;
  return {
    authCaptcha(
      input: OperationInput<"authCaptcha"> & {
        query: OperationParameter<"authCaptcha", "query">;
      },
      config: PureHttpRequestConfig = {}
    ) {
      return transport.request<OperationResponse<"authCaptcha">>(
        "get",
        interpolate("/admin/auth/captcha", input.path),
        { params: input.query, headers: input.headers, data: input.body },
        config
      );
    },
    authLogin(
      input: OperationInput<"authLogin"> & { body: OperationBody<"authLogin"> },
      config: PureHttpRequestConfig = {}
    ) {
      return transport.request<OperationResponse<"authLogin">>(
        "post",
        interpolate("/admin/auth/login", input.path),
        { params: input.query, headers: input.headers, data: input.body },
        config
      );
    },
    authLogout(
      input: OperationInput<"authLogout"> = {},
      config: PureHttpRequestConfig = {}
    ) {
      return transport.request<OperationResponse<"authLogout">>(
        "post",
        interpolate("/admin/auth/logout", input.path),
        { params: input.query, headers: input.headers, data: input.body },
        config
      );
    },
    authRefresh(
      input: OperationInput<"authRefresh"> = {},
      config: PureHttpRequestConfig = {}
    ) {
      return transport.request<OperationResponse<"authRefresh">>(
        "post",
        interpolate("/admin/auth/refresh", input.path),
        { params: input.query, headers: input.headers, data: input.body },
        config
      );
    },
    sessionMenu(
      input: OperationInput<"sessionMenu"> = {},
      config: PureHttpRequestConfig = {}
    ) {
      return transport.request<OperationResponse<"sessionMenu">>(
        "get",
        interpolate("/admin/session/menu", input.path),
        { params: input.query, headers: input.headers, data: input.body },
        config
      );
    },
    sessionProfile(
      input: OperationInput<"sessionProfile"> = {},
      config: PureHttpRequestConfig = {}
    ) {
      return transport.request<OperationResponse<"sessionProfile">>(
        "get",
        interpolate("/admin/session/profile", input.path),
        { params: input.query, headers: input.headers, data: input.body },
        config
      );
    },
    sessionSwitchOrg(
      input: OperationInput<"sessionSwitchOrg"> & {
        body: OperationBody<"sessionSwitchOrg">;
      },
      config: PureHttpRequestConfig = {}
    ) {
      return transport.request<OperationResponse<"sessionSwitchOrg">>(
        "post",
        interpolate("/admin/session/switch-org", input.path),
        { params: input.query, headers: input.headers, data: input.body },
        config
      );
    }
  };
}
export const api = createApiClient();
