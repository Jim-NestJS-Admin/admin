# 通用 CRUD · 列表、主子表与回收站

适用于已有后端资源的单表/主子表及回收站，沿用 Pure / Element Plus。入口 `CrudPage.vue`，父容器必须给出确定高度（如布局内容区的剩余高度）并设置 `min-height: 0`。资源或 pageKey 改变时，用 Vue 的 `:key` 重新挂载组件。

## 已实现与适配边界

- 可选左树，桌面可拖动宽度、折叠；窄屏放入分类筛选抽屉。工具栏左侧业务操作，右侧关键字搜索与「刷新 / 高级查询 / 列设置」一组图标按钮；工具栏底边线与左树标题栏同高（`--crud-head-height`，跟随全局组件尺寸）。表格内部滚动，分页固定底部。
- 读取页面描述渲染表格和七种基础表单项；排序传给后端，字段只允许 schema.actions.page.sortable / filterable。
- 列显示、顺序、宽度、固定和密度；保存前按后端可读列再次裁剪。preferences 可选，未提供时只在当前组件内生效。已保存偏好加载失败会提示，不能当作保存成功。
- 新增、详情、修改、批量删除适配口；主键保持字符串，修改保留旧 version。409/400 错误不清空表单，未知异常不展示内部信息。双击只发一次；同一次失败重试沿用幂等键，修改内容后换键；429 展示等待时间并阻止期间再次写入。
- 会话、组织或授权重置时中断请求、清除列表/表单/偏好/选择。每个异步结果还校验上下文代次；列表和详情另校验请求顺序，忽略未遵守 AbortSignal 的旧响应。

第二批补齐多子表抽屉/只读详情、增删/复制/原生拖动与键盘排序、按动作和逐行状态裁剪差异、行级错误定位和自动定位出错页签，以及带旧版本的回收站恢复/彻底删除。Element Plus 的树子节点属性另设内部名称，避免把业务聚合的 children 对象当成树节点数组。

尚未实现导出和高级查询面板。advanced 插槽只预留查询适配口，T18 定义格式后接入；用户偏好的正式服务端保存等 T18；逐行权限状态适配等 T16，不能推测被脱敏值的原文。高风险操作的统一服务端确认流程等 T25 正式适配，普通确认框不能代替后端确认。T13 整体仍在进行中，不能把两批组件开发视为真实业务联调或整体验收。

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

以真实生成 DTO 为准；不要直接把内部 CrudQuery 整个发送给服务端。回收站按已审 T03③ `4915aca` 的契约：recycled 只映射 page/size/keyword，restore/purge 将内部记录标识数组映射为 `{ items: [{ id, version }] }`，禁止发送旧 `{ ids }` 草案。版本取自当前回收站列表，不先刷新版本后静默重试。

## 主子表与生成器模板接入口

详情适配器提供生成 DTO 中的 children，组件只维护视图草稿。`context.relatedChanges` 是内部变化清单，业务适配器须映射到生成客户端的资源专属 DTO：

| 内部变化                     | 后端资源请求中的 children[resource]  |
| ---------------------------- | ------------------------------------ |
| inserted[{localKey,values}]  | added[{...values,clientId:localKey}] |
| modified[{recordKey,values}] | updated[{...values,id:recordKey}]    |
| removed[]                    | deleted[]                            |

新增和修改都只调用一次主表 create/update，把主表 data 和上述 children 一起传给生成接口。组件不发子表独立写接口，主表旧 version 保持不变直至提交，后端负责同一事务。localKey 在失败重试中稳定，不拿数组索引或数据库编号代替新增标识。

只删除用户明确点击删除的已加载行；未加载的组不提交，未加载的其他行不推断为删除。自定义详情只有部分明细时，`relatedComplete(resource,detail)` 必须返回 false；完整加载才显式返回 true，允许整体拖动/键盘排序和本地最小行数检查。排序字段必须在本次动作可写且每行可见；字段值未知、只读、脱敏时不允许据此重排。复制只取可新增且可见的字段，不带原 id、归属字段或不可见原值。

后端错误的 resource + id/clientId 定位行，缺少 clientId 时才以 index 映射本次 inserted 数组。行标红并显示公开消息，自动切到第一个错误子表；校验和409均保留全部编辑内容及本地标识。客户端的必填/行数/明确重复提示只是体验，完整结果、SQL默认值/排序规则、归属和权限仍须后端校验。

T21 生成页面时使用本组件，最小页面结构是 `<CrudPage :page-key="pageKey" :port="port" :permissions="permissions" :cell="cell" :child-cell="childCell" />`。pageKey 为稳定资源标识；port 是根据**实际生成操作函数与类型**实现的适配器；permissions 只引用生成常量，含 info/recycle/restore/purge；cell/childCell 对接实际权限响应。每个生成模块可覆盖既有插槽，不能另写一套 CRUD、推导权限或维护复制 DTO。模板要通过类型/测试和跨仓库契约检查，不用本测试入口充当正式业务页。

