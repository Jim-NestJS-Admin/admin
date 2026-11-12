<script setup lang="ts">
/** 平台 · 租户管理（阶段 2，契约 tenant.md 第 7 节；只有平台用户能打开） */
import { onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import CrudPage from "@/components/Crud/CrudPage.vue";
import { defaultCell } from "@/components/Crud/model.mjs";
import type { CrudCell, CrudPort, CrudRecord } from "@/components/Crud/types";
import { api, type OperationBody } from "@/api/client";
import { generatedCrud } from "@/platform/generated-crud";
import TenantUsage from "./TenantUsage.vue";

defineOptions({ name: "PlatformTenant" });
const { t } = useI18n();
const generated = generatedCrud("platformTenant");

/**
 * 新建租户要同时提交管理员账号和密码（不在租户表上），后端在一个事务里建租户、根组织、
 * 超级管理员角色和管理员账号；其余操作沿用通用适配。
 */
const port: CrudPort = {
  ...generated.port,
  create: async (values, context) => {
    const { adminUsername, adminPassword, ...data } = values;
    const result = await api.platformTenantAdd(
      {
        body: {
          data,
          adminUsername,
          adminPassword
        } as unknown as OperationBody<"platformTenantAdd">
      },
      {
        signal: context.signal,
        headers: { "Idempotency-Key": context.idempotencyKey }
      }
    );
    return result.data as unknown as CrudRecord;
  }
};

/** 套餐下拉和列表里的套餐名称 */
const packages = ref<{ id: string; label: string }[]>([]);
onMounted(async () => {
  try {
    const page = await api.platformPackagePage({
      body: { page: 1, size: 100 }
    });
    packages.value = page.data.list.map(row => ({
      id: String(row.id),
      label: `${row.name}（${row.code}）`
    }));
  } catch {
    packages.value = [];
  }
});
function cell(row: CrudRecord, field: string): CrudCell {
  const value = defaultCell(row, field) as CrudCell;
  if (field !== "packageId" || value.state === "hidden") return value;
  const found = packages.value.find(p => p.id === String(value.display));
  return found ? { ...value, display: found.label } : value;
}
</script>

<template>
  <CrudPage
    :port="port"
    page-key="platform:tenant"
    :permissions="generated.permissions"
    :cell="cell"
  >
    <template #form-packageId="{ values, disabled }">
      <el-select
        v-model="values.packageId"
        filterable
        :disabled="disabled"
        :aria-label="t('crud.select')"
      >
        <el-option
          v-for="item in packages"
          :key="item.id"
          :value="item.id"
          :label="item.label"
        />
      </el-select>
    </template>
    <template #form-domains="{ values, disabled }">
      <div class="field-stack">
        <el-select
          :model-value="(values.domains ?? []) as string[]"
          multiple
          filterable
          allow-create
          default-first-option
          :reserve-keyword="false"
          :disabled="disabled"
          @update:model-value="
            values.domains = ($event as string[]).map(d =>
              d.trim().toLowerCase()
            )
          "
        />
        <span class="field-hint">{{ t("platform.domainsHint") }}</span>
      </div>
    </template>
    <template #form-extra="{ mode, values, errors, disabled }">
      <template v-if="mode === 'add'">
        <el-form-item
          :label="t('platform.adminUsername')"
          required
          :error="errors.adminUsername?.map(m => t(m)).join('；')"
        >
          <el-input
            v-model="values.adminUsername as string"
            autocomplete="off"
            maxlength="64"
            :disabled="disabled"
          />
        </el-form-item>
        <el-form-item
          :label="t('platform.adminPassword')"
          required
          :error="errors.adminPassword?.map(m => t(m)).join('；')"
        >
          <div class="field-stack">
            <el-input
              v-model="values.adminPassword as string"
              type="password"
              show-password
              autocomplete="new-password"
              :disabled="disabled"
            />
            <span class="field-hint">{{ t("platform.adminHint") }}</span>
          </div>
        </el-form-item>
      </template>
    </template>
    <template #editor-related="{ record }">
      <TenantUsage :key="String(record.id)" :tenant-id="String(record.id)" />
    </template>
  </CrudPage>
</template>

<style scoped>
.field-stack {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
}

.field-hint {
  font-size: 12px;
  line-height: 1.4;
  color: var(--el-text-color-secondary);
}
</style>
