# jim-nestjs-admin 前端
当前进度（2026-11-06）：T07新增用户、角色、菜单、组织、角色分配、多上级管理契约已生成；本轮按Jimmy要求先写代码，测试保留到统一阶段。登录已改为后端svg-captcha图形验证码，统一响应解包为图片与题目编号，账号变化、点击刷新、登录失败均作废旧题；保留Pure原版布局和资产。altcha依赖已移除。退出会把清理前的访问令牌交给网关，有令牌就携带，Cookie退出仍支持。后文ALTCHA和旧测试数为历史阶段记录，不代表当前测试已执行。

正式项目独立仓库，当前分支 codex/T11-admin-init。基于 Pure Admin 国际化精简版 6.2.0，保留 LICENSE（MIT）。来源：https://github.com/pure-admin/pure-admin-thin/tree/i18n ，快照 2395bb11b51b45c3e9ae78ee23f88e3f3510b606；底座来自已审查 T19（文档仓库提交 6777d1a）。

## 启动和检查

Node.js 22，pnpm 10.28.0。

```sh
corepack pnpm install --frozen-lockfile
pnpm dev
pnpm lint
pnpm typecheck
pnpm test
pnpm format:check
pnpm build
pnpm smoke:production
pnpm audit --prod
pnpm preview
```

开发地址 http://127.0.0.1:8851 ，生产预览 http://127.0.0.1:8852 。公开配置见 .env.example，按需复制为 .env，禁止放密钥。

## 当前交付边界

T11 仍在进行中：布局底座、双语登录入口、内存会话、单标签页刷新单飞、退出与切组织的旧响应隔离、动态菜单本地白名单、响应式 v-perm、统一错误解析、生产插件及真实产物检查已具备。24 项测试覆盖权限拒绝、菜单容错、非 2xx 错误、刷新失败与退出竞态等。

已在 codex/T11-auth-integration 安装正式 AdminGateway 适配器，使用生成客户端接入验证码、登录、刷新、退出、用户资料、菜单和切组织七个操作。无默认账号、假登录或生产 mock。src/platform/contracts.ts 是前端内部状态与适配口，不是后端 DTO；src/api 由 T12 从后端 OpenAPI 生成。

认证契约见 ../docs/contracts/auth-session.md。本批固定使用 server 6475933edc7e4e7d636ed9917038dd9c570ded9d 的正式 OpenAPI 生成，T05 已审，T06 仍在复审。认证请求不走业务刷新拦截器，资料/菜单使用刚签发的内存令牌；资料失败不建立部分会话，授权版本变化清理旧页面，无当前组织也可以建立合法会话。Cookie 由浏览器传输，访问令牌不落盘。

本地联调运行 `pnpm exec vite --host localhost --port 8848 --strictPort`，访问 http://localhost:8848 。开发代理默认关闭；确认真实 Nest 后端地址后在本地公开配置里设置 VITE_ADMIN_PROXY_TARGET（见 .env.example），/admin 才会转发到该地址并保留 Origin。后端需要允许当前前端 Origin。生产部署仍需配置同源反向代理。实际账号来源待 T07，T06 复审及真实 Cookie/ALTCHA 登录、菜单与组织切换全链路验收尚未完成，T11 整体保持进行中。动态视图白名单只接收实际实现的页面，不用演示菜单填充正式系统。

ALTCHA 3.5.0 是本次新增依赖，用于规则指定的人机验证；账号或语言变化、每次提交后重建组件，异步旧题作废，判定交给库与后端。正式适配器必须返回原始题目对象，不能走统一成功信封解析。

## 依赖与验证

旧底座运行依赖存在已知漏洞，本次按现有 semver 范围更新兼容版本，未跨主版本升级；锁文件固定解析结果。2026-11-05 生产审计为 0 告警。Vue 3.5.44、Element Plus 2.14.7、axios 1.21.0；Vite 7.1.12、TypeScript 5.9.3 保留原主线。

