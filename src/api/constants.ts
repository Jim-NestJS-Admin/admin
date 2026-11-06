// 此文件由 pnpm gen:api 生成，禁止手改。
export const PERMISSIONS = [
  "system:menu:add",
  "system:menu:delete",
  "system:menu:info",
  "system:menu:page",
  "system:menu:update",
  "system:org:add",
  "system:org:delete",
  "system:org:info",
  "system:org:page",
  "system:org:update",
  "system:role:add",
  "system:role:delete",
  "system:role:info",
  "system:role:page",
  "system:role:update",
  "system:user-role:add",
  "system:user-role:delete",
  "system:user-role:info",
  "system:user-role:page",
  "system:user-role:update",
  "system:user-supervisor:add",
  "system:user-supervisor:delete",
  "system:user-supervisor:info",
  "system:user-supervisor:page",
  "system:user-supervisor:update",
  "system:user:add",
  "system:user:delete",
  "system:user:info",
  "system:user:page",
  "system:user:reset-password",
  "system:user:update"
] as const;
export type PermissionCode = (typeof PERMISSIONS)[number];
export const SCOPES = [] as const;
export const ENUMS = {
  "components.schemas.CrudSchema.properties.api.items": [
    "page",
    "info",
    "add",
    "update",
    "delete",
    "recycle",
    "restore",
    "purge"
  ],
  "components.schemas.CrudSchema.properties.deleteMode": ["soft", "hard"],
  "components.schemas.CrudSchemaFormItem.properties.component": [
    "input",
    "textarea",
    "number",
    "select",
    "switch",
    "date",
    "datetime"
  ],
  "components.schemas.CrudSchemaFormItem.properties.edit": [
    "both",
    "add",
    "none"
  ],
  "components.schemas.CrudSchemaSort.properties.order": ["asc", "desc"],
  "components.schemas.MenuItemDto.properties.type": ["directory", "page"],
  "components.schemas.PermissionItem.properties.risk": ["normal", "high"],
  "components.schemas.SystemMenuPageSort.properties.field": [
    "id",
    "createdAt",
    "updatedAt",
    "rank"
  ],
  "components.schemas.SystemMenuPageSort.properties.order": ["asc", "desc"],
  "components.schemas.SystemOrgPageSort.properties.field": [
    "id",
    "createdAt",
    "updatedAt",
    "rank"
  ],
  "components.schemas.SystemOrgPageSort.properties.order": ["asc", "desc"],
  "components.schemas.SystemRoleAddData.properties.dataScope": [
    "all",
    "org",
    "org_and_children",
    "self",
    "custom"
  ],
  "components.schemas.SystemRolePageSort.properties.field": [
    "id",
    "createdAt",
    "updatedAt"
  ],
  "components.schemas.SystemRolePageSort.properties.order": ["asc", "desc"],
  "components.schemas.SystemRoleRow.properties.dataScope": [
    "all",
    "org",
    "org_and_children",
    "self",
    "custom"
  ],
  "components.schemas.SystemRoleUpdateData.properties.dataScope": [
    "all",
    "org",
    "org_and_children",
    "self",
    "custom"
  ],
  "components.schemas.SystemUserPageSort.properties.field": [
    "id",
    "createdAt",
    "updatedAt",
    "username"
  ],
  "components.schemas.SystemUserPageSort.properties.order": ["asc", "desc"],
  "components.schemas.SystemUserRolePageSort.properties.field": [
    "id",
    "createdAt",
    "updatedAt"
  ],
  "components.schemas.SystemUserRolePageSort.properties.order": ["asc", "desc"],
  "components.schemas.SystemUserSupervisorPageSort.properties.field": [
    "id",
    "createdAt",
    "updatedAt"
  ],
  "components.schemas.SystemUserSupervisorPageSort.properties.order": [
    "asc",
    "desc"
  ],
  "components.schemas.TokenResult.properties.tokenType": ["Bearer"]
} as const;
