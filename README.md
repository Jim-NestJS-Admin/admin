# jim-nestjs-admin

基于 **Vue 3 + Element Plus** 的后台管理前端，配套 [jim-nestjs-admin-server](https://github.com/Jim-NestJS-Admin/server)（NestJS）使用。界面底座来自 [Pure Admin](https://github.com/pure-admin/pure-admin-thin)（国际化精简版），在此之上实现了通用 CRUD 页面、字段权限、在线页面配置和代码生成器。

<!-- TODO: 放一张真实系统页面截图（如用户管理），例如 ![用户管理](docs/images/user.png) -->

## 功能特性

- **接口代码自动生成**：从后端 OpenAPI 生成类型安全的请求函数和权限常量，不手写接口
- **通用 CRUD 页面**：工具栏（按钮组 + 搜索 + 高级查询 + 列设置）、表格、分页的统一布局；可选左侧树
- **主子表编辑**：抽屉里主表表单 + 子表可编辑表格，一次保存，出错行标红
- **权限**：菜单由后端下发，按钮用 `v-perm` 控制；字段按角色可编辑 / 只读 / 脱敏 / 隐藏
- **在线页面配置**：管理员拖拽调整字段、列表列和表单，保存即生效，可恢复默认和查看历史版本
- **代码生成器**：分步配置字段，选单表 / 树表 / 主子表模板，一次生成前后端代码（仅开发环境）
- **系统管理**：用户、角色、组织、菜单、字典、参数、操作日志、登录日志
- **会话安全**：访问令牌只放内存不落盘；多标签页刷新令牌单飞协调；图形验证码登录
- **中英双语**，页面响应式适配手机

## 技术栈

Vue 3.5 · Element Plus 2 · Vite 7 · TypeScript · Pinia · Vue Router · vue-i18n · Tailwind CSS

## 快速开始

环境要求：Node.js 22、pnpm 10。请先按[后端说明](https://github.com/Jim-NestJS-Admin/server#快速开始)启动后端。

```bash
git clone https://github.com/Jim-NestJS-Admin/admin.git
cd admin
cp .env.example .env
```

在 `.env` 里把 `VITE_ADMIN_PROXY_TARGET` 设为后端地址，例如 `http://localhost:3000`。然后：

```bash
corepack pnpm install --frozen-lockfile
pnpm dev
```

打开 http://127.0.0.1:8851 ，用后端初始化的账号 `admin` / `123456` 登录（仅本机开发库，登录后请修改密码）。

> 后端 `.env` 的 `AUTH_ADMIN_ORIGINS` 需要包含前端地址 `http://127.0.0.1:8851`。生产环境请用同源反向代理部署，不要依赖开发代理。

## 常用命令

| 命令 | 作用 |
| --- | --- |
| `pnpm dev` | 开发模式（http://127.0.0.1:8851） |
| `pnpm build` | 生产构建并校验产物 |
| `pnpm preview` | 预览生产构建（http://127.0.0.1:8852） |
| `pnpm lint` / `pnpm typecheck` | 代码检查 / 类型检查 |
| `pnpm test` | 测试 |
| `pnpm gen:api` | 从后端 OpenAPI 生成接口代码（默认读 `../server/openapi/admin.json`） |
| `pnpm gen:api:check` | 检查生成的接口代码是否与快照一致 |

`src/api/` 下的文件由 `pnpm gen:api` 生成，请勿手改。

## 参与贡献

欢迎提交 Issue 和 Pull Request，请先阅读 [CONTRIBUTING.md](CONTRIBUTING.md)。发现安全问题请按 [SECURITY.md](SECURITY.md) 私下报告。

## 致谢

- [Pure Admin](https://github.com/pure-admin/vue-pure-admin)：本项目的界面底座

## 许可证

[MIT](LICENSE)。本项目基于 Pure Admin（MIT，© pure-admin）修改，保留其原始版权声明。