本机生产浏览器验证：中英文切换、空账号密码、未配置服务时禁止登录；截图 shots/login-production.png。当前浏览器视口覆盖接口未实际改变页面宽度，因此本次未确认手机尺寸验收，需后续在真实 390px 视口复核。T19 的手机验证不能代替正式项目验证。

构建仍提示浏览器兼容性数据库陈旧，不影响本轮构建，后续集中维护工具链。CI 执行代码检查、类型、测试、格式、构建产物校验、冒烟与生产依赖审计。

## T11 不依赖后端部分的收尾

新增同源 BroadcastChannel + Web Locks 协调刷新。存储中只有不含凭据的随机版本标记；访问令牌随内存结果在同源标签页间短暂传递。并发请求只轮换一次，消息丢失或刷新失败时拒绝等待者，不再重复刷新；退出、重新登录、组织变更与刷新串行，并使旧请求结果失效。不支持上述浏览器能力或存储不可用时拒绝认证，不降级为无协调轮换。

请求层只对明确 401/4001 单飞刷新并重放一次，原请求体和幂等键保持不变；迟到的旧令牌 401 复用同批已刷新的令牌，403/400/409 不刷新。原始 ALTCHA 响应和无访问令牌请求由生成客户端适配层显式选择。字段错误与 429 等待提示已接入登录页，未知异常使用安全兜底。

24 项测试包括真实 HTTP 服务的非 2xx/重放/取消、权限指令的动态撤销、跨标签页消息丢失/退出竞态。另以 test/session-browser.html 在两个真实浏览器标签页验证并发只执行一次和在途旧结果作废（shots/session-coordination.png），测试页面不进入生产入口或产物。它只传递合成数字，不构造可登录的假会话。

此段为基础收尾记录；本批已接入生成客户端，真实账号全链路验证仍待 T06 审查及 T07 账号来源。正式手机尺寸尚未确认，浏览器的视口覆盖接口仍未实际生效；保留为后续可验证事项，不冒称本轮手机验收通过。T11 整体保持进行中，本次收尾可先交审。

## T12 接口生成

新增开发依赖 openapi-typescript 7.13.0，按官方 Node API 将 OpenAPI 引用、组合类型和枚举转换为类型，再生成接入既有 HTTP 层的操作函数；不自行实现 schema 类型解析。参考：https://openapi-ts.dev/node 。

```sh
pnpm gen:api
pnpm gen:api:check
pnpm gen:api --input https://example.com/admin.json --source-revision <后端提交号>
```

默认读 ../server/openapi/admin.json，生成 src/api/schema.d.ts、client.ts、constants.ts、manifest.json，禁止手改。manifest 记录后端提交号、输入 SHA256 和操作数；api-source/admin.json 是同次输入快照，使只有 admin 仓库的 CI 仍可验证全部生成文件一致。若没有相邻后端仓库，默认使用已提交快照及 manifest 中的来源信息。远程地址必须显式给后端提交号，禁止 URL 携带凭据/查询参数，禁止重定向和外部引用。

当前版本化输入快照包含七个正式认证/会话操作，没有业务资源路径；权限扩展缺失时生成空集合并提示，不从路由猜权限。生成器已兼容 T06 正式的 `x-permission: { code, risk }`，并继续读取根或操作上的 `x-permissions` 字符串数组，合并去重后生成权限常量；非法对象扩展拒绝生成，不能静默猜测。根的 x-scopes 字符串数组与标准 OAuth2 flow 的 scopes 也会收集。ENUMS 按完整 schema 属性路径生成，保留原始枚举值。本批已更新 T05/T06 正式客户端快照，T06 复审和真实账号全链路联调仍未完成，没有混入测试接口。

