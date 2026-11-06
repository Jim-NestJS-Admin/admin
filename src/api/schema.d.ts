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
     * 获取图形验证码
     * @description 字母数字验证码，2 分钟有效，只能用一次（答错也作废，要重新获取）；account 传用户输入的账号
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
  "/admin/system/menu/add": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 新增菜单 */
    post: operations["systemMenuAdd"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/system/menu/delete": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 删除菜单（整批成败） */
    post: operations["systemMenuDelete"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/system/menu/info": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 菜单详情 */
    post: operations["systemMenuInfo"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/system/menu/page": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 菜单分页列表 */
    post: operations["systemMenuPage"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/system/menu/schema": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** 菜单页面描述 */
    get: operations["systemMenuSchema"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/system/menu/update": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 修改菜单 */
    post: operations["systemMenuUpdate"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/system/org/add": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 新增组织 */
    post: operations["systemOrgAdd"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/system/org/delete": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 删除组织（整批成败） */
    post: operations["systemOrgDelete"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/system/org/info": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 组织详情 */
    post: operations["systemOrgInfo"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/system/org/page": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 组织分页列表 */
    post: operations["systemOrgPage"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/system/org/schema": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** 组织页面描述 */
    get: operations["systemOrgSchema"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/system/org/update": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 修改组织 */
    post: operations["systemOrgUpdate"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/system/permission/list": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** 后端已声明权限码及风险级别 */
    get: operations["systemPermissionList"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/system/role/add": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 新增角色 */
    post: operations["systemRoleAdd"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/system/role/delete": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 删除角色（整批成败） */
    post: operations["systemRoleDelete"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/system/role/info": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 角色详情 */
    post: operations["systemRoleInfo"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/system/role/page": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 角色分页列表 */
    post: operations["systemRolePage"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/system/role/schema": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** 角色页面描述 */
    get: operations["systemRoleSchema"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/system/role/update": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 修改角色 */
    post: operations["systemRoleUpdate"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/system/user-role/add": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 新增用户组织角色分配 */
    post: operations["systemUserRoleAdd"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/system/user-role/delete": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 删除用户组织角色分配（整批成败） */
    post: operations["systemUserRoleDelete"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/system/user-role/info": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 用户组织角色分配详情 */
    post: operations["systemUserRoleInfo"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/system/user-role/page": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 用户组织角色分配分页列表 */
    post: operations["systemUserRolePage"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/system/user-role/schema": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** 用户组织角色分配页面描述 */
    get: operations["systemUserRoleSchema"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/system/user-role/update": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 修改用户组织角色分配 */
    post: operations["systemUserRoleUpdate"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/system/user-supervisor/add": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 新增用户多上级 */
    post: operations["systemUserSupervisorAdd"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/system/user-supervisor/delete": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 删除用户多上级（整批成败） */
    post: operations["systemUserSupervisorDelete"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/system/user-supervisor/info": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 用户多上级详情 */
    post: operations["systemUserSupervisorInfo"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/system/user-supervisor/page": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 用户多上级分页列表 */
    post: operations["systemUserSupervisorPage"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/system/user-supervisor/schema": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** 用户多上级页面描述 */
    get: operations["systemUserSupervisorSchema"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/system/user-supervisor/update": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 修改用户多上级 */
    post: operations["systemUserSupervisorUpdate"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/system/user/change-password": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 修改本人密码，核对原密码并吊销旧会话 */
    post: operations["systemUserChangePassword"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/system/user/create": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 创建用户并设置初始密码 */
    post: operations["systemUserCreate"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/system/user/delete": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 删除用户（整批成败） */
    post: operations["systemUserDelete"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/system/user/info": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 用户详情 */
    post: operations["systemUserInfo"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/system/user/page": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 用户分页列表 */
    post: operations["systemUserPage"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/system/user/reset-password": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 管理员重置密码并吊销用户会话 */
    post: operations["systemUserResetPassword"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/system/user/schema": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** 用户页面描述 */
    get: operations["systemUserSchema"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/system/user/update": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 修改用户 */
    post: operations["systemUserUpdate"];
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
    CaptchaResultDto: {
      /** @description 验证码编号，登录时原样带上 */
      captchaId: string;
      /** @description 验证码图片（data:image/svg+xml;base64,...），直接放进 img 的 src */
      image: string;
    };
    ChangeSystemPassword: {
      oldPassword: string;
      password: string;
      version: number;
    };
    CreateSystemUser: {
      defaultOrgId?: string | null;
      enabled?: boolean;
      nickname: string;
      /** @description 初始密码，按普通用户密码规则检查 */
      password: string;
      username: string;
    };
    CrudSchema: {
      actions: components["schemas"]["CrudSchemaActions"];
      api: (
        | "page"
        | "info"
        | "add"
        | "update"
        | "delete"
        | "recycle"
        | "restore"
        | "purge"
      )[];
      /** @description 子表；没有子表时为空数组 */
      children: components["schemas"]["CrudSchemaChild"][];
      columns: components["schemas"]["CrudSchemaColumn"][];
      defaultSort: components["schemas"]["CrudSchemaSort"][];
      /** @enum {string} */
      deleteMode: "soft" | "hard";
      dictionaries: {
        [key: string]: components["schemas"]["CrudSchemaDictItem"][];
      };
      form: components["schemas"]["CrudSchemaFormItem"][];
      label: string;
      maxSize: number;
      /**
       * @description 权限码前缀
       * @example system:user
       */
      permPrefix: string;
      query: components["schemas"]["CrudSchemaQueryItem"][];
      /** @example system/user */
      resource: string;
    };
    CrudSchemaActions: {
      add?: components["schemas"]["CrudSchemaWriteAction"];
      page?: components["schemas"]["CrudSchemaPageAction"];
      update?: components["schemas"]["CrudSchemaWriteAction"];
    };
    CrudSchemaChild: {
      add: components["schemas"]["CrudSchemaWriteAction"];
      columns: components["schemas"]["CrudSchemaColumn"][];
      form: components["schemas"]["CrudSchemaFormItem"][];
      label: string;
      max: number;
      min: number;
      /** @example items */
      resource: string;
      sortField?: string;
      /** @description 同一张单据里不能重复的字段组 */
      unique: string[][];
      update: components["schemas"]["CrudSchemaWriteAction"];
    };
    CrudSchemaColumn: {
      /** @description 字典名，对应 dictionaries 里的键 */
      dict?: string;
      field: string;
      label: string;
      sortable: boolean;
      width?: number;
    };
    CrudSchemaDictItem: {
      label: string;
      value: string | number | boolean;
    };
    CrudSchemaFormItem: {
      /** @enum {string} */
      component:
        | "input"
        | "textarea"
        | "number"
        | "select"
        | "switch"
        | "date"
        | "datetime";
      dict?: string;
      /**
       * @description both：新增和修改都能写；add：只在新增时写；none：只读
       * @enum {string}
       */
      edit: "both" | "add" | "none";
      field: string;
      label: string;
      placeholder?: string;
      required: boolean;
    };
    CrudSchemaPageAction: {
      filterable: string[];
      /** @description 搜索框匹配的字段 */
      keyWords: string[];
      /** @description 最多能看哪些列；每一行实际状态以接口逐行返回为准 */
      readable: string[];
      sortable: string[];
    };
    CrudSchemaQueryItem: {
      field: string;
      label: string;
      /** @description 可用的运算符；高级查询在 T18 扩展 */
      operators: string[];
    };
    CrudSchemaSort: {
      field: string;
      /** @enum {string} */
      order: "asc" | "desc";
    };
    CrudSchemaWriteAction: {
      writable: string[];
    };
    LoginDto: {
      /** @description 用户看图输入的验证码，不区分大小写 */
      captchaCode?: string;
      /** @description 验证码编号（出题接口返回的 captchaId） */
      captchaId?: string;
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
    PermissionItem: {
      code: string;
      /** @enum {string} */
      risk: "normal" | "high";
    };
    PermissionList: {
      list: components["schemas"]["PermissionItem"][];
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
    ResetSystemPassword: {
      id: string;
      password: string;
      version: number;
    };
    SwitchOrgDto: {
      /** @description 要切换到的组织编号 */
      orgId: string;
    };
    SystemMenuAddBody: {
      data: components["schemas"]["SystemMenuAddData"];
    };
    SystemMenuAddData: {
      /** @description 页面组件 */
      component?: Record<string, never> | null;
      /** @description 隐藏 */
      hidden?: boolean;
      /** @description 图标 */
      icon?: Record<string, never> | null;
      /** @description 缓存页面 */
      keepAlive?: boolean;
      /** @description 上级菜单 */
      parentId?: string | null;
      /** @description 路径 */
      path?: string;
      /** @description 权限码 */
      permission?: Record<string, never> | null;
      /** @description 排序 */
      rank?: number;
      /** @description 标题 */
      title: string;
      /** @description 类型 */
      type: Record<string, never>;
    };
    SystemMenuDeleteBody: {
      ids: string[];
    };
    SystemMenuDeleteResult: {
      /** @description 处理的行数 */
      count: number;
    };
    SystemMenuInfoBody: {
      /** @example 1 */
      id: string;
    };
    SystemMenuPageBody: {
      /** @description 按等于筛选 */
      eq?: components["schemas"]["SystemMenuPageEq"];
      /** @description 搜索框，模糊匹配：title、path */
      keyword?: string;
      /** @default 1 */
      page: number;
      /** @default 20 */
      size: number;
      sort?: components["schemas"]["SystemMenuPageSort"][];
    };
    SystemMenuPageEq: {
      /** @description 上级菜单 */
      parentId?: string | null;
      /** @description 类型 */
      type?: Record<string, never>;
    };
    SystemMenuPageResult: {
      list: components["schemas"]["SystemMenuRow"][];
      page: number;
      size: number;
      total: number;
    };
    SystemMenuPageSort: {
      /**
       * @description 排序字段
       * @enum {string}
       */
      field: "id" | "createdAt" | "updatedAt" | "rank";
      /** @enum {string} */
      order: "asc" | "desc";
    };
    SystemMenuRow: {
      /** @description 页面组件 */
      component?: Record<string, never> | null;
      /**
       * Format: date-time
       * @description 创建时间
       */
      createdAt: string;
      /** @description 创建人 */
      createdBy: string | null;
      /** @description 隐藏 */
      hidden?: boolean;
      /** @description 图标 */
      icon?: Record<string, never> | null;
      /**
       * @description 编号
       * @example 1
       */
      id: string;
      /** @description 缓存页面 */
      keepAlive?: boolean;
      /** @description 所属组织（新增时取当前组织，数据权限按它过滤） */
      orgId: string | null;
      /** @description 上级菜单 */
      parentId?: string | null;
      /** @description 路径 */
      path?: string;
      /** @description 权限码 */
      permission?: Record<string, never> | null;
      /** @description 排序 */
      rank?: number;
      /** @description 标题 */
      title: string;
      /** @description 类型 */
      type: Record<string, never>;
      /**
       * Format: date-time
       * @description 修改时间
       */
      updatedAt: string;
      /** @description 修改人 */
      updatedBy: string | null;
      /** @description 版本号，修改时原样带回 */
      version: number;
    };
    SystemMenuUpdateBody: {
      /** @description 只传要改的字段 */
      data: components["schemas"]["SystemMenuUpdateData"];
      /** @example 1 */
      id: string;
      /** @description 读到的版本号，原样带回 */
      version: number;
    };
    SystemMenuUpdateData: {
      /** @description 页面组件 */
      component?: Record<string, never> | null;
      /** @description 隐藏 */
      hidden?: boolean;
      /** @description 图标 */
      icon?: Record<string, never> | null;
      /** @description 缓存页面 */
      keepAlive?: boolean;
      /** @description 上级菜单 */
      parentId?: string | null;
      /** @description 路径 */
      path?: string;
      /** @description 权限码 */
      permission?: Record<string, never> | null;
      /** @description 排序 */
      rank?: number;
      /** @description 标题 */
      title?: string;
      /** @description 类型 */
      type?: Record<string, never>;
    };
    SystemMutationResult: {
      id: string;
    };
    SystemOrgAddBody: {
      data: components["schemas"]["SystemOrgAddData"];
    };
    SystemOrgAddData: {
      /** @description 启用 */
      enabled?: boolean;
      /** @description 组织名称 */
      name: string;
      /** @description 上级组织 */
      parentId?: string | null;
      /** @description 排序 */
      rank?: number;
    };
    SystemOrgDeleteBody: {
      ids: string[];
    };
    SystemOrgDeleteResult: {
      /** @description 处理的行数 */
      count: number;
    };
    SystemOrgInfoBody: {
      /** @example 1 */
      id: string;
    };
    SystemOrgPageBody: {
      /** @description 按等于筛选 */
      eq?: components["schemas"]["SystemOrgPageEq"];
      /** @description 搜索框，模糊匹配：name */
      keyword?: string;
      /** @default 1 */
      page: number;
      /** @default 20 */
      size: number;
      sort?: components["schemas"]["SystemOrgPageSort"][];
    };
    SystemOrgPageEq: {
      /** @description 启用 */
      enabled?: boolean;
      /** @description 上级组织 */
      parentId?: string | null;
    };
    SystemOrgPageResult: {
      list: components["schemas"]["SystemOrgRow"][];
      page: number;
      size: number;
      total: number;
    };
    SystemOrgPageSort: {
      /**
       * @description 排序字段
       * @enum {string}
       */
      field: "id" | "createdAt" | "updatedAt" | "rank";
      /** @enum {string} */
      order: "asc" | "desc";
    };
    SystemOrgRow: {
      /**
       * Format: date-time
       * @description 创建时间
       */
      createdAt: string;
      /** @description 创建人 */
      createdBy: string | null;
      /** @description 启用 */
      enabled?: boolean;
      /**
       * @description 编号
       * @example 1
       */
      id: string;
      /** @description 组织名称 */
      name: string;
      /** @description 所属组织（新增时取当前组织，数据权限按它过滤） */
      orgId: string | null;
      /** @description 上级组织 */
      parentId?: string | null;
      /** @description 排序 */
      rank?: number;
      /**
       * Format: date-time
       * @description 修改时间
       */
      updatedAt: string;
      /** @description 修改人 */
      updatedBy: string | null;
      /** @description 版本号，修改时原样带回 */
      version: number;
    };
    SystemOrgUpdateBody: {
      /** @description 只传要改的字段 */
      data: components["schemas"]["SystemOrgUpdateData"];
      /** @example 1 */
      id: string;
      /** @description 读到的版本号，原样带回 */
      version: number;
    };
    SystemOrgUpdateData: {
      /** @description 启用 */
      enabled?: boolean;
      /** @description 组织名称 */
      name?: string;
      /** @description 上级组织 */
      parentId?: string | null;
      /** @description 排序 */
      rank?: number;
    };
    SystemRoleAddBody: {
      data: components["schemas"]["SystemRoleAddData"];
    };
    SystemRoleAddData: {
      /** @description 角色标识 */
      code: string;
      /** @description 自定义组织 */
      customOrgIds?: string[];
      /**
       * @description 数据范围
       * @enum {string}
       */
      dataScope: "all" | "org" | "org_and_children" | "self" | "custom";
      /** @description 启用 */
      enabled?: boolean;
      /** @description 角色名称 */
      name: string;
      /** @description 权限码 */
      permissions: string[];
    };
    SystemRoleDeleteBody: {
      ids: string[];
    };
    SystemRoleDeleteResult: {
      /** @description 处理的行数 */
      count: number;
    };
    SystemRoleInfoBody: {
      /** @example 1 */
      id: string;
    };
    SystemRolePageBody: {
      /** @description 按等于筛选 */
      eq?: components["schemas"]["SystemRolePageEq"];
      /** @description 搜索框，模糊匹配：code、name */
      keyword?: string;
      /** @default 1 */
      page: number;
      /** @default 20 */
      size: number;
      sort?: components["schemas"]["SystemRolePageSort"][];
    };
    SystemRolePageEq: {
      /** @description 启用 */
      enabled?: boolean;
    };
    SystemRolePageResult: {
      list: components["schemas"]["SystemRoleRow"][];
      page: number;
      size: number;
      total: number;
    };
    SystemRolePageSort: {
      /**
       * @description 排序字段
       * @enum {string}
       */
      field: "id" | "createdAt" | "updatedAt";
      /** @enum {string} */
      order: "asc" | "desc";
    };
    SystemRoleRow: {
      /** @description 内置超级管理员 */
      allPermissions?: boolean;
      /** @description 角色标识 */
      code: string;
      /**
       * Format: date-time
       * @description 创建时间
       */
      createdAt: string;
      /** @description 创建人 */
      createdBy: string | null;
      /** @description 自定义组织 */
      customOrgIds?: string[];
      /**
       * @description 数据范围
       * @enum {string}
       */
      dataScope: "all" | "org" | "org_and_children" | "self" | "custom";
      /** @description 启用 */
      enabled?: boolean;
      /**
       * @description 编号
       * @example 1
       */
      id: string;
      /** @description 角色名称 */
      name: string;
      /** @description 所属组织（新增时取当前组织，数据权限按它过滤） */
      orgId: string | null;
      /** @description 权限码 */
      permissions: string[];
      /**
       * Format: date-time
       * @description 修改时间
       */
      updatedAt: string;
      /** @description 修改人 */
      updatedBy: string | null;
      /** @description 版本号，修改时原样带回 */
      version: number;
    };
    SystemRoleUpdateBody: {
      /** @description 只传要改的字段 */
      data: components["schemas"]["SystemRoleUpdateData"];
      /** @example 1 */
      id: string;
      /** @description 读到的版本号，原样带回 */
      version: number;
    };
    SystemRoleUpdateData: {
      /** @description 自定义组织 */
      customOrgIds?: string[];
      /**
       * @description 数据范围
       * @enum {string}
       */
      dataScope?: "all" | "org" | "org_and_children" | "self" | "custom";
      /** @description 启用 */
      enabled?: boolean;
      /** @description 角色名称 */
      name?: string;
      /** @description 权限码 */
      permissions?: string[];
    };
    SystemUserDeleteBody: {
      ids: string[];
    };
    SystemUserDeleteResult: {
      /** @description 处理的行数 */
      count: number;
    };
    SystemUserInfoBody: {
      /** @example 1 */
      id: string;
    };
    SystemUserPageBody: {
      /** @description 按等于筛选 */
      eq?: components["schemas"]["SystemUserPageEq"];
      /** @description 搜索框，模糊匹配：username、nickname */
      keyword?: string;
      /** @default 1 */
      page: number;
      /** @default 20 */
      size: number;
      sort?: components["schemas"]["SystemUserPageSort"][];
    };
    SystemUserPageEq: {
      /** @description 默认组织 */
      defaultOrgId?: string | null;
      /** @description 启用 */
      enabled?: boolean;
    };
    SystemUserPageResult: {
      list: components["schemas"]["SystemUserRow"][];
      page: number;
      size: number;
      total: number;
    };
    SystemUserPageSort: {
      /**
       * @description 排序字段
       * @enum {string}
       */
      field: "id" | "createdAt" | "updatedAt" | "username";
      /** @enum {string} */
      order: "asc" | "desc";
    };
    SystemUserRoleAddBody: {
      data: components["schemas"]["SystemUserRoleAddData"];
    };
    SystemUserRoleAddData: {
      /** @description 角色 */
      roleId: string;
      /** @description 作用范围组织 */
      scopeOrgId?: string | null;
      /** @description 用户 */
      userId: string;
    };
    SystemUserRoleDeleteBody: {
      ids: string[];
    };
    SystemUserRoleDeleteResult: {
      /** @description 处理的行数 */
      count: number;
    };
    SystemUserRoleInfoBody: {
      /** @example 1 */
      id: string;
    };
    SystemUserRolePageBody: {
      /** @description 按等于筛选 */
      eq?: components["schemas"]["SystemUserRolePageEq"];
      /** @description 这个资源没有配置搜索字段，传了也不生效 */
      keyword?: string;
      /** @default 1 */
      page: number;
      /** @default 20 */
      size: number;
      sort?: components["schemas"]["SystemUserRolePageSort"][];
    };
    SystemUserRolePageEq: {
      /** @description 角色 */
      roleId?: string;
      /** @description 作用范围组织 */
      scopeOrgId?: string | null;
      /** @description 用户 */
      userId?: string;
    };
    SystemUserRolePageResult: {
      list: components["schemas"]["SystemUserRoleRow"][];
      page: number;
      size: number;
      total: number;
    };
    SystemUserRolePageSort: {
      /**
       * @description 排序字段
       * @enum {string}
       */
      field: "id" | "createdAt" | "updatedAt";
      /** @enum {string} */
      order: "asc" | "desc";
    };
    SystemUserRoleRow: {
      /**
       * Format: date-time
       * @description 创建时间
       */
      createdAt: string;
      /** @description 创建人 */
      createdBy: string | null;
      /**
       * @description 编号
       * @example 1
       */
      id: string;
      /** @description 所属组织（新增时取当前组织，数据权限按它过滤） */
      orgId: string | null;
      /** @description 角色 */
      roleId: string;
      /** @description 作用范围组织 */
      scopeOrgId?: string | null;
      /**
       * Format: date-time
       * @description 修改时间
       */
      updatedAt: string;
      /** @description 修改人 */
      updatedBy: string | null;
      /** @description 用户 */
      userId: string;
      /** @description 版本号，修改时原样带回 */
      version: number;
    };
    SystemUserRoleUpdateBody: {
      /** @description 只传要改的字段 */
      data: components["schemas"]["SystemUserRoleUpdateData"];
      /** @example 1 */
      id: string;
      /** @description 读到的版本号，原样带回 */
      version: number;
    };
    SystemUserRoleUpdateData: {
      /** @description 角色 */
      roleId?: string;
      /** @description 作用范围组织 */
      scopeOrgId?: string | null;
    };
    SystemUserRow: {
      /** @description 头像 */
      avatar?: Record<string, never> | null;
      /**
       * Format: date-time
       * @description 创建时间
       */
      createdAt: string;
      /** @description 创建人 */
      createdBy: string | null;
      /** @description 默认组织 */
      defaultOrgId?: string | null;
      /** @description 启用 */
      enabled?: boolean;
      /**
       * @description 编号
       * @example 1
       */
      id: string;
      /** @description 语言 */
      locale?: string;
      /** @description 姓名 */
      nickname: string;
      /** @description 所属组织（新增时取当前组织，数据权限按它过滤） */
      orgId: string | null;
      /**
       * Format: date-time
       * @description 修改时间
       */
      updatedAt: string;
      /** @description 修改人 */
      updatedBy: string | null;
      /** @description 账号 */
      username: string;
      /** @description 版本号，修改时原样带回 */
      version: number;
    };
    SystemUserSupervisorAddBody: {
      data: components["schemas"]["SystemUserSupervisorAddData"];
    };
    SystemUserSupervisorAddData: {
      /** @description 上级用户 */
      supervisorId: string;
      /** @description 用户 */
      userId: string;
    };
    SystemUserSupervisorDeleteBody: {
      ids: string[];
    };
    SystemUserSupervisorDeleteResult: {
      /** @description 处理的行数 */
      count: number;
    };
    SystemUserSupervisorInfoBody: {
      /** @example 1 */
      id: string;
    };
    SystemUserSupervisorPageBody: {
      /** @description 按等于筛选 */
      eq?: components["schemas"]["SystemUserSupervisorPageEq"];
      /** @description 这个资源没有配置搜索字段，传了也不生效 */
      keyword?: string;
      /** @default 1 */
      page: number;
      /** @default 20 */
      size: number;
      sort?: components["schemas"]["SystemUserSupervisorPageSort"][];
    };
    SystemUserSupervisorPageEq: {
      /** @description 上级用户 */
      supervisorId?: string;
      /** @description 用户 */
      userId?: string;
    };
    SystemUserSupervisorPageResult: {
      list: components["schemas"]["SystemUserSupervisorRow"][];
      page: number;
      size: number;
      total: number;
    };
    SystemUserSupervisorPageSort: {
      /**
       * @description 排序字段
       * @enum {string}
       */
      field: "id" | "createdAt" | "updatedAt";
      /** @enum {string} */
      order: "asc" | "desc";
    };
    SystemUserSupervisorRow: {
      /**
       * Format: date-time
       * @description 创建时间
       */
      createdAt: string;
      /** @description 创建人 */
      createdBy: string | null;
      /**
       * @description 编号
       * @example 1
       */
      id: string;
      /** @description 所属组织（新增时取当前组织，数据权限按它过滤） */
      orgId: string | null;
      /** @description 上级用户 */
      supervisorId: string;
      /**
       * Format: date-time
       * @description 修改时间
       */
      updatedAt: string;
      /** @description 修改人 */
      updatedBy: string | null;
      /** @description 用户 */
      userId: string;
      /** @description 版本号，修改时原样带回 */
      version: number;
    };
    SystemUserSupervisorUpdateBody: {
      /** @description 只传要改的字段 */
      data: components["schemas"]["SystemUserSupervisorUpdateData"];
      /** @example 1 */
      id: string;
      /** @description 读到的版本号，原样带回 */
      version: number;
    };
    SystemUserSupervisorUpdateData: {
      /** @description 上级用户 */
      supervisorId?: string;
    };
    SystemUserUpdateBody: {
      /** @description 只传要改的字段 */
      data: components["schemas"]["SystemUserUpdateData"];
      /** @example 1 */
      id: string;
      /** @description 读到的版本号，原样带回 */
      version: number;
    };
    SystemUserUpdateData: {
      /** @description 头像 */
      avatar?: Record<string, never> | null;
      /** @description 默认组织 */
      defaultOrgId?: string | null;
      /** @description 启用 */
      enabled?: boolean;
      /** @description 语言 */
      locale?: string;
      /** @description 姓名 */
      nickname?: string;
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
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": {
            /** @enum {integer} */
            code: 1000;
            data: components["schemas"]["CaptchaResultDto"];
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
  systemMenuAdd: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["SystemMenuAddBody"];
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
            data: components["schemas"]["SystemMenuRow"];
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
    };
  };
  systemMenuDelete: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["SystemMenuDeleteBody"];
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
            data: components["schemas"]["SystemMenuDeleteResult"];
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
      /** @description 4004：数据不存在或无权访问 */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ApiErrorBody"];
        };
      };
    };
  };
  systemMenuInfo: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["SystemMenuInfoBody"];
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
            data: components["schemas"]["SystemMenuRow"];
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
      /** @description 4004：数据不存在或无权访问 */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ApiErrorBody"];
        };
      };
    };
  };
  systemMenuPage: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["SystemMenuPageBody"];
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
            data: components["schemas"]["SystemMenuPageResult"];
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
    };
  };
  systemMenuSchema: {
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
            data: components["schemas"]["CrudSchema"];
            /** @example ok */
            message: string;
          };
        };
      };
    };
  };
  systemMenuUpdate: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["SystemMenuUpdateBody"];
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
            data: components["schemas"]["SystemMenuRow"];
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
      /** @description 4004：数据不存在或无权访问 */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ApiErrorBody"];
        };
      };
      /** @description 4009：数据已被他人修改，请刷新后重试 */
      409: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ApiErrorBody"];
        };
      };
    };
  };
  systemOrgAdd: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["SystemOrgAddBody"];
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
            data: components["schemas"]["SystemOrgRow"];
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
    };
  };
  systemOrgDelete: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["SystemOrgDeleteBody"];
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
            data: components["schemas"]["SystemOrgDeleteResult"];
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
      /** @description 4004：数据不存在或无权访问 */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ApiErrorBody"];
        };
      };
    };
  };
  systemOrgInfo: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["SystemOrgInfoBody"];
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
            data: components["schemas"]["SystemOrgRow"];
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
      /** @description 4004：数据不存在或无权访问 */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ApiErrorBody"];
        };
      };
    };
  };
  systemOrgPage: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["SystemOrgPageBody"];
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
            data: components["schemas"]["SystemOrgPageResult"];
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
    };
  };
  systemOrgSchema: {
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
            data: components["schemas"]["CrudSchema"];
            /** @example ok */
            message: string;
          };
        };
      };
    };
  };
  systemOrgUpdate: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["SystemOrgUpdateBody"];
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
            data: components["schemas"]["SystemOrgRow"];
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
      /** @description 4004：数据不存在或无权访问 */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ApiErrorBody"];
        };
      };
      /** @description 4009：数据已被他人修改，请刷新后重试 */
      409: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ApiErrorBody"];
        };
      };
    };
  };
  systemPermissionList: {
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
            data: components["schemas"]["PermissionList"];
            /** @example ok */
            message: string;
          };
        };
      };
    };
  };
  systemRoleAdd: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["SystemRoleAddBody"];
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
            data: components["schemas"]["SystemRoleRow"];
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
    };
  };
  systemRoleDelete: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["SystemRoleDeleteBody"];
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
            data: components["schemas"]["SystemRoleDeleteResult"];
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
      /** @description 4004：数据不存在或无权访问 */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ApiErrorBody"];
        };
      };
    };
  };
  systemRoleInfo: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["SystemRoleInfoBody"];
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
            data: components["schemas"]["SystemRoleRow"];
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
      /** @description 4004：数据不存在或无权访问 */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ApiErrorBody"];
        };
      };
    };
  };
  systemRolePage: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["SystemRolePageBody"];
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
            data: components["schemas"]["SystemRolePageResult"];
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
    };
  };
  systemRoleSchema: {
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
            data: components["schemas"]["CrudSchema"];
            /** @example ok */
            message: string;
          };
        };
      };
    };
  };
  systemRoleUpdate: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["SystemRoleUpdateBody"];
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
            data: components["schemas"]["SystemRoleRow"];
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
      /** @description 4004：数据不存在或无权访问 */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ApiErrorBody"];
        };
      };
      /** @description 4009：数据已被他人修改，请刷新后重试 */
      409: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ApiErrorBody"];
        };
      };
    };
  };
  systemUserRoleAdd: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["SystemUserRoleAddBody"];
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
            data: components["schemas"]["SystemUserRoleRow"];
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
    };
  };
  systemUserRoleDelete: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["SystemUserRoleDeleteBody"];
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
            data: components["schemas"]["SystemUserRoleDeleteResult"];
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
      /** @description 4004：数据不存在或无权访问 */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ApiErrorBody"];
        };
      };
    };
  };
  systemUserRoleInfo: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["SystemUserRoleInfoBody"];
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
            data: components["schemas"]["SystemUserRoleRow"];
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
      /** @description 4004：数据不存在或无权访问 */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ApiErrorBody"];
        };
      };
    };
  };
  systemUserRolePage: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["SystemUserRolePageBody"];
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
            data: components["schemas"]["SystemUserRolePageResult"];
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
    };
  };
  systemUserRoleSchema: {
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
            data: components["schemas"]["CrudSchema"];
            /** @example ok */
            message: string;
          };
        };
      };
    };
  };
  systemUserRoleUpdate: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["SystemUserRoleUpdateBody"];
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
            data: components["schemas"]["SystemUserRoleRow"];
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
      /** @description 4004：数据不存在或无权访问 */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ApiErrorBody"];
        };
      };
      /** @description 4009：数据已被他人修改，请刷新后重试 */
      409: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ApiErrorBody"];
        };
      };
    };
  };
  systemUserSupervisorAdd: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["SystemUserSupervisorAddBody"];
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
            data: components["schemas"]["SystemUserSupervisorRow"];
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
    };
  };
  systemUserSupervisorDelete: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["SystemUserSupervisorDeleteBody"];
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
            data: components["schemas"]["SystemUserSupervisorDeleteResult"];
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
      /** @description 4004：数据不存在或无权访问 */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ApiErrorBody"];
        };
      };
    };
  };
  systemUserSupervisorInfo: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["SystemUserSupervisorInfoBody"];
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
            data: components["schemas"]["SystemUserSupervisorRow"];
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
      /** @description 4004：数据不存在或无权访问 */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ApiErrorBody"];
        };
      };
    };
  };
  systemUserSupervisorPage: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["SystemUserSupervisorPageBody"];
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
            data: components["schemas"]["SystemUserSupervisorPageResult"];
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
    };
  };
  systemUserSupervisorSchema: {
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
            data: components["schemas"]["CrudSchema"];
            /** @example ok */
            message: string;
          };
        };
      };
    };
  };
  systemUserSupervisorUpdate: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["SystemUserSupervisorUpdateBody"];
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
            data: components["schemas"]["SystemUserSupervisorRow"];
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
      /** @description 4004：数据不存在或无权访问 */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ApiErrorBody"];
        };
      };
      /** @description 4009：数据已被他人修改，请刷新后重试 */
      409: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ApiErrorBody"];
        };
      };
    };
  };
  systemUserChangePassword: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["ChangeSystemPassword"];
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
            data: components["schemas"]["SystemMutationResult"];
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
      /** @description 4009：数据已被他人修改，请刷新后重试 */
      409: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ApiErrorBody"];
        };
      };
    };
  };
  systemUserCreate: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["CreateSystemUser"];
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
            data: components["schemas"]["SystemMutationResult"];
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
      /** @description 4003：没有权限 */
      403: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ApiErrorBody"];
        };
      };
    };
  };
  systemUserDelete: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["SystemUserDeleteBody"];
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
            data: components["schemas"]["SystemUserDeleteResult"];
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
      /** @description 4004：数据不存在或无权访问 */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ApiErrorBody"];
        };
      };
    };
  };
  systemUserInfo: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["SystemUserInfoBody"];
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
            data: components["schemas"]["SystemUserRow"];
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
      /** @description 4004：数据不存在或无权访问 */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ApiErrorBody"];
        };
      };
    };
  };
  systemUserPage: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["SystemUserPageBody"];
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
            data: components["schemas"]["SystemUserPageResult"];
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
    };
  };
  systemUserResetPassword: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["ResetSystemPassword"];
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
            data: components["schemas"]["SystemMutationResult"];
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
      /** @description 4003：没有权限 */
      403: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ApiErrorBody"];
        };
      };
      /** @description 4004：数据不存在或无权访问 */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ApiErrorBody"];
        };
      };
      /** @description 4009：数据已被他人修改，请刷新后重试 */
      409: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ApiErrorBody"];
        };
      };
    };
  };
  systemUserSchema: {
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
            data: components["schemas"]["CrudSchema"];
            /** @example ok */
            message: string;
          };
        };
      };
    };
  };
  systemUserUpdate: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["SystemUserUpdateBody"];
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
            data: components["schemas"]["SystemUserRow"];
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
      /** @description 4004：数据不存在或无权访问 */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ApiErrorBody"];
        };
      };
      /** @description 4009：数据已被他人修改，请刷新后重试 */
      409: {
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
