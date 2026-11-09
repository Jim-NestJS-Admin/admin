import { api, type OperationBody } from "@/api/client";
import { OPERATION_PERMISSIONS } from "@/api/constants";
import { useUserStoreHook } from "@/store/modules/user";
import { generatedCrud } from "@/platform/generated-crud";
import type {
  CrudPort,
  CrudQuery,
  CrudMutation,
  CrudRecord
} from "@/components/Crud/types";

export const permission = (
  operation: keyof typeof OPERATION_PERMISSIONS
): string => OPERATION_PERMISSIONS[operation][0] ?? "";
const queryBody = (query: CrudQuery) => ({
  page: query.pageNumber,
  size: query.pageSize,
  keyword: query.search,
  sort: query.sorting.map(item => ({
    field: item.field,
    order: item.direction
  })),
  eq: query.equality,
  where: query.advanced
});
const mutationConfig = (context: CrudMutation) => ({
  signal: context.signal,
  headers: { "Idempotency-Key": context.idempotencyKey }
});
const defaults: Record<string, CrudRecord> = {
  role: { enabled: true, permissions: [], customOrgIds: [], dataScope: "org" },
  org: { parentId: null, enabled: true, rank: 0 },
  menu: {
    parentId: null,
    type: "page",
    path: "",
    component: null,
    permission: null,
    icon: null,
    rank: 0,
    keepAlive: false,
    hidden: false
  },
  "user-role": { scopeOrgId: null },
  "dict-type": { enabled: true },
  "dict-item": { enabled: true, rank: 0 },
  parameter: { description: null, value: "" }
};
const createValues = (resource: string, values: CrudRecord) => {
  const supplied = Object.fromEntries(
    Object.entries(values).filter(([, value]) => value !== undefined)
  );
  return {
    ...defaults[resource],
    ...(resource === "user-role"
      ? { scopeOrgId: useUserStoreHook().organizationId || null }
      : {}),
    ...supplied
  };
};
export const resources = {
  user: {
    permissions: {
      info: permission("systemUserInfo"),
      update: permission("systemUserUpdate"),
      remove: permission("systemUserDelete")
    },
    port: {
      describe: async (signal: AbortSignal) =>
        (await api.systemUserSchema({}, { signal })).data,
      list: async (query: CrudQuery, signal: AbortSignal) => {
        const response = await api.systemUserPage(
          { body: queryBody(query) as OperationBody<"systemUserPage"> },
          { signal }
        );
        return { rows: response.data.list, totalRows: response.data.total };
      },
      detail: async (id: string, signal: AbortSignal) =>
        (await api.systemUserInfo({ body: { id } }, { signal })).data,
      update: async (
        identity: { id: string; version: number },
        values: CrudRecord,
        context: CrudMutation
      ) =>
        (
          await api.systemUserUpdate(
            {
              body: {
                ...identity,
                data: values as OperationBody<"systemUserUpdate">["data"]
              }
            },
            mutationConfig(context)
          )
        ).data,
      remove: async (ids: string[], context: CrudMutation) =>
        (await api.systemUserDelete({ body: { ids } }, mutationConfig(context)))
          .data
    } satisfies CrudPort
  },

  role: {
    permissions: {
      info: permission("systemRoleInfo"),
      update: permission("systemRoleUpdate"),
      remove: permission("systemRoleDelete"),
      create: permission("systemRoleAdd")
    },
    port: {
      describe: async (signal: AbortSignal) =>
        (await api.systemRoleSchema({}, { signal })).data,
      list: async (query: CrudQuery, signal: AbortSignal) => {
        const response = await api.systemRolePage(
          { body: queryBody(query) as OperationBody<"systemRolePage"> },
          { signal }
        );
        return { rows: response.data.list, totalRows: response.data.total };
      },
      detail: async (id: string, signal: AbortSignal) =>
        (await api.systemRoleInfo({ body: { id } }, { signal })).data,
      create: async (values: CrudRecord, context: CrudMutation) =>
        (
          await api.systemRoleAdd(
            {
              body: {
                data: createValues(
                  "role",
                  values
                ) as OperationBody<"systemRoleAdd">["data"]
              }
            },
            mutationConfig(context)
          )
        ).data,
      update: async (
        identity: { id: string; version: number },
        values: CrudRecord,
        context: CrudMutation
      ) =>
        (
          await api.systemRoleUpdate(
            {
              body: {
                ...identity,
                data: values as OperationBody<"systemRoleUpdate">["data"]
              }
            },
            mutationConfig(context)
          )
        ).data,
      remove: async (ids: string[], context: CrudMutation) =>
        (await api.systemRoleDelete({ body: { ids } }, mutationConfig(context)))
          .data
    } satisfies CrudPort
  },

  org: {
    permissions: {
      info: permission("systemOrgInfo"),
      update: permission("systemOrgUpdate"),
      remove: permission("systemOrgDelete"),
      create: permission("systemOrgAdd")
    },
    port: {
      describe: async (signal: AbortSignal) =>
        (await api.systemOrgSchema({}, { signal })).data,
      list: async (query: CrudQuery, signal: AbortSignal) => {
        const response = await api.systemOrgPage(
          { body: queryBody(query) as OperationBody<"systemOrgPage"> },
          { signal }
        );
        return { rows: response.data.list, totalRows: response.data.total };
      },
      detail: async (id: string, signal: AbortSignal) =>
        (await api.systemOrgInfo({ body: { id } }, { signal })).data,
      create: async (values: CrudRecord, context: CrudMutation) =>
        (
          await api.systemOrgAdd(
            {
              body: {
                data: createValues(
                  "org",
                  values
                ) as OperationBody<"systemOrgAdd">["data"]
              }
            },
            mutationConfig(context)
          )
        ).data,
      update: async (
        identity: { id: string; version: number },
        values: CrudRecord,
        context: CrudMutation
      ) =>
        (
          await api.systemOrgUpdate(
            {
              body: {
                ...identity,
                data: values as OperationBody<"systemOrgUpdate">["data"]
              }
            },
            mutationConfig(context)
          )
        ).data,
      remove: async (ids: string[], context: CrudMutation) =>
        (await api.systemOrgDelete({ body: { ids } }, mutationConfig(context)))
          .data
    } satisfies CrudPort
  },

  menu: {
    permissions: {
      info: permission("systemMenuInfo"),
      update: permission("systemMenuUpdate"),
      remove: permission("systemMenuDelete"),
      create: permission("systemMenuAdd")
    },
    port: {
      describe: async (signal: AbortSignal) =>
        (await api.systemMenuSchema({}, { signal })).data,
      list: async (query: CrudQuery, signal: AbortSignal) => {
        const response = await api.systemMenuPage(
          { body: queryBody(query) as OperationBody<"systemMenuPage"> },
          { signal }
        );
        return { rows: response.data.list, totalRows: response.data.total };
      },
      detail: async (id: string, signal: AbortSignal) =>
        (await api.systemMenuInfo({ body: { id } }, { signal })).data,
      create: async (values: CrudRecord, context: CrudMutation) =>
        (
          await api.systemMenuAdd(
            {
              body: {
                data: createValues(
                  "menu",
                  values
                ) as OperationBody<"systemMenuAdd">["data"]
              }
            },
            mutationConfig(context)
          )
        ).data,
      update: async (
        identity: { id: string; version: number },
        values: CrudRecord,
        context: CrudMutation
      ) =>
        (
          await api.systemMenuUpdate(
            {
              body: {
                ...identity,
                data: values as OperationBody<"systemMenuUpdate">["data"]
              }
            },
            mutationConfig(context)
          )
        ).data,
      remove: async (ids: string[], context: CrudMutation) =>
        (await api.systemMenuDelete({ body: { ids } }, mutationConfig(context)))
          .data
    } satisfies CrudPort
  },

  "user-role": {
    permissions: {
      info: permission("systemUserRoleInfo"),
      update: permission("systemUserRoleUpdate"),
      remove: permission("systemUserRoleDelete"),
      create: permission("systemUserRoleAdd")
    },
    port: {
      describe: async (signal: AbortSignal) =>
        (await api.systemUserRoleSchema({}, { signal })).data,
      list: async (query: CrudQuery, signal: AbortSignal) => {
        const response = await api.systemUserRolePage(
          { body: queryBody(query) as OperationBody<"systemUserRolePage"> },
          { signal }
        );
        return { rows: response.data.list, totalRows: response.data.total };
      },
      detail: async (id: string, signal: AbortSignal) =>
        (await api.systemUserRoleInfo({ body: { id } }, { signal })).data,
      create: async (values: CrudRecord, context: CrudMutation) =>
        (
          await api.systemUserRoleAdd(
            {
              body: {
                data: createValues(
                  "user-role",
                  values
                ) as OperationBody<"systemUserRoleAdd">["data"]
              }
            },
            mutationConfig(context)
          )
        ).data,
      update: async (
        identity: { id: string; version: number },
        values: CrudRecord,
        context: CrudMutation
      ) =>
        (
          await api.systemUserRoleUpdate(
            {
              body: {
                ...identity,
                data: values as OperationBody<"systemUserRoleUpdate">["data"]
              }
            },
            mutationConfig(context)
          )
        ).data,
      remove: async (ids: string[], context: CrudMutation) =>
        (
          await api.systemUserRoleDelete(
            { body: { ids } },
            mutationConfig(context)
          )
        ).data
    } satisfies CrudPort
  },

  "user-supervisor": {
    permissions: {
      info: permission("systemUserSupervisorInfo"),
      update: permission("systemUserSupervisorUpdate"),
      remove: permission("systemUserSupervisorDelete"),
      create: permission("systemUserSupervisorAdd")
    },
    port: {
      describe: async (signal: AbortSignal) =>
        (await api.systemUserSupervisorSchema({}, { signal })).data,
      list: async (query: CrudQuery, signal: AbortSignal) => {
        const response = await api.systemUserSupervisorPage(
          {
            body: queryBody(query) as OperationBody<"systemUserSupervisorPage">
          },
          { signal }
        );
        return { rows: response.data.list, totalRows: response.data.total };
      },
      detail: async (id: string, signal: AbortSignal) =>
        (await api.systemUserSupervisorInfo({ body: { id } }, { signal })).data,
      create: async (values: CrudRecord, context: CrudMutation) =>
        (
          await api.systemUserSupervisorAdd(
            {
              body: {
                data: createValues(
                  "user-supervisor",
                  values
                ) as OperationBody<"systemUserSupervisorAdd">["data"]
              }
            },
            mutationConfig(context)
          )
        ).data,
      update: async (
        identity: { id: string; version: number },
        values: CrudRecord,
        context: CrudMutation
      ) =>
        (
          await api.systemUserSupervisorUpdate(
            {
              body: {
                ...identity,
                data: values as OperationBody<"systemUserSupervisorUpdate">["data"]
              }
            },
            mutationConfig(context)
          )
        ).data,
      remove: async (ids: string[], context: CrudMutation) =>
        (
          await api.systemUserSupervisorDelete(
            { body: { ids } },
            mutationConfig(context)
          )
        ).data
    } satisfies CrudPort
  },

  "dict-type": {
    permissions: {
      info: permission("systemDictTypeInfo"),
      update: permission("systemDictTypeUpdate"),
      remove: permission("systemDictTypeDelete"),
      create: permission("systemDictTypeAdd")
    },
    port: {
      describe: async (signal: AbortSignal) =>
        (await api.systemDictTypeSchema({}, { signal })).data,
      list: async (query: CrudQuery, signal: AbortSignal) => {
        const response = await api.systemDictTypePage(
          { body: queryBody(query) as OperationBody<"systemDictTypePage"> },
          { signal }
        );
        return { rows: response.data.list, totalRows: response.data.total };
      },
      detail: async (id: string, signal: AbortSignal) =>
        (await api.systemDictTypeInfo({ body: { id } }, { signal })).data,
      create: async (values: CrudRecord, context: CrudMutation) =>
        (
          await api.systemDictTypeAdd(
            {
              body: {
                data: createValues(
                  "dict-type",
                  values
                ) as OperationBody<"systemDictTypeAdd">["data"]
              }
            },
            mutationConfig(context)
          )
        ).data,
      update: async (
        identity: { id: string; version: number },
        values: CrudRecord,
        context: CrudMutation
      ) =>
        (
          await api.systemDictTypeUpdate(
            {
              body: {
                ...identity,
                data: values as OperationBody<"systemDictTypeUpdate">["data"]
              }
            },
            mutationConfig(context)
          )
        ).data,
      remove: async (ids: string[], context: CrudMutation) =>
        (
          await api.systemDictTypeDelete(
            { body: { ids } },
            mutationConfig(context)
          )
        ).data
    } satisfies CrudPort
  },

  "dict-item": {
    permissions: {
      info: permission("systemDictItemInfo"),
      update: permission("systemDictItemUpdate"),
      remove: permission("systemDictItemDelete"),
      create: permission("systemDictItemAdd")
    },
    port: {
      describe: async (signal: AbortSignal) =>
        (await api.systemDictItemSchema({}, { signal })).data,
      list: async (query: CrudQuery, signal: AbortSignal) => {
        const response = await api.systemDictItemPage(
          { body: queryBody(query) as OperationBody<"systemDictItemPage"> },
          { signal }
        );
        return { rows: response.data.list, totalRows: response.data.total };
      },
      detail: async (id: string, signal: AbortSignal) =>
        (await api.systemDictItemInfo({ body: { id } }, { signal })).data,
      create: async (values: CrudRecord, context: CrudMutation) =>
        (
          await api.systemDictItemAdd(
            {
              body: {
                data: createValues(
                  "dict-item",
                  values
                ) as OperationBody<"systemDictItemAdd">["data"]
              }
            },
            mutationConfig(context)
          )
        ).data,
      update: async (
        identity: { id: string; version: number },
        values: CrudRecord,
        context: CrudMutation
      ) =>
        (
          await api.systemDictItemUpdate(
            {
              body: {
                ...identity,
                data: values as OperationBody<"systemDictItemUpdate">["data"]
              }
            },
            mutationConfig(context)
          )
        ).data,
      remove: async (ids: string[], context: CrudMutation) =>
        (
          await api.systemDictItemDelete(
            { body: { ids } },
            mutationConfig(context)
          )
        ).data
    } satisfies CrudPort
  },

  parameter: {
    permissions: {
      info: permission("systemParameterInfo"),
      update: permission("systemParameterUpdate"),
      remove: permission("systemParameterDelete"),
      create: permission("systemParameterAdd")
    },
    port: {
      describe: async (signal: AbortSignal) =>
        (await api.systemParameterSchema({}, { signal })).data,
      list: async (query: CrudQuery, signal: AbortSignal) => {
        const response = await api.systemParameterPage(
          { body: queryBody(query) as OperationBody<"systemParameterPage"> },
          { signal }
        );
        return { rows: response.data.list, totalRows: response.data.total };
      },
      detail: async (id: string, signal: AbortSignal) =>
        (await api.systemParameterInfo({ body: { id } }, { signal })).data,
      create: async (values: CrudRecord, context: CrudMutation) =>
        (
          await api.systemParameterAdd(
            {
              body: {
                data: createValues(
                  "parameter",
                  values
                ) as OperationBody<"systemParameterAdd">["data"]
              }
            },
            mutationConfig(context)
          )
        ).data,
      update: async (
        identity: { id: string; version: number },
        values: CrudRecord,
        context: CrudMutation
      ) =>
        (
          await api.systemParameterUpdate(
            {
              body: {
                ...identity,
                data: values as OperationBody<"systemParameterUpdate">["data"]
              }
            },
            mutationConfig(context)
          )
        ).data,
      remove: async (ids: string[], context: CrudMutation) =>
        (
          await api.systemParameterDelete(
            { body: { ids } },
            mutationConfig(context)
          )
        ).data
    } satisfies CrudPort
  },

  "operation-log": {
    permissions: { info: permission("systemOperationLogInfo") },
    port: {
      describe: async (signal: AbortSignal) =>
        (await api.systemOperationLogSchema({}, { signal })).data,
      list: async (query: CrudQuery, signal: AbortSignal) => {
        const response = await api.systemOperationLogPage(
          { body: queryBody(query) as OperationBody<"systemOperationLogPage"> },
          { signal }
        );
        return { rows: response.data.list, totalRows: response.data.total };
      },
      detail: async (id: string, signal: AbortSignal) =>
        (await api.systemOperationLogInfo({ body: { id } }, { signal })).data
    } satisfies CrudPort
  },

  "login-log": {
    permissions: { info: permission("systemLoginLogInfo") },
    port: {
      describe: async (signal: AbortSignal) =>
        (await api.systemLoginLogSchema({}, { signal })).data,
      list: async (query: CrudQuery, signal: AbortSignal) => {
        const response = await api.systemLoginLogPage(
          { body: queryBody(query) as OperationBody<"systemLoginLogPage"> },
          { signal }
        );
        return { rows: response.data.list, totalRows: response.data.total };
      },
      detail: async (id: string, signal: AbortSignal) =>
        (await api.systemLoginLogInfo({ body: { id } }, { signal })).data
    } satisfies CrudPort
  }
} as const;
export type SystemResource = keyof typeof resources;
for (const [resource, definition] of Object.entries(resources)) {
  const prefix = `system${resource
    .split("-")
    .map(part => part[0].toUpperCase() + part.slice(1))
    .join("")}`;
  const generated = generatedCrud(prefix, `system:${resource}`);
  Object.assign(definition.port, {
    preferences: generated.port.preferences,
    ...(generated.port.export ? { export: generated.port.export } : {}),
    // 树形资源（组织、菜单）：没有搜索条件时整棵树一次加载，显示成树形表格
    ...(generated.port.tree ? { tree: generated.port.tree } : {})
  });
  Object.assign(definition.permissions, {
    export: generated.permissions.export
  });
}
