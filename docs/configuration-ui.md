# 配置页界面依据（T22 / T24，2026-11-09）

目标：Pure Admin内的开发工具与模块配置页，面向已有管理权限的操作者；沿用现有主题、Element Plus、字体和导航，不更换底座。

参考的真实产品文档：

- https://directus.com/docs/getting-started/data-model ：先选数据集合，再编辑字段/关系；适合左侧资源选择和分栏。
- https://directus.com/docs/guides/data-model/interfaces ：字段输入方式与显示设置分开；采用字段行与独立选项。
- https://docs.strapi.io/cms/features/content-type-builder ：基本配置与字段设置区分、内容类型模板；采用来源/模板/字段/生成流程。
- https://docs.strapi.io/cms/features/content-manager ：显示配置、拖动顺序、可视编辑；采用排序按钮兼容键盘、即时结构预览。
- https://supabase.com/docs/guides/database/tables ：先选择或创建表，再查看字段结构；导入已有表和新建配置保持不同入口。

具体决定：T22顶部选择配置，中间按配置/预览/结构差异分标签，底部集中预览/下载/确认写入。T24选择资源后用字段/列表/表单三个页签，当前版本与历史常驻。保存前保留草稿，网络失败保留幂等键，旧响应取消；代码和差异用纯文本显示，不执行源码。预览使用空表头/禁用输入表达结构，不伪造后台数据。大表内部滚动，小屏工具栏换行，拖动同时提供上下按钮。

仅参考公开文档和本项目已实现页面，未做浏览器、手机或运行测试；统一验收时再验证视觉与交互。
