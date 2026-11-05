# 通用 CRUD · 第一批

适用于已有后端资源的单表列表和主表表单，沿用 Pure / Element Plus。入口 `CrudPage.vue`，父容器必须给出确定高度（如布局内容区的剩余高度）并设置 `min-height: 0`。资源或 pageKey 改变时，用 Vue 的 `:key` 重新挂载组件。

## 已实现与适配边界

- 可选左树，桌面可拖动宽度、折叠；窄屏放入分类筛选抽屉。工具栏左侧操作、右侧搜索和列设置，表格内部滚动，分页固定底部。
- 读取页面描述渲染表格和七种基础表单项；排序传给后端，字段只允许 schema.actions.page.sortable / filterable。
- 列显示、顺序、宽度、固定和密度；保存前按后端可读列再次裁剪。preferences 可选，未提供时只在当前组件内生效。已保存偏好加载失败会提示，不能当作保存成功。
- 新增、详情、修改、批量删除适配口；主键保持字符串，修改保留旧 version。409/400 错误不清空表单，未知异常不展示内部信息。双击只发一次；同一次失败重试沿用幂等键，修改内容后换键；429 展示等待时间并阻止期间再次写入。
- 会话、组织或授权重置时中断请求、清除列表/表单/偏好/选择。每个异步结果还校验上下文代次；列表和详情另校验请求顺序，忽略未遵守 AbortSignal 的旧响应。

本批尚未实现主子表编辑、回收站、导出和高级查询面板。advanced 插槽只预留查询适配口，T18 定义格式后接入；用户偏好的正式服务端保存等 T18；逐行权限状态适配等 T16，不能推测被脱敏值的原文。T13 整体仍在进行中，不能把本批审查通过视为整体验收。

## 与生成客户端的契约

`types.ts` 中的 CrudPort、CrudQuery 是组件内部视图适配口，不是后端 DTO。业务页面必须用 T12 生成函数实现适配器，解开返回 envelope 的 `.data`，禁止复制接口类型或拼请求路径。

| 组件适配口                        | T03① 后端契约                                                                                                                            |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| describe(signal)                  | schema 的 data，包含 columns/form/dictionaries/actions 等                                                                                |
| list(query, signal)               | page：映射 pageNumber→page、pageSize→size、search→keyword、sorting→sort（direction→order）、equality→eq；返回 list→rows、total→totalRows |
| detail(id, signal)                | info `{ id }` 的 data                                                                                                                    |
| create(values, context)           | add `{ data: values }`，signal 与 idempotencyKey 传入生成传输层                                                                          |
| update(identity, values, context) | update `{ id, version, data: values }`，不刷新旧版本后偷偷重试                                                                           |
| remove(ids, context)              | delete `{ ids }`，后端必须整批成败                                                                                                       |

以真实生成 DTO 为准；不要直接把内部 CrudQuery 整个发送给服务端。T03③回收站尚在复审，本批没有依赖它的临时 ids 草案。

`permissions` 必须由调用方传入**生成的权限码常量**，没有代码就不显示按钮；不能拼 permPrefix 推测权限。仍用 v-perm 响应当前授权。客户端只影响展示，服务端始终负责最终校验。

`cell(row, field)` 由正式权限响应的适配器给出 visible/masked/hidden 与已允许展示的 display。默认规则仅把响应中不存在的属性视作 hidden；**不能识别一个字符串是否经过脱敏**，正式 T16 接入必须显式传 cell。hidden 不读取 display，masked 不映射字典、不进自定义单元格插槽，不允许编辑。组件不接收原文备份。

插槽：tree 提供白名单 filter；toolbar 提供 query/reload；advanced 提供 apply；cell-字段仅获得可见字段 value/text；form-字段仅在本次动作及逐行状态可写时开放。插槽代码同样须遵守生成类型、权限和白名单。

## 框架类型来源

正式 admin.json 尚无业务接口，不能手写 CrudSchema。`api-source/crud-schema.json` 精确提取 T12 的真实 T03①测试 OpenAPI `651af06` 中 CrudSchema\* 模型；`pnpm gen:crud-schema` 由同一生成库生成 src/api/crud-schema.d.ts 和带摘要/提交号的清单，`pnpm gen:crud-schema:check` 校验漂移。正式 OpenAPI 包含这些模型后统一迁回主生成文件，不能维护两套 DTO。测试还断言该子集与真实导出模型完全相同。

浏览器用的 `test/fixtures/t03-user-schema.json` 来自 server `133a76f` 真实 DemoUserController 的 buildCrudSchema，只构建实体 metadata，没有初始化数据库连接。测试入口 `test/crud-browser.html` 使用合成记录和独立适配口，正式 main/router 不导入，实际生产产物检查拒绝测试入口/合成会话标记。

## 验证和视觉依据

本批使用 ui-research 流程，延续已通过审查的 `docs/spikes/frontend-pure` 列表布局，面向日常后台的高密度数据操作，不引入新 UI 库或依赖。

- [Element Plus Table](https://element-plus.org/en-US/component/table.html)：采用固定高度、内部滚动和 custom 后端排序，不在前端排序生产数据。
- [ProTable](https://procomponents.ant.design/en-US/components/table/)：参考工具栏与列显示偏好分离的交互组织。网页依赖 JS，未把搜索结果当作视觉截图验收。
- [Pure Admin](https://pure-admin.github.io/vue-pure-admin/) 与本项目已审 T19 本地预研：沿用现有组件、间距、主题和左树布局，实际效果以本地浏览器验证为准。

单元与控制器测试覆盖权限收窄、逐行隐藏/脱敏、写白名单、冲突保留/幂等、双击、限流、请求乱序和切组织旧响应；类型、lint、格式、构建和实际产物/生产 HTTP 冒烟均须通过。

浏览器已操作必填提示、新增、编辑冲突保留、列隐藏并重新加载、清空会话视图。`test/viewport.html` 在 iframe 内提供实际 **390×844 CSS 视口**，DOM 测量 viewport/document/body 宽度均390，抽屉宽390；这不是手机真机验收。截图位于 `shots/crud-desktop.png`、`shots/crud-mobile-form.png`。
