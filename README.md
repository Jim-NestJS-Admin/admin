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

T11 仍在进行中：布局底座、双语登录入口、内存会话、单标签页刷新单飞、退出与切组织的旧响应隔离、动态菜单本地白名单、响应式 v-perm、统一错误解析、生产插件及真实产物检查已具备。11 项测试覆盖权限拒绝、菜单容错、非 2xx 错误、刷新失败与退出竞态等。

目前没有安装正式 AdminGateway 适配器，登录显示服务暂不可用并保持禁用；无默认账号、假登录或生产 mock。src/platform/contracts.ts 是前端内部状态与适配口，不是后端 DTO。src/api 只允许 T12 从正式 OpenAPI 生成，当前留空，不照草案手写请求类型。

认证草案见 ../docs/contracts/auth-session.md。待 T05/T06 导出正式契约后完成：T12 生成客户端与适配器、刷新 Cookie 同源代理、跨标签页刷新协调、4001 单次刷新与安全重放、登录字段/限流错误提示、真实 ALTCHA 出题登录、权限变化及组织切换端到端验证。上述部分未验收，不能把本次基础提交视为完整 T11 完成。

ALTCHA 3.5.0 是本次新增依赖，用于规则指定的人机验证；账号或语言变化、每次提交后重建组件，异步旧题作废，判定交给库与后端。正式适配器必须返回原始题目对象，不能走统一成功信封解析。

## 依赖与验证

旧底座运行依赖存在已知漏洞，本次按现有 semver 范围更新兼容版本，未跨主版本升级；锁文件固定解析结果。2026-11-05 生产审计为 0 告警。Vue 3.5.44、Element Plus 2.14.7、axios 1.21.0；Vite 7.1.12、TypeScript 5.9.3 保留原主线。

本机生产浏览器验证：中英文切换、空账号密码、未配置服务时禁止登录；截图 shots/login-production.png。当前浏览器视口覆盖接口未实际改变页面宽度，因此本次未确认手机尺寸验收，需后续在真实 390px 视口复核。T19 的手机验证不能代替正式项目验证。

构建仍提示浏览器兼容性数据库陈旧，不影响本轮构建，后续集中维护工具链。CI 执行代码检查、类型、测试、格式、构建产物校验、冒烟与生产依赖审计。
