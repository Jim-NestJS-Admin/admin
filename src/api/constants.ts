// 此文件由 pnpm gen:api 生成，禁止手改。
export const PERMISSIONS = [
  "dev:codegen:delete",
  "dev:codegen:list",
  "dev:codegen:save",
  "dev:codegen:write",
  "file:asset:info",
  "file:asset:page",
  "file:asset:read",
  "file:asset:upload",
  "form:definition:add",
  "form:definition:info",
  "form:definition:page",
  "form:definition:update",
  "form:definition:validate",
  "form:submission:add",
  "form:submission:info",
  "form:submission:page",
  "platform:package:add",
  "platform:package:delete",
  "platform:package:export",
  "platform:package:info",
  "platform:package:page",
  "platform:package:update",
  "platform:tenant:add",
  "platform:tenant:delete",
  "platform:tenant:export",
  "platform:tenant:info",
  "platform:tenant:page",
  "platform:tenant:update",
  "system:code-rule:add",
  "system:code-rule:bind",
  "system:code-rule:delete",
  "system:code-rule:info",
  "system:code-rule:page",
  "system:code-rule:preview",
  "system:code-rule:update",
  "system:code-sequence:info",
  "system:code-sequence:page",
  "system:dict-item:add",
  "system:dict-item:delete",
  "system:dict-item:export",
  "system:dict-item:info",
  "system:dict-item:page",
  "system:dict-item:update",
  "system:dict-type:add",
  "system:dict-type:delete",
  "system:dict-type:export",
  "system:dict-type:info",
  "system:dict-type:page",
  "system:dict-type:update",
  "system:field:add",
  "system:field:delete",
  "system:field:info",
  "system:field:list",
  "system:field:page",
  "system:field:update",
  "system:login-log:export",
  "system:login-log:info",
  "system:login-log:page",
  "system:menu:add",
  "system:menu:delete",
  "system:menu:export",
  "system:menu:info",
  "system:menu:page",
  "system:menu:update",
  "system:operation-log:export",
  "system:operation-log:info",
  "system:operation-log:page",
  "system:org:add",
  "system:org:delete",
  "system:org:export",
  "system:org:info",
  "system:org:page",
  "system:org:update",
  "system:page-config:info",
  "system:page-config:update",
  "system:parameter:add",
  "system:parameter:delete",
  "system:parameter:export",
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
  "system:role:export",
  "system:role:info",
  "system:role:page",
  "system:role:update",
  "system:user-role:add",
  "system:user-role:delete",
  "system:user-role:export",
  "system:user-role:info",
  "system:user-role:page",
  "system:user-role:update",
  "system:user-supervisor:add",
  "system:user-supervisor:delete",
  "system:user-supervisor:export",
  "system:user-supervisor:info",
  "system:user-supervisor:page",
  "system:user-supervisor:update",
  "system:user:add",
  "system:user:delete",
  "system:user:export",
  "system:user:info",
  "system:user:page",
  "system:user:reset-password",
  "system:user:update",
  "workflow:definition:add",
  "workflow:definition:info",
  "workflow:definition:page",
  "workflow:definition:publish",
  "workflow:definition:update",
  "workflow:directory:page",
  "workflow:instance:add",
  "workflow:instance:info",
  "workflow:instance:page",
  "workflow:instance:resubmit",
  "workflow:instance:urge",
  "workflow:instance:withdraw",
  "workflow:record:info",
  "workflow:record:page",
  "workflow:task:approve",
  "workflow:task:info",
  "workflow:task:page",
  "workflow:task:reject",
  "workflow:task:transfer"
] as const;
export type PermissionCode = (typeof PERMISSIONS)[number];
export const OPERATION_PERMISSIONS = {
  authCaptcha: [],
  authLogin: [],
  authLogout: [],
  authRefresh: [],
  authTenantHint: [],
  codeRuleBindingSet: ["system:code-rule:bind"],
  codeRuleHistory: ["system:code-rule:info"],
  codeRulePreview: ["system:code-rule:preview"],
  codeRuleTimeZones: ["system:code-rule:page"],
  codeRuleUsageList: ["system:code-rule:page"],
  codeRuleValidate: ["system:code-rule:preview"],
  devCodegenDelete: ["dev:codegen:delete"],
  devCodegenDownload: ["dev:codegen:save"],
  devCodegenFieldTypes: ["dev:codegen:save"],
  devCodegenImport: ["dev:codegen:save"],
  devCodegenImportSpec: ["dev:codegen:save"],
  devCodegenInfo: ["dev:codegen:list"],
  devCodegenList: ["dev:codegen:list"],
  devCodegenPreview: ["dev:codegen:save"],
  devCodegenPreviewSpec: ["dev:codegen:save"],
  devCodegenSave: ["dev:codegen:save"],
  devCodegenSaveSpec: ["dev:codegen:save"],
  devCodegenSchemaSpec: ["dev:codegen:save"],
  devCodegenSync: ["dev:codegen:save"],
  devCodegenTables: ["dev:codegen:save"],
  devCodegenValidateSpec: ["dev:codegen:save"],
  devCodegenWrite: ["dev:codegen:write"],
  devCodegenWriteSpec: ["dev:codegen:write"],
  fileAssetDownload: ["file:asset:read"],
  fileAssetInfo: ["file:asset:info"],
  fileAssetPage: ["file:asset:page"],
  fileAssetSchema: ["file:asset:page"],
  fileAssetUpload: ["file:asset:upload"],
  formDefinitionAdd: ["form:definition:add"],
  formDefinitionInfo: ["form:definition:info"],
  formDefinitionInspect: ["form:definition:info"],
  formDefinitionPage: ["form:definition:page"],
  formDefinitionRevise: ["form:definition:update"],
  formDefinitionSchema: ["form:definition:page"],
  formDefinitionValidate: ["form:definition:validate"],
  formSubmissionAdd: ["form:submission:add"],
  formSubmissionInfo: ["form:submission:info"],
  formSubmissionMine: ["form:submission:page"],
  formSubmissionPage: ["form:submission:page"],
  formSubmissionSchema: ["form:submission:page"],
  platformPackageAdd: ["platform:package:add"],
  platformPackageDelete: ["platform:package:delete"],
  platformPackageExport: ["platform:package:export"],
  platformPackageInfo: ["platform:package:info"],
  platformPackageMenus: ["platform:package:info"],
  platformPackagePage: ["platform:package:page"],
  platformPackageSchema: ["platform:package:page"],
  platformPackageUpdate: ["platform:package:update"],
  platformTenantAdd: ["platform:tenant:add"],
  platformTenantDelete: ["platform:tenant:delete"],
  platformTenantExport: ["platform:tenant:export"],
  platformTenantInfo: ["platform:tenant:info"],
  platformTenantPage: ["platform:tenant:page"],
  platformTenantSchema: ["platform:tenant:page"],
  platformTenantUpdate: ["platform:tenant:update"],
  platformTenantUsage: ["platform:tenant:info"],
  sessionMenu: [],
  sessionPreferenceDelete: [],
  sessionPreferenceGet: [],
  sessionPreferenceSave: [],
  sessionProfile: [],
  sessionSwitchOrg: [],
  systemCodeRuleAdd: ["system:code-rule:add"],
  systemCodeRuleDelete: ["system:code-rule:delete"],
  systemCodeRuleInfo: ["system:code-rule:info"],
  systemCodeRulePage: ["system:code-rule:page"],
  systemCodeRuleSchema: ["system:code-rule:page"],
  systemCodeRuleUpdate: ["system:code-rule:update"],
  systemCodeSequenceInfo: ["system:code-sequence:info"],
  systemCodeSequencePage: ["system:code-sequence:page"],
  systemCodeSequenceSchema: ["system:code-sequence:page"],
  systemDictItemAdd: ["system:dict-item:add"],
  systemDictItemDelete: ["system:dict-item:delete"],
  systemDictItemExport: ["system:dict-item:export"],
  systemDictItemInfo: ["system:dict-item:info"],
  systemDictItemPage: ["system:dict-item:page"],
  systemDictItemSchema: ["system:dict-item:page"],
  systemDictItemUpdate: ["system:dict-item:update"],
  systemDictTypeAdd: ["system:dict-type:add"],
  systemDictTypeDelete: ["system:dict-type:delete"],
  systemDictTypeExport: ["system:dict-type:export"],
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
  systemLoginLogExport: ["system:login-log:export"],
  systemLoginLogInfo: ["system:login-log:info"],
  systemLoginLogPage: ["system:login-log:page"],
  systemLoginLogSchema: ["system:login-log:page"],
  systemMenuAdd: ["system:menu:add"],
  systemMenuDelete: ["system:menu:delete"],
  systemMenuExport: ["system:menu:export"],
  systemMenuInfo: ["system:menu:info"],
  systemMenuPage: ["system:menu:page"],
  systemMenuSchema: ["system:menu:page"],
  systemMenuTree: ["system:menu:page"],
  systemMenuUpdate: ["system:menu:update"],
  systemOperationLogExport: ["system:operation-log:export"],
  systemOperationLogInfo: ["system:operation-log:info"],
  systemOperationLogPage: ["system:operation-log:page"],
  systemOperationLogSchema: ["system:operation-log:page"],
  systemOrgAdd: ["system:org:add"],
  systemOrgDelete: ["system:org:delete"],
  systemOrgExport: ["system:org:export"],
  systemOrgInfo: ["system:org:info"],
  systemOrgPage: ["system:org:page"],
  systemOrgSchema: ["system:org:page"],
  systemOrgTree: ["system:org:page"],
  systemOrgUpdate: ["system:org:update"],
  systemPageConfigHistory: ["system:page-config:info"],
  systemPageConfigHistoryInfo: ["system:page-config:info"],
  systemPageConfigInfo: ["system:page-config:info"],
  systemPageConfigReset: ["system:page-config:update"],
  systemPageConfigRestore: ["system:page-config:update"],
  systemPageConfigSave: ["system:page-config:update"],
  systemParameterAdd: ["system:parameter:add"],
  systemParameterDelete: ["system:parameter:delete"],
  systemParameterExport: ["system:parameter:export"],
  systemParameterInfo: ["system:parameter:info"],
  systemParameterPage: ["system:parameter:page"],
  systemParameterSchema: ["system:parameter:page"],
  systemParameterUpdate: ["system:parameter:update"],
  systemPermissionList: ["system:role:info"],
  systemRoleAdd: ["system:role:add"],
  systemRoleDelete: ["system:role:delete"],
  systemRoleExport: ["system:role:export"],
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
  systemUserExport: ["system:user:export"],
  systemUserInfo: ["system:user:info"],
  systemUserMe: [],
  systemUserPage: ["system:user:page"],
  systemUserResetPassword: ["system:user:reset-password"],
  systemUserRoleAdd: ["system:user-role:add"],
  systemUserRoleDelete: ["system:user-role:delete"],
  systemUserRoleExport: ["system:user-role:export"],
  systemUserRoleInfo: ["system:user-role:info"],
  systemUserRolePage: ["system:user-role:page"],
  systemUserRoleSchema: ["system:user-role:page"],
  systemUserRoleUpdate: ["system:user-role:update"],
  systemUserSchema: ["system:user:page"],
  systemUserSupervisorAdd: ["system:user-supervisor:add"],
  systemUserSupervisorDelete: ["system:user-supervisor:delete"],
  systemUserSupervisorExport: ["system:user-supervisor:export"],
  systemUserSupervisorInfo: ["system:user-supervisor:info"],
  systemUserSupervisorPage: ["system:user-supervisor:page"],
  systemUserSupervisorSchema: ["system:user-supervisor:page"],
  systemUserSupervisorUpdate: ["system:user-supervisor:update"],
  systemUserUpdate: ["system:user:update"],
  workflowDefinitionAdd: ["workflow:definition:add"],
  workflowDefinitionAvailable: ["workflow:instance:add"],
  workflowDefinitionInfo: ["workflow:definition:info"],
  workflowDefinitionInspect: ["workflow:definition:info"],
  workflowDefinitionPage: ["workflow:definition:page"],
  workflowDefinitionPublish: ["workflow:definition:publish"],
  workflowDefinitionRevise: ["workflow:definition:update"],
  workflowDefinitionSchema: ["workflow:definition:page"],
  workflowDirectoryPage: ["workflow:directory:page"],
  workflowInstanceAttachment: ["workflow:instance:info"],
  workflowInstanceDocument: ["workflow:instance:info"],
  workflowInstanceInfo: ["workflow:instance:info"],
  workflowInstancePage: ["workflow:instance:page"],
  workflowInstancePreview: ["workflow:instance:info"],
  workflowInstanceResubmit: ["workflow:instance:resubmit"],
  workflowInstanceSchema: ["workflow:instance:page"],
  workflowInstanceStart: ["workflow:instance:add"],
  workflowInstanceUrge: ["workflow:instance:urge"],
  workflowInstanceWithdraw: ["workflow:instance:withdraw"],
  workflowRecordInfo: ["workflow:record:info"],
  workflowRecordPage: ["workflow:record:page"],
  workflowRecordSchema: ["workflow:record:page"],
  workflowTaskApprove: ["workflow:task:approve"],
  workflowTaskInfo: ["workflow:task:info"],
  workflowTaskPage: ["workflow:task:page"],
  workflowTaskReject: ["workflow:task:reject"],
  workflowTaskSchema: ["workflow:task:page"],
  workflowTaskTransfer: ["workflow:task:transfer"]
} as const;
export const SCOPES = [] as const;
export const ENUMS = {
  "components.schemas.CodeUsageItem.properties.charset": [
    "upper_alnum",
    "lower_slug",
    "digits",
    "unrestricted"
  ],
  "components.schemas.CrudSchema.properties.api.items": [
    "page",
    "info",
    "add",
    "update",
    "delete",
    "recycle",
    "restore",
    "purge",
    "export",
    "tree"
  ],
  "components.schemas.CrudSchema.properties.deleteMode": ["soft", "hard"],
  "components.schemas.CrudSchemaColumn.properties.type": [
    "text",
    "number",
    "boolean",
    "date",
    "datetime",
    "json",
    "reference"
  ],
  "components.schemas.CrudSchemaDictItem.properties.tagType": [
    "primary",
    "success",
    "info",
    "warning",
    "danger"
  ],
  "components.schemas.CrudSchemaFormItem.properties.component": [
    "input",
    "textarea",
    "number",
    "select",
    "switch",
    "date",
    "datetime",
    "tree-select"
  ],
  "components.schemas.CrudSchemaFormItem.properties.edit": [
    "both",
    "add",
    "none"
  ],
  "components.schemas.CrudSchemaQueryItem.properties.operators.items": [
    "eq",
    "ne",
    "gt",
    "gte",
    "lt",
    "lte",
    "in",
    "notIn",
    "contains",
    "startsWith",
    "between",
    "isNull",
    "notNull"
  ],
  "components.schemas.CrudSchemaQueryItem.properties.type": [
    "string",
    "number",
    "boolean",
    "date"
  ],
  "components.schemas.CrudSchemaSort.properties.order": ["asc", "desc"],
  "components.schemas.DictionaryOption.properties.tagType": [
    "primary",
    "success",
    "info",
    "warning",
    "danger"
  ],
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
  "components.schemas.FieldPermStateDto.properties.mask": [
    "phone",
    "email",
    "idcard",
    "last4",
    "all"
  ],
  "components.schemas.FieldPermStateDto.properties.state": [
    "editable",
    "readonly",
    "masked",
    "hidden"
  ],
  "components.schemas.FileAssetPageSort.properties.field": [
    "id",
    "createdAt",
    "updatedAt",
    "bytes"
  ],
  "components.schemas.FileAssetPageSort.properties.order": ["asc", "desc"],
  "components.schemas.FileAssetRow.properties._fieldState.additionalProperties":
    ["readonly", "masked", "hidden"],
  "components.schemas.FormDefinitionPageSort.properties.field": [
    "id",
    "createdAt",
    "updatedAt",
    "code",
    "revision"
  ],
  "components.schemas.FormDefinitionPageSort.properties.order": ["asc", "desc"],
  "components.schemas.FormDefinitionRow.properties._fieldState.additionalProperties":
    ["readonly", "masked", "hidden"],
  "components.schemas.FormDesignerDto.properties.schemaVersion": [1],
  "components.schemas.FormFieldDto.properties.codeCharset": [
    "upper_alnum",
    "lower_slug",
    "digits",
    "unrestricted"
  ],
  "components.schemas.FormFieldDto.properties.component": [
    "input",
    "inputNumber",
    "switch",
    "select",
    "radio",
    "checkbox",
    "datePicker"
  ],
  "components.schemas.FormFieldDto.properties.type": [
    "string",
    "number",
    "boolean",
    "array",
    "date"
  ],
  "components.schemas.FormLinkageDto.properties.action": [
    "visible",
    "required",
    "options"
  ],
  "components.schemas.FormLinkageDto.properties.operator": ["eq", "ne", "in"],
  "components.schemas.FormSubmissionPageSort.properties.field": [
    "id",
    "createdAt",
    "updatedAt"
  ],
  "components.schemas.FormSubmissionPageSort.properties.order": ["asc", "desc"],
  "components.schemas.FormSubmissionRow.properties._fieldState.additionalProperties":
    ["readonly", "masked", "hidden"],
  "components.schemas.FormValidationDto.properties.format": ["email", "url"],
  "components.schemas.FormValidationResult.properties.valid": [true],
  "components.schemas.MaskRuleDto.properties.code": [
    "phone",
    "email",
    "idcard",
    "last4",
    "all"
  ],
  "components.schemas.MenuItemDto.properties.type": ["directory", "page"],
  "components.schemas.ModuleSpec.properties.template": [
    "single",
    "tree",
    "masterDetail"
  ],
  "components.schemas.ModuleSpec.properties.version": [1],
  "components.schemas.PackageMenuItem.properties.type": [
    "directory",
    "page",
    "button"
  ],
  "components.schemas.PermissionItem.properties.risk": ["normal", "high"],
  "components.schemas.PlatformPackageExportBody.properties.format": [
    "csv",
    "xlsx"
  ],
  "components.schemas.PlatformPackagePageSort.properties.field": [
    "id",
    "createdAt",
    "updatedAt"
  ],
  "components.schemas.PlatformPackagePageSort.properties.order": [
    "asc",
    "desc"
  ],
  "components.schemas.PlatformPackageRow.properties._fieldState.additionalProperties":
    ["readonly", "masked", "hidden"],
  "components.schemas.PlatformTenantExportBody.properties.format": [
    "csv",
    "xlsx"
  ],
  "components.schemas.PlatformTenantPageSort.properties.field": [
    "id",
    "createdAt",
    "updatedAt"
  ],
  "components.schemas.PlatformTenantPageSort.properties.order": ["asc", "desc"],
  "components.schemas.PlatformTenantRow.properties._fieldState.additionalProperties":
    ["readonly", "masked", "hidden"],
  "components.schemas.QueryConditionDto.properties.op": [
    "eq",
    "ne",
    "gt",
    "gte",
    "lt",
    "lte",
    "in",
    "notIn",
    "contains",
    "startsWith",
    "between",
    "isNull",
    "notNull"
  ],
  "components.schemas.QueryGroupDto.properties.op": ["and", "or"],
  "components.schemas.SpecField.properties.codeCharset": [
    "upper_alnum",
    "lower_slug",
    "digits",
    "unrestricted"
  ],
  "components.schemas.SpecField.properties.type": [
    "string",
    "text",
    "int",
    "decimal",
    "money",
    "date",
    "datetime",
    "boolean",
    "json",
    "dictionary",
    "reference",
    "image",
    "file"
  ],
  "components.schemas.SpecFieldPerm.properties.default": [
    "editable",
    "readonly",
    "masked",
    "hidden"
  ],
  "components.schemas.SpecFieldPerm.properties.mask": [
    "phone",
    "email",
    "idcard",
    "last4",
    "all"
  ],
  "components.schemas.SpecFile.properties.action": [
    "create",
    "overwrite",
    "unchanged",
    "skip-modified"
  ],
  "components.schemas.SpecFile.properties.project": ["server", "admin"],
  "components.schemas.SpecOptions.properties.deleteMode": ["soft", "hard"],
  "components.schemas.SpecRecord.properties.status": [
    "notGenerated",
    "generated",
    "modified",
    "invalid"
  ],
  "components.schemas.SystemCodeRuleAddData.properties.resetPeriod": [
    "never",
    "year",
    "month",
    "day"
  ],
  "components.schemas.SystemCodeRulePageEq.properties.resetPeriod": [
    "never",
    "year",
    "month",
    "day"
  ],
  "components.schemas.SystemCodeRulePageSort.properties.field": [
    "id",
    "createdAt",
    "updatedAt"
  ],
  "components.schemas.SystemCodeRulePageSort.properties.order": ["asc", "desc"],
  "components.schemas.SystemCodeRuleRow.properties._fieldState.additionalProperties":
    ["readonly", "masked", "hidden"],
  "components.schemas.SystemCodeRuleRow.properties.resetPeriod": [
    "never",
    "year",
    "month",
    "day"
  ],
  "components.schemas.SystemCodeRuleUpdateData.properties.resetPeriod": [
    "never",
    "year",
    "month",
    "day"
  ],
  "components.schemas.SystemCodeSequencePageSort.properties.field": [
    "id",
    "createdAt",
    "updatedAt"
  ],
  "components.schemas.SystemCodeSequencePageSort.properties.order": [
    "asc",
    "desc"
  ],
  "components.schemas.SystemCodeSequenceRow.properties._fieldState.additionalProperties":
    ["readonly", "masked", "hidden"],
  "components.schemas.SystemDictItemAddData.properties.tagType": [
    "primary",
    "success",
    "info",
    "warning",
    "danger"
  ],
  "components.schemas.SystemDictItemExportBody.properties.format": [
    "csv",
    "xlsx"
  ],
  "components.schemas.SystemDictItemPageSort.properties.field": [
    "id",
    "createdAt",
    "updatedAt",
    "rank"
  ],
  "components.schemas.SystemDictItemPageSort.properties.order": ["asc", "desc"],
  "components.schemas.SystemDictItemRow.properties._fieldState.additionalProperties":
    ["readonly", "masked", "hidden"],
  "components.schemas.SystemDictItemRow.properties.tagType": [
    "primary",
    "success",
    "info",
    "warning",
    "danger"
  ],
  "components.schemas.SystemDictItemUpdateData.properties.tagType": [
    "primary",
    "success",
    "info",
    "warning",
    "danger"
  ],
  "components.schemas.SystemDictTypeExportBody.properties.format": [
    "csv",
    "xlsx"
  ],
  "components.schemas.SystemDictTypePageSort.properties.field": [
    "id",
    "createdAt",
    "updatedAt",
    "rank"
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
  "components.schemas.SystemLoginLogExportBody.properties.format": [
    "csv",
    "xlsx"
  ],
  "components.schemas.SystemLoginLogPageSort.properties.field": [
    "id",
    "createdAt",
    "updatedAt"
  ],
  "components.schemas.SystemLoginLogPageSort.properties.order": ["asc", "desc"],
  "components.schemas.SystemLoginLogRow.properties._fieldState.additionalProperties":
    ["readonly", "masked", "hidden"],
  "components.schemas.SystemMenuAddData.properties.scope": [
    "tenant",
    "platform"
  ],
  "components.schemas.SystemMenuAddData.properties.type": [
    "directory",
    "page",
    "button"
  ],
  "components.schemas.SystemMenuExportBody.properties.format": ["csv", "xlsx"],
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
  "components.schemas.SystemMenuRow.properties.scope": ["tenant", "platform"],
  "components.schemas.SystemMenuRow.properties.type": [
    "directory",
    "page",
    "button"
  ],
  "components.schemas.SystemMenuUpdateData.properties.scope": [
    "tenant",
    "platform"
  ],
  "components.schemas.SystemMenuUpdateData.properties.type": [
    "directory",
    "page",
    "button"
  ],
  "components.schemas.SystemOperationLogExportBody.properties.format": [
    "csv",
    "xlsx"
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
  "components.schemas.SystemOrgExportBody.properties.format": ["csv", "xlsx"],
  "components.schemas.SystemOrgPageSort.properties.field": [
    "id",
    "createdAt",
    "updatedAt",
    "rank"
  ],
  "components.schemas.SystemOrgPageSort.properties.order": ["asc", "desc"],
  "components.schemas.SystemOrgRow.properties._fieldState.additionalProperties":
    ["readonly", "masked", "hidden"],
  "components.schemas.SystemParameterExportBody.properties.format": [
    "csv",
    "xlsx"
  ],
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
  "components.schemas.SystemRoleExportBody.properties.format": ["csv", "xlsx"],
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
  "components.schemas.SystemUserExportBody.properties.format": ["csv", "xlsx"],
  "components.schemas.SystemUserPageSort.properties.field": [
    "id",
    "createdAt",
    "updatedAt",
    "username"
  ],
  "components.schemas.SystemUserPageSort.properties.order": ["asc", "desc"],
  "components.schemas.SystemUserRoleExportBody.properties.format": [
    "csv",
    "xlsx"
  ],
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
  "components.schemas.SystemUserSupervisorExportBody.properties.format": [
    "csv",
    "xlsx"
  ],
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
  "components.schemas.TenantHintResult.properties.mode": ["domain", "code"],
  "components.schemas.TokenResult.properties.tokenType": ["Bearer"],
  "components.schemas.WorkflowActor.properties.type": [
    "users",
    "roles",
    "department_leader",
    "supervisor",
    "self_select",
    "applicant"
  ],
  "components.schemas.WorkflowConditionGroup.properties.logic": ["all", "any"],
  "components.schemas.WorkflowConditionValue.properties.operator": [
    "eq",
    "ne",
    "gt",
    "gte",
    "lt",
    "lte",
    "in",
    "not_in"
  ],
  "components.schemas.WorkflowConditionValue.properties.source": [
    "field",
    "applicant_org",
    "applicant_role"
  ],
  "components.schemas.WorkflowDefinition.properties.status": [
    "draft",
    "published"
  ],
  "components.schemas.WorkflowDefinitionPageEq.properties.status": [
    "draft",
    "published"
  ],
  "components.schemas.WorkflowDefinitionPageSort.properties.field": [
    "id",
    "createdAt",
    "updatedAt",
    "revision"
  ],
  "components.schemas.WorkflowDefinitionPageSort.properties.order": [
    "asc",
    "desc"
  ],
  "components.schemas.WorkflowDefinitionRow.properties._fieldState.additionalProperties":
    ["readonly", "masked", "hidden"],
  "components.schemas.WorkflowDefinitionRow.properties.status": [
    "draft",
    "published"
  ],
  "components.schemas.WorkflowDesignerDto.properties.schemaVersion": [1],
  "components.schemas.WorkflowDirectoryBody.properties.kind": [
    "users",
    "roles",
    "orgs"
  ],
  "components.schemas.WorkflowFormView.properties.fieldStates.additionalProperties":
    ["editable", "readonly", "masked", "hidden"],
  "components.schemas.WorkflowInstance.properties.status": [
    "running",
    "approved",
    "returned",
    "withdrawn"
  ],
  "components.schemas.WorkflowInstancePageEq.properties.status": [
    "running",
    "approved",
    "returned",
    "withdrawn"
  ],
  "components.schemas.WorkflowInstancePageSort.properties.field": [
    "id",
    "createdAt",
    "updatedAt"
  ],
  "components.schemas.WorkflowInstancePageSort.properties.order": [
    "asc",
    "desc"
  ],
  "components.schemas.WorkflowInstanceRow.properties._fieldState.additionalProperties":
    ["readonly", "masked", "hidden"],
  "components.schemas.WorkflowInstanceRow.properties.status": [
    "running",
    "approved",
    "returned",
    "withdrawn"
  ],
  "components.schemas.WorkflowNode.properties.empty": [
    "pass",
    "administrator",
    "stop"
  ],
  "components.schemas.WorkflowNode.properties.fieldPermissions.additionalProperties":
    ["editable", "readonly", "masked", "hidden"],
  "components.schemas.WorkflowNode.properties.mode": [
    "sequential",
    "all",
    "any"
  ],
  "components.schemas.WorkflowNode.properties.rejectTo": ["applicant"],
  "components.schemas.WorkflowNode.properties.type": [
    "approve",
    "copy",
    "condition",
    "parallel"
  ],
  "components.schemas.WorkflowProgressNode.properties.status": [
    "waiting",
    "pending",
    "approved",
    "cancelled",
    "returned",
    "copied",
    "taken"
  ],
  "components.schemas.WorkflowProgressNode.properties.type": [
    "approve",
    "copy",
    "condition",
    "parallel"
  ],
  "components.schemas.WorkflowRecordPageEq.properties.action": [
    "start",
    "approve",
    "empty_pass",
    "repeat_pass",
    "reject",
    "transfer",
    "withdraw",
    "resubmit",
    "urge",
    "timeout"
  ],
  "components.schemas.WorkflowRecordPageSort.properties.field": [
    "id",
    "createdAt",
    "updatedAt"
  ],
  "components.schemas.WorkflowRecordPageSort.properties.order": ["asc", "desc"],
  "components.schemas.WorkflowRecordRow.properties._fieldState.additionalProperties":
    ["readonly", "masked", "hidden"],
  "components.schemas.WorkflowRecordRow.properties.action": [
    "start",
    "approve",
    "empty_pass",
    "repeat_pass",
    "reject",
    "transfer",
    "withdraw",
    "resubmit",
    "urge",
    "timeout"
  ],
  "components.schemas.WorkflowTaskPageEq.properties.kind": ["approve", "copy"],
  "components.schemas.WorkflowTaskPageEq.properties.status": [
    "pending",
    "approved",
    "cancelled",
    "rejected",
    "transferred",
    "copied"
  ],
  "components.schemas.WorkflowTaskPageSort.properties.field": [
    "id",
    "createdAt",
    "updatedAt"
  ],
  "components.schemas.WorkflowTaskPageSort.properties.order": ["asc", "desc"],
  "components.schemas.WorkflowTaskRow.properties._fieldState.additionalProperties":
    ["readonly", "masked", "hidden"],
  "components.schemas.WorkflowTaskRow.properties.kind": ["approve", "copy"],
  "components.schemas.WorkflowTaskRow.properties.status": [
    "pending",
    "approved",
    "cancelled",
    "rejected",
    "transferred",
    "copied"
  ],
  "components.schemas.WorkflowTimeout.properties.action": [
    "remind",
    "supervisor"
  ]
} as const;
