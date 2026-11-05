# admin 项目协作规则

本目录是 jim-nestjs-admin 的独立前端仓库。先读 `../docs/AGENTS.md`、`../docs/ARCHITECTURE.md`、`../docs/TASKS.md`，本文件只补充前端规则。

- 基于 Pure Admin 国际化精简版，保留 LICENSE 和来源说明。沿用 Vue3、Element Plus、Pinia、vue-i18n 与现有布局，不引入另一套 UI 框架。
- 所有正式接口代码、DTO、权限码、枚举由 T12 从后端 OpenAPI 生成到 src/api，禁止手写或复制 mock。src/platform 的类型是前端内部状态和适配口，不是后端 DTO；真实适配实现必须使用生成客户端。
- 认证接口尚未导出时使用失败关闭的未配置适配口，不能用演示账号、假会话或生产 mock 假装已联调。T11 的真实认证接入保持进行中，明确写入交接。
- 访问凭据只在内存中，不写浏览器可读 Cookie、localStorage 或日志；刷新凭据传输方式待 T05/OpenAPI 确定，不擅自假定 Cookie 契约。
- v-perm 从当前 store 权限读取，没有全通配。组织/授权变更清理旧路由、页面和请求；前端只改善体验，后端仍强制鉴权。
- 新页面使用语言包和 Element Plus 无障碍语义；审批页面按手机断点单独验收。
- 提交前运行 pnpm lint、pnpm typecheck、pnpm test、pnpm build、pnpm verify:production；禁止生产 mock，不能只靠搜索插件包名检查。
- 分支使用 codex/T11-admin-init 等任务分支；交接写 ../docs/TASKS.md，并通过 ../collab 信箱通知 Claude。不要把文档仓库其他未提交内容混进本仓库。
