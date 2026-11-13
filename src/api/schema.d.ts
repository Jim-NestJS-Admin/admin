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
  "/admin/auth/tenant-hint": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * 登录页要不要填租户编码
     * @description 按访问的域名判断：已绑定租户返回 domain 和租户名称；否则返回 code，登录页显示「租户编码」，出题、登录、刷新、退出请求带 X-Tenant-Code 头（不带等同默认租户）
     */
    get: operations["authTenantHint"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/dev/codegen/delete": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 删除生成配置（不删已生成的代码） */
    post: operations["devCodegenDelete"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/dev/codegen/download": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 下载生成的代码压缩包 */
    post: operations["devCodegenDownload"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/dev/codegen/field-types": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 支持的字段类型与默认设置 */
    post: operations["devCodegenFieldTypes"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/dev/codegen/import": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 按表结构生成初始配置（不保存） */
    post: operations["devCodegenImport"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/dev/codegen/import-spec": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 从一张或多张表推断规格草稿 */
    post: operations["devCodegenImportSpec"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/dev/codegen/info": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 生成配置详情 */
    post: operations["devCodegenInfo"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/dev/codegen/list": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 生成配置列表 */
    post: operations["devCodegenList"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/dev/codegen/preview": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 预览要生成的文件和每个文件的处理方式 */
    post: operations["devCodegenPreview"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/dev/codegen/preview-spec": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 预览规格的 SQL、文件、差异和指纹 */
    post: operations["devCodegenPreviewSpec"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/dev/codegen/save": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 保存生成配置（新建或修改） */
    post: operations["devCodegenSave"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/dev/codegen/save-spec": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 保存规格草稿 */
    post: operations["devCodegenSaveSpec"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/dev/codegen/schema-spec": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 按规格计算正式 CRUD 页面描述 */
    post: operations["devCodegenSchemaSpec"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/dev/codegen/sync": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 表结构和配置的差异 */
    post: operations["devCodegenSync"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/dev/codegen/tables": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 数据库里还没导入的表 */
    post: operations["devCodegenTables"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/dev/codegen/validate-spec": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 逐字段校验模块规格 */
    post: operations["devCodegenValidateSpec"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/dev/codegen/write": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 确认写入本机项目（只写文件，不执行命令） */
    post: operations["devCodegenWrite"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/dev/codegen/write-spec": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 核对预览指纹后写入规格代码 */
    post: operations["devCodegenWriteSpec"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/file/asset/download": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 鉴权下载文件 */
    post: operations["fileAssetDownload"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/file/asset/info": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 文件详情 */
    post: operations["fileAssetInfo"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/file/asset/page": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 文件分页列表 */
    post: operations["fileAssetPage"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/file/asset/schema": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** 文件页面描述 */
    get: operations["fileAssetSchema"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/file/asset/upload": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 上传文件 */
    post: operations["fileAssetUpload"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/form/definition/add": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 创建表单第一版快照 */
    post: operations["formDefinitionAdd"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/form/definition/info": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 表单定义详情 */
    post: operations["formDefinitionInfo"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/form/definition/inspect": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 校验设计并解析字段清单，不保存 */
    post: operations["formDefinitionInspect"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/form/definition/page": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 表单定义分页列表 */
    post: operations["formDefinitionPage"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/form/definition/revise": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 追加表单修订，旧版本不可变 */
    post: operations["formDefinitionRevise"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/form/definition/schema": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** 表单定义页面描述 */
    get: operations["formDefinitionSchema"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/form/definition/validate": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 按固定表单版本校验提交值，不保存业务数据 */
    post: operations["formDefinitionValidate"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/platform/package/add": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 新增套餐 */
    post: operations["platformPackageAdd"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/platform/package/delete": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 删除套餐（整批成败） */
    post: operations["platformPackageDelete"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/platform/package/export": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 导出套餐（Excel / CSV，按列表的查询条件，最多 1 万行） */
    post: operations["platformPackageExport"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/platform/package/info": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 套餐详情 */
    post: operations["platformPackageInfo"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/platform/package/menus": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 可选租户菜单树（含按钮） */
    post: operations["platformPackageMenus"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/platform/package/page": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 套餐分页列表 */
    post: operations["platformPackagePage"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/platform/package/schema": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** 套餐页面描述 */
    get: operations["platformPackageSchema"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/platform/package/update": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 修改套餐 */
    post: operations["platformPackageUpdate"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/platform/tenant/add": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 创建租户并在同一事务初始化管理员 */
    post: operations["platformTenantAdd"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/platform/tenant/delete": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 删除租户（整批成败） */
    post: operations["platformTenantDelete"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/platform/tenant/export": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 导出租户（Excel / CSV，按列表的查询条件，最多 1 万行） */
    post: operations["platformTenantExport"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/platform/tenant/info": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 租户详情 */
    post: operations["platformTenantInfo"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/platform/tenant/page": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 租户分页列表 */
    post: operations["platformTenantPage"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/platform/tenant/schema": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** 租户页面描述 */
    get: operations["platformTenantSchema"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/platform/tenant/update": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 修改租户 */
    post: operations["platformTenantUpdate"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/platform/tenant/usage": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 只读查看租户用户数、存储与配额 */
    post: operations["platformTenantUsage"];
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
  "/admin/session/preference": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** 读一项个人偏好 */
    get: operations["sessionPreferenceGet"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/session/preference/delete": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 删除一项个人偏好 */
    post: operations["sessionPreferenceDelete"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/session/preference/save": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 保存一项个人偏好（覆盖） */
    post: operations["sessionPreferenceSave"];
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
  "/admin/system/code-rule/add": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 新增编码规则 */
    post: operations["systemCodeRuleAdd"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/system/code-rule/binding/set": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 建立或切换编码规则绑定 */
    post: operations["codeRuleBindingSet"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/system/code-rule/delete": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 删除编码规则（整批成败） */
    post: operations["systemCodeRuleDelete"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/system/code-rule/history": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 编码规则审计快照 */
    post: operations["codeRuleHistory"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/system/code-rule/info": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 编码规则详情 */
    post: operations["systemCodeRuleInfo"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/system/code-rule/page": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 编码规则分页列表 */
    post: operations["systemCodeRulePage"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/system/code-rule/preview": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 预览后续编码，不占用号码 */
    post: operations["codeRulePreview"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/system/code-rule/schema": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** 编码规则页面描述 */
    get: operations["systemCodeRuleSchema"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/system/code-rule/timezones": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 系统维护的IANA时区目录，含中文城市名 */
    post: operations["codeRuleTimeZones"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/system/code-rule/update": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 修改编码规则 */
    post: operations["systemCodeRuleUpdate"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/system/code-rule/usage/list": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 已注册编码用途与绑定 */
    post: operations["codeRuleUsageList"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/system/code-rule/validate": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 校验规则与用途兼容性，不写入 */
    post: operations["codeRuleValidate"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/system/code-sequence/info": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 编码序号详情 */
    post: operations["systemCodeSequenceInfo"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/system/code-sequence/page": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 编码序号分页列表 */
    post: operations["systemCodeSequencePage"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/system/code-sequence/schema": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** 编码序号页面描述 */
    get: operations["systemCodeSequenceSchema"];
    put?: never;
    post?: never;
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
  "/admin/system/dict-item/export": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 导出字典项（Excel / CSV，按列表的查询条件，最多 1 万行） */
    post: operations["systemDictItemExport"];
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
  "/admin/system/dict-type/export": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 导出字典类型（Excel / CSV，按列表的查询条件，最多 1 万行） */
    post: operations["systemDictTypeExport"];
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
  "/admin/system/login-log/export": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 导出登录日志（Excel / CSV，按列表的查询条件，最多 1 万行） */
    post: operations["systemLoginLogExport"];
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
  "/admin/system/menu/export": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 导出菜单（Excel / CSV，按列表的查询条件，最多 1 万行） */
    post: operations["systemMenuExport"];
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
  "/admin/system/menu/tree": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 菜单树形列表（全部可见节点，平铺） */
    post: operations["systemMenuTree"];
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
  "/admin/system/operation-log/export": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 导出操作日志（Excel / CSV，按列表的查询条件，最多 1 万行） */
    post: operations["systemOperationLogExport"];
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
  "/admin/system/org/export": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 导出组织（Excel / CSV，按列表的查询条件，最多 1 万行） */
    post: operations["systemOrgExport"];
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
  "/admin/system/org/tree": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 组织树形列表（全部可见节点，平铺） */
    post: operations["systemOrgTree"];
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
  "/admin/system/page-config": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** 模块显示配置 */
    get: operations["systemPageConfigInfo"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/system/page-config/history": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 修改历史 */
    post: operations["systemPageConfigHistory"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/system/page-config/history-info": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 历史版本内容 */
    post: operations["systemPageConfigHistoryInfo"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/system/page-config/reset": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 恢复代码默认 */
    post: operations["systemPageConfigReset"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/system/page-config/restore": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 恢复历史版本 */
    post: operations["systemPageConfigRestore"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/admin/system/page-config/save": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 保存模块显示配置 */
    post: operations["systemPageConfigSave"];
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
  "/admin/system/parameter/export": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 导出系统参数（Excel / CSV，按列表的查询条件，最多 1 万行） */
    post: operations["systemParameterExport"];
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
  "/admin/system/role/export": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 导出角色（Excel / CSV，按列表的查询条件，最多 1 万行） */
    post: operations["systemRoleExport"];
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
  "/admin/system/user-role/export": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 导出用户组织角色分配（Excel / CSV，按列表的查询条件，最多 1 万行） */
    post: operations["systemUserRoleExport"];
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
  "/admin/system/user-supervisor/export": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 导出用户多上级（Excel / CSV，按列表的查询条件，最多 1 万行） */
    post: operations["systemUserSupervisorExport"];
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
  "/admin/system/user/export": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 导出用户（Excel / CSV，按列表的查询条件，最多 1 万行） */
    post: operations["systemUserExport"];
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
    CodeBindingBody: {
      ruleId: string;
      usageKey: string;
    };
    CodeHistoryItem: {
      /** Format: date-time */
      createdAt: string;
      revision: number;
      snapshot: {
        [key: string]: unknown;
      };
    };
    CodeHistoryResult: {
      list: components["schemas"]["CodeHistoryItem"][];
    };
    CodePreviewBody: {
      ruleId: string;
      usageKey?: string;
    };
    CodePreviewResult: {
      codes: string[];
      consumes: boolean;
      periodKey: string;
    };
    CodeRuleValidateBody: {
      data: components["schemas"]["CodeRuleValidateInput"];
      usageKey?: string;
    };
    CodeRuleValidateInput: {
      resetPeriod: string;
      segments: {
        [key: string]: unknown;
      }[];
      start: string;
      timezone: string;
    };
    CodeTimeZoneItem: {
      common: boolean;
      labelEn: string;
      labelZh: string;
      value: string;
    };
    CodeTimeZoneResult: {
      list: components["schemas"]["CodeTimeZoneItem"][];
    };
    CodeUsageItem: {
      allowRuleSwitch: boolean;
      /** @enum {string} */
      charset: "upper_alnum" | "lower_slug" | "digits";
      field: string;
      issue: string;
      key: string;
      maxLength: number;
      minLength?: number;
      name: string;
      resource: string;
      ruleId: string | null;
      ruleName: string | null;
      uniqueScope: string;
    };
    CodeUsageResult: {
      list: components["schemas"]["CodeUsageItem"][];
    };
    CreateFormBody: {
      data: components["schemas"]["FormDefinitionInput"];
    };
    CreateSystemUser: {
      defaultOrgId?: string | null;
      enabled?: boolean;
      nickname: string;
      /** @description 初始密码，按普通用户密码规则检查 */
      password: string;
      username: string;
    };
    CreateTenantBody: {
      /** @description 初始管理员密码，仅用于创建，不返回 */
      adminPassword: string;
      /** @description 初始管理员账号 */
      adminUsername: string;
      data: components["schemas"]["CreateTenantData"];
    };
    CreateTenantData: {
      /** @description 租户编码 */
      code: string;
      /** @description 联系人 */
      contactName?: Record<string, never> | null;
      /** @description 联系电话 */
      contactPhone?: Record<string, never> | null;
      /** @description 绑定域名 */
      domains?: string[];
      /** @description 启用 */
      enabled?: boolean;
      /**
       * Format: date-time
       * @description 到期时间
       */
      expiresAt?: string | null;
      /** @description 租户名称 */
      name: string;
      /** @description 套餐 */
      packageId: string;
      /** @description 备注 */
      remark?: Record<string, never> | null;
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
        | "export"
        | "tree"
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
      /** @description 每个业务字段在本页面（列表权限的本次有效角色）下的最宽字段权限状态；逐行以 _fieldState 为准 */
      fieldPerms?: {
        [key: string]: components["schemas"]["FieldPermStateDto"];
      };
      form: components["schemas"]["CrudSchemaFormItem"][];
      label: string;
      maxSize: number;
      /** @description 不含用户列设置的显示配置（代码默认 → 模块配置，按字段权限裁剪后）；结构同 view，前端列设置以它为基准只保存用户改过的部分 */
      moduleView?: Record<string, never>;
      /**
       * @description 权限码前缀
       * @example system:user
       */
      permPrefix: string;
      query: components["schemas"]["CrudSchemaQueryItem"][];
      /** @example system/user */
      resource: string;
      /** @description 树形资源配置；不是树时为 null */
      tree: components["schemas"]["CrudSchemaTree"] | null;
      /** @description 生效的显示配置（代码默认 → 模块配置 → 用户列设置，按字段权限裁剪后），结构见契约 page-config.md 第 2、4 节 */
      view?: Record<string, never>;
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
      /** @description 默认不显示（用户可以在列设置里打开）：编号、版本号等系统字段 */
      hidden?: boolean;
      label: string;
      sortable: boolean;
      /**
       * @description 显示方式：datetime / date 按本地时间格式化，boolean 显示是 / 否，reference 显示行里 _display 的名称
       * @enum {string}
       */
      type:
        | "text"
        | "number"
        | "boolean"
        | "date"
        | "datetime"
        | "json"
        | "reference";
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
        | "datetime"
        | "tree-select";
      dict?: string;
      /**
       * @description both：新增和修改都能写；add：只在新增时写；none：只读
       * @enum {string}
       */
      edit: "both" | "add" | "none";
      field: string;
      generated?: boolean;
      generatedHint?: string;
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
      /** @description 这个字段可用的运算符 */
      operators: (
        | "eq"
        | "ne"
        | "gt"
        | "gte"
        | "lt"
        | "lte"
        | "in"
        | "notIn"
        | "contains"
        | "startsWith"
        | "between"
        | "isNull"
        | "notNull"
      )[];
      /**
       * @description 值的类型，前端据此选输入控件
       * @enum {string}
       */
      type: "string" | "number" | "boolean" | "date";
    };
    CrudSchemaSort: {
      field: string;
      /** @enum {string} */
      order: "asc" | "desc";
    };
    CrudSchemaTree: {
      /**
       * @description 节点显示名称字段
       * @example name
       */
      nameField: string;
      /**
       * @description 指向父节点编号的字段
       * @example parentId
       */
      parentField: string;
      /**
       * @description 同级排序字段
       * @example sort
       */
      sortField?: string;
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
    FieldPermStateDto: {
      /** @enum {string|null} */
      mask: "phone" | "email" | "idcard" | "last4" | "all" | null;
      /** @enum {string} */
      state: "editable" | "readonly" | "masked" | "hidden";
    };
    FileAssetInfoBody: {
      /** @example 1 */
      id: string;
    };
    FileAssetPageBody: {
      /** @description 按等于筛选 */
      eq?: components["schemas"]["FileAssetPageEq"];
      /** @description 这个资源没有配置搜索字段，传了也不生效 */
      keyword?: string;
      /** @default 1 */
      page: number;
      /** @default 20 */
      size: number;
      sort?: components["schemas"]["FileAssetPageSort"][];
      /** @description 高级查询：最多 3 层、20 个条件（契约 query.md） */
      where?: components["schemas"]["QueryGroupDto"];
    };
    FileAssetPageEq: Record<string, never>;
    FileAssetPageResult: {
      list: components["schemas"]["FileAssetRow"][];
      page: number;
      size: number;
      total: number;
    };
    FileAssetPageSort: {
      /**
       * @description 排序字段
       * @enum {string}
       */
      field: "id" | "createdAt" | "updatedAt" | "bytes";
      /** @enum {string} */
      order: "asc" | "desc";
    };
    FileAssetRow: {
      /** @description 编号字段的显示名：createdBy / updatedBy 是用户名称，orgId 是组织名称；查不到的不返回 */
      _display?: {
        [key: string]: string;
      };
      /** @description 这一行上不是「可编辑」的字段：readonly 只读、masked 值已打码、hidden 不返回（契约 field-perm.md 3.1） */
      _fieldState?: {
        [key: string]: "readonly" | "masked" | "hidden";
      };
      /** @description 大小（字节） */
      bytes?: number;
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
      /** @description 类型 */
      mime?: string;
      /** @description 文件名 */
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
    FileIdBody: {
      /** @example 1 */
      id: string;
    };
    FileReceipt: {
      bytes: number;
      id: string;
      mime: string;
      /** @description 系统生成的文件名，不使用客户端提供的名称 */
      name: string;
    };
    FormDefinition: {
      /** @description 表单编码 */
      code?: string;
      /**
       * Format: date-time
       * @description 创建时间
       */
      createdAt: string;
      /** @description 创建人 */
      createdBy: string | null;
      /** @description 表单设计 */
      designer?: components["schemas"]["FormDesignerDto"];
      /** @description 字段清单 */
      fields?: components["schemas"]["FormFieldDto"][];
      /**
       * @description 编号
       * @example 1
       */
      id: string;
      /** @description 表单名称 */
      name?: string;
      /** @description 所属组织（新增时取当前组织，数据权限按它过滤） */
      orgId: string | null;
      /** @description 表单版本 */
      revision?: number;
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
    FormDefinitionInfoBody: {
      /** @example 1 */
      id: string;
    };
    FormDefinitionInput: {
      designer: components["schemas"]["FormDesignerDto"];
      name: string;
    };
    FormDefinitionPageBody: {
      /** @description 按等于筛选 */
      eq?: components["schemas"]["FormDefinitionPageEq"];
      /** @description 搜索框，模糊匹配：code、name */
      keyword?: string;
      /** @default 1 */
      page: number;
      /** @default 20 */
      size: number;
      sort?: components["schemas"]["FormDefinitionPageSort"][];
      /** @description 高级查询：最多 3 层、20 个条件（契约 query.md） */
      where?: components["schemas"]["QueryGroupDto"];
    };
    FormDefinitionPageEq: {
      /** @description 表单编码 */
      code?: string;
      /** @description 表单版本 */
      revision?: number;
    };
    FormDefinitionPageResult: {
      list: components["schemas"]["FormDefinitionRow"][];
      page: number;
      size: number;
      total: number;
    };
    FormDefinitionPageSort: {
      /**
       * @description 排序字段
       * @enum {string}
       */
      field: "id" | "createdAt" | "updatedAt" | "code" | "revision";
      /** @enum {string} */
      order: "asc" | "desc";
    };
    FormDefinitionRow: {
      /** @description 编号字段的显示名：createdBy / updatedBy 是用户名称，orgId 是组织名称；查不到的不返回 */
      _display?: {
        [key: string]: string;
      };
      /** @description 这一行上不是「可编辑」的字段：readonly 只读、masked 值已打码、hidden 不返回（契约 field-perm.md 3.1） */
      _fieldState?: {
        [key: string]: "readonly" | "masked" | "hidden";
      };
      /** @description 表单编码 */
      code?: string;
      /**
       * Format: date-time
       * @description 创建时间
       */
      createdAt: string;
      /** @description 创建人 */
      createdBy: string | null;
      /** @description 表单设计 */
      designer?: components["schemas"]["FormDesignerDto"];
      /** @description 字段清单 */
      fields?: components["schemas"]["FormFieldDto"][];
      /**
       * @description 编号
       * @example 1
       */
      id: string;
      /** @description 表单名称 */
      name?: string;
      /** @description 所属组织（新增时取当前组织，数据权限按它过滤） */
      orgId: string | null;
      /** @description 表单版本 */
      revision?: number;
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
    FormDesignerDto: {
      linkages?: components["schemas"]["FormLinkageDto"][];
      option?: {
        [key: string]: unknown;
      };
      /** @description FormCreate 规则安全子集，详见 docs/contracts/form.md */
      rule: {
        [key: string]: unknown;
      }[];
      /**
       * @description 安全表单契约版本
       * @enum {number}
       */
      schemaVersion: 1;
    };
    FormFieldDto: {
      /** @enum {string} */
      component:
        | "input"
        | "inputNumber"
        | "switch"
        | "select"
        | "radio"
        | "checkbox"
        | "datePicker";
      field: string;
      multilingual: boolean;
      multiple: boolean;
      options: components["schemas"]["FormOptionDto"][];
      queryable: boolean;
      required: boolean;
      title: string;
      /** @enum {string} */
      type: "string" | "number" | "boolean" | "array" | "date";
      validation: components["schemas"]["FormValidationDto"];
      visible: boolean;
    };
    FormLinkageDto: {
      /** @enum {string} */
      action: "visible" | "required" | "options";
      /** @enum {string} */
      operator: "eq" | "ne" | "in";
      source: string;
      target: string;
      /** @description 与来源字段比较的标量，in 使用标量数组 */
      value: string | number | boolean | (string | number | boolean)[];
      /** @description 不匹配时应用的布尔值或静态选项数组 */
      whenFalse:
        | boolean
        | {
            label: string;
            value: string | number | boolean;
          }[];
      /** @description 匹配时应用的布尔值或静态选项数组 */
      whenTrue:
        | boolean
        | {
            label: string;
            value: string | number | boolean;
          }[];
    };
    FormOptionDto: {
      label: string;
      value: string | number | boolean;
    };
    FormValidationDto: {
      /** @enum {string} */
      format?: "email" | "url";
      max?: number;
      min?: number;
      precision?: number;
    };
    FormValidationResult: {
      definitionId: string;
      revision: number;
      /** @enum {boolean} */
      valid: true;
    };
    HistoryBody: {
      page?: number;
      /**
       * @description 资源（权限码前缀）
       * @example system:user
       */
      resource: string;
      size?: number;
    };
    HistoryInfoBody: {
      historyId: string;
      /**
       * @description 资源（权限码前缀）
       * @example system:user
       */
      resource: string;
    };
    IdBody: {
      id: string;
    };
    ImportSpecBody: {
      tables: string[];
    };
    InspectFormBody: {
      designer: components["schemas"]["FormDesignerDto"];
    };
    InspectFormResult: {
      designer: components["schemas"]["FormDesignerDto"];
      fields: components["schemas"]["FormFieldDto"][];
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
    ModuleSpec: {
      businessName: string;
      children?: components["schemas"]["SpecChild"][];
      fields: components["schemas"]["SpecField"][];
      moduleName: string;
      options?: components["schemas"]["SpecOptions"];
      permissionPrefix: string;
      tableName: string;
      /** @enum {string} */
      template: "single" | "tree" | "masterDetail";
      title: string;
      tree?: components["schemas"]["SpecTree"];
      /** @enum {number} */
      version: 1;
    };
    OrgOption: {
      id: string;
      name: string;
      /** @description 从根到自己的名称 */
      path: string[];
    };
    PackageMenuItem: {
      children: components["schemas"]["PackageMenuItem"][];
      id: string;
      parentId: string | null;
      permission: string | null;
      title: string;
      /** @enum {string} */
      type: "directory" | "page" | "button";
    };
    PermissionItem: {
      code: string;
      /** @enum {string} */
      risk: "normal" | "high";
    };
    PermissionList: {
      list: components["schemas"]["PermissionItem"][];
    };
    PlatformPackageAddBody: {
      data: components["schemas"]["PlatformPackageAddData"];
    };
    PlatformPackageAddData: {
      /** @description 套餐编码 */
      code: string;
      /** @description 启用 */
      enabled?: boolean;
      /** @description 可用菜单 */
      menuIds?: string[];
      /** @description 套餐名称 */
      name: string;
      /** @description 配额 */
      quotas?: components["schemas"]["TenantQuotas"];
      /** @description 备注 */
      remark?: Record<string, never> | null;
    };
    PlatformPackageDeleteBody: {
      ids: string[];
    };
    PlatformPackageDeleteResult: {
      /** @description 处理的行数 */
      count: number;
    };
    PlatformPackageExportBody: {
      /** @description 当前可见列，按传入顺序导出；仍按服务端字段权限裁剪 */
      columns?: string[];
      /** @description 按等于筛选 */
      eq?: components["schemas"]["PlatformPackagePageEq"];
      /**
       * @default csv
       * @enum {string}
       */
      format: "csv" | "xlsx";
      /** @description 搜索框，模糊匹配：code、name */
      keyword?: string;
      /** @default 1 */
      page: number;
      /** @default 20 */
      size: number;
      sort?: components["schemas"]["PlatformPackagePageSort"][];
      /**
       * @description 浏览器 IANA 时区；省略时使用服务器本地时区
       * @example Asia/Shanghai
       */
      timeZone?: string;
      /** @description 高级查询：最多 3 层、20 个条件（契约 query.md） */
      where?: components["schemas"]["QueryGroupDto"];
    };
    PlatformPackageInfoBody: {
      /** @example 1 */
      id: string;
    };
    PlatformPackagePageBody: {
      /** @description 按等于筛选 */
      eq?: components["schemas"]["PlatformPackagePageEq"];
      /** @description 搜索框，模糊匹配：code、name */
      keyword?: string;
      /** @default 1 */
      page: number;
      /** @default 20 */
      size: number;
      sort?: components["schemas"]["PlatformPackagePageSort"][];
      /** @description 高级查询：最多 3 层、20 个条件（契约 query.md） */
      where?: components["schemas"]["QueryGroupDto"];
    };
    PlatformPackagePageEq: {
      /** @description 启用 */
      enabled?: boolean;
    };
    PlatformPackagePageResult: {
      list: components["schemas"]["PlatformPackageRow"][];
      page: number;
      size: number;
      total: number;
    };
    PlatformPackagePageSort: {
      /**
       * @description 排序字段
       * @enum {string}
       */
      field: "id" | "createdAt" | "updatedAt";
      /** @enum {string} */
      order: "asc" | "desc";
    };
    PlatformPackageRow: {
      /** @description 编号字段的显示名：createdBy / updatedBy 是用户名称，orgId 是组织名称；查不到的不返回 */
      _display?: {
        [key: string]: string;
      };
      /** @description 这一行上不是「可编辑」的字段：readonly 只读、masked 值已打码、hidden 不返回（契约 field-perm.md 3.1） */
      _fieldState?: {
        [key: string]: "readonly" | "masked" | "hidden";
      };
      /** @description 套餐编码 */
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
      /** @description 可用菜单 */
      menuIds?: string[];
      /** @description 套餐名称 */
      name?: string;
      /** @description 所属组织（新增时取当前组织，数据权限按它过滤） */
      orgId: string | null;
      /** @description 配额 */
      quotas?: components["schemas"]["TenantQuotas"];
      /** @description 备注 */
      remark?: Record<string, never> | null;
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
    PlatformPackageUpdateBody: {
      /** @description 只传要改的字段 */
      data: components["schemas"]["PlatformPackageUpdateData"];
      /** @example 1 */
      id: string;
      /** @description 读到的版本号，原样带回 */
      version: number;
    };
    PlatformPackageUpdateData: {
      /** @description 启用 */
      enabled?: boolean;
      /** @description 可用菜单 */
      menuIds?: string[];
      /** @description 套餐名称 */
      name?: string;
      /** @description 配额 */
      quotas?: components["schemas"]["TenantQuotas"];
      /** @description 备注 */
      remark?: Record<string, never> | null;
    };
    PlatformTenantDeleteBody: {
      ids: string[];
    };
    PlatformTenantDeleteResult: {
      /** @description 处理的行数 */
      count: number;
    };
    PlatformTenantExportBody: {
      /** @description 当前可见列，按传入顺序导出；仍按服务端字段权限裁剪 */
      columns?: string[];
      /** @description 按等于筛选 */
      eq?: components["schemas"]["PlatformTenantPageEq"];
      /**
       * @default csv
       * @enum {string}
       */
      format: "csv" | "xlsx";
      /** @description 搜索框，模糊匹配：code、name */
      keyword?: string;
      /** @default 1 */
      page: number;
      /** @default 20 */
      size: number;
      sort?: components["schemas"]["PlatformTenantPageSort"][];
      /**
       * @description 浏览器 IANA 时区；省略时使用服务器本地时区
       * @example Asia/Shanghai
       */
      timeZone?: string;
      /** @description 高级查询：最多 3 层、20 个条件（契约 query.md） */
      where?: components["schemas"]["QueryGroupDto"];
    };
    PlatformTenantInfoBody: {
      /** @example 1 */
      id: string;
    };
    PlatformTenantPageBody: {
      /** @description 按等于筛选 */
      eq?: components["schemas"]["PlatformTenantPageEq"];
      /** @description 搜索框，模糊匹配：code、name */
      keyword?: string;
      /** @default 1 */
      page: number;
      /** @default 20 */
      size: number;
      sort?: components["schemas"]["PlatformTenantPageSort"][];
      /** @description 高级查询：最多 3 层、20 个条件（契约 query.md） */
      where?: components["schemas"]["QueryGroupDto"];
    };
    PlatformTenantPageEq: {
      /** @description 租户编码 */
      code?: string;
      /** @description 启用 */
      enabled?: boolean;
      /** @description 套餐 */
      packageId?: string;
    };
    PlatformTenantPageResult: {
      list: components["schemas"]["PlatformTenantRow"][];
      page: number;
      size: number;
      total: number;
    };
    PlatformTenantPageSort: {
      /**
       * @description 排序字段
       * @enum {string}
       */
      field: "id" | "createdAt" | "updatedAt";
      /** @enum {string} */
      order: "asc" | "desc";
    };
    PlatformTenantRow: {
      /** @description 编号字段的显示名：createdBy / updatedBy 是用户名称，orgId 是组织名称；查不到的不返回 */
      _display?: {
        [key: string]: string;
      };
      /** @description 这一行上不是「可编辑」的字段：readonly 只读、masked 值已打码、hidden 不返回（契约 field-perm.md 3.1） */
      _fieldState?: {
        [key: string]: "readonly" | "masked" | "hidden";
      };
      /** @description 租户编码 */
      code?: string;
      /** @description 联系人 */
      contactName?: Record<string, never> | null;
      /** @description 联系电话 */
      contactPhone?: Record<string, never> | null;
      /**
       * Format: date-time
       * @description 创建时间
       */
      createdAt: string;
      /** @description 创建人 */
      createdBy: string | null;
      /** @description 绑定域名 */
      domains?: string[];
      /** @description 启用 */
      enabled?: boolean;
      /**
       * Format: date-time
       * @description 到期时间
       */
      expiresAt?: string | null;
      /**
       * @description 编号
       * @example 1
       */
      id: string;
      /** @description 租户名称 */
      name?: string;
      /** @description 所属组织（新增时取当前组织，数据权限按它过滤） */
      orgId: string | null;
      /** @description 套餐 */
      packageId?: string;
      /** @description 备注 */
      remark?: Record<string, never> | null;
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
    PlatformTenantUpdateBody: {
      /** @description 只传要改的字段 */
      data: components["schemas"]["PlatformTenantUpdateData"];
      /** @example 1 */
      id: string;
      /** @description 读到的版本号，原样带回 */
      version: number;
    };
    PlatformTenantUpdateData: {
      /** @description 联系人 */
      contactName?: Record<string, never> | null;
      /** @description 联系电话 */
      contactPhone?: Record<string, never> | null;
      /** @description 绑定域名 */
      domains?: string[];
      /** @description 启用 */
      enabled?: boolean;
      /**
       * Format: date-time
       * @description 到期时间
       */
      expiresAt?: string | null;
      /** @description 租户名称 */
      name?: string;
      /** @description 套餐 */
      packageId?: string;
      /** @description 备注 */
      remark?: Record<string, never> | null;
    };
    PreferenceKeyDto: {
      /**
       * @description 小写字母开头，最多 100 字
       * @example query:system:user
       */
      key: string;
    };
    PreferenceResult: {
      key: string;
      /** @description 没有保存过时是 null */
      value?: Record<string, never>;
    };
    ProfileResult: {
      currentOrg: components["schemas"]["OrgOption"] | null;
      /** @example zh-CN */
      locale: string;
      /** @description 有角色的组织，可以切换 */
      orgs: components["schemas"]["OrgOption"][];
      /** @description 当前组织下有效的超级管理员身份 */
      superAdmin: boolean;
      tenant: components["schemas"]["ProfileTenant"];
      user: components["schemas"]["ProfileUser"];
    };
    ProfileTenant: {
      /** @description 租户编码，登录时填写 */
      code: string;
      /** @description 租户编号（平台为 0） */
      id: string;
      name: string;
      /** @description 是不是平台（管理所有租户） */
      platform: boolean;
    };
    ProfileUser: {
      avatar: string | null;
      id: string;
      nickname: string;
      username: string;
    };
    QueryConditionDto: {
      /** @description 可筛选字段（页面描述 query[].field） */
      field: string;
      /** @enum {string} */
      op:
        | "eq"
        | "ne"
        | "gt"
        | "gte"
        | "lt"
        | "lte"
        | "in"
        | "notIn"
        | "contains"
        | "startsWith"
        | "between"
        | "isNull"
        | "notNull";
      /** @description 值：eq…lte 是简单值；in / notIn 是数组；between 是 [下限, 上限]；isNull / notNull 不要 */
      value?: Record<string, never>;
    };
    QueryGroupDto: {
      items: (
        | components["schemas"]["QueryConditionDto"]
        | components["schemas"]["QueryGroupDto"]
      )[];
      /** @enum {string} */
      op: "and" | "or";
    };
    ResetSystemPassword: {
      id: string;
      password: string;
      version: number;
    };
    RestoreBody: {
      historyId: string;
      /**
       * @description 资源（权限码前缀）
       * @example system:user
       */
      resource: string;
      version: number;
    };
    ReviseFormBody: {
      /** @description 当前最新业务修订号，修订后加1 */
      baseRevision: number;
      data: components["schemas"]["FormDefinitionInput"];
      /** @description 作为修订来源的固定表单版本编号 */
      definitionId: string;
    };
    SaveBody: {
      /** @description 生成配置（契约 codegen.md 第 2 节） */
      config: Record<string, never>;
      /** @description 不带是新建 */
      id?: string;
      /** @description 修改时带读到的版本 */
      version?: number;
    };
    SaveFieldConfigurations: {
      changes: components["schemas"]["FieldConfigurationChange"][];
    };
    SavePreferenceDto: {
      /**
       * @description 小写字母开头，最多 100 字
       * @example query:system:user
       */
      key: string;
      /** @description 任意 JSON，最多 64KB（常用查询就是 query.md 的 where 加名字） */
      value: Record<string, never>;
    };
    SaveRoleFieldConfigurations: {
      changes: components["schemas"]["FieldConfigurationChange"][];
      roleId: string;
    };
    SaveSpecBody: {
      id?: string;
      spec: components["schemas"]["ModuleSpec"];
      version?: number;
    };
    SpecBody: {
      spec: components["schemas"]["ModuleSpec"];
    };
    SpecChild: {
      fields: components["schemas"]["SpecField"][];
      /** @description 由框架维护的外键属性，不得同时出现在 fields 中 */
      foreignKey: string;
      tableName: string;
      title: string;
    };
    SpecError: {
      message: string;
      path: string;
    };
    SpecField: {
      column: string;
      comment?: string;
      defaultValue?: (string | number | boolean) | null;
      dictCode?: string;
      fieldPerm?: components["schemas"]["SpecFieldPerm"];
      label: string;
      length?: number;
      nullable?: boolean;
      precision?: number;
      property: string;
      scale?: number;
      /** @enum {string} */
      type:
        | "string"
        | "text"
        | "int"
        | "decimal"
        | "money"
        | "date"
        | "datetime"
        | "boolean"
        | "json"
        | "dictionary"
        | "reference"
        | "image"
        | "file";
      unique?: boolean;
    };
    SpecFieldPerm: {
      /** @enum {string} */
      default: "editable" | "readonly" | "masked" | "hidden";
      /** @enum {string} */
      mask?: "phone" | "email" | "idcard" | "last4" | "all";
    };
    SpecFieldType: {
      component: string;
      databaseType: string;
      defaultLength?: number;
      label: string;
      options: string[];
      precision?: number;
      scale?: number;
      type: string;
    };
    SpecFile: {
      /** @enum {string} */
      action: "create" | "overwrite" | "unchanged" | "skip-modified";
      content: string;
      diff: string;
      key: string;
      path: string;
      previous: string;
      /** @enum {string} */
      project: "server" | "admin";
    };
    SpecImportResult: {
      errors: components["schemas"]["SpecError"][];
      spec: components["schemas"]["ModuleSpec"];
    };
    SpecOptions: {
      /** @enum {string} */
      deleteMode?: "soft" | "hard";
      exportEnabled?: boolean;
      scopeEnabled?: boolean;
    };
    SpecPreviewResult: {
      files: components["schemas"]["SpecFile"][];
      fingerprint: string;
      manualSteps: string[];
      note: string;
      spec: components["schemas"]["ModuleSpec"];
      sql: string[];
      token: string;
    };
    SpecRecord: {
      error?: string;
      id: string;
      label: string;
      name: string;
      spec?: components["schemas"]["ModuleSpec"];
      /** @enum {string} */
      status: "notGenerated" | "generated" | "modified" | "invalid";
      updatedAt: string;
      version: number;
    };
    SpecSaveResult: {
      id: string;
    };
    SpecTable: {
      comment: string;
      fieldCount: number;
      table: string;
    };
    SpecTree: {
      nameField: string;
      parentField: string;
      sortField?: string;
    };
    SpecValidationResult: {
      errors: components["schemas"]["SpecError"][];
      valid: boolean;
    };
    SpecWriteFailure: {
      message: string;
      path: string;
    };
    SpecWriteResult: {
      failed: components["schemas"]["SpecWriteFailure"][];
      manualSteps: string[];
      recovery: string;
      skipped: string[];
      written: string[];
    };
    SwitchOrgDto: {
      /** @description 要切换到的组织编号 */
      orgId: string;
    };
    SystemCodeRuleAddBody: {
      data: components["schemas"]["SystemCodeRuleAddData"];
    };
    SystemCodeRuleAddData: {
      /** @description 规则编码 */
      code: string;
      /** @description 说明 */
      description?: string;
      /** @description 规则名称 */
      name: string;
      /**
       * @description 重置周期
       * @enum {string}
       */
      resetPeriod: "never" | "year" | "month" | "day";
      /** @description 编码段 */
      segments: {
        [key: string]: unknown;
      }[];
      /** @description 起始值 */
      start: string;
      /**
       * @description 状态
       * @enum {string}
       */
      status: "enabled" | "disabled";
      /** @description 时区 */
      timezone: string;
    };
    SystemCodeRuleDeleteBody: {
      ids: string[];
    };
    SystemCodeRuleDeleteResult: {
      /** @description 处理的行数 */
      count: number;
    };
    SystemCodeRuleInfoBody: {
      /** @example 1 */
      id: string;
    };
    SystemCodeRulePageBody: {
      /** @description 按等于筛选 */
      eq?: components["schemas"]["SystemCodeRulePageEq"];
      /** @description 搜索框，模糊匹配：code、name */
      keyword?: string;
      /** @default 1 */
      page: number;
      /** @default 20 */
      size: number;
      sort?: components["schemas"]["SystemCodeRulePageSort"][];
      /** @description 高级查询：最多 3 层、20 个条件（契约 query.md） */
      where?: components["schemas"]["QueryGroupDto"];
    };
    SystemCodeRulePageEq: {
      /**
       * @description 重置周期
       * @enum {string}
       */
      resetPeriod?: "never" | "year" | "month" | "day";
      /**
       * @description 状态
       * @enum {string}
       */
      status?: "enabled" | "disabled";
    };
    SystemCodeRulePageResult: {
      list: components["schemas"]["SystemCodeRuleRow"][];
      page: number;
      size: number;
      total: number;
    };
    SystemCodeRulePageSort: {
      /**
       * @description 排序字段
       * @enum {string}
       */
      field: "id" | "createdAt" | "updatedAt";
      /** @enum {string} */
      order: "asc" | "desc";
    };
    SystemCodeRuleRow: {
      /** @description 编号字段的显示名：createdBy / updatedBy 是用户名称，orgId 是组织名称；查不到的不返回 */
      _display?: {
        [key: string]: string;
      };
      /** @description 这一行上不是「可编辑」的字段：readonly 只读、masked 值已打码、hidden 不返回（契约 field-perm.md 3.1） */
      _fieldState?: {
        [key: string]: "readonly" | "masked" | "hidden";
      };
      /** @description 规则编码 */
      code?: string;
      /**
       * Format: date-time
       * @description 创建时间
       */
      createdAt: string;
      /** @description 创建人 */
      createdBy: string | null;
      /** @description 说明 */
      description?: string;
      /** @description 首次绑定时间 */
      firstBoundAt?: Record<string, never>;
      /** @description 首次绑定用途 */
      firstBoundUsageKey?: Record<string, never>;
      /**
       * @description 编号
       * @example 1
       */
      id: string;
      /** @description 规则名称 */
      name?: string;
      /** @description 所属组织（新增时取当前组织，数据权限按它过滤） */
      orgId: string | null;
      /**
       * @description 重置周期
       * @enum {string}
       */
      resetPeriod?: "never" | "year" | "month" | "day";
      /** @description 修订号 */
      revision?: number;
      /** @description 编码段 */
      segments?: {
        [key: string]: unknown;
      }[];
      /** @description 起始值 */
      start?: string;
      /**
       * @description 状态
       * @enum {string}
       */
      status?: "enabled" | "disabled";
      /** @description 时区 */
      timezone?: string;
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
    SystemCodeRuleUpdateBody: {
      /** @description 只传要改的字段 */
      data: components["schemas"]["SystemCodeRuleUpdateData"];
      /** @example 1 */
      id: string;
      /** @description 读到的版本号，原样带回 */
      version: number;
    };
    SystemCodeRuleUpdateData: {
      /** @description 说明 */
      description?: string;
      /** @description 规则名称 */
      name?: string;
      /**
       * @description 重置周期
       * @enum {string}
       */
      resetPeriod?: "never" | "year" | "month" | "day";
      /** @description 编码段 */
      segments?: {
        [key: string]: unknown;
      }[];
      /** @description 起始值 */
      start?: string;
      /**
       * @description 状态
       * @enum {string}
       */
      status?: "enabled" | "disabled";
      /** @description 时区 */
      timezone?: string;
    };
    SystemCodeSequenceInfoBody: {
      /** @example 1 */
      id: string;
    };
    SystemCodeSequencePageBody: {
      /** @description 按等于筛选 */
      eq?: components["schemas"]["SystemCodeSequencePageEq"];
      /** @description 这个资源没有配置搜索字段，传了也不生效 */
      keyword?: string;
      /** @default 1 */
      page: number;
      /** @default 20 */
      size: number;
      sort?: components["schemas"]["SystemCodeSequencePageSort"][];
      /** @description 高级查询：最多 3 层、20 个条件（契约 query.md） */
      where?: components["schemas"]["QueryGroupDto"];
    };
    SystemCodeSequencePageEq: {
      /** @description 周期 */
      periodKey?: string;
      /** @description 规则编号 */
      ruleId?: string;
    };
    SystemCodeSequencePageResult: {
      list: components["schemas"]["SystemCodeSequenceRow"][];
      page: number;
      size: number;
      total: number;
    };
    SystemCodeSequencePageSort: {
      /**
       * @description 排序字段
       * @enum {string}
       */
      field: "id" | "createdAt" | "updatedAt";
      /** @enum {string} */
      order: "asc" | "desc";
    };
    SystemCodeSequenceRow: {
      /** @description 编号字段的显示名：createdBy / updatedBy 是用户名称，orgId 是组织名称；查不到的不返回 */
      _display?: {
        [key: string]: string;
      };
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
      /** @description 当前序号 */
      current?: string;
      /**
       * @description 编号
       * @example 1
       */
      id: string;
      /** @description 最近编码 */
      lastCode?: Record<string, never>;
      /** @description 所属组织（新增时取当前组织，数据权限按它过滤） */
      orgId: string | null;
      /** @description 周期 */
      periodKey?: string;
      /** @description 规则编号 */
      ruleId?: string;
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
    SystemDictItemExportBody: {
      /** @description 当前可见列，按传入顺序导出；仍按服务端字段权限裁剪 */
      columns?: string[];
      /** @description 按等于筛选 */
      eq?: components["schemas"]["SystemDictItemPageEq"];
      /**
       * @default csv
       * @enum {string}
       */
      format: "csv" | "xlsx";
      /** @description 搜索框，模糊匹配：label、value */
      keyword?: string;
      /** @default 1 */
      page: number;
      /** @default 20 */
      size: number;
      sort?: components["schemas"]["SystemDictItemPageSort"][];
      /**
       * @description 浏览器 IANA 时区；省略时使用服务器本地时区
       * @example Asia/Shanghai
       */
      timeZone?: string;
      /** @description 高级查询：最多 3 层、20 个条件（契约 query.md） */
      where?: components["schemas"]["QueryGroupDto"];
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
      /** @description 高级查询：最多 3 层、20 个条件（契约 query.md） */
      where?: components["schemas"]["QueryGroupDto"];
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
      /** @description 编号字段的显示名：createdBy / updatedBy 是用户名称，orgId 是组织名称；查不到的不返回 */
      _display?: {
        [key: string]: string;
      };
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
      /** @description 字典值 */
      value?: string;
    };
    SystemDictTypeAddBody: {
      data: components["schemas"]["SystemDictTypeAddData"];
    };
    SystemDictTypeAddData: {
      /** @description 内置 */
      builtin?: boolean;
      /** @description 字典标识 */
      code: string;
      /** @description 启用 */
      enabled?: boolean;
      /** @description 字典名称 */
      name: string;
      /** @description 排序 */
      rank?: number;
    };
    SystemDictTypeDeleteBody: {
      ids: string[];
    };
    SystemDictTypeDeleteResult: {
      /** @description 处理的行数 */
      count: number;
    };
    SystemDictTypeExportBody: {
      /** @description 当前可见列，按传入顺序导出；仍按服务端字段权限裁剪 */
      columns?: string[];
      /** @description 按等于筛选 */
      eq?: components["schemas"]["SystemDictTypePageEq"];
      /**
       * @default csv
       * @enum {string}
       */
      format: "csv" | "xlsx";
      /** @description 搜索框，模糊匹配：code、name */
      keyword?: string;
      /** @default 1 */
      page: number;
      /** @default 20 */
      size: number;
      sort?: components["schemas"]["SystemDictTypePageSort"][];
      /**
       * @description 浏览器 IANA 时区；省略时使用服务器本地时区
       * @example Asia/Shanghai
       */
      timeZone?: string;
      /** @description 高级查询：最多 3 层、20 个条件（契约 query.md） */
      where?: components["schemas"]["QueryGroupDto"];
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
      /** @description 高级查询：最多 3 层、20 个条件（契约 query.md） */
      where?: components["schemas"]["QueryGroupDto"];
    };
    SystemDictTypePageEq: {
      /** @description 内置 */
      builtin?: boolean;
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
      field: "id" | "createdAt" | "updatedAt" | "rank";
      /** @enum {string} */
      order: "asc" | "desc";
    };
    SystemDictTypeRow: {
      /** @description 编号字段的显示名：createdBy / updatedBy 是用户名称，orgId 是组织名称；查不到的不返回 */
      _display?: {
        [key: string]: string;
      };
      /** @description 这一行上不是「可编辑」的字段：readonly 只读、masked 值已打码、hidden 不返回（契约 field-perm.md 3.1） */
      _fieldState?: {
        [key: string]: "readonly" | "masked" | "hidden";
      };
      /** @description 内置 */
      builtin?: boolean;
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
    SystemDictTypeUpdateBody: {
      /** @description 只传要改的字段 */
      data: components["schemas"]["SystemDictTypeUpdateData"];
      /** @example 1 */
      id: string;
      /** @description 读到的版本号，原样带回 */
      version: number;
    };
    SystemDictTypeUpdateData: {
      /** @description 内置 */
      builtin?: boolean;
      /** @description 字典标识 */
      code?: string;
      /** @description 启用 */
      enabled?: boolean;
      /** @description 字典名称 */
      name?: string;
      /** @description 排序 */
      rank?: number;
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
      /** @description 高级查询：最多 3 层、20 个条件（契约 query.md） */
      where?: components["schemas"]["QueryGroupDto"];
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
      /** @description 编号字段的显示名：createdBy / updatedBy 是用户名称，orgId 是组织名称；查不到的不返回 */
      _display?: {
        [key: string]: string;
      };
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
    SystemLoginLogExportBody: {
      /** @description 当前可见列，按传入顺序导出；仍按服务端字段权限裁剪 */
      columns?: string[];
      /** @description 按等于筛选 */
      eq?: components["schemas"]["SystemLoginLogPageEq"];
      /**
       * @default csv
       * @enum {string}
       */
      format: "csv" | "xlsx";
      /** @description 搜索框，模糊匹配：username */
      keyword?: string;
      /** @default 1 */
      page: number;
      /** @default 20 */
      size: number;
      sort?: components["schemas"]["SystemLoginLogPageSort"][];
      /**
       * @description 浏览器 IANA 时区；省略时使用服务器本地时区
       * @example Asia/Shanghai
       */
      timeZone?: string;
      /** @description 高级查询：最多 3 层、20 个条件（契约 query.md） */
      where?: components["schemas"]["QueryGroupDto"];
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
      /** @description 高级查询：最多 3 层、20 个条件（契约 query.md） */
      where?: components["schemas"]["QueryGroupDto"];
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
      /** @description 编号字段的显示名：createdBy / updatedBy 是用户名称，orgId 是组织名称；查不到的不返回 */
      _display?: {
        [key: string]: string;
      };
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
      /**
       * @description 菜单范围
       * @enum {string}
       */
      scope: "tenant" | "platform";
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
    SystemMenuExportBody: {
      /** @description 当前可见列，按传入顺序导出；仍按服务端字段权限裁剪 */
      columns?: string[];
      /** @description 按等于筛选 */
      eq?: components["schemas"]["SystemMenuPageEq"];
      /**
       * @default csv
       * @enum {string}
       */
      format: "csv" | "xlsx";
      /** @description 搜索框，模糊匹配：title、path */
      keyword?: string;
      /** @default 1 */
      page: number;
      /** @default 20 */
      size: number;
      sort?: components["schemas"]["SystemMenuPageSort"][];
      /**
       * @description 浏览器 IANA 时区；省略时使用服务器本地时区
       * @example Asia/Shanghai
       */
      timeZone?: string;
      /** @description 高级查询：最多 3 层、20 个条件（契约 query.md） */
      where?: components["schemas"]["QueryGroupDto"];
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
      /** @description 高级查询：最多 3 层、20 个条件（契约 query.md） */
      where?: components["schemas"]["QueryGroupDto"];
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
      /** @description 编号字段的显示名：createdBy / updatedBy 是用户名称，orgId 是组织名称；查不到的不返回 */
      _display?: {
        [key: string]: string;
      };
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
      /**
       * @description 菜单范围
       * @enum {string}
       */
      scope?: "tenant" | "platform";
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
    SystemMenuTreeResult: {
      /** @description 全部可见节点（平铺），前端按页面描述 tree.parentField 组树；父节点不在列表里的当作根节点 */
      list: components["schemas"]["SystemMenuRow"][];
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
      /**
       * @description 菜单范围
       * @enum {string}
       */
      scope?: "tenant" | "platform";
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
    SystemOperationLogExportBody: {
      /** @description 当前可见列，按传入顺序导出；仍按服务端字段权限裁剪 */
      columns?: string[];
      /** @description 按等于筛选 */
      eq?: components["schemas"]["SystemOperationLogPageEq"];
      /**
       * @default csv
       * @enum {string}
       */
      format: "csv" | "xlsx";
      /** @description 搜索框，模糊匹配：action、resource */
      keyword?: string;
      /** @default 1 */
      page: number;
      /** @default 20 */
      size: number;
      sort?: components["schemas"]["SystemOperationLogPageSort"][];
      /**
       * @description 浏览器 IANA 时区；省略时使用服务器本地时区
       * @example Asia/Shanghai
       */
      timeZone?: string;
      /** @description 高级查询：最多 3 层、20 个条件（契约 query.md） */
      where?: components["schemas"]["QueryGroupDto"];
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
      /** @description 高级查询：最多 3 层、20 个条件（契约 query.md） */
      where?: components["schemas"]["QueryGroupDto"];
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
      /** @description 编号字段的显示名：createdBy / updatedBy 是用户名称，orgId 是组织名称；查不到的不返回 */
      _display?: {
        [key: string]: string;
      };
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
    SystemOrgExportBody: {
      /** @description 当前可见列，按传入顺序导出；仍按服务端字段权限裁剪 */
      columns?: string[];
      /** @description 按等于筛选 */
      eq?: components["schemas"]["SystemOrgPageEq"];
      /**
       * @default csv
       * @enum {string}
       */
      format: "csv" | "xlsx";
      /** @description 搜索框，模糊匹配：name */
      keyword?: string;
      /** @default 1 */
      page: number;
      /** @default 20 */
      size: number;
      sort?: components["schemas"]["SystemOrgPageSort"][];
      /**
       * @description 浏览器 IANA 时区；省略时使用服务器本地时区
       * @example Asia/Shanghai
       */
      timeZone?: string;
      /** @description 高级查询：最多 3 层、20 个条件（契约 query.md） */
      where?: components["schemas"]["QueryGroupDto"];
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
      /** @description 高级查询：最多 3 层、20 个条件（契约 query.md） */
      where?: components["schemas"]["QueryGroupDto"];
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
      /** @description 编号字段的显示名：createdBy / updatedBy 是用户名称，orgId 是组织名称；查不到的不返回 */
      _display?: {
        [key: string]: string;
      };
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
    SystemOrgTreeResult: {
      /** @description 全部可见节点（平铺），前端按页面描述 tree.parentField 组树；父节点不在列表里的当作根节点 */
      list: components["schemas"]["SystemOrgRow"][];
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
    SystemParameterExportBody: {
      /** @description 当前可见列，按传入顺序导出；仍按服务端字段权限裁剪 */
      columns?: string[];
      /** @description 按等于筛选 */
      eq?: components["schemas"]["SystemParameterPageEq"];
      /**
       * @default csv
       * @enum {string}
       */
      format: "csv" | "xlsx";
      /** @description 搜索框，模糊匹配：key */
      keyword?: string;
      /** @default 1 */
      page: number;
      /** @default 20 */
      size: number;
      sort?: components["schemas"]["SystemParameterPageSort"][];
      /**
       * @description 浏览器 IANA 时区；省略时使用服务器本地时区
       * @example Asia/Shanghai
       */
      timeZone?: string;
      /** @description 高级查询：最多 3 层、20 个条件（契约 query.md） */
      where?: components["schemas"]["QueryGroupDto"];
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
      /** @description 高级查询：最多 3 层、20 个条件（契约 query.md） */
      where?: components["schemas"]["QueryGroupDto"];
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
      /** @description 编号字段的显示名：createdBy / updatedBy 是用户名称，orgId 是组织名称；查不到的不返回 */
      _display?: {
        [key: string]: string;
      };
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
    SystemRoleExportBody: {
      /** @description 当前可见列，按传入顺序导出；仍按服务端字段权限裁剪 */
      columns?: string[];
      /** @description 按等于筛选 */
      eq?: components["schemas"]["SystemRolePageEq"];
      /**
       * @default csv
       * @enum {string}
       */
      format: "csv" | "xlsx";
      /** @description 搜索框，模糊匹配：code、name */
      keyword?: string;
      /** @default 1 */
      page: number;
      /** @default 20 */
      size: number;
      sort?: components["schemas"]["SystemRolePageSort"][];
      /**
       * @description 浏览器 IANA 时区；省略时使用服务器本地时区
       * @example Asia/Shanghai
       */
      timeZone?: string;
      /** @description 高级查询：最多 3 层、20 个条件（契约 query.md） */
      where?: components["schemas"]["QueryGroupDto"];
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
      /** @description 高级查询：最多 3 层、20 个条件（契约 query.md） */
      where?: components["schemas"]["QueryGroupDto"];
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
      /** @description 编号字段的显示名：createdBy / updatedBy 是用户名称，orgId 是组织名称；查不到的不返回 */
      _display?: {
        [key: string]: string;
      };
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
      /** @description 高级查询：最多 3 层、20 个条件（契约 query.md） */
      where?: components["schemas"]["QueryGroupDto"];
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
      /** @description 编号字段的显示名：createdBy / updatedBy 是用户名称，orgId 是组织名称；查不到的不返回 */
      _display?: {
        [key: string]: string;
      };
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
    SystemUserExportBody: {
      /** @description 当前可见列，按传入顺序导出；仍按服务端字段权限裁剪 */
      columns?: string[];
      /** @description 按等于筛选 */
      eq?: components["schemas"]["SystemUserPageEq"];
      /**
       * @default csv
       * @enum {string}
       */
      format: "csv" | "xlsx";
      /** @description 搜索框，模糊匹配：username、nickname */
      keyword?: string;
      /** @default 1 */
      page: number;
      /** @default 20 */
      size: number;
      sort?: components["schemas"]["SystemUserPageSort"][];
      /**
       * @description 浏览器 IANA 时区；省略时使用服务器本地时区
       * @example Asia/Shanghai
       */
      timeZone?: string;
      /** @description 高级查询：最多 3 层、20 个条件（契约 query.md） */
      where?: components["schemas"]["QueryGroupDto"];
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
      /** @description 高级查询：最多 3 层、20 个条件（契约 query.md） */
      where?: components["schemas"]["QueryGroupDto"];
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
    SystemUserRoleExportBody: {
      /** @description 当前可见列，按传入顺序导出；仍按服务端字段权限裁剪 */
      columns?: string[];
      /** @description 按等于筛选 */
      eq?: components["schemas"]["SystemUserRolePageEq"];
      /**
       * @default csv
       * @enum {string}
       */
      format: "csv" | "xlsx";
      /** @description 这个资源没有配置搜索字段，传了也不生效 */
      keyword?: string;
      /** @default 1 */
      page: number;
      /** @default 20 */
      size: number;
      sort?: components["schemas"]["SystemUserRolePageSort"][];
      /**
       * @description 浏览器 IANA 时区；省略时使用服务器本地时区
       * @example Asia/Shanghai
       */
      timeZone?: string;
      /** @description 高级查询：最多 3 层、20 个条件（契约 query.md） */
      where?: components["schemas"]["QueryGroupDto"];
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
      /** @description 高级查询：最多 3 层、20 个条件（契约 query.md） */
      where?: components["schemas"]["QueryGroupDto"];
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
      /** @description 编号字段的显示名：createdBy / updatedBy 是用户名称，orgId 是组织名称；查不到的不返回 */
      _display?: {
        [key: string]: string;
      };
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
      /** @description 编号字段的显示名：createdBy / updatedBy 是用户名称，orgId 是组织名称；查不到的不返回 */
      _display?: {
        [key: string]: string;
      };
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
    SystemUserSupervisorExportBody: {
      /** @description 当前可见列，按传入顺序导出；仍按服务端字段权限裁剪 */
      columns?: string[];
      /** @description 按等于筛选 */
      eq?: components["schemas"]["SystemUserSupervisorPageEq"];
      /**
       * @default csv
       * @enum {string}
       */
      format: "csv" | "xlsx";
      /** @description 这个资源没有配置搜索字段，传了也不生效 */
      keyword?: string;
      /** @default 1 */
      page: number;
      /** @default 20 */
      size: number;
      sort?: components["schemas"]["SystemUserSupervisorPageSort"][];
      /**
       * @description 浏览器 IANA 时区；省略时使用服务器本地时区
       * @example Asia/Shanghai
       */
      timeZone?: string;
      /** @description 高级查询：最多 3 层、20 个条件（契约 query.md） */
      where?: components["schemas"]["QueryGroupDto"];
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
      /** @description 高级查询：最多 3 层、20 个条件（契约 query.md） */
      where?: components["schemas"]["QueryGroupDto"];
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
      /** @description 编号字段的显示名：createdBy / updatedBy 是用户名称，orgId 是组织名称；查不到的不返回 */
      _display?: {
        [key: string]: string;
      };
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
    TableBody: {
      /** @example crm_customer */
      table: string;
    };
    TenantCreationResult: {
      /**
       * @description 编号
       * @example 1
       */
      id: string;
      /** @description 版本号，修改时原样带回 */
      version: number;
    };
    TenantHintResult: {
      /**
       * @description domain：域名已绑定租户，登录页不用填租户编码；code：要填租户编码（不填等同默认租户）
       * @enum {string}
       */
      mode: "domain" | "code";
      tenant?: components["schemas"]["TenantHintTenant"];
    };
    TenantHintTenant: {
      code: string;
      name: string;
    };
    TenantIdBody: {
      id: string;
    };
    TenantQuotas: {
      /** @default null */
      aiTokensMonthly: number | null;
      /** @default null */
      maxSites: number | null;
      /** @default null */
      maxUsers: number | null;
      /** @default null */
      mcpCallsMonthly: number | null;
      /** @default null */
      storageMb: number | null;
    };
    TenantUsageResult: {
      quotas: components["schemas"]["TenantQuotas"];
      /** @description 已用字节，十进制字符串，避免大数丢精度 */
      storageBytes: string;
      tenantId: string;
      users: number;
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
    ValidateFormBody: {
      data: {
        [key: string]: unknown;
      };
      /** @description 固定表单版本记录编号 */
      definitionId: string;
    };
    VersionBody: {
      /**
       * @description 资源（权限码前缀）
       * @example system:user
       */
      resource: string;
      version: number;
    };
    WriteBody: {
      id: string;
      /** @description 手改过但仍要覆盖的文件路径 */
      overwrite?: string[];
      /** @description 预览返回的 token */
      token: string;
    };
    WriteSpecBody: {
      /** @description preview-spec 返回的 fingerprint */
      fingerprint: string;
      /** @description 显式确认覆盖的文件key（project:path）或预览路径；其他手改文件继续跳过 */
      overwrite?: string[];
      spec: components["schemas"]["ModuleSpec"];
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
  authTenantHint: {
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
            data: components["schemas"]["TenantHintResult"];
            /** @example ok */
            message: string;
          };
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
  devCodegenDelete: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["IdBody"];
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
            data: Record<string, never> | null;
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
  devCodegenDownload: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["IdBody"];
      };
    };
    responses: {
      /** @description 代码压缩包 */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/zip": Blob;
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
  devCodegenFieldTypes: {
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
            data: components["schemas"]["SpecFieldType"][];
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
  devCodegenImport: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["TableBody"];
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
            data: Record<string, never> | null;
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
  devCodegenImportSpec: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["ImportSpecBody"];
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
            data: components["schemas"]["SpecImportResult"];
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
  devCodegenInfo: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["IdBody"];
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
            data: Record<string, never> | null;
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
  devCodegenList: {
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
            data: components["schemas"]["SpecRecord"][];
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
  devCodegenPreview: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["IdBody"];
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
            data: Record<string, never> | null;
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
  devCodegenPreviewSpec: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["SpecBody"];
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
            data: components["schemas"]["SpecPreviewResult"];
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
  devCodegenSave: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["SaveBody"];
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
            data: Record<string, never> | null;
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
  devCodegenSaveSpec: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["SaveSpecBody"];
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
            data: components["schemas"]["SpecSaveResult"];
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
  devCodegenSchemaSpec: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["SpecBody"];
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
            data: components["schemas"]["CrudSchema"];
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
  devCodegenSync: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["IdBody"];
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
            data: Record<string, never> | null;
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
  devCodegenTables: {
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
            data: components["schemas"]["SpecTable"][];
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
  devCodegenValidateSpec: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["SpecBody"];
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
            data: components["schemas"]["SpecValidationResult"];
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
  devCodegenWrite: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["WriteBody"];
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
            data: Record<string, never> | null;
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
  devCodegenWriteSpec: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["WriteSpecBody"];
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
            data: components["schemas"]["SpecWriteResult"];
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
  fileAssetDownload: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["FileIdBody"];
      };
    };
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/octet-stream": Blob;
        };
      };
      /** @description 4000：参数有误、唯一冲突等，字段错误在 data.errors */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/octet-stream": components["schemas"]["ApiErrorBody"];
        };
      };
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/octet-stream": components["schemas"]["ApiErrorBody"];
        };
      };
      403: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/octet-stream": components["schemas"]["ApiErrorBody"];
        };
      };
      /** @description 4004：数据不存在或无权访问 */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/octet-stream": components["schemas"]["ApiErrorBody"];
        };
      };
      413: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/octet-stream": components["schemas"]["ApiErrorBody"];
        };
      };
      503: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/octet-stream": components["schemas"]["ApiErrorBody"];
        };
      };
    };
  };
  fileAssetInfo: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["FileAssetInfoBody"];
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
            data: components["schemas"]["FileAssetRow"];
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
  fileAssetPage: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["FileAssetPageBody"];
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
            data: components["schemas"]["FileAssetPageResult"];
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
  fileAssetSchema: {
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
  fileAssetUpload: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "multipart/form-data": {
          /** Format: binary */
          file: Blob;
        };
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
            data: components["schemas"]["FileReceipt"];
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
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ApiErrorBody"];
        };
      };
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
      413: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ApiErrorBody"];
        };
      };
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
  formDefinitionAdd: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["CreateFormBody"];
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
            data: components["schemas"]["FormDefinition"];
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
  formDefinitionInfo: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["FormDefinitionInfoBody"];
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
            data: components["schemas"]["FormDefinitionRow"];
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
  formDefinitionInspect: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["InspectFormBody"];
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
            data: components["schemas"]["InspectFormResult"];
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
  formDefinitionPage: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["FormDefinitionPageBody"];
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
            data: components["schemas"]["FormDefinitionPageResult"];
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
  formDefinitionRevise: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["ReviseFormBody"];
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
            data: components["schemas"]["FormDefinition"];
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
  formDefinitionSchema: {
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
  formDefinitionValidate: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["ValidateFormBody"];
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
            data: components["schemas"]["FormValidationResult"];
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
    };
  };
  platformPackageAdd: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["PlatformPackageAddBody"];
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
            data: components["schemas"]["PlatformPackageRow"];
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
  platformPackageDelete: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["PlatformPackageDeleteBody"];
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
            data: components["schemas"]["PlatformPackageDeleteResult"];
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
  platformPackageExport: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["PlatformPackageExportBody"];
      };
    };
    responses: {
      /** @description Excel / CSV 文件（CSV为UTF-8带BOM） */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": Blob;
          "text/csv": Blob;
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
    };
  };
  platformPackageInfo: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["PlatformPackageInfoBody"];
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
            data: components["schemas"]["PlatformPackageRow"];
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
  platformPackageMenus: {
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
            data: components["schemas"]["PackageMenuItem"][];
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
    };
  };
  platformPackagePage: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["PlatformPackagePageBody"];
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
            data: components["schemas"]["PlatformPackagePageResult"];
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
  platformPackageSchema: {
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
  platformPackageUpdate: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["PlatformPackageUpdateBody"];
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
            data: components["schemas"]["PlatformPackageRow"];
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
  platformTenantAdd: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["CreateTenantBody"];
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
            data: components["schemas"]["TenantCreationResult"];
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
  platformTenantDelete: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["PlatformTenantDeleteBody"];
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
            data: components["schemas"]["PlatformTenantDeleteResult"];
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
  platformTenantExport: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["PlatformTenantExportBody"];
      };
    };
    responses: {
      /** @description Excel / CSV 文件（CSV为UTF-8带BOM） */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": Blob;
          "text/csv": Blob;
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
    };
  };
  platformTenantInfo: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["PlatformTenantInfoBody"];
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
            data: components["schemas"]["PlatformTenantRow"];
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
  platformTenantPage: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["PlatformTenantPageBody"];
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
            data: components["schemas"]["PlatformTenantPageResult"];
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
  platformTenantSchema: {
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
  platformTenantUpdate: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["PlatformTenantUpdateBody"];
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
            data: components["schemas"]["PlatformTenantRow"];
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
  platformTenantUsage: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["TenantIdBody"];
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
            data: components["schemas"]["TenantUsageResult"];
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
  sessionPreferenceGet: {
    parameters: {
      query: {
        /** @description 小写字母开头，最多 100 字 */
        key: string;
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
            data: components["schemas"]["PreferenceResult"];
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
    };
  };
  sessionPreferenceDelete: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["PreferenceKeyDto"];
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
            data: Record<string, never> | null;
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
    };
  };
  sessionPreferenceSave: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["SavePreferenceDto"];
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
            data: components["schemas"]["PreferenceResult"];
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
  systemCodeRuleAdd: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["SystemCodeRuleAddBody"];
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
            data: components["schemas"]["SystemCodeRuleRow"];
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
  codeRuleBindingSet: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["CodeBindingBody"];
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
            data: components["schemas"]["CodeBindingBody"];
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
  systemCodeRuleDelete: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["SystemCodeRuleDeleteBody"];
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
            data: components["schemas"]["SystemCodeRuleDeleteResult"];
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
  codeRuleHistory: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["CodePreviewBody"];
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
            data: components["schemas"]["CodeHistoryResult"];
            /** @example ok */
            message: string;
          };
        };
      };
    };
  };
  systemCodeRuleInfo: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["SystemCodeRuleInfoBody"];
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
            data: components["schemas"]["SystemCodeRuleRow"];
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
  systemCodeRulePage: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["SystemCodeRulePageBody"];
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
            data: components["schemas"]["SystemCodeRulePageResult"];
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
  codeRulePreview: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["CodePreviewBody"];
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
            data: components["schemas"]["CodePreviewResult"];
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
  systemCodeRuleSchema: {
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
  codeRuleTimeZones: {
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
            data: components["schemas"]["CodeTimeZoneResult"];
            /** @example ok */
            message: string;
          };
        };
      };
    };
  };
  systemCodeRuleUpdate: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["SystemCodeRuleUpdateBody"];
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
            data: components["schemas"]["SystemCodeRuleRow"];
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
  codeRuleUsageList: {
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
            data: components["schemas"]["CodeUsageResult"];
            /** @example ok */
            message: string;
          };
        };
      };
    };
  };
  codeRuleValidate: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["CodeRuleValidateBody"];
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
            data: components["schemas"]["CodePreviewResult"];
            /** @example ok */
            message: string;
          };
        };
      };
    };
  };
  systemCodeSequenceInfo: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["SystemCodeSequenceInfoBody"];
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
            data: components["schemas"]["SystemCodeSequenceRow"];
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
  systemCodeSequencePage: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["SystemCodeSequencePageBody"];
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
            data: components["schemas"]["SystemCodeSequencePageResult"];
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
  systemCodeSequenceSchema: {
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
  systemDictItemExport: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["SystemDictItemExportBody"];
      };
    };
    responses: {
      /** @description Excel / CSV 文件（CSV为UTF-8带BOM） */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": Blob;
          "text/csv": Blob;
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
  systemDictTypeExport: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["SystemDictTypeExportBody"];
      };
    };
    responses: {
      /** @description Excel / CSV 文件（CSV为UTF-8带BOM） */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": Blob;
          "text/csv": Blob;
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
  systemLoginLogExport: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["SystemLoginLogExportBody"];
      };
    };
    responses: {
      /** @description Excel / CSV 文件（CSV为UTF-8带BOM） */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": Blob;
          "text/csv": Blob;
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
  systemMenuExport: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["SystemMenuExportBody"];
      };
    };
    responses: {
      /** @description Excel / CSV 文件（CSV为UTF-8带BOM） */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": Blob;
          "text/csv": Blob;
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
  systemMenuTree: {
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
            data: components["schemas"]["SystemMenuTreeResult"];
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
  systemOperationLogExport: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["SystemOperationLogExportBody"];
      };
    };
    responses: {
      /** @description Excel / CSV 文件（CSV为UTF-8带BOM） */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": Blob;
          "text/csv": Blob;
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
  systemOrgExport: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["SystemOrgExportBody"];
      };
    };
    responses: {
      /** @description Excel / CSV 文件（CSV为UTF-8带BOM） */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": Blob;
          "text/csv": Blob;
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
  systemOrgTree: {
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
            data: components["schemas"]["SystemOrgTreeResult"];
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
  systemPageConfigInfo: {
    parameters: {
      query: {
        /** @description 资源（权限码前缀） */
        resource: string;
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
            data: Record<string, never> | null;
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
    };
  };
  systemPageConfigHistory: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["HistoryBody"];
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
            data: Record<string, never> | null;
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
    };
  };
  systemPageConfigHistoryInfo: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["HistoryInfoBody"];
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
            data: Record<string, never> | null;
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
    };
  };
  systemPageConfigReset: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["VersionBody"];
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
            data: Record<string, never> | null;
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
  systemPageConfigRestore: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["RestoreBody"];
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
            data: Record<string, never> | null;
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
  systemPageConfigSave: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["SaveBody"];
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
            data: Record<string, never> | null;
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
  systemParameterExport: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["SystemParameterExportBody"];
      };
    };
    responses: {
      /** @description Excel / CSV 文件（CSV为UTF-8带BOM） */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": Blob;
          "text/csv": Blob;
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
  systemRoleExport: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["SystemRoleExportBody"];
      };
    };
    responses: {
      /** @description Excel / CSV 文件（CSV为UTF-8带BOM） */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": Blob;
          "text/csv": Blob;
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
  systemUserRoleExport: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["SystemUserRoleExportBody"];
      };
    };
    responses: {
      /** @description Excel / CSV 文件（CSV为UTF-8带BOM） */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": Blob;
          "text/csv": Blob;
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
  systemUserSupervisorExport: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["SystemUserSupervisorExportBody"];
      };
    };
    responses: {
      /** @description Excel / CSV 文件（CSV为UTF-8带BOM） */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": Blob;
          "text/csv": Blob;
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
  systemUserExport: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["SystemUserExportBody"];
      };
    };
    responses: {
      /** @description Excel / CSV 文件（CSV为UTF-8带BOM） */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": Blob;
          "text/csv": Blob;
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