使用示例：业务页从 src/api/client 导入 api，调用由 operationId 命名的函数；请求参数分 body/path/query/headers，统一返回值类型直接来自 OpenAPI 成功响应信封。原始出题响应在认证适配层显式传 responseMode: raw、authPolicy: none，不能把它误判为统一信封；认证适配已由 backend-gateway.ts 接入。multipart 按契约构造 FormData，binary 类型生成 Blob。

测试源 test/fixtures/t03-openapi.json 来自已经审查的 server 651af06 的真实测试实体和控制器，10 个操作；来源见 t03-provenance.json。导出工具 scripts/export-t03-openapi.mjs 只编译测试资源并创建没有数据库模块的 Nest 应用，未连接数据库。复现时在 Codex 独立 server worktree 核实对应提交后运行 pnpm gen:api:fixture；该工具会更新测试快照，不会把测试端点写入正式 src/api。

测试覆盖可重复生成、真实 T03 DTO 的正反类型断言、请求版本与幂等键转发、引用/重复 operationId 拒绝、路径参数编码、multipart、正式产物与输入快照一致。生成器只写固定目录与自己拥有的文件，不覆盖手写文件或符号链接。当前分支基于 T11 8e5d1de，尚未自动合并。

## T14 系统管理页面（代码阶段）

系统用户、角色、组织、菜单、组织角色分配、多上级、字典类型/项、参数、操作日志、登录日志共11个实际页面，组件键为 `system/<资源名>`（例如 `system/user`、`system/user-role`）。只开放本地白名单，菜单由后端提供；部署时需T10初始化菜单，不能靠前端假数据补菜单。

接口快照来自server-t08的931e49f。所有按钮权限从生成的OPERATION_PERMISSIONS读取。用户创建/重置密码走专用接口；导航顶部支持当前组织切换及本人改密。组织、菜单、字典和作用范围有左树筛选，关联选择器按权限加载，不把编号当可授权范围。

本轮类型检查、lint、生产构建通过。按Jimmy要求，新增/更新测试先写入，统一验收阶段再执行；未做浏览器联调。字段权限配置和逐行状态等待T16契约补齐，查询偏好和高级查询等待T18。

## T17 字段权限配置（代码阶段）

角色管理新增「字段权限」页签，可按模块/字段检索，整模块设置、从其他角色复制到草稿、跟随默认、按版本提交变更。模块默认配置组件位于system/field，可供T24模块配置字段页签复用。两种模式共用正式overview与save生成接口，服务器整批同事务保存并审计；复制只复制状态/规则，保留目标版本。

客户端输入来自server-t17 ba3f69f（含T16 6616ae3、T07/T08、T17 fc6c80f）。通用CRUD改用正式src/api/schema的模型，并按_fieldState逐行隐藏、脱敏/只读；schema.fieldPerms裁剪页面列、可写字段和排序入口。后端CrudSchema的Swagger目前漏声明fieldPerms，已写入TASKS；运行时适配未手写后台DTO。T16子表字段处理仍未完成，不能把子表编辑器视为后端权限已经验收。

节点类型检查通过，lint发现的样式空行已修复，生产构建通过。测试已补但未执行，未做浏览器/HTTP验证。新页面未自动合入main或切换当前本地运行分支。

## T13 查询/偏好/导出与生成页面适配（2026-11-09）

接口输入固定为server-t13 7f2e837，含Claude d4c5456及系统安全导出入口。高级查询从schema.query读取字段/类型/运算符，只开放当前可见原值字段；支持且/或、三层、20条件，in最多100项。常用查询走sessionPreference接口，键query:<权限前缀>；列设置走columns:<权限前缀>，身份完全由服务端会话决定。失效字段的旧查询拒绝恢复，不恢复已经收回的字段。CSV调用后端export二进制操作，不在浏览器导出原始数据。

树表使用平铺tree接口转为树，处理不可见父节点和脏循环，支持父级选择；有搜索/高级查询时走后端分页并保留分页器。生成页面通过generatedCrud绑定固定的T12操作，聚合子表按资源分组发送added/updated/deleted，新增只发added。模板在codegen-templates/，变量约定已补docs/contracts/codegen.md，待Claude接进后端渲染流程。

