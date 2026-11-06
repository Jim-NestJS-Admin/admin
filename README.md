# jim-nestjs-admin 前端

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

目前没有安装正式 AdminGateway 适配器，登录显示服务暂不可用并保持禁用；无默认账号、假登录或生产 mock。src/platform/contracts.ts 是前端内部状态与适配口，不是后端 DTO。src/api 只允许 T12 从正式 OpenAPI 生成，当前留空，不照草案手写请求类型。

认证草案见 ../docs/contracts/auth-session.md。待 T05/T06 导出正式契约后完成：T12 生成客户端与适配器、刷新 Cookie 同源代理、真实 ALTCHA 出题登录、权限变化及组织切换端到端验证。上述部分未验收，不能把本次基础提交视为完整 T11 完成。

ALTCHA 3.5.0 是本次新增依赖，用于规则指定的人机验证；账号或语言变化、每次提交后重建组件，异步旧题作废，判定交给库与后端。正式适配器必须返回原始题目对象，不能走统一成功信封解析。

## 依赖与验证

旧底座运行依赖存在已知漏洞，本次按现有 semver 范围更新兼容版本，未跨主版本升级；锁文件固定解析结果。2026-11-05 生产审计为 0 告警。Vue 3.5.44、Element Plus 2.14.7、axios 1.21.0；Vite 7.1.12、TypeScript 5.9.3 保留原主线。

本机生产浏览器验证：中英文切换、空账号密码、未配置服务时禁止登录；截图 shots/login-production.png。当前浏览器视口覆盖接口未实际改变页面宽度，因此本次未确认手机尺寸验收，需后续在真实 390px 视口复核。T19 的手机验证不能代替正式项目验证。

构建仍提示浏览器兼容性数据库陈旧，不影响本轮构建，后续集中维护工具链。CI 执行代码检查、类型、测试、格式、构建产物校验、冒烟与生产依赖审计。

## T11 不依赖后端部分的收尾

新增同源 BroadcastChannel + Web Locks 协调刷新。存储中只有不含凭据的随机版本标记；访问令牌随内存结果在同源标签页间短暂传递。并发请求只轮换一次，消息丢失或刷新失败时拒绝等待者，不再重复刷新；退出、重新登录、组织变更与刷新串行，并使旧请求结果失效。不支持上述浏览器能力或存储不可用时拒绝认证，不降级为无协调轮换。

请求层只对明确 401/4001 单飞刷新并重放一次，原请求体和幂等键保持不变；迟到的旧令牌 401 复用同批已刷新的令牌，403/400/409 不刷新。原始 ALTCHA 响应和无访问令牌请求由生成客户端适配层显式选择。字段错误与 429 等待提示已接入登录页，未知异常使用安全兜底。

24 项测试包括真实 HTTP 服务的非 2xx/重放/取消、权限指令的动态撤销、跨标签页消息丢失/退出竞态。另以 test/session-browser.html 在两个真实浏览器标签页验证并发只执行一次和在途旧结果作废（shots/session-coordination.png），测试页面不进入生产入口或产物。它只传递合成数字，不构造可登录的假会话。

真实 Cookie/ALTCHA/菜单权限与组织认证联调仍等 T05/T06 + T12。正式手机尺寸尚未确认，浏览器的视口覆盖接口仍未实际生效；保留为后续可验证事项，不冒称本轮手机验收通过。T11 整体保持进行中，本次收尾可先交审。

## T12 接口生成

新增开发依赖 openapi-typescript 7.13.0，按官方 Node API 将 OpenAPI 引用、组合类型和枚举转换为类型，再生成接入既有 HTTP 层的操作函数；不自行实现 schema 类型解析。参考：https://openapi-ts.dev/node 。

```sh
pnpm gen:api
pnpm gen:api:check
pnpm gen:api --input https://example.com/admin.json --source-revision <后端提交号>
```

默认读 ../server/openapi/admin.json，生成 src/api/schema.d.ts、client.ts、constants.ts、manifest.json，禁止手改。manifest 记录后端提交号、输入 SHA256 和操作数；api-source/admin.json 是同次输入快照，使只有 admin 仓库的 CI 仍可验证全部生成文件一致。若没有相邻后端仓库，默认使用已提交快照及 manifest 中的来源信息。远程地址必须显式给后端提交号，禁止 URL 携带凭据/查询参数，禁止重定向和外部引用。

当前版本化输入快照的正式 admin.json 没有业务路径，正式客户端故意为空；权限扩展缺失时生成空集合并提示，不从路由猜权限。生成器已兼容 T06 正式的 `x-permission: { code, risk }`，并继续读取根或操作上的 `x-permissions` 字符串数组，合并去重后生成权限常量；非法对象扩展拒绝生成，不能静默猜测。根的 x-scopes 字符串数组与标准 OAuth2 flow 的 scopes 也会收集。ENUMS 按完整 schema 属性路径生成，保留原始枚举值。T05/T06 正式客户端快照更新与真实前端联调仍单独推进，本批没有混入测试接口。

使用示例：业务页从 src/api/client 导入 api，调用由 operationId 命名的函数；请求参数分 body/path/query/headers，统一返回值类型直接来自 OpenAPI 成功响应信封。原始出题响应在认证适配层显式传 responseMode: raw、authPolicy: none，不能把它误判为统一信封；实际认证适配仍待 T05/T06 导出。multipart 按契约构造 FormData，binary 类型生成 Blob。

测试源 test/fixtures/t03-openapi.json 来自已经审查的 server 651af06 的真实测试实体和控制器，10 个操作；来源见 t03-provenance.json。导出工具 scripts/export-t03-openapi.mjs 只编译测试资源并创建没有数据库模块的 Nest 应用，未连接数据库。复现时在 Codex 独立 server worktree 核实对应提交后运行 pnpm gen:api:fixture；该工具会更新测试快照，不会把测试端点写入正式 src/api。

测试覆盖可重复生成、真实 T03 DTO 的正反类型断言、请求版本与幂等键转发、引用/重复 operationId 拒绝、路径参数编码、multipart、正式产物与输入快照一致。生成器只写固定目录与自己拥有的文件，不覆盖手写文件或符号链接。当前分支基于 T11 8e5d1de，尚未自动合并。
