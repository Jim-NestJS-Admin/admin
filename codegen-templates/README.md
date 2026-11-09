# 前端模板

单表、树表、主子表共用page.vue.tpl，由后端schema控制能力；父级选择/树列表、子表编辑、回收站、导出由CrudPage处理。生成页只通过generatedCrud调用T12客户端，不生成手写后台DTO或请求URL。

输出路径：src/views/<module>/<business>/index.vue、src/locales/<module>/<business>.ts。生成后仍需人工注册模块和导航组件白名单，导出后端OpenAPI并运行gen:api，禁止自动安装/提交或执行迁移。

模板使用限定变量替换，不执行模板代码。JSON变量必须由服务端JSON.stringify产生；pageKeyExpression必须是固定标识符路径转换成安全的单引号表达式，不能直接塞用户文本。变量定义见docs/contracts/codegen.md。
