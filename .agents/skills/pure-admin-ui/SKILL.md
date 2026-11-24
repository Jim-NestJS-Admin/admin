---
name: pure-admin-ui
description: 在 jim-nestjs-admin 的 admin 前端实现或评审页面、导航、菜单徽标、通知、表格、表单和弹层时，按项目采用的 Pure Admin 国际化精简版与 Element Plus 约定复用布局、组件、样式和交互。
---

# Pure Admin 前端约定

本项目基于 Pure Admin 国际化精简版 6.2.0，固定上游快照为 `2395bb11b51b45c3e9ae78ee23f88e3f3510b606`。实现前先读 `admin/AGENTS.md`，找到本仓库同类页面或布局组件，并核对底座来源。需要确认 Pure 的默认行为时，对照固定快照或 `docs/spikes/frontend-pure/app/` 的本地预研源码。完整版只作参考，组件属性和主题变量以项目锁定版本为准。来源详见 [Pure Admin 官方文档仓库](https://github.com/pure-admin/pure-admin-doc) 和 [项目采用的国际化精简版](https://github.com/pure-admin/pure-admin-thin/tree/2395bb11b51b45c3e9ae78ee23f88e3f3510b606)。

## 实现顺序

- 先用相近页面确认布局、控件尺寸、交互和主题。查看项目共享组件及 Pure 的对应插槽，再决定扩展点。接入真实数据时，保留现有布局容器、焦点顺序、间距和主题，优先替换数据、状态和事件绑定。
- 标准管理列表优先用 `src/components/Crud/CrudPage.vue`，沿用左侧操作、右侧搜索和过滤、表格内部滚动及底部分页。业务页面需要定制时先用已有插槽。弹层、表单、标签和状态优先用项目已注册的 Element Plus 组件。
- 菜单和路由沿用当前会话可见的菜单树、动态路由与组件白名单。界面文字走 `locales/`，颜色优先取项目现有主题变量或 Element Plus 语义变量。业务数据与权限沿用 `admin/AGENTS.md` 规定的生成客户端及 `v-perm`。
- 验证改动经过正常页面入口，覆盖实际受影响的布局、主题和权限状态。菜单和顶部工具栏改动检查窄屏、折叠侧栏、长标题和键盘焦点，保持原有的选中高亮与展开交互。

## 站内信与菜单徽标

**Pure 的扩展点**

- 顶部通知从 `src/layout/components/lay-notice/index.vue` 入手。沿用固定快照的 `el-dropdown`、铃铛及原配徽标位置、列表和空态。把原配示例数组换成真实未读总数与消息数据，保留读取后的跳转或抽屉行为。参照 [固定版通知源码](https://github.com/pure-admin/pure-admin-thin/blob/2395bb11b51b45c3e9ae78ee23f88e3f3510b606/src/layout/components/lay-notice/index.vue)。
- `src/layout/components/lay-sidebar/components/SidebarItem.vue` 分别渲染菜单叶子和分组标题，并递归渲染子项。在两个标题分支共用紧凑的行内数字徽标，保留 `ReText` 的标题截断、`SidebarExtraIcon` 和展开箭头。分组徽标位于展开箭头内侧，数字垂直居中，高度固定并随数字扩宽。参照 [固定版菜单源码](https://github.com/pure-admin/pure-admin-thin/blob/2395bb11b51b45c3e9ae78ee23f88e3f3510b606/src/layout/components/lay-sidebar/components/SidebarItem.vue)、[Element Plus Menu](https://element-plus.org/en-US/component/menu.html) 和 [Badge](https://element-plus.org/en-US/component/badge)。

**本项目的计数规则**

- 铃铛显示当前用户未读站内信总数，工作台显示当前用户待处理的审批数。复用 `src/store/modules/workflow-counts.ts` 和原有接口，读消息只刷新未读数，审批处理成功后刷新待办数。菜单组件只消费共享状态。
- 叶子显示所属计数，父级汇总其可见子树内的计数。用稳定路由标识或计数来源键归集，每个来源在同一父级只计一次。三层或更多层按同一规则处理，单子项折叠成一行时显示对应计数。父级汇总在分组展开与收起时一致。
- 按原始数值汇总，展示时隐藏 `0`，超过 `99` 显示 `99+`。用现有主题令牌和行内尺寸，保证徽标适配明暗主题、激活项和长标题。给可访问名称保留真实计数。验收有 `1` 条待办时三个可见层级各显示 `1`，无关分组没有徽标，再验证 `0`、`99`、`100` 和无权限场景。
