import Axios, { type AxiosInstance } from "axios";
import { createApiClient } from "@/api/client";
import type { components } from "@/api/schema";
import { RequestFailure } from "@/utils/http";
import type { PureHttpRequestConfig, RequestMethods } from "@/utils/http/types";
import { normalizeFailure } from "./policy.mjs";
import type {
  AdminGateway,
  NavigationItem,
  SessionSnapshot
} from "./contracts";

type Schemas = components["schemas"];

/** 认证请求独立于业务请求的刷新拦截器，避免递归刷新或携带旧令牌。 */
export function createBackendGateway(
  currentToken: () => string,
  transport: AxiosInstance = Axios.create({ timeout: 15000 })
): AdminGateway {
  const client = (token = "") =>
    createApiClient({
      async request<T>(
        method: RequestMethods,
        url: string,
        params = {},
        config: PureHttpRequestConfig = {}
      ): Promise<T> {
        try {
          const headers = new Axios.AxiosHeaders({
            Accept: "application/json"
          });
          if (token) headers.set("Authorization", `Bearer ${token}`);
          const response = await transport.request({
            ...params,
            method,
            url,
            headers,
            signal: config.signal,
            withCredentials: true
          });
          if (config.responseMode !== "raw" && response.data?.code !== 1000)
            throw { response };
          return response.data as T;
        } catch (error) {
          throw new RequestFailure(normalizeFailure(error));
        }
      }
    });

  const menus = (items: Schemas["MenuItemDto"][]): NavigationItem[] =>
    items.map(item => ({
      key: `menu-${item.id}`,
      path: item.path,
      title: item.title,
      kind: item.type,
      view: item.component ?? undefined,
      permission: item.permission ?? undefined,
      hidden: item.hidden,
      keepAlive: item.keepAlive,
      rank: item.rank,
      icon: item.icon,
      children: item.children ? menus(item.children) : undefined
    }));

  const hydrate = async (
    token: Schemas["TokenResult"]
  ): Promise<SessionSnapshot> => {
    if (
      !token?.accessToken ||
      token.tokenType !== "Bearer" ||
      !Number.isFinite(token.expiresIn) ||
      token.expiresIn <= 0
    )
      throw new RequestFailure(normalizeFailure(null));
    // 过期时间从拿到令牌时计算，不因资料加载耗时而延长。
    const expiresAt = Date.now() + token.expiresIn * 1000;
    const authenticated = client(token.accessToken);
    const [profile, navigation] = await Promise.all([
      authenticated.sessionProfile(),
      authenticated.sessionMenu()
    ]);
    const data = profile.data;
    const access = navigation.data;
    if (
      !data?.user?.id ||
      typeof data.user.username !== "string" ||
      !Array.isArray(access?.permissions) ||
      !access.permissions.every(value => typeof value === "string") ||
      !Array.isArray(access.menus) ||
      !Number.isSafeInteger(access.authVersion)
    )
      throw new RequestFailure(normalizeFailure(null));
    return {
      accessToken: token.accessToken,
      expiresAt,
      user: data.user,
      organizationId: data.currentOrg?.id ?? "",
      authVersion: access.authVersion,
      organizations: data.orgs,
      permissions: access.permissions,
      menus: menus(access.menus)
    };
  };
  const refresh = async () => hydrate((await client().authRefresh()).data);
  return {
    async signIn(input) {
      const result = await client().authLogin({
        body: {
          username: input.account,
          password: input.password,
          captchaId: input.captchaId,
          captchaCode: input.captchaCode
        }
      });
      return hydrate(result.data);
    },
    refresh,
    async resume() {
      try {
        return await refresh();
      } catch (error) {
        if (
          error instanceof RequestFailure &&
          error.failure.status === 401 &&
          error.failure.code === 4001
        )
          return null;
        throw error;
      }
    },
    async signOut(accessToken = currentToken()) {
      await client(accessToken).authLogout();
    },
    async switchOrganization(id) {
      const token = currentToken();
      if (!token) throw new RequestFailure(normalizeFailure(null));
      return hydrate(
        (await client(token).sessionSwitchOrg({ body: { orgId: id } })).data
      );
    },
    async challenge(account, _language, signal) {
      const result = await client().authCaptcha(
        { query: { purpose: "login", account } },
        { signal }
      );
      if (
        !result.data?.captchaId ||
        typeof result.data.image !== "string" ||
        !/^data:image\/svg\+xml;base64,[A-Za-z0-9+/]+=*$/.test(
          result.data.image
        ) ||
        result.data.image.length > 128000
      )
        throw new RequestFailure(normalizeFailure(null));
      return { id: result.data.captchaId, image: result.data.image };
    }
  };
}