`permissions` 必须由调用方传入**生成的权限码常量**，没有代码就不显示按钮；不能拼 permPrefix 推测权限。仍用 v-perm 响应当前授权。客户端只影响展示，服务端始终负责最终校验。

`cell(row, field)` 由正式权限响应的适配器给出 visible/masked/hidden 与已允许展示的 display。默认规则仅把响应中不存在的属性视作 hidden；**不能识别一个字符串是否经过脱敏**，正式 T16 接入必须显式传 cell。hidden 不读取 display，masked 不映射字典、不进自定义单元格插槽，不允许编辑。组件不接收原文备份。

`childCell(resource,row,field)` 使用相同状态规则。详情只读模式禁用全部子表操作且 save 不会提交。只有完整组才提供排序，未加载组会明确提示。

插槽：tree 提供白名单 filter；toolbar 提供 query/reload；advanced 提供 apply；cell-字段仅获得可见字段 value/text；form-字段仅在本次动作及逐行状态可写时开放。插槽代码同样须遵守生成类型、权限和白名单。

## 框架类型来源

正式 admin.json 尚无业务接口，不能手写 CrudSchema。`api-source/crud-schema.json` 精确提取真实 T03 `4915aca` 测试 OpenAPI 中 CrudSchema\* 模型，包含 children 和八种动作；`pnpm gen:crud-schema` 由同一生成库生成 src/api/crud-schema.d.ts 和带摘要/提交号的清单，`pnpm gen:crud-schema:check` 校验漂移。正式 OpenAPI 包含这些模型后统一迁回主生成文件，不能维护两套 DTO。测试还断言该子集与真实导出模型完全相同。

`gen:api:fixture` 从固定的 Codex server 审查 worktree 的真实用户/日志/主子表控制器导出 OpenAPI，并通过 buildCrudSchema 导出 user/order 页面描述，只构建实体 metadata，没有初始化数据库连接；来源记录于 t03-provenance.json。两个浏览器测试入口使用合成记录和独立适配口，正式 main/router 不导入，实际生产产物检查拒绝测试入口/合成会话标记。

可选执行 `pnpm test:crud-contract`：后端必须与来源提交一致且源码干净，已由 gen:api:fixture 编译。此检查将实际组件变化映射交给真实 T03 planChildren / RecycleActionBody 校验器，验证新增/修改/保护字段与版本体，仍不连接数据库；CI 常规52测试不要求克隆后端，不把这项额外验证算进52测试。

## 验证和视觉依据

本批使用 ui-research 流程，延续已通过审查的 `docs/spikes/frontend-pure` 列表布局，面向日常后台的高密度数据操作，不引入新 UI 库或依赖。

- [Element Plus Table](https://element-plus.org/en-US/component/table.html)：采用固定高度、内部滚动和 custom 后端排序，不在前端排序生产数据。
- [ProTable](https://procomponents.ant.design/en-US/components/table/)：参考工具栏与列显示偏好分离的交互组织。网页依赖 JS，未把搜索结果当作视觉截图验收。
- [Pure Admin](https://pure-admin.github.io/vue-pure-admin/) 与本项目已审 T19 本地预研：沿用现有组件、间距、主题和左树布局，实际效果以本地浏览器验证为准。

单元与控制器测试覆盖权限收窄、逐行隐藏/脱敏、写白名单、冲突保留/幂等、双击、限流、请求乱序和切组织旧响应；类型、lint、格式、构建和实际产物/生产 HTTP 冒烟均须通过。

浏览器已操作必填提示、新增、编辑冲突保留、列隐藏并重新加载、清空会话视图。`test/viewport.html` 在 iframe 内提供实际 **390×844 CSS 视口**，DOM 测量 viewport/document/body 宽度均390，抽屉宽390；这不是手机真机验收。截图位于 `shots/crud-desktop.png`、`shots/crud-mobile-form.png`。

第二批浏览器验证 `test/aggregate-browser.html` 的复制、键盘排序及真实原生拖动（SKU-A 从首行移到第三行）、一次主表保存含明细差异、错误行定位/保留、只读详情、恢复携带 id/version。彻底删除只验证确认文字和取消，调用参数由控制器测试覆盖，没有在浏览器执行永久删除。`test/aggregate-viewport.html` 的390×844 CSS视口中页面/body宽390、可见抽屉390×844。截图 aggregate-desktop.png、aggregate-error.png、aggregate-mobile.png 位于 shots/。

T17补充：正式接口已具备CrudSchema，types.ts现直接使用src/api/schema；早期crud-schema子集只留作历史测试输入。\_fieldState明确区分只读/脱敏/隐藏，未知状态失败关闭，不根据星号推断。页面fieldPerms和逐行状态分别约束新增与修改；新增定向测试按Jimmy要求暂不执行。后端schema的Swagger属性遗漏已交接。
