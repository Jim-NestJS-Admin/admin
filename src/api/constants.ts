// 此文件由 pnpm gen:api 生成，禁止手改。
export const PERMISSIONS = [
  "system:dict-item:add",
  "system:dict-item:delete",
  "system:dict-item:info",
  "system:dict-item:page",
  "system:dict-item:update",
  "system:dict-type:add",
  "system:dict-type:delete",
  "system:dict-type:info",
  "system:dict-type:page",
  "system:dict-type:update",
  "system:field:add",
  "system:field:delete",
  "system:field:info",
  "system:field:list",
  "system:field:page",
  "system:field:update",
  "system:login-log:info",
  "system:login-log:page",
  "system:menu:add",
  "system:menu:delete",
  "system:menu:info",
  "system:menu:page",
  "system:menu:update",
  "system:operation-log:info",
  "system:operation-log:page",
  "system:org:add",
  "system:org:delete",
  "system:org:info",
  "system:org:page",
  "system:org:update",
  "system:parameter:add",
  "system:parameter:delete",
  "system:parameter:info",
  "system:parameter:page",
  "system:parameter:update",
  "system:role-field:add",
  "system:role-field:delete",
  "system:role-field:info",
  "system:role-field:page",
  "system:role-field:update",
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
export const OPERATION_PERMISSIONS = {
  authCaptcha: [],
  authLogin: [],
  authLogout: [],
  authRefresh: [],
  sessionMenu: [],
  sessionProfile: [],
  sessionSwitchOrg: [],
  systemDictItemAdd: ["system:dict-item:add"],
  systemDictItemDelete: ["system:dict-item:delete"],
  systemDictItemInfo: ["system:dict-item:info"],
  systemDictItemPage: ["system:dict-item:page"],
  systemDictItemSchema: ["system:dict-item:page"],
  systemDictItemUpdate: ["system:dict-item:update"],
  systemDictTypeAdd: ["system:dict-type:add"],
  systemDictTypeDelete: ["system:dict-type:delete"],
  systemDictTypeInfo: ["system:dict-type:info"],
  systemDictTypePage: ["system:dict-type:page"],
  systemDictTypeSchema: ["system:dict-type:page"],
  systemDictTypeUpdate: ["system:dict-type:update"],
  systemDictionaryOptions: [],
  systemFieldAdd: ["system:field:add"],
  systemFieldDelete: ["system:field:delete"],
  systemFieldInfo: ["system:field:info"],
  systemFieldOverview: ["system:field:page"],
  systemFieldPage: ["system:field:page"],
  systemFieldPermRegistry: ["system:field:list"],
  systemFieldSave: ["system:field:update"],
  systemFieldSchema: ["system:field:page"],
  systemFieldUpdate: ["system:field:update"],
  systemLoginLogInfo: ["system:login-log:info"],
  systemLoginLogPage: ["system:login-log:page"],
  systemLoginLogSchema: ["system:login-log:page"],
  systemMenuAdd: ["system:menu:add"],
  systemMenuDelete: ["system:menu:delete"],
  systemMenuInfo: ["system:menu:info"],
  systemMenuPage: ["system:menu:page"],
  systemMenuSchema: ["system:menu:page"],
  systemMenuUpdate: ["system:menu:update"],
  systemOperationLogInfo: ["system:operation-log:info"],
  systemOperationLogPage: ["system:operation-log:page"],
  systemOperationLogSchema: ["system:operation-log:page"],
  systemOrgAdd: ["system:org:add"],
  systemOrgDelete: ["system:org:delete"],
  systemOrgInfo: ["system:org:info"],
  systemOrgPage: ["system:org:page"],
  systemOrgSchema: ["system:org:page"],
  systemOrgUpdate: ["system:org:update"],
  systemParameterAdd: ["system:parameter:add"],
  systemParameterDelete: ["system:parameter:delete"],
  systemParameterInfo: ["system:parameter:info"],
  systemParameterPage: ["system:parameter:page"],
  systemParameterSchema: ["system:parameter:page"],
  systemParameterUpdate: ["system:parameter:update"],
  systemPermissionList: ["system:role:info"],
  systemRoleAdd: ["system:role:add"],
  systemRoleDelete: ["system:role:delete"],
  systemRoleFieldAdd: ["system:role-field:add"],
  systemRoleFieldDelete: ["system:role-field:delete"],
  systemRoleFieldInfo: ["system:role-field:info"],
  systemRoleFieldOverview: ["system:role-field:page"],
  systemRoleFieldPage: ["system:role-field:page"],
  systemRoleFieldSave: ["system:role-field:update"],
  systemRoleFieldSchema: ["system:role-field:page"],
  systemRoleFieldUpdate: ["system:role-field:update"],
  systemRoleInfo: ["system:role:info"],
  systemRolePage: ["system:role:page"],
  systemRoleSchema: ["system:role:page"],
  systemRoleUpdate: ["system:role:update"],
  systemUserChangePassword: [],
  systemUserCreate: ["system:user:add"],
  systemUserDelete: ["system:user:delete"],
  systemUserInfo: ["system:user:info"],
  systemUserMe: [],
  systemUserPage: ["system:user:page"],
  systemUserResetPassword: ["system:user:reset-password"],
  systemUserRoleAdd: ["system:user-role:add"],
  systemUserRoleDelete: ["system:user-role:delete"],
  systemUserRoleInfo: ["system:user-role:info"],
  systemUserRolePage: ["system:user-role:page"],
  systemUserRoleSchema: ["system:user-role:page"],
  systemUserRoleUpdate: ["system:user-role:update"],
  systemUserSchema: ["system:user:page"],
  systemUserSupervisorAdd: ["system:user-supervisor:add"],
  systemUserSupervisorDelete: ["system:user-supervisor:delete"],
  systemUserSupervisorInfo: ["system:user-supervisor:info"],
  systemUserSupervisorPage: ["system:user-supervisor:page"],
  systemUserSupervisorSchema: ["system:user-supervisor:page"],
  systemUserSupervisorUpdate: ["system:user-supervisor:update"],
  systemUserUpdate: ["system:user:update"]
} as const;
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
  "components.schemas.FieldConfigurationChange.properties.delegable": [
    "editable",
    "readonly",
    "masked",
    "hidden"
  ],
  "components.schemas.FieldConfigurationChange.properties.mask": [
    "phone",
    "email",
    "idcard",
    "last4",
    "all"
  ],
  "components.schemas.FieldConfigurationChange.properties.state": [
    "editable",
    "readonly",
    "masked",
    "hidden"
  ],
  "components.schemas.FieldConfigurationEntry.properties.codeDefault": [
    "editable",
    "readonly",
    "masked",
    "hidden"
  ],
  "components.schemas.FieldConfigurationEntry.properties.codeDelegable": [
    "editable",
    "readonly",
    "masked",
    "hidden"
  ],
  "components.schemas.FieldConfigurationEntry.properties.codeMask": [
    "phone",
    "email",
    "idcard",
    "last4",
    "all"
  ],
  "components.schemas.FieldConfigurationEntry.properties.defaultDelegable": [
    "editable",
    "readonly",
    "masked",
    "hidden"
  ],
  "components.schemas.FieldConfigurationEntry.properties.defaultMask": [
    "phone",
    "email",
    "idcard",
    "last4",
    "all"
  ],
  "components.schemas.FieldConfigurationEntry.properties.defaultState": [
    "editable",
    "readonly",
    "masked",
    "hidden"
  ],
  "components.schemas.FieldConfigurationEntry.properties.delegable": [
    "editable",
    "readonly",
    "masked",
    "hidden"
  ],
  "components.schemas.FieldConfigurationEntry.properties.mask": [
    "phone",
    "email",
    "idcard",
    "last4",
    "all"
  ],
  "components.schemas.FieldConfigurationEntry.properties.state": [
    "editable",
    "readonly",
    "masked",
    "hidden"
  ],
  "components.schemas.FieldPermFieldDto.properties.default": [
    "editable",
    "readonly",
    "masked",
    "hidden"
  ],
  "components.schemas.FieldPermFieldDto.properties.delegable": [
    "editable",
    "readonly",
    "masked",
    "hidden"
  ],
  "components.schemas.FieldPermFieldDto.properties.mask": [
    "phone",
    "email",
    "idcard",
    "last4",
    "all"
  ],
  "components.schemas.MaskRuleDto.properties.code": [
    "phone",
    "email",
    "idcard",
    "last4",
    "all"
  ],
  "components.schemas.MenuItemDto.properties.type": ["directory", "page"],
  "components.schemas.PermissionItem.properties.risk": ["normal", "high"],
  "components.schemas.SystemDictItemPageSort.properties.field": [
    "id",
    "createdAt",
    "updatedAt",
    "rank"
  ],
  "components.schemas.SystemDictItemPageSort.properties.order": ["asc", "desc"],
  "components.schemas.SystemDictItemRow.properties._fieldState.additionalProperties":
    ["readonly", "masked", "hidden"],
  "components.schemas.SystemDictTypePageSort.properties.field": [
    "id",
    "createdAt",
    "updatedAt"
  ],
  "components.schemas.SystemDictTypePageSort.properties.order": ["asc", "desc"],
  "components.schemas.SystemDictTypeRow.properties._fieldState.additionalProperties":
    ["readonly", "masked", "hidden"],
  "components.schemas.SystemFieldAddData.properties.delegable": [
    "editable",
    "readonly",
    "masked",
    "hidden"
  ],
  "components.schemas.SystemFieldAddData.properties.mask": [
    "phone",
    "email",
    "idcard",
    "last4",
    "all"
  ],
  "components.schemas.SystemFieldAddData.properties.state": [
    "editable",
    "readonly",
    "masked",
    "hidden"
  ],
  "components.schemas.SystemFieldPageSort.properties.field": [
    "id",
    "createdAt",
    "updatedAt"
  ],
  "components.schemas.SystemFieldPageSort.properties.order": ["asc", "desc"],
  "components.schemas.SystemFieldRow.properties._fieldState.additionalProperties":
    ["readonly", "masked", "hidden"],
  "components.schemas.SystemFieldRow.properties.delegable": [
    "editable",
    "readonly",
    "masked",
    "hidden"
  ],
  "components.schemas.SystemFieldRow.properties.mask": [
    "phone",
    "email",
    "idcard",
    "last4",
    "all"
  ],
  "components.schemas.SystemFieldRow.properties.state": [
    "editable",
    "readonly",
    "masked",
    "hidden"
  ],
  "components.schemas.SystemFieldUpdateData.properties.delegable": [
    "editable",
    "readonly",
    "masked",
    "hidden"
  ],
  "components.schemas.SystemFieldUpdateData.properties.mask": [
    "phone",
    "email",
    "idcard",
    "last4",
    "all"
  ],
  "components.schemas.SystemFieldUpdateData.properties.state": [
    "editable",
    "readonly",
    "masked",
    "hidden"
  ],
  "components.schemas.SystemLoginLogPageSort.properties.field": [
    "id",
    "createdAt",
    "updatedAt"
  ],
  "components.schemas.SystemLoginLogPageSort.properties.order": ["asc", "desc"],
  "components.schemas.SystemLoginLogRow.properties._fieldState.additionalProperties":
    ["readonly", "masked", "hidden"],
  "components.schemas.SystemMenuAddData.properties.type": [
    "directory",
    "page",
    "button"
  ],
  "components.schemas.SystemMenuPageEq.properties.type": [
    "directory",
    "page",
    "button"
  ],
  "components.schemas.SystemMenuPageSort.properties.field": [
    "id",
    "createdAt",
    "updatedAt",
    "rank"
  ],
  "components.schemas.SystemMenuPageSort.properties.order": ["asc", "desc"],
  "components.schemas.SystemMenuRow.properties._fieldState.additionalProperties":
    ["readonly", "masked", "hidden"],
  "components.schemas.SystemMenuRow.properties.type": [
    "directory",
    "page",
    "button"
  ],
  "components.schemas.SystemMenuUpdateData.properties.type": [
    "directory",
    "page",
    "button"
  ],
  "components.schemas.SystemOperationLogPageSort.properties.field": [
    "id",
    "createdAt",
    "updatedAt"
  ],
  "components.schemas.SystemOperationLogPageSort.properties.order": [
    "asc",
    "desc"
  ],
  "components.schemas.SystemOperationLogRow.properties._fieldState.additionalProperties":
    ["readonly", "masked", "hidden"],
  "components.schemas.SystemOrgPageSort.properties.field": [
    "id",
    "createdAt",
    "updatedAt",
    "rank"
  ],
  "components.schemas.SystemOrgPageSort.properties.order": ["asc", "desc"],
  "components.schemas.SystemOrgRow.properties._fieldState.additionalProperties":
    ["readonly", "masked", "hidden"],
  "components.schemas.SystemParameterPageSort.properties.field": [
    "id",
    "createdAt",
    "updatedAt"
  ],
  "components.schemas.SystemParameterPageSort.properties.order": [
    "asc",
    "desc"
  ],
  "components.schemas.SystemParameterRow.properties._fieldState.additionalProperties":
    ["readonly", "masked", "hidden"],
  "components.schemas.SystemRoleAddData.properties.dataScope": [
    "all",
    "org",
    "org_and_children",
    "self",
    "custom"
  ],
  "components.schemas.SystemRoleFieldAddData.properties.mask": [
    "phone",
    "email",
    "idcard",
    "last4",
    "all"
  ],
  "components.schemas.SystemRoleFieldAddData.properties.state": [
    "editable",
    "readonly",
    "masked",
    "hidden"
  ],
  "components.schemas.SystemRoleFieldPageSort.properties.field": [
    "id",
    "createdAt",
    "updatedAt"
  ],
  "components.schemas.SystemRoleFieldPageSort.properties.order": [
    "asc",
    "desc"
  ],
  "components.schemas.SystemRoleFieldRow.properties._fieldState.additionalProperties":
    ["readonly", "masked", "hidden"],
  "components.schemas.SystemRoleFieldRow.properties.mask": [
    "phone",
    "email",
    "idcard",
    "last4",
    "all"
  ],
  "components.schemas.SystemRoleFieldRow.properties.state": [
    "editable",
    "readonly",
    "masked",
    "hidden"
  ],
  "components.schemas.SystemRoleFieldUpdateData.properties.mask": [
    "phone",
    "email",
    "idcard",
    "last4",
    "all"
  ],
  "components.schemas.SystemRoleFieldUpdateData.properties.state": [
    "editable",
    "readonly",
    "masked",
    "hidden"
  ],
  "components.schemas.SystemRolePageSort.properties.field": [
    "id",
    "createdAt",
    "updatedAt"
  ],
  "components.schemas.SystemRolePageSort.properties.order": ["asc", "desc"],
  "components.schemas.SystemRoleRow.properties._fieldState.additionalProperties":
    ["readonly", "masked", "hidden"],
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
  "components.schemas.SystemUserRoleRow.properties._fieldState.additionalProperties":
    ["readonly", "masked", "hidden"],
  "components.schemas.SystemUserRow.properties._fieldState.additionalProperties":
    ["readonly", "masked", "hidden"],
  "components.schemas.SystemUserSupervisorPageSort.properties.field": [
    "id",
    "createdAt",
    "updatedAt"
  ],
  "components.schemas.SystemUserSupervisorPageSort.properties.order": [
    "asc",
    "desc"
  ],
  "components.schemas.SystemUserSupervisorRow.properties._fieldState.additionalProperties":
    ["readonly", "masked", "hidden"],
  "components.schemas.TokenResult.properties.tokenType": ["Bearer"]
} as const;