schema.view中的列显示/顺序/宽度、搜索筛选范围、默认排序、页大小、表单顺序/提示已接入，始终和原schema字段/动作权限取交集。T24的表单分组/跨度/显示方式在模块配置页批次继续完成。

类型/lint/生产构建在本节点集中检查；查询与树的测试已写未执行。未启动浏览器或执行迁移，统一测试按Jimmy安排进行。

## T22 代码生成页面（2026-11-09，代码阶段）

dev/codegen接入正式devCodegen接口：导入表/新建配置、三种模板卡片、字段与子表配置、拖动与上下按钮、树表关系、删除/表单/导出/数据范围选项、空表结构预览、按文件浏览源码/写入动作、明确选择覆盖手改文件、预览token确认写入、ZIP下载和数据库结构差异。差异只读，不自动执行建表；保存草稿之后才允许预览/下载/写入，结果分别显示written/skipped/failed。请求失败重试复用同一意图幂等键。

导航组件键dev/codegen，后端未启用开发工具时会返回404。现有后端配置/返回大量为通用JSON，前端只维护编辑器草稿，经生成客户端发送，由后端最终校验；未手写后台DTO。字段类型、组件、字段安全JSON可编辑，复杂规则按契约由后端拒绝。T21前端文件渲染待Claude接收T13的codegen-templates模板。ZIP成功响应缺binary描述，目前通过生成操作的responseType/responseMode传输选项适配，并已交接补文档。T25二进制重放问题已交后端修正。

类型检查、lint、构建通过；字段配置往返与非法输入测试已写未执行。未在本机执行生成/覆盖文件、未做浏览器/HTTP测试。设计依据见docs/configuration-ui.md。

## T24 模块配置（2026-11-09，代码阶段）

system/page-config从字段清单选择资源，提供字段安全配置、列表显示和表单三个页签。显示配置通过生成的systemPageConfig接口按版本保存，可读取历史、预览、恢复、回到代码默认；字段安全配置复用T17独立接口，不能通过显示配置放宽权限。列/表单支持拖动与键盘上下按钮，右侧结构预览不使用假业务数据；旧历史响应受上下文版本限制。保存失败保留草稿与幂等键。

通用CRUD进一步读取schema.view的表单dialog/drawer、分组与12/24跨度，手机断点改为整行。模板和导航仍保留Pure底座。接口来自T13快照server7f2e837，schema.view及配置响应部分仍为通用JSON，只做编辑器内部视图状态，不另手写后端DTO。

类型检查、lint、构建通过；显示白名单测试已写未执行。未做浏览器验收、未执行迁移或切换主线。界面依据见docs/configuration-ui.md。

## 前端集成分支（2026-11-09）

Jimmy授权把T13（9bffad3）、T22（2db92f8）、T24（2a5be1d）合到codex/frontend-integration。工作目录admin-integration。保留生成器dev/codegen和模块配置system/page-config两个组件键，语言包与交接说明均完整保留。类型/lint/build集中检查；单元、e2e、浏览器测试仍留到统一验收。最新接口由server-integration / claude/integration的f295be83fd980f4e737e59850cacecbf6bdb5739生成，CSV、ZIP成功响应已描述为二进制；生成脚本按成功响应的binary声明统一设置blob/raw传输选项。

配套后端已纳入T09补偿、Claude的上传摘要/二进制/事务状态修复、前端模板渲染和本地初始化脚本。生成器预览和写入后显著列出后端manualSteps，提醒模块登记、迁移、接口生成、路由、语言包和菜单授权仍需人工完成；修改配置后隐藏过期清单，切换配置或会话时清除。这里仍是独立集成分支，未切换main或当前本地运行服务，未执行迁移、初始化或生成器文件写入。
