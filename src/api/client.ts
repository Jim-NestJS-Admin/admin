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
    },
    systemDictItemAdd(
      input: OperationInput<"systemDictItemAdd"> & {
        body: OperationBody<"systemDictItemAdd">;
      },
      config: PureHttpRequestConfig = {}
    ) {
      return transport.request<OperationResponse<"systemDictItemAdd">>(
        "post",
        interpolate("/admin/system/dict-item/add", input.path),
        { params: input.query, headers: input.headers, data: input.body },
        config
      );
    },
    systemDictItemDelete(
      input: OperationInput<"systemDictItemDelete"> & {
        body: OperationBody<"systemDictItemDelete">;
      },
      config: PureHttpRequestConfig = {}
    ) {
      return transport.request<OperationResponse<"systemDictItemDelete">>(
        "post",
        interpolate("/admin/system/dict-item/delete", input.path),
        { params: input.query, headers: input.headers, data: input.body },
        config
      );
    },
    systemDictItemInfo(
      input: OperationInput<"systemDictItemInfo"> & {
        body: OperationBody<"systemDictItemInfo">;
      },
      config: PureHttpRequestConfig = {}
    ) {
      return transport.request<OperationResponse<"systemDictItemInfo">>(
        "post",
        interpolate("/admin/system/dict-item/info", input.path),
        { params: input.query, headers: input.headers, data: input.body },
        config
      );
    },
    systemDictItemPage(
      input: OperationInput<"systemDictItemPage"> & {
        body: OperationBody<"systemDictItemPage">;
      },
      config: PureHttpRequestConfig = {}
    ) {
      return transport.request<OperationResponse<"systemDictItemPage">>(
        "post",
        interpolate("/admin/system/dict-item/page", input.path),
        { params: input.query, headers: input.headers, data: input.body },
        config
      );
    },
    systemDictItemSchema(
      input: OperationInput<"systemDictItemSchema"> = {},
      config: PureHttpRequestConfig = {}
    ) {
      return transport.request<OperationResponse<"systemDictItemSchema">>(
        "get",
        interpolate("/admin/system/dict-item/schema", input.path),
        { params: input.query, headers: input.headers, data: input.body },
        config
      );
    },
    systemDictItemUpdate(
      input: OperationInput<"systemDictItemUpdate"> & {
        body: OperationBody<"systemDictItemUpdate">;
      },
      config: PureHttpRequestConfig = {}
    ) {
      return transport.request<OperationResponse<"systemDictItemUpdate">>(
        "post",
        interpolate("/admin/system/dict-item/update", input.path),
        { params: input.query, headers: input.headers, data: input.body },
        config
      );
    },
    systemDictTypeAdd(
      input: OperationInput<"systemDictTypeAdd"> & {
        body: OperationBody<"systemDictTypeAdd">;
      },
      config: PureHttpRequestConfig = {}
    ) {
      return transport.request<OperationResponse<"systemDictTypeAdd">>(
        "post",
        interpolate("/admin/system/dict-type/add", input.path),
        { params: input.query, headers: input.headers, data: input.body },
        config
      );
    },
    systemDictionaryOptions(
      input: OperationInput<"systemDictionaryOptions"> & {
        query: OperationParameter<"systemDictionaryOptions", "query">;
      },
      config: PureHttpRequestConfig = {}
    ) {
      return transport.request<OperationResponse<"systemDictionaryOptions">>(
        "get",
        interpolate("/admin/system/dict-type/data", input.path),
        { params: input.query, headers: input.headers, data: input.body },
        config
      );
    },
    systemDictTypeDelete(
      input: OperationInput<"systemDictTypeDelete"> & {
        body: OperationBody<"systemDictTypeDelete">;
      },
      config: PureHttpRequestConfig = {}
    ) {
      return transport.request<OperationResponse<"systemDictTypeDelete">>(
        "post",
        interpolate("/admin/system/dict-type/delete", input.path),
        { params: input.query, headers: input.headers, data: input.body },
        config
      );
    },
    systemDictTypeInfo(
      input: OperationInput<"systemDictTypeInfo"> & {
        body: OperationBody<"systemDictTypeInfo">;
      },
      config: PureHttpRequestConfig = {}
    ) {
      return transport.request<OperationResponse<"systemDictTypeInfo">>(
        "post",
        interpolate("/admin/system/dict-type/info", input.path),
        { params: input.query, headers: input.headers, data: input.body },
        config
      );
    },
    systemDictTypePage(
      input: OperationInput<"systemDictTypePage"> & {
        body: OperationBody<"systemDictTypePage">;
      },
      config: PureHttpRequestConfig = {}
    ) {
      return transport.request<OperationResponse<"systemDictTypePage">>(
        "post",
        interpolate("/admin/system/dict-type/page", input.path),
        { params: input.query, headers: input.headers, data: input.body },
        config
      );
    },
    systemDictTypeSchema(
      input: OperationInput<"systemDictTypeSchema"> = {},
      config: PureHttpRequestConfig = {}
    ) {
      return transport.request<OperationResponse<"systemDictTypeSchema">>(
        "get",
        interpolate("/admin/system/dict-type/schema", input.path),
        { params: input.query, headers: input.headers, data: input.body },
        config
      );
    },
    systemDictTypeUpdate(
      input: OperationInput<"systemDictTypeUpdate"> & {
        body: OperationBody<"systemDictTypeUpdate">;
      },
      config: PureHttpRequestConfig = {}
    ) {
      return transport.request<OperationResponse<"systemDictTypeUpdate">>(
        "post",
        interpolate("/admin/system/dict-type/update", input.path),
        { params: input.query, headers: input.headers, data: input.body },
        config
      );
    },
    systemLoginLogInfo(
      input: OperationInput<"systemLoginLogInfo"> & {
        body: OperationBody<"systemLoginLogInfo">;
      },
      config: PureHttpRequestConfig = {}
    ) {
      return transport.request<OperationResponse<"systemLoginLogInfo">>(
        "post",
        interpolate("/admin/system/login-log/info", input.path),
        { params: input.query, headers: input.headers, data: input.body },
        config
      );
    },
    systemLoginLogPage(
      input: OperationInput<"systemLoginLogPage"> & {
        body: OperationBody<"systemLoginLogPage">;
      },
      config: PureHttpRequestConfig = {}
    ) {
      return transport.request<OperationResponse<"systemLoginLogPage">>(
        "post",
        interpolate("/admin/system/login-log/page", input.path),
        { params: input.query, headers: input.headers, data: input.body },
        config
      );
    },
    systemLoginLogSchema(
      input: OperationInput<"systemLoginLogSchema"> = {},
      config: PureHttpRequestConfig = {}
    ) {
      return transport.request<OperationResponse<"systemLoginLogSchema">>(
        "get",
        interpolate("/admin/system/login-log/schema", input.path),
        { params: input.query, headers: input.headers, data: input.body },
        config
      );
    },
    systemMenuAdd(
      input: OperationInput<"systemMenuAdd"> & {
        body: OperationBody<"systemMenuAdd">;
      },
      config: PureHttpRequestConfig = {}
    ) {
      return transport.request<OperationResponse<"systemMenuAdd">>(
        "post",
        interpolate("/admin/system/menu/add", input.path),
        { params: input.query, headers: input.headers, data: input.body },
        config
      );
    },
    systemMenuDelete(
      input: OperationInput<"systemMenuDelete"> & {
        body: OperationBody<"systemMenuDelete">;
      },
      config: PureHttpRequestConfig = {}
    ) {
      return transport.request<OperationResponse<"systemMenuDelete">>(
        "post",
        interpolate("/admin/system/menu/delete", input.path),
        { params: input.query, headers: input.headers, data: input.body },
        config
      );
    },
    systemMenuInfo(
      input: OperationInput<"systemMenuInfo"> & {
        body: OperationBody<"systemMenuInfo">;
      },
      config: PureHttpRequestConfig = {}
    ) {
      return transport.request<OperationResponse<"systemMenuInfo">>(
        "post",
        interpolate("/admin/system/menu/info", input.path),
        { params: input.query, headers: input.headers, data: input.body },
        config
      );
    },
    systemMenuPage(
      input: OperationInput<"systemMenuPage"> & {
        body: OperationBody<"systemMenuPage">;
      },
      config: PureHttpRequestConfig = {}
    ) {
      return transport.request<OperationResponse<"systemMenuPage">>(
        "post",
        interpolate("/admin/system/menu/page", input.path),
        { params: input.query, headers: input.headers, data: input.body },
        config
      );
    },
    systemMenuSchema(
      input: OperationInput<"systemMenuSchema"> = {},
      config: PureHttpRequestConfig = {}
    ) {
      return transport.request<OperationResponse<"systemMenuSchema">>(
        "get",
        interpolate("/admin/system/menu/schema", input.path),
        { params: input.query, headers: input.headers, data: input.body },
        config
      );
    },
    systemMenuUpdate(
      input: OperationInput<"systemMenuUpdate"> & {
        body: OperationBody<"systemMenuUpdate">;
      },
      config: PureHttpRequestConfig = {}
    ) {
      return transport.request<OperationResponse<"systemMenuUpdate">>(
        "post",
        interpolate("/admin/system/menu/update", input.path),
        { params: input.query, headers: input.headers, data: input.body },
        config
      );
    },
    systemOperationLogInfo(
      input: OperationInput<"systemOperationLogInfo"> & {
        body: OperationBody<"systemOperationLogInfo">;
      },
      config: PureHttpRequestConfig = {}
    ) {
      return transport.request<OperationResponse<"systemOperationLogInfo">>(
        "post",
        interpolate("/admin/system/operation-log/info", input.path),
        { params: input.query, headers: input.headers, data: input.body },
        config
      );
    },
    systemOperationLogPage(
      input: OperationInput<"systemOperationLogPage"> & {
        body: OperationBody<"systemOperationLogPage">;
      },
      config: PureHttpRequestConfig = {}
    ) {
      return transport.request<OperationResponse<"systemOperationLogPage">>(
        "post",
        interpolate("/admin/system/operation-log/page", input.path),
        { params: input.query, headers: input.headers, data: input.body },
        config
      );
    },
    systemOperationLogSchema(
      input: OperationInput<"systemOperationLogSchema"> = {},
      config: PureHttpRequestConfig = {}
    ) {
      return transport.request<OperationResponse<"systemOperationLogSchema">>(
        "get",
        interpolate("/admin/system/operation-log/schema", input.path),
        { params: input.query, headers: input.headers, data: input.body },
        config
      );
    },
    systemOrgAdd(
      input: OperationInput<"systemOrgAdd"> & {
        body: OperationBody<"systemOrgAdd">;
      },
      config: PureHttpRequestConfig = {}
    ) {
      return transport.request<OperationResponse<"systemOrgAdd">>(
        "post",
        interpolate("/admin/system/org/add", input.path),
        { params: input.query, headers: input.headers, data: input.body },
        config
      );
    },
    systemOrgDelete(
      input: OperationInput<"systemOrgDelete"> & {
        body: OperationBody<"systemOrgDelete">;
      },
      config: PureHttpRequestConfig = {}
    ) {
      return transport.request<OperationResponse<"systemOrgDelete">>(
        "post",
        interpolate("/admin/system/org/delete", input.path),
        { params: input.query, headers: input.headers, data: input.body },
        config
      );
    },
    systemOrgInfo(
      input: OperationInput<"systemOrgInfo"> & {
        body: OperationBody<"systemOrgInfo">;
      },
      config: PureHttpRequestConfig = {}
    ) {
      return transport.request<OperationResponse<"systemOrgInfo">>(
        "post",
        interpolate("/admin/system/org/info", input.path),
        { params: input.query, headers: input.headers, data: input.body },
        config
      );
    },
    systemOrgPage(
      input: OperationInput<"systemOrgPage"> & {
        body: OperationBody<"systemOrgPage">;
      },
      config: PureHttpRequestConfig = {}
    ) {
      return transport.request<OperationResponse<"systemOrgPage">>(
        "post",
        interpolate("/admin/system/org/page", input.path),
        { params: input.query, headers: input.headers, data: input.body },
        config
      );
    },
    systemOrgSchema(
      input: OperationInput<"systemOrgSchema"> = {},
      config: PureHttpRequestConfig = {}
    ) {
      return transport.request<OperationResponse<"systemOrgSchema">>(
        "get",
        interpolate("/admin/system/org/schema", input.path),
        { params: input.query, headers: input.headers, data: input.body },
        config
      );
    },
    systemOrgUpdate(
      input: OperationInput<"systemOrgUpdate"> & {
        body: OperationBody<"systemOrgUpdate">;
      },
      config: PureHttpRequestConfig = {}
    ) {
      return transport.request<OperationResponse<"systemOrgUpdate">>(
        "post",
        interpolate("/admin/system/org/update", input.path),
        { params: input.query, headers: input.headers, data: input.body },
        config
      );
    },
    systemParameterAdd(
      input: OperationInput<"systemParameterAdd"> & {
        body: OperationBody<"systemParameterAdd">;
      },
      config: PureHttpRequestConfig = {}
    ) {
      return transport.request<OperationResponse<"systemParameterAdd">>(
        "post",
        interpolate("/admin/system/parameter/add", input.path),
        { params: input.query, headers: input.headers, data: input.body },
        config
      );
    },
    systemParameterDelete(
      input: OperationInput<"systemParameterDelete"> & {
        body: OperationBody<"systemParameterDelete">;
      },
      config: PureHttpRequestConfig = {}
    ) {
      return transport.request<OperationResponse<"systemParameterDelete">>(
        "post",
        interpolate("/admin/system/parameter/delete", input.path),
        { params: input.query, headers: input.headers, data: input.body },
        config
      );
    },
    systemParameterInfo(
      input: OperationInput<"systemParameterInfo"> & {
        body: OperationBody<"systemParameterInfo">;
      },
      config: PureHttpRequestConfig = {}
    ) {
      return transport.request<OperationResponse<"systemParameterInfo">>(
        "post",
        interpolate("/admin/system/parameter/info", input.path),
        { params: input.query, headers: input.headers, data: input.body },
        config
      );
    },
    systemParameterPage(
      input: OperationInput<"systemParameterPage"> & {
        body: OperationBody<"systemParameterPage">;
      },
      config: PureHttpRequestConfig = {}
    ) {
      return transport.request<OperationResponse<"systemParameterPage">>(
        "post",
        interpolate("/admin/system/parameter/page", input.path),
        { params: input.query, headers: input.headers, data: input.body },
        config
      );
    },
    systemParameterSchema(
      input: OperationInput<"systemParameterSchema"> = {},
      config: PureHttpRequestConfig = {}
    ) {
      return transport.request<OperationResponse<"systemParameterSchema">>(
        "get",
        interpolate("/admin/system/parameter/schema", input.path),
        { params: input.query, headers: input.headers, data: input.body },
        config
      );
    },
    systemParameterUpdate(
      input: OperationInput<"systemParameterUpdate"> & {
        body: OperationBody<"systemParameterUpdate">;
      },
      config: PureHttpRequestConfig = {}
    ) {
      return transport.request<OperationResponse<"systemParameterUpdate">>(
        "post",
        interpolate("/admin/system/parameter/update", input.path),
        { params: input.query, headers: input.headers, data: input.body },
        config
      );
    },
    systemPermissionList(
      input: OperationInput<"systemPermissionList"> = {},
      config: PureHttpRequestConfig = {}
    ) {
      return transport.request<OperationResponse<"systemPermissionList">>(
        "get",
        interpolate("/admin/system/permission/list", input.path),
        { params: input.query, headers: input.headers, data: input.body },
        config
      );
    },
    systemRoleAdd(
      input: OperationInput<"systemRoleAdd"> & {
        body: OperationBody<"systemRoleAdd">;
      },
      config: PureHttpRequestConfig = {}
    ) {
      return transport.request<OperationResponse<"systemRoleAdd">>(
        "post",
        interpolate("/admin/system/role/add", input.path),
        { params: input.query, headers: input.headers, data: input.body },
        config
      );
    },
    systemRoleDelete(
      input: OperationInput<"systemRoleDelete"> & {
        body: OperationBody<"systemRoleDelete">;
      },
      config: PureHttpRequestConfig = {}
    ) {
      return transport.request<OperationResponse<"systemRoleDelete">>(
        "post",
        interpolate("/admin/system/role/delete", input.path),
        { params: input.query, headers: input.headers, data: input.body },
        config
      );
    },
    systemRoleInfo(
      input: OperationInput<"systemRoleInfo"> & {
        body: OperationBody<"systemRoleInfo">;
      },
      config: PureHttpRequestConfig = {}
    ) {
      return transport.request<OperationResponse<"systemRoleInfo">>(
        "post",
        interpolate("/admin/system/role/info", input.path),
        { params: input.query, headers: input.headers, data: input.body },
        config
      );
    },
    systemRolePage(
      input: OperationInput<"systemRolePage"> & {
        body: OperationBody<"systemRolePage">;
      },
      config: PureHttpRequestConfig = {}
    ) {
      return transport.request<OperationResponse<"systemRolePage">>(
        "post",
        interpolate("/admin/system/role/page", input.path),
        { params: input.query, headers: input.headers, data: input.body },
        config
      );
    },
    systemRoleSchema(
      input: OperationInput<"systemRoleSchema"> = {},
      config: PureHttpRequestConfig = {}
    ) {
      return transport.request<OperationResponse<"systemRoleSchema">>(
        "get",
        interpolate("/admin/system/role/schema", input.path),
        { params: input.query, headers: input.headers, data: input.body },
        config
      );
    },
    systemRoleUpdate(
      input: OperationInput<"systemRoleUpdate"> & {
        body: OperationBody<"systemRoleUpdate">;
      },
      config: PureHttpRequestConfig = {}
    ) {
      return transport.request<OperationResponse<"systemRoleUpdate">>(
        "post",
        interpolate("/admin/system/role/update", input.path),
        { params: input.query, headers: input.headers, data: input.body },
        config
      );
    },
    systemUserRoleAdd(
      input: OperationInput<"systemUserRoleAdd"> & {
        body: OperationBody<"systemUserRoleAdd">;
      },
      config: PureHttpRequestConfig = {}
    ) {
      return transport.request<OperationResponse<"systemUserRoleAdd">>(
        "post",
        interpolate("/admin/system/user-role/add", input.path),
        { params: input.query, headers: input.headers, data: input.body },
        config
      );
    },
    systemUserRoleDelete(
      input: OperationInput<"systemUserRoleDelete"> & {
        body: OperationBody<"systemUserRoleDelete">;
      },
      config: PureHttpRequestConfig = {}
    ) {
      return transport.request<OperationResponse<"systemUserRoleDelete">>(
        "post",
        interpolate("/admin/system/user-role/delete", input.path),
        { params: input.query, headers: input.headers, data: input.body },
        config
      );
    },
    systemUserRoleInfo(
      input: OperationInput<"systemUserRoleInfo"> & {
        body: OperationBody<"systemUserRoleInfo">;
      },
      config: PureHttpRequestConfig = {}
    ) {
      return transport.request<OperationResponse<"systemUserRoleInfo">>(
        "post",
        interpolate("/admin/system/user-role/info", input.path),
        { params: input.query, headers: input.headers, data: input.body },
        config
      );
    },
    systemUserRolePage(
      input: OperationInput<"systemUserRolePage"> & {
        body: OperationBody<"systemUserRolePage">;
      },
      config: PureHttpRequestConfig = {}
    ) {
      return transport.request<OperationResponse<"systemUserRolePage">>(
        "post",
        interpolate("/admin/system/user-role/page", input.path),
        { params: input.query, headers: input.headers, data: input.body },
        config
      );
    },
    systemUserRoleSchema(
      input: OperationInput<"systemUserRoleSchema"> = {},
      config: PureHttpRequestConfig = {}
    ) {
      return transport.request<OperationResponse<"systemUserRoleSchema">>(
        "get",
        interpolate("/admin/system/user-role/schema", input.path),
        { params: input.query, headers: input.headers, data: input.body },
        config
      );
    },
    systemUserRoleUpdate(
      input: OperationInput<"systemUserRoleUpdate"> & {
        body: OperationBody<"systemUserRoleUpdate">;
      },
      config: PureHttpRequestConfig = {}
    ) {
      return transport.request<OperationResponse<"systemUserRoleUpdate">>(
        "post",
        interpolate("/admin/system/user-role/update", input.path),
        { params: input.query, headers: input.headers, data: input.body },
        config
      );
    },
    systemUserSupervisorAdd(
      input: OperationInput<"systemUserSupervisorAdd"> & {
        body: OperationBody<"systemUserSupervisorAdd">;
      },
      config: PureHttpRequestConfig = {}
    ) {
      return transport.request<OperationResponse<"systemUserSupervisorAdd">>(
        "post",
        interpolate("/admin/system/user-supervisor/add", input.path),
        { params: input.query, headers: input.headers, data: input.body },
        config
      );
    },
    systemUserSupervisorDelete(
      input: OperationInput<"systemUserSupervisorDelete"> & {
        body: OperationBody<"systemUserSupervisorDelete">;
      },
      config: PureHttpRequestConfig = {}
    ) {
      return transport.request<OperationResponse<"systemUserSupervisorDelete">>(
        "post",
        interpolate("/admin/system/user-supervisor/delete", input.path),
        { params: input.query, headers: input.headers, data: input.body },
        config
      );
    },
    systemUserSupervisorInfo(
      input: OperationInput<"systemUserSupervisorInfo"> & {
        body: OperationBody<"systemUserSupervisorInfo">;
      },
      config: PureHttpRequestConfig = {}
    ) {
      return transport.request<OperationResponse<"systemUserSupervisorInfo">>(
        "post",
        interpolate("/admin/system/user-supervisor/info", input.path),
        { params: input.query, headers: input.headers, data: input.body },
        config
      );
    },
    systemUserSupervisorPage(
      input: OperationInput<"systemUserSupervisorPage"> & {
        body: OperationBody<"systemUserSupervisorPage">;
      },
      config: PureHttpRequestConfig = {}
    ) {
      return transport.request<OperationResponse<"systemUserSupervisorPage">>(
        "post",
        interpolate("/admin/system/user-supervisor/page", input.path),
        { params: input.query, headers: input.headers, data: input.body },
        config
      );
    },
    systemUserSupervisorSchema(
      input: OperationInput<"systemUserSupervisorSchema"> = {},
      config: PureHttpRequestConfig = {}
    ) {
      return transport.request<OperationResponse<"systemUserSupervisorSchema">>(
        "get",
        interpolate("/admin/system/user-supervisor/schema", input.path),
        { params: input.query, headers: input.headers, data: input.body },
        config
      );
    },
    systemUserSupervisorUpdate(
      input: OperationInput<"systemUserSupervisorUpdate"> & {
        body: OperationBody<"systemUserSupervisorUpdate">;
      },
      config: PureHttpRequestConfig = {}
    ) {
      return transport.request<OperationResponse<"systemUserSupervisorUpdate">>(
        "post",
        interpolate("/admin/system/user-supervisor/update", input.path),
        { params: input.query, headers: input.headers, data: input.body },
        config
      );
    },
    systemUserChangePassword(
      input: OperationInput<"systemUserChangePassword"> & {
        body: OperationBody<"systemUserChangePassword">;
      },
      config: PureHttpRequestConfig = {}
    ) {
      return transport.request<OperationResponse<"systemUserChangePassword">>(
        "post",
        interpolate("/admin/system/user/change-password", input.path),
        { params: input.query, headers: input.headers, data: input.body },
        config
      );
    },
    systemUserCreate(
      input: OperationInput<"systemUserCreate"> & {
        body: OperationBody<"systemUserCreate">;
      },
      config: PureHttpRequestConfig = {}
    ) {
      return transport.request<OperationResponse<"systemUserCreate">>(
        "post",
        interpolate("/admin/system/user/create", input.path),
        { params: input.query, headers: input.headers, data: input.body },
        config
      );
    },
    systemUserDelete(
      input: OperationInput<"systemUserDelete"> & {
        body: OperationBody<"systemUserDelete">;
      },
      config: PureHttpRequestConfig = {}
    ) {
      return transport.request<OperationResponse<"systemUserDelete">>(
        "post",
        interpolate("/admin/system/user/delete", input.path),
        { params: input.query, headers: input.headers, data: input.body },
        config
      );
    },
    systemUserInfo(
      input: OperationInput<"systemUserInfo"> & {
        body: OperationBody<"systemUserInfo">;
      },
      config: PureHttpRequestConfig = {}
    ) {
      return transport.request<OperationResponse<"systemUserInfo">>(
        "post",
        interpolate("/admin/system/user/info", input.path),
        { params: input.query, headers: input.headers, data: input.body },
        config
      );
    },
    systemUserMe(
      input: OperationInput<"systemUserMe"> = {},
      config: PureHttpRequestConfig = {}
    ) {
      return transport.request<OperationResponse<"systemUserMe">>(
        "get",
        interpolate("/admin/system/user/me", input.path),
        { params: input.query, headers: input.headers, data: input.body },
        config
      );
    },
    systemUserPage(
      input: OperationInput<"systemUserPage"> & {
        body: OperationBody<"systemUserPage">;
      },
      config: PureHttpRequestConfig = {}
    ) {
      return transport.request<OperationResponse<"systemUserPage">>(
        "post",
        interpolate("/admin/system/user/page", input.path),
        { params: input.query, headers: input.headers, data: input.body },
        config
      );
    },
    systemUserResetPassword(
      input: OperationInput<"systemUserResetPassword"> & {
        body: OperationBody<"systemUserResetPassword">;
      },
      config: PureHttpRequestConfig = {}
    ) {
      return transport.request<OperationResponse<"systemUserResetPassword">>(
        "post",
        interpolate("/admin/system/user/reset-password", input.path),
        { params: input.query, headers: input.headers, data: input.body },
        config
      );
    },
    systemUserSchema(
      input: OperationInput<"systemUserSchema"> = {},
      config: PureHttpRequestConfig = {}
    ) {
      return transport.request<OperationResponse<"systemUserSchema">>(
        "get",
        interpolate("/admin/system/user/schema", input.path),
        { params: input.query, headers: input.headers, data: input.body },
        config
      );
    },
    systemUserUpdate(
      input: OperationInput<"systemUserUpdate"> & {
        body: OperationBody<"systemUserUpdate">;
      },
      config: PureHttpRequestConfig = {}
    ) {
      return transport.request<OperationResponse<"systemUserUpdate">>(
        "post",
        interpolate("/admin/system/user/update", input.path),
        { params: input.query, headers: input.headers, data: input.body },
        config
      );
    }
  };
}
export const api = createApiClient();
