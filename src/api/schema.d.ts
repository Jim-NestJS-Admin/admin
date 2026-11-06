// 此文件由 pnpm gen:api 生成，禁止手改。
export type paths = {
  "/admin/auth/captcha": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * 出人机验证题
     * @description 直接返回 ALTCHA 题目对象（不包统一结构），给前端 altcha 组件用；出错时照常返回统一结构
     */
    get: operations["authCaptcha"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/auth/login": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 账号密码登录 */
    post: operations["authLogin"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/auth/logout": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * 退出
     * @description 有访问令牌就带上；吊销本会话并清 Cookie，会话本来就没了也返回成功
     */
    post: operations["authLogout"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/auth/refresh": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * 刷新访问令牌
     * @description 靠 Cookie 里的刷新令牌，同时换新的刷新令牌。失败一律 401 并清 Cookie，不要重试
     */
    post: operations["authRefresh"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/session/menu": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** 菜单树和权限码 */
    get: operations["sessionMenu"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/session/profile": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** 当前用户、当前组织、可切换的组织 */
    get: operations["sessionProfile"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/session/switch-org": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * 切换当前组织
     * @description 返回带新组织的访问令牌，同时换刷新令牌 Cookie；旧访问令牌立即失效
     */
    post: operations["sessionSwitchOrg"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
};
export type webhooks = Record<string, never>;
export type components = {
  schemas: {
    ApiErrorBody: {
      /**
       * @description 业务码，非 1000 都是失败
       * @example 4000
       */
      code: number;
      data: components["schemas"]["ApiErrorData"] | null;
      /** @example 请求参数有误 */
      message: string;
    };
    ApiErrorData: {
      errors?: components["schemas"]["ApiFieldError"][];
    };
    ApiFieldError: {
      /** @description 新增子行的客户端标识 */
      clientId?: string;
      /** @example username */
      field: string;
      /** @description 已有子行的编号 */
      id?: string;
      /** @description 新增子行没有可用的 clientId 时，它在 added 里的位置（从 0 开始） */
      index?: number;
      messages: string[];
      /** @description 子表资源名（主子表保存时） */
      resource?: string;
    };
    LoginDto: {
      /** @description altcha 组件给出的结果 */
      altcha?: string;
      /** Format: password */
      password: string;
      /**
       * @description 不区分大小写，首尾空格忽略
       * @example admin
       */
      username: string;
    };
    MenuItemDto: {
      children?: components["schemas"]["MenuItemDto"][];
      /** @description 前端页面相对路径，只认本地白名单 */
      component?: string | null;
      hidden?: boolean;
      icon: string | null;
      id: string;
      keepAlive?: boolean;
      path: string;
      permission?: string | null;
      rank: number;
      /** @description 后台配置的显示名 */
      title: string;
      /** @enum {string} */
      type: "directory" | "page";
    };
    MenuResult: {
      /** @description 授权版本，只用来判断权限变了没有 */
      authVersion: number;
      /** @description 菜单树，不含按钮 */
      menus: components["schemas"]["MenuItemDto"][];
      /** @description 当前组织下的权限码，明确列表，没有通配符 */
      permissions: string[];
    };
    OrgOption: {
      id: string;
      name: string;
      /** @description 从根到自己的名称 */
      path: string[];
    };
    ProfileResult: {
      currentOrg: components["schemas"]["OrgOption"] | null;
      /** @example zh-CN */
      locale: string;
      /** @description 有角色的组织，可以切换 */
      orgs: components["schemas"]["OrgOption"][];
      user: components["schemas"]["ProfileUser"];
    };
    ProfileUser: {
      avatar: string | null;
      id: string;
      nickname: string;
      username: string;
    };
    SwitchOrgDto: {
      /** @description 要切换到的组织编号 */
      orgId: string;
    };
    TokenResult: {
      /** @description 访问令牌，只放内存，放在 Authorization: Bearer 头里 */
      accessToken: string;
      /**
       * @description 访问令牌多少秒后过期
       * @example 1800
       */
      expiresIn: number;
      /** @enum {string} */
      tokenType: "Bearer";
    };
  };
  responses: never;
  parameters: never;
  requestBodies: never;
  headers: never;
  pathItems: never;
};
export type $defs = Record<string, never>;
export interface operations {
  authCaptcha: {
    parameters: {
      query: {
        /** @description 用户输入的账号原文，出题和登录必须传同一个值 */
        account: string;
        /** @description 用途，后台只有 login */
        purpose: "login";
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description ALTCHA 题目对象 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": Record<string, never>;
        };
      };
      /** @description 4000：参数有误、唯一冲突等，字段错误在 data.errors */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ApiErrorBody"];
        };
      };
      /** @description 5003：服务暂不可用 */
      503: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ApiErrorBody"];
        };
      };
    };
  };
  authLogin: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["LoginDto"];
      };
    };
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": {
            /** @enum {integer} */
            code: 1000;
            data: components["schemas"]["TokenResult"];
            /** @example ok */
            message: string;
          };
        };
      };
      /** @description 4000：参数有误、唯一冲突等，字段错误在 data.errors */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ApiErrorBody"];
        };
      };
      /** @description 4029：请求太频繁或输错次数过多，data.retryAfterSeconds 是多少秒后再试 */
      429: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ApiErrorBody"];
        };
      };
      /** @description 5003：服务暂不可用 */
      503: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ApiErrorBody"];
        };
      };
    };
  };
  authLogout: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": {
            /** @enum {integer} */
            code: 1000;
            data: Record<string, never> | null;
            /** @example ok */
            message: string;
          };
        };
      };
      /** @description 4003：没有权限 */
      403: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ApiErrorBody"];
        };
      };
      /** @description 5003：服务暂不可用 */
      503: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ApiErrorBody"];
        };
      };
    };
  };
  authRefresh: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": {
            /** @enum {integer} */
            code: 1000;
            data: components["schemas"]["TokenResult"];
            /** @example ok */
            message: string;
          };
        };
      };
      /** @description 4001：没有登录、访问令牌无效或会话已失效 */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ApiErrorBody"];
        };
      };
      /** @description 4003：没有权限 */
      403: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ApiErrorBody"];
        };
      };
      /** @description 5003：服务暂不可用 */
      503: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ApiErrorBody"];
        };
      };
    };
  };
  sessionMenu: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": {
            /** @enum {integer} */
            code: 1000;
            data: components["schemas"]["MenuResult"];
            /** @example ok */
            message: string;
          };
        };
      };
      /** @description 4001：没有登录、访问令牌无效或会话已失效 */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ApiErrorBody"];
        };
      };
      /** @description 5003：服务暂不可用 */
      503: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ApiErrorBody"];
        };
      };
    };
  };
  sessionProfile: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": {
            /** @enum {integer} */
            code: 1000;
            data: components["schemas"]["ProfileResult"];
            /** @example ok */
            message: string;
          };
        };
      };
      /** @description 4001：没有登录、访问令牌无效或会话已失效 */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ApiErrorBody"];
        };
      };
      /** @description 5003：服务暂不可用 */
      503: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ApiErrorBody"];
        };
      };
    };
  };
  sessionSwitchOrg: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["SwitchOrgDto"];
      };
    };
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": {
            /** @enum {integer} */
            code: 1000;
            data: components["schemas"]["TokenResult"];
            /** @example ok */
            message: string;
          };
        };
      };
      /** @description 4000：参数有误、唯一冲突等，字段错误在 data.errors */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ApiErrorBody"];
        };
      };
      /** @description 4001：没有登录、访问令牌无效或会话已失效 */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ApiErrorBody"];
        };
      };
      /** @description 4003：没有权限 */
      403: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ApiErrorBody"];
        };
      };
      /** @description 5003：服务暂不可用 */
      503: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ApiErrorBody"];
        };
      };
    };
  };
}
