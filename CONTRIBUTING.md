# 参与贡献

感谢你愿意参与 jim-nestjs-admin！

## 提交 Issue

- 报 Bug：说明浏览器、复现步骤、期望结果和实际结果，最好附截图
- 提需求：说明使用场景

## 提交 Pull Request

1. Fork 本仓库，从 `main` 新建分支
2. 按「快速开始」搭好本地环境（需要同时运行后端）
3. 修改代码，并补充相应测试
4. 提交前确保以下命令全部通过：

   ```bash
   pnpm lint
   pnpm typecheck
   pnpm test
   pnpm format:check
   pnpm build
   ```

5. 提交 PR，说明改了什么、为什么改；界面改动请附截图

## 代码约定

- 样式遵循 Pure Admin 的风格和组件用法，不要另起一套
- 列表页统一为：工具栏（左按钮组、右搜索和工具）→ 表格 → 底部分页
- `src/api/` 由 `pnpm gen:api` 生成，不要手改；接口变化应先改后端再重新生成
- 提交信息遵循 commitlint 规范（如 `feat: 新增 xx`、`fix: 修复 xx`）
