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
  "/admin/system/dict-item/add": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 新增字典项 */
    post: operations["systemDictItemAdd"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/system/dict-item/delete": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 删除字典项（整批成败） */
    post: operations["systemDictItemDelete"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/system/dict-item/info": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 字典项详情 */
    post: operations["systemDictItemInfo"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/system/dict-item/page": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 字典项分页列表 */
    post: operations["systemDictItemPage"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/system/dict-item/schema": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** 字典项页面描述 */
    get: operations["systemDictItemSchema"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/system/dict-item/update": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 修改字典项 */
    post: operations["systemDictItemUpdate"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/system/dict-type/add": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 新增字典类型 */
    post: operations["systemDictTypeAdd"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/system/dict-type/data": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** 当前租户启用字典的下拉选项 */
    get: operations["systemDictionaryOptions"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/system/dict-type/delete": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 删除字典类型（整批成败） */
    post: operations["systemDictTypeDelete"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/system/dict-type/info": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 字典类型详情 */
    post: operations["systemDictTypeInfo"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/system/dict-type/page": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 字典类型分页列表 */
    post: operations["systemDictTypePage"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/system/dict-type/schema": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** 字典类型页面描述 */
    get: operations["systemDictTypeSchema"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/system/dict-type/update": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 修改字典类型 */
    post: operations["systemDictTypeUpdate"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/system/field-perm/registry": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** 字段权限清单（代码默认值） */
    get: operations["systemFieldPermRegistry"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/system/field/add": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 新增模块字段默认权限 */
    post: operations["systemFieldAdd"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/system/field/delete": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 删除模块字段默认权限（整批成败） */
    post: operations["systemFieldDelete"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/system/field/info": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 模块字段默认权限详情 */
    post: operations["systemFieldInfo"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/system/field/overview": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** 合并代码与当前租户模块字段默认配置 */
    get: operations["systemFieldOverview"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/system/field/page": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 模块字段默认权限分页列表 */
    post: operations["systemFieldPage"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/system/field/save": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 同事务保存模块字段默认权限 */
    post: operations["systemFieldSave"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/system/field/schema": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** 模块字段默认权限页面描述 */
    get: operations["systemFieldSchema"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/system/field/update": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 修改模块字段默认权限 */
    post: operations["systemFieldUpdate"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/system/login-log/info": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 登录日志详情 */
    post: operations["systemLoginLogInfo"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/system/login-log/page": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 登录日志分页列表 */
    post: operations["systemLoginLogPage"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/system/login-log/schema": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** 登录日志页面描述 */
    get: operations["systemLoginLogSchema"];
    put?: never;
    post?: never;
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
  "/admin/system/operation-log/info": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 操作日志详情 */
    post: operations["systemOperationLogInfo"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/system/operation-log/page": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 操作日志分页列表 */
    post: operations["systemOperationLogPage"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/system/operation-log/schema": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** 操作日志页面描述 */
    get: operations["systemOperationLogSchema"];
    put?: never;
    post?: never;
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
  "/admin/system/parameter/add": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 新增系统参数 */
    post: operations["systemParameterAdd"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/system/parameter/delete": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 删除系统参数（整批成败） */
    post: operations["systemParameterDelete"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/system/parameter/info": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 系统参数详情 */
    post: operations["systemParameterInfo"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/system/parameter/page": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 系统参数分页列表 */
    post: operations["systemParameterPage"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/system/parameter/schema": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** 系统参数页面描述 */
    get: operations["systemParameterSchema"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/system/parameter/update": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 修改系统参数 */
    post: operations["systemParameterUpdate"];
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
  "/admin/system/role-field/add": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 新增角色字段权限 */
    post: operations["systemRoleFieldAdd"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/system/role-field/delete": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 删除角色字段权限（整批成败） */
    post: operations["systemRoleFieldDelete"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/system/role-field/info": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 角色字段权限详情 */
    post: operations["systemRoleFieldInfo"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/system/role-field/overview": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** 角色字段权限与模块默认的配置读模型 */
    get: operations["systemRoleFieldOverview"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/system/role-field/page": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 角色字段权限分页列表 */
    post: operations["systemRoleFieldPage"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/system/role-field/save": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 同事务保存角色字段权限，支持整模块和复制后的变更 */
    post: operations["systemRoleFieldSave"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/system/role-field/schema": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** 角色字段权限页面描述 */
    get: operations["systemRoleFieldSchema"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/system/role-field/update": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 修改角色字段权限 */
    post: operations["systemRoleFieldUpdate"];
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
  "/admin/system/user/me": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** 本人账号与当前版本，不依赖用户管理权限 */
    get: operations["systemUserMe"];
    put?: never;
    post?: never;
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
    DictionaryOption: {
      label: string;
      value: string;
    };
    DictionaryOptions: {
      items: components["schemas"]["DictionaryOption"][];
    };
    FieldConfigurationChange: {
      /** @enum {string|null} */
      delegable?: "editable" | "readonly" | "masked" | "hidden" | null;
      field: string;
      /** @enum {string|null} */
      mask?: "phone" | "email" | "idcard" | "last4" | "all" | null;
      resource: string;
      /**
       * @description null表示跟随默认；新增配置version传0
       * @enum {string|null}
       */
      state: "editable" | "readonly" | "masked" | "hidden" | null;
      version: number;
    };
    FieldConfigurationEntry: {
      /** @enum {string} */
      codeDefault: "editable" | "readonly" | "masked" | "hidden";
      /** @enum {string|null} */
      codeDelegable: "editable" | "readonly" | "masked" | "hidden" | null;
      /** @enum {string|null} */
      codeMask: "phone" | "email" | "idcard" | "last4" | "all" | null;
      /** @enum {string|null} */
      defaultDelegable: "editable" | "readonly" | "masked" | "hidden" | null;
      /** @enum {string|null} */
      defaultMask: "phone" | "email" | "idcard" | "last4" | "all" | null;
      /** @enum {string} */
      defaultState: "editable" | "readonly" | "masked" | "hidden";
      /** @enum {string|null} */
      delegable: "editable" | "readonly" | "masked" | "hidden" | null;
      field: string;
      label: string;
      /** @enum {string|null} */
      mask: "phone" | "email" | "idcard" | "last4" | "all" | null;
      resource: string;
      resourceLabel: string;
      /**
       * @description null表示跟随默认
       * @enum {string|null}
       */
      state: "editable" | "readonly" | "masked" | "hidden" | null;
      /** @description 当前目标覆盖版本；没有覆盖为0 */
      version: number;
    };
    FieldConfigurationOverview: {
      fields: components["schemas"]["FieldConfigurationEntry"][];
    };
    FieldConfigurationResult: {
      count: number;
    };
    FieldPermFieldDto: {
      configurable: boolean;
      /**
       * @description 代码默认状态
       * @enum {string}
       */
      default: "editable" | "readonly" | "masked" | "hidden";
      /**
       * @description 可委派上限
       * @enum {string|null}
       */
      delegable: "editable" | "readonly" | "masked" | "hidden" | null;
      /** @description 实体属性名 */
      field: string;
      label: string;
      /** @enum {string|null} */
      mask: "phone" | "email" | "idcard" | "last4" | "all" | null;
    };
    FieldPermRegistryDto: {
      masks: components["schemas"]["MaskRuleDto"][];
      resources: components["schemas"]["FieldPermResourceDto"][];
    };
    FieldPermResourceDto: {
      fields: components["schemas"]["FieldPermFieldDto"][];
      label: string;
      /** @description 资源（权限码前缀），如 system:user */
      resource: string;
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
    MaskRuleDto: {
      /** @enum {string} */
      code: "phone" | "email" | "idcard" | "last4" | "all";
      label: string;
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
    SaveFieldConfigurations: {
      changes: components["schemas"]["FieldConfigurationChange"][];
    };
    SaveRoleFieldConfigurations: {
      changes: components["schemas"]["FieldConfigurationChange"][];
      roleId: string;
    };
    SwitchOrgDto: {
      /** @description 要切换到的组织编号 */
      orgId: string;
    };
    SystemDictItemAddBody: {
      data: components["schemas"]["SystemDictItemAddData"];
    };
    SystemDictItemAddData: {
      /** @description 启用 */
      enabled?: boolean;
      /** @description 显示名称 */
      label: string;
      /** @description 排序 */
      rank?: number;
      /** @description 字典类型 */
      typeId: string;
      /** @description 字典值 */
      value: string;
    };
    SystemDictItemDeleteBody: {
      ids: string[];
    };
    SystemDictItemDeleteResult: {
      /** @description 处理的行数 */
      count: number;
    };
    SystemDictItemInfoBody: {
      /** @example 1 */
      id: string;
    };
    SystemDictItemPageBody: {
      /** @description 按等于筛选 */
      eq?: components["schemas"]["SystemDictItemPageEq"];
      /** @description 搜索框，模糊匹配：label、value */
      keyword?: string;
      /** @default 1 */
      page: number;
      /** @default 20 */
      size: number;
      sort?: components["schemas"]["SystemDictItemPageSort"][];
    };
    SystemDictItemPageEq: {
      /** @description 启用 */
      enabled?: boolean;
      /** @description 字典类型 */
      typeId?: string;
    };
    SystemDictItemPageResult: {
      list: components["schemas"]["SystemDictItemRow"][];
      page: number;
      size: number;
      total: number;
    };
    SystemDictItemPageSort: {
      /**
       * @description 排序字段
       * @enum {string}
       */
      field: "id" | "createdAt" | "updatedAt" | "rank";
      /** @enum {string} */
      order: "asc" | "desc";
    };
    SystemDictItemRow: {
      /** @description 这一行上不是「可编辑」的字段：readonly 只读、masked 值已打码、hidden 不返回（契约 field-perm.md 3.1） */
      _fieldState?: {
        [key: string]: "readonly" | "masked" | "hidden";
      };
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
      /** @description 显示名称 */
      label?: string;
      /** @description 所属组织（新增时取当前组织，数据权限按它过滤） */
      orgId: string | null;
      /** @description 排序 */
      rank?: number;
      /** @description 字典类型 */
      typeId?: string;
      /**
       * Format: date-time
       * @description 修改时间
       */
      updatedAt: string;
      /** @description 修改人 */
      updatedBy: string | null;
      /** @description 字典值 */
      value?: string;
      /** @description 版本号，修改时原样带回 */
      version: number;
    };
    SystemDictItemUpdateBody: {
      /** @description 只传要改的字段 */
      data: components["schemas"]["SystemDictItemUpdateData"];
      /** @example 1 */
      id: string;
      /** @description 读到的版本号，原样带回 */
      version: number;
    };
    SystemDictItemUpdateData: {
      /** @description 启用 */
      enabled?: boolean;
      /** @description 显示名称 */
      label?: string;
      /** @description 排序 */
      rank?: number;
    };
    SystemDictTypeAddBody: {
      data: components["schemas"]["SystemDictTypeAddData"];
    };
    SystemDictTypeAddData: {
      /** @description 字典标识 */
      code: string;
      /** @description 启用 */
      enabled?: boolean;
      /** @description 字典名称 */
      name: string;
    };
    SystemDictTypeDeleteBody: {
      ids: string[];
    };
    SystemDictTypeDeleteResult: {
      /** @description 处理的行数 */
      count: number;
    };
    SystemDictTypeInfoBody: {
      /** @example 1 */
      id: string;
    };
    SystemDictTypePageBody: {
      /** @description 按等于筛选 */
      eq?: components["schemas"]["SystemDictTypePageEq"];
      /** @description 搜索框，模糊匹配：code、name */
      keyword?: string;
      /** @default 1 */
      page: number;
      /** @default 20 */
      size: number;
      sort?: components["schemas"]["SystemDictTypePageSort"][];
    };
    SystemDictTypePageEq: {
      /** @description 启用 */
      enabled?: boolean;
    };
    SystemDictTypePageResult: {
      list: components["schemas"]["SystemDictTypeRow"][];
      page: number;
      size: number;
      total: number;
    };
    SystemDictTypePageSort: {
      /**
       * @description 排序字段
       * @enum {string}
       */
      field: "id" | "createdAt" | "updatedAt";
      /** @enum {string} */
      order: "asc" | "desc";
    };
    SystemDictTypeRow: {
      /** @description 这一行上不是「可编辑」的字段：readonly 只读、masked 值已打码、hidden 不返回（契约 field-perm.md 3.1） */
      _fieldState?: {
        [key: string]: "readonly" | "masked" | "hidden";
      };
      /** @description 字典标识 */
      code?: string;
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
      /** @description 字典名称 */
      name?: string;
      /** @description 所属组织（新增时取当前组织，数据权限按它过滤） */
      orgId: string | null;
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
    SystemDictTypeUpdateBody: {
      /** @description 只传要改的字段 */
      data: components["schemas"]["SystemDictTypeUpdateData"];
      /** @example 1 */
      id: string;
      /** @description 读到的版本号，原样带回 */
      version: number;
    };
    SystemDictTypeUpdateData: {
      /** @description 启用 */
      enabled?: boolean;
      /** @description 字典名称 */
      name?: string;
    };
    SystemFieldAddBody: {
      data: components["schemas"]["SystemFieldAddData"];
    };
    SystemFieldAddData: {
      /**
       * @description 可委派上限
       * @enum {string|null}
       */
      delegable?: "editable" | "readonly" | "masked" | "hidden" | null;
      /** @description 启用 */
      enabled?: boolean;
      /** @description 字段 */
      field: string;
      /**
       * @description 脱敏规则
       * @enum {string|null}
       */
      mask?: "phone" | "email" | "idcard" | "last4" | "all" | null;
      /** @description 资源 */
      resource: string;
      /**
       * @description 状态
       * @enum {string}
       */
      state: "editable" | "readonly" | "masked" | "hidden";
    };
    SystemFieldDeleteBody: {
      ids: string[];
    };
    SystemFieldDeleteResult: {
      /** @description 处理的行数 */
      count: number;
    };
    SystemFieldInfoBody: {
      /** @example 1 */
      id: string;
    };
    SystemFieldPageBody: {
      /** @description 按等于筛选 */
      eq?: components["schemas"]["SystemFieldPageEq"];
      /** @description 搜索框，模糊匹配：resource、field */
      keyword?: string;
      /** @default 1 */
      page: number;
      /** @default 20 */
      size: number;
      sort?: components["schemas"]["SystemFieldPageSort"][];
    };
    SystemFieldPageEq: {
      /** @description 启用 */
      enabled?: boolean;
      /** @description 字段 */
      field?: string;
      /** @description 资源 */
      resource?: string;
    };
    SystemFieldPageResult: {
      list: components["schemas"]["SystemFieldRow"][];
      page: number;
      size: number;
      total: number;
    };
    SystemFieldPageSort: {
      /**
       * @description 排序字段
       * @enum {string}
       */
      field: "id" | "createdAt" | "updatedAt";
      /** @enum {string} */
      order: "asc" | "desc";
    };
    SystemFieldRow: {
      /** @description 这一行上不是「可编辑」的字段：readonly 只读、masked 值已打码、hidden 不返回（契约 field-perm.md 3.1） */
      _fieldState?: {
        [key: string]: "readonly" | "masked" | "hidden";
      };
      /** @description 允许配置 */
      configurable?: boolean;
      /**
       * Format: date-time
       * @description 创建时间
       */
      createdAt: string;
      /** @description 创建人 */
      createdBy: string | null;
      /**
       * @description 可委派上限
       * @enum {string|null}
       */
      delegable?: "editable" | "readonly" | "masked" | "hidden" | null;
      /** @description 启用 */
      enabled?: boolean;
      /** @description 字段 */
      field?: string;
      /**
       * @description 编号
       * @example 1
       */
      id: string;
      /**
       * @description 脱敏规则
       * @enum {string|null}
       */
      mask?: "phone" | "email" | "idcard" | "last4" | "all" | null;
      /** @description 所属组织（新增时取当前组织，数据权限按它过滤） */
      orgId: string | null;
      /** @description 资源 */
      resource?: string;
      /** @description 来源 */
      source?: string;
      /**
       * @description 状态
       * @enum {string}
       */
      state?: "editable" | "readonly" | "masked" | "hidden";
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
    SystemFieldUpdateBody: {
      /** @description 只传要改的字段 */
      data: components["schemas"]["SystemFieldUpdateData"];
      /** @example 1 */
      id: string;
      /** @description 读到的版本号，原样带回 */
      version: number;
    };
    SystemFieldUpdateData: {
      /**
       * @description 可委派上限
       * @enum {string|null}
       */
      delegable?: "editable" | "readonly" | "masked" | "hidden" | null;
      /** @description 启用 */
      enabled?: boolean;
      /**
       * @description 脱敏规则
       * @enum {string|null}
       */
      mask?: "phone" | "email" | "idcard" | "last4" | "all" | null;
      /**
       * @description 状态
       * @enum {string}
       */
      state?: "editable" | "readonly" | "masked" | "hidden";
    };
    SystemLoginLogInfoBody: {
      /** @example 1 */
      id: string;
    };
    SystemLoginLogPageBody: {
      /** @description 按等于筛选 */
      eq?: components["schemas"]["SystemLoginLogPageEq"];
      /** @description 搜索框，模糊匹配：username */
      keyword?: string;
      /** @default 1 */
      page: number;
      /** @default 20 */
      size: number;
      sort?: components["schemas"]["SystemLoginLogPageSort"][];
    };
    SystemLoginLogPageEq: {
      /** @description 事件 */
      event?: string;
      /** @description 结果 */
      success?: boolean;
    };
    SystemLoginLogPageResult: {
      list: components["schemas"]["SystemLoginLogRow"][];
      page: number;
      size: number;
      total: number;
    };
    SystemLoginLogPageSort: {
      /**
       * @description 排序字段
       * @enum {string}
       */
      field: "id" | "createdAt" | "updatedAt";
      /** @enum {string} */
      order: "asc" | "desc";
    };
    SystemLoginLogRow: {
      /** @description 这一行上不是「可编辑」的字段：readonly 只读、masked 值已打码、hidden 不返回（契约 field-perm.md 3.1） */
      _fieldState?: {
        [key: string]: "readonly" | "masked" | "hidden";
      };
      /**
       * Format: date-time
       * @description 创建时间
       */
      createdAt: string;
      /** @description 创建人 */
      createdBy: string | null;
      /** @description 事件 */
      event?: string;
      /**
       * @description 编号
       * @example 1
       */
      id: string;
      /** @description 所属组织（新增时取当前组织，数据权限按它过滤） */
      orgId: string | null;
      /** @description 原因 */
      reason?: Record<string, never>;
      /** @description 结果 */
      success?: boolean;
      /**
       * Format: date-time
       * @description 修改时间
       */
      updatedAt: string;
      /** @description 修改人 */
      updatedBy: string | null;
      /** @description 账号 */
      username?: Record<string, never>;
      /** @description 版本号，修改时原样带回 */
      version: number;
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
      /**
       * @description 类型
       * @enum {string}
       */
      type: "directory" | "page" | "button";
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
      /**
       * @description 类型
       * @enum {string}
       */
      type?: "directory" | "page" | "button";
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
      /** @description 这一行上不是「可编辑」的字段：readonly 只读、masked 值已打码、hidden 不返回（契约 field-perm.md 3.1） */
      _fieldState?: {
        [key: string]: "readonly" | "masked" | "hidden";
      };
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
      title?: string;
      /**
       * @description 类型
       * @enum {string}
       */
      type?: "directory" | "page" | "button";
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
      /**
       * @description 类型
       * @enum {string}
       */
      type?: "directory" | "page" | "button";
    };
    SystemMutationResult: {
      id: string;
    };
    SystemOperationLogInfoBody: {
      /** @example 1 */
      id: string;
    };
    SystemOperationLogPageBody: {
      /** @description 按等于筛选 */
      eq?: components["schemas"]["SystemOperationLogPageEq"];
      /** @description 搜索框，模糊匹配：action、resource */
      keyword?: string;
      /** @default 1 */
      page: number;
      /** @default 20 */
      size: number;
      sort?: components["schemas"]["SystemOperationLogPageSort"][];
    };
    SystemOperationLogPageEq: {
      /** @description 成功 */
      success?: boolean;
    };
    SystemOperationLogPageResult: {
      list: components["schemas"]["SystemOperationLogRow"][];
      page: number;
      size: number;
      total: number;
    };
    SystemOperationLogPageSort: {
      /**
       * @description 排序字段
       * @enum {string}
       */
      field: "id" | "createdAt" | "updatedAt";
      /** @enum {string} */
      order: "asc" | "desc";
    };
    SystemOperationLogRow: {
      /** @description 这一行上不是「可编辑」的字段：readonly 只读、masked 值已打码、hidden 不返回（契约 field-perm.md 3.1） */
      _fieldState?: {
        [key: string]: "readonly" | "masked" | "hidden";
      };
      /** @description 动作 */
      action?: string;
      /**
       * Format: date-time
       * @description 创建时间
       */
      createdAt: string;
      /** @description 创建人 */
      createdBy: string | null;
      /** @description 耗时毫秒 */
      durationMs?: number;
      /**
       * @description 编号
       * @example 1
       */
      id: string;
      /** @description 请求方法 */
      method?: string;
      /** @description 所属组织（新增时取当前组织，数据权限按它过滤） */
      orgId: string | null;
      /** @description 记录数 */
      recordCount?: number;
      /** @description 请求编号 */
      requestId?: Record<string, never>;
      /** @description 资源 */
      resource?: string;
      /** @description 状态码 */
      status?: number;
      /** @description 成功 */
      success?: boolean;
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
      /** @description 这一行上不是「可编辑」的字段：readonly 只读、masked 值已打码、hidden 不返回（契约 field-perm.md 3.1） */
      _fieldState?: {
        [key: string]: "readonly" | "masked" | "hidden";
      };
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
      name?: string;
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
    SystemParameterAddBody: {
      data: components["schemas"]["SystemParameterAddData"];
    };
    SystemParameterAddData: {
      /** @description 说明 */
      description?: Record<string, never> | null;
      /** @description 参数标识 */
      key: string;
      /** @description 参数值 */
      value?: string;
    };
    SystemParameterDeleteBody: {
      ids: string[];
    };
    SystemParameterDeleteResult: {
      /** @description 处理的行数 */
      count: number;
    };
    SystemParameterInfoBody: {
      /** @example 1 */
      id: string;
    };
    SystemParameterPageBody: {
      /** @description 按等于筛选 */
      eq?: components["schemas"]["SystemParameterPageEq"];
      /** @description 搜索框，模糊匹配：key */
      keyword?: string;
      /** @default 1 */
      page: number;
      /** @default 20 */
      size: number;
      sort?: components["schemas"]["SystemParameterPageSort"][];
    };
    SystemParameterPageEq: Record<string, never>;
    SystemParameterPageResult: {
      list: components["schemas"]["SystemParameterRow"][];
      page: number;
      size: number;
      total: number;
    };
    SystemParameterPageSort: {
      /**
       * @description 排序字段
       * @enum {string}
       */
      field: "id" | "createdAt" | "updatedAt";
      /** @enum {string} */
      order: "asc" | "desc";
    };
    SystemParameterRow: {
      /** @description 这一行上不是「可编辑」的字段：readonly 只读、masked 值已打码、hidden 不返回（契约 field-perm.md 3.1） */
      _fieldState?: {
        [key: string]: "readonly" | "masked" | "hidden";
      };
      /**
       * Format: date-time
       * @description 创建时间
       */
      createdAt: string;
      /** @description 创建人 */
      createdBy: string | null;
      /** @description 说明 */
      description?: Record<string, never> | null;
      /**
       * @description 编号
       * @example 1
       */
      id: string;
      /** @description 参数标识 */
      key?: string;
      /** @description 所属组织（新增时取当前组织，数据权限按它过滤） */
      orgId: string | null;
      /**
       * Format: date-time
       * @description 修改时间
       */
      updatedAt: string;
      /** @description 修改人 */
      updatedBy: string | null;
      /** @description 参数值 */
      value?: string;
      /** @description 版本号，修改时原样带回 */
      version: number;
    };
    SystemParameterUpdateBody: {
      /** @description 只传要改的字段 */
      data: components["schemas"]["SystemParameterUpdateData"];
      /** @example 1 */
      id: string;
      /** @description 读到的版本号，原样带回 */
      version: number;
    };
    SystemParameterUpdateData: {
      /** @description 说明 */
      description?: Record<string, never> | null;
      /** @description 参数值 */
      value?: string;
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
    SystemRoleFieldAddBody: {
      data: components["schemas"]["SystemRoleFieldAddData"];
    };
    SystemRoleFieldAddData: {
      /** @description 字段 */
      field: string;
      /**
       * @description 脱敏规则
       * @enum {string|null}
       */
      mask?: "phone" | "email" | "idcard" | "last4" | "all" | null;
      /** @description 资源 */
      resource: string;
      /** @description 角色 */
      roleId: string;
      /**
       * @description 状态
       * @enum {string}
       */
      state: "editable" | "readonly" | "masked" | "hidden";
    };
    SystemRoleFieldDeleteBody: {
      ids: string[];
    };
    SystemRoleFieldDeleteResult: {
      /** @description 处理的行数 */
      count: number;
    };
    SystemRoleFieldInfoBody: {
      /** @example 1 */
      id: string;
    };
    SystemRoleFieldPageBody: {
      /** @description 按等于筛选 */
      eq?: components["schemas"]["SystemRoleFieldPageEq"];
      /** @description 搜索框，模糊匹配：resource、field */
      keyword?: string;
      /** @default 1 */
      page: number;
      /** @default 20 */
      size: number;
      sort?: components["schemas"]["SystemRoleFieldPageSort"][];
    };
    SystemRoleFieldPageEq: {
      /** @description 字段 */
      field?: string;
      /** @description 资源 */
      resource?: string;
      /** @description 角色 */
      roleId?: string;
    };
    SystemRoleFieldPageResult: {
      list: components["schemas"]["SystemRoleFieldRow"][];
      page: number;
      size: number;
      total: number;
    };
    SystemRoleFieldPageSort: {
      /**
       * @description 排序字段
       * @enum {string}
       */
      field: "id" | "createdAt" | "updatedAt";
      /** @enum {string} */
      order: "asc" | "desc";
    };
    SystemRoleFieldRow: {
      /** @description 这一行上不是「可编辑」的字段：readonly 只读、masked 值已打码、hidden 不返回（契约 field-perm.md 3.1） */
      _fieldState?: {
        [key: string]: "readonly" | "masked" | "hidden";
      };
      /**
       * Format: date-time
       * @description 创建时间
       */
      createdAt: string;
      /** @description 创建人 */
      createdBy: string | null;
      /** @description 字段 */
      field?: string;
      /**
       * @description 编号
       * @example 1
       */
      id: string;
      /**
       * @description 脱敏规则
       * @enum {string|null}
       */
      mask?: "phone" | "email" | "idcard" | "last4" | "all" | null;
      /** @description 所属组织（新增时取当前组织，数据权限按它过滤） */
      orgId: string | null;
      /** @description 资源 */
      resource?: string;
      /** @description 角色 */
      roleId?: string;
      /**
       * @description 状态
       * @enum {string}
       */
      state?: "editable" | "readonly" | "masked" | "hidden";
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
    SystemRoleFieldUpdateBody: {
      /** @description 只传要改的字段 */
      data: components["schemas"]["SystemRoleFieldUpdateData"];
      /** @example 1 */
      id: string;
      /** @description 读到的版本号，原样带回 */
      version: number;
    };
    SystemRoleFieldUpdateData: {
      /**
       * @description 脱敏规则
       * @enum {string|null}
       */
      mask?: "phone" | "email" | "idcard" | "last4" | "all" | null;
      /**
       * @description 状态
       * @enum {string}
       */
      state?: "editable" | "readonly" | "masked" | "hidden";
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
      /** @description 这一行上不是「可编辑」的字段：readonly 只读、masked 值已打码、hidden 不返回（契约 field-perm.md 3.1） */
      _fieldState?: {
        [key: string]: "readonly" | "masked" | "hidden";
      };
      /** @description 内置超级管理员 */
      allPermissions?: boolean;
      /** @description 角色标识 */
      code?: string;
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
      dataScope?: "all" | "org" | "org_and_children" | "self" | "custom";
      /** @description 启用 */
      enabled?: boolean;
      /**
       * @description 编号
       * @example 1
       */
      id: string;
      /** @description 角色名称 */
      name?: string;
      /** @description 所属组织（新增时取当前组织，数据权限按它过滤） */
      orgId: string | null;
      /** @description 权限码 */
      permissions?: string[];
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
    SystemSelfAccount: {
      id: string;
      nickname: string;
      username: string;
      version: number;
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
      /** @description 这一行上不是「可编辑」的字段：readonly 只读、masked 值已打码、hidden 不返回（契约 field-perm.md 3.1） */
      _fieldState?: {
        [key: string]: "readonly" | "masked" | "hidden";
      };
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
      roleId?: string;
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
      userId?: string;
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
      /** @description 这一行上不是「可编辑」的字段：readonly 只读、masked 值已打码、hidden 不返回（契约 field-perm.md 3.1） */
      _fieldState?: {
        [key: string]: "readonly" | "masked" | "hidden";
      };
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
      nickname?: string;
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
      username?: string;
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
      /** @description 这一行上不是「可编辑」的字段：readonly 只读、masked 值已打码、hidden 不返回（契约 field-perm.md 3.1） */
      _fieldState?: {
        [key: string]: "readonly" | "masked" | "hidden";
      };
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
      supervisorId?: string;
      /**
       * Format: date-time
       * @description 修改时间
       */
      updatedAt: string;
      /** @description 修改人 */
      updatedBy: string | null;
      /** @description 用户 */
      userId?: string;
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
  systemDictItemAdd: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["SystemDictItemAddBody"];
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
            data: components["schemas"]["SystemDictItemRow"];
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
  systemDictItemDelete: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["SystemDictItemDeleteBody"];
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
            data: components["schemas"]["SystemDictItemDeleteResult"];
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
  systemDictItemInfo: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["SystemDictItemInfoBody"];
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
            data: components["schemas"]["SystemDictItemRow"];
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
  systemDictItemPage: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["SystemDictItemPageBody"];
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
            data: components["schemas"]["SystemDictItemPageResult"];
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
  systemDictItemSchema: {
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
  systemDictItemUpdate: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["SystemDictItemUpdateBody"];
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
            data: components["schemas"]["SystemDictItemRow"];
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
  systemDictTypeAdd: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["SystemDictTypeAddBody"];
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
            data: components["schemas"]["SystemDictTypeRow"];
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
  systemDictionaryOptions: {
    parameters: {
      query: {
        code: string;
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
            data: components["schemas"]["DictionaryOptions"];
            /** @example ok */
            message: string;
          };
        };
      };
    };
  };
  systemDictTypeDelete: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["SystemDictTypeDeleteBody"];
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
            data: components["schemas"]["SystemDictTypeDeleteResult"];
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
  systemDictTypeInfo: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["SystemDictTypeInfoBody"];
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
            data: components["schemas"]["SystemDictTypeRow"];
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
  systemDictTypePage: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["SystemDictTypePageBody"];
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
            data: components["schemas"]["SystemDictTypePageResult"];
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
  systemDictTypeSchema: {
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
  systemDictTypeUpdate: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["SystemDictTypeUpdateBody"];
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
            data: components["schemas"]["SystemDictTypeRow"];
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
  systemFieldPermRegistry: {
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
            data: components["schemas"]["FieldPermRegistryDto"];
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
  systemFieldAdd: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["SystemFieldAddBody"];
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
            data: components["schemas"]["SystemFieldRow"];
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
  systemFieldDelete: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["SystemFieldDeleteBody"];
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
            data: components["schemas"]["SystemFieldDeleteResult"];
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
  systemFieldInfo: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["SystemFieldInfoBody"];
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
            data: components["schemas"]["SystemFieldRow"];
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
  systemFieldOverview: {
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
            data: components["schemas"]["FieldConfigurationOverview"];
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
    };
  };
  systemFieldPage: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["SystemFieldPageBody"];
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
            data: components["schemas"]["SystemFieldPageResult"];
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
  systemFieldSave: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["SaveFieldConfigurations"];
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
            data: components["schemas"]["FieldConfigurationResult"];
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
  systemFieldSchema: {
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
  systemFieldUpdate: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["SystemFieldUpdateBody"];
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
            data: components["schemas"]["SystemFieldRow"];
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
  systemLoginLogInfo: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["SystemLoginLogInfoBody"];
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
            data: components["schemas"]["SystemLoginLogRow"];
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
  systemLoginLogPage: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["SystemLoginLogPageBody"];
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
            data: components["schemas"]["SystemLoginLogPageResult"];
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
  systemLoginLogSchema: {
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
  systemOperationLogInfo: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["SystemOperationLogInfoBody"];
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
            data: components["schemas"]["SystemOperationLogRow"];
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
  systemOperationLogPage: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["SystemOperationLogPageBody"];
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
            data: components["schemas"]["SystemOperationLogPageResult"];
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
  systemOperationLogSchema: {
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
  systemParameterAdd: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["SystemParameterAddBody"];
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
            data: components["schemas"]["SystemParameterRow"];
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
  systemParameterDelete: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["SystemParameterDeleteBody"];
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
            data: components["schemas"]["SystemParameterDeleteResult"];
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
  systemParameterInfo: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["SystemParameterInfoBody"];
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
            data: components["schemas"]["SystemParameterRow"];
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
  systemParameterPage: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["SystemParameterPageBody"];
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
            data: components["schemas"]["SystemParameterPageResult"];
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
  systemParameterSchema: {
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
  systemParameterUpdate: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["SystemParameterUpdateBody"];
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
            data: components["schemas"]["SystemParameterRow"];
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
  systemRoleFieldAdd: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["SystemRoleFieldAddBody"];
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
            data: components["schemas"]["SystemRoleFieldRow"];
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
  systemRoleFieldDelete: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["SystemRoleFieldDeleteBody"];
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
            data: components["schemas"]["SystemRoleFieldDeleteResult"];
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
  systemRoleFieldInfo: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["SystemRoleFieldInfoBody"];
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
            data: components["schemas"]["SystemRoleFieldRow"];
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
  systemRoleFieldOverview: {
    parameters: {
      query: {
        roleId: string;
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
            data: components["schemas"]["FieldConfigurationOverview"];
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
    };
  };
  systemRoleFieldPage: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["SystemRoleFieldPageBody"];
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
            data: components["schemas"]["SystemRoleFieldPageResult"];
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
  systemRoleFieldSave: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["SaveRoleFieldConfigurations"];
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
            data: components["schemas"]["FieldConfigurationResult"];
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
  systemRoleFieldSchema: {
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
  systemRoleFieldUpdate: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["SystemRoleFieldUpdateBody"];
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
            data: components["schemas"]["SystemRoleFieldRow"];
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
  systemUserMe: {
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
            data: components["schemas"]["SystemSelfAccount"];
            /** @example ok */
            message: string;
          };
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
