import { api, type OperationBody } from "@/api/client";
import { OPERATION_PERMISSIONS } from "@/api/constants";
import type { PureHttpRequestConfig } from "@/utils/http/types";
import type {
  CrudPort,
  CrudQuery,
  CrudRecord,
  CrudMutation,
  CrudSchema,
  CrudChoices
} from "@/components/Crud/types";

type Operation = keyof typeof api;
/** 通用页面的内部适配边界；实际HTTP仍只调用T12生成的操作，不拼任意URL。 */
type Invoke = (
  input: unknown,
  config: PureHttpRequestConfig
) => Promise<{ data: unknown } | Blob>;
const body = (query: CrudQuery) => ({
  page: query.pageNumber,
  size: query.pageSize,
  keyword: query.search,
  eq: query.equality,
  sort: query.sorting.map(item => ({
    field: item.field,
    order: item.direction
  })),
  where: query.advanced
});
const config = (context: CrudMutation) => ({
  signal: context.signal,
  headers: { "Idempotency-Key": context.idempotencyKey }
});
/** 导出的日期时间按浏览器时区格式化，和列表显示一致；取不到时交给服务器默认 */
function browserTimeZone(): { timeZone?: string } {
  try {
    const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return zone ? { timeZone: zone } : {};
  } catch {
    return {};
  }
}
export function generatedCrud(prefix: string, resource = "") {
  const operation = (suffix: string) => `${prefix}${suffix}` as Operation;
  const available = (suffix: string) => Object.hasOwn(api, operation(suffix));
  const call = async (
    suffix: string,
    input: unknown,
    options: PureHttpRequestConfig
  ) => {
    if (!available(suffix)) throw Error("crud.requestFailed");
    return (api[operation(suffix)] as unknown as Invoke)(input, options);
  };
  const data = async <T>(
    suffix: string,
    input: unknown,
    options: PureHttpRequestConfig
  ): Promise<T> => {
    const response = await call(suffix, input, options);
    if (response instanceof Blob || !response || !("data" in response))
      throw Error("crud.requestFailed");
    return response.data as T;
  };
  const permissions = Object.fromEntries(
    Object.entries({
      create: "Add",
      info: "Info",
      update: "Update",
      remove: "Delete",
      recycle: "RecyclePage",
      restore: "Restore",
      purge: "Purge",
      export: "Export"
    }).map(([action, suffix]) => [
      action,
      OPERATION_PERMISSIONS[operation(suffix)]?.[0] ?? ""
    ])
  );
  const port: CrudPort = {
    describe: async signal => {
      const schema = await data<CrudSchema>("Schema", {}, { signal });
      resource = schema.permPrefix;
      return schema;
    },
    list: async (query, signal) => {
      const result = await data<{ list: CrudRecord[]; total: number }>(
        "Page",
        { body: body(query) },
        { signal }
      );
      return { rows: result.list, totalRows: result.total };
    },
    detail: (id, signal) =>
      data<CrudRecord>("Info", { body: { id } }, { signal }),
    ...(available("Add")
      ? {
          create: (values, context) =>
            data<CrudRecord>(
              "Add",
              { body: { data: values, children: children(context, true) } },
              config(context)
            )
        }
      : {}),
    ...(available("Update")
      ? {
          update: (identity, values, context) =>
            data<CrudRecord>(
              "Update",
              {
                body: { ...identity, data: values, children: children(context) }
              },
              config(context)
            )
        }
      : {}),
    ...(available("Delete")
      ? {
          remove: (ids, context) =>
            data("Delete", { body: { ids } }, config(context))
        }
      : {}),
    ...(available("Tree")
      ? {
          tree: async signal =>
            (await data<{ list: CrudRecord[] }>("Tree", {}, { signal })).list
        }
      : {}),
    ...(available("Export")
      ? {
          export: async (query, signal, options) => {
            const response = await call(
              "Export",
              {
                body: {
                  ...body(query),
                  format: options?.format ?? "csv",
                  ...(options?.columns ? { columns: options.columns } : {}),
                  ...browserTimeZone()
                }
              },
              { signal }
            );
            if (!(response instanceof Blob)) throw Error("crud.requestFailed");
            return response;
          }
        }
      : {}),
    ...(available("RecyclePage")
      ? {
          recycled: async (query, signal) => {
            const result = await data<{ list: CrudRecord[]; total: number }>(
              "RecyclePage",
              {
                body: {
                  page: query.pageNumber,
                  size: query.pageSize,
                  keyword: query.search
                }
              },
              { signal }
            );
            return { rows: result.list, totalRows: result.total };
          }
        }
      : {}),
    ...(available("Restore")
      ? {
          restore: (items, context) =>
            data("Restore", { body: { items } }, config(context))
        }
      : {}),
    ...(available("Purge")
      ? {
          purge: (items, context) =>
            data("Purge", { body: { items } }, config(context))
        }
      : {}),
    preferences: {
      load: async (_page, signal) => {
        const response = await api.sessionPreferenceGet(
          { query: { key: `columns:${resource}` } },
          { signal }
        );
        const value = response.data.value as unknown as {
          density?: string;
          columns?: {
            field: string;
            width?: number;
            hidden?: boolean;
            fixed?: string;
          }[];
        };
        return {
          density: value?.density,
          columns: Array.isArray(value?.columns)
            ? value.columns.map(column => ({
                ...column,
                visible: column.hidden !== true
              }))
            : []
        };
      },
      save: async (_page, choices: CrudChoices, signal) => {
        await api.sessionPreferenceSave(
          {
            body: {
              key: `columns:${resource}`,
              value: {
                density: choices.density,
                columns: choices.columns.map(column => ({
                  field: column.field,
                  width: column.width,
                  hidden: !column.visible,
                  ...(column.fixed ? { fixed: column.fixed } : {})
                }))
              }
            } as unknown as OperationBody<"sessionPreferenceSave">
          },
          { signal, headers: { "Idempotency-Key": crypto.randomUUID() } }
        );
      }
    }
  };
  return { port, permissions };
}
function children(context: CrudMutation, adding = false) {
  return context.relatedChanges
    ? Object.fromEntries(
        context.relatedChanges.map(change => [
          change.resource,
          {
            added: change.inserted.map(row => ({
              ...row.values,
              clientId: row.localKey
            })),
            ...(adding
              ? {}
              : {
                  updated: change.modified.map(row => ({
                    ...row.values,
                    id: row.recordKey
                  })),
                  deleted: change.removed
                })
          }
        ])
      )
    : undefined;
}
