// 此文件由 pnpm gen:api 生成，禁止手改。
export type paths = Record<string, never>;
export type webhooks = Record<string, never>;
export type components = {
  schemas: {
    CrudSchema: {
      actions: components["schemas"]["CrudSchemaActions"];
      api: (
        | "page"
        | "info"
        | "add"
        | "update"
        | "delete"
        | "recycle"
        | "restore"
        | "purge"
      )[];
      /** @description 子表；没有子表时为空数组 */
      children: components["schemas"]["CrudSchemaChild"][];
      columns: components["schemas"]["CrudSchemaColumn"][];
      defaultSort: components["schemas"]["CrudSchemaSort"][];
      /** @enum {string} */
      deleteMode: "soft" | "hard";
      dictionaries: {
        [key: string]: components["schemas"]["CrudSchemaDictItem"][];
      };
      form: components["schemas"]["CrudSchemaFormItem"][];
      label: string;
      maxSize: number;
      /**
       * @description 权限码前缀
       * @example system:user
       */
      permPrefix: string;
      query: components["schemas"]["CrudSchemaQueryItem"][];
      /** @example system/user */
      resource: string;
    };
    CrudSchemaActions: {
      add?: components["schemas"]["CrudSchemaWriteAction"];
      page?: components["schemas"]["CrudSchemaPageAction"];
      update?: components["schemas"]["CrudSchemaWriteAction"];
    };
    CrudSchemaChild: {
      add: components["schemas"]["CrudSchemaWriteAction"];
      columns: components["schemas"]["CrudSchemaColumn"][];
      form: components["schemas"]["CrudSchemaFormItem"][];
      label: string;
      max: number;
      min: number;
      /** @example items */
      resource: string;
      sortField?: string;
      /** @description 同一张单据里不能重复的字段组 */
      unique: string[][];
      update: components["schemas"]["CrudSchemaWriteAction"];
    };
    CrudSchemaColumn: {
      /** @description 字典名，对应 dictionaries 里的键 */
      dict?: string;
      field: string;
      label: string;
      sortable: boolean;
      width?: number;
    };
    CrudSchemaDictItem: {
      label: string;
      value: string | number | boolean;
    };
    CrudSchemaFormItem: {
      /** @enum {string} */
      component:
        | "input"
        | "textarea"
        | "number"
        | "select"
        | "switch"
        | "date"
        | "datetime";
      dict?: string;
      /**
       * @description both：新增和修改都能写；add：只在新增时写；none：只读
       * @enum {string}
       */
      edit: "both" | "add" | "none";
      field: string;
      label: string;
      placeholder?: string;
      required: boolean;
    };
    CrudSchemaPageAction: {
      filterable: string[];
      /** @description 搜索框匹配的字段 */
      keyWords: string[];
      /** @description 最多能看哪些列；每一行实际状态以接口逐行返回为准 */
      readable: string[];
      sortable: string[];
    };
    CrudSchemaQueryItem: {
      field: string;
      label: string;
      /** @description 可用的运算符；高级查询在 T18 扩展 */
      operators: string[];
    };
    CrudSchemaSort: {
      field: string;
      /** @enum {string} */
      order: "asc" | "desc";
    };
    CrudSchemaWriteAction: {
      writable: string[];
    };
  };
  responses: never;
  parameters: never;
  requestBodies: never;
  headers: never;
  pathItems: never;
};
export type $defs = Record<string, never>;
export type operations = Record<string, never>;
