<script setup lang="ts">
/** 平台 · 套餐管理（阶段 2，契约 tenant.md 第 2、7 节；只有平台用户能打开） */
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import CrudPage from "@/components/Crud/CrudPage.vue";
import { api } from "@/api/client";
import { generatedCrud } from "@/platform/generated-crud";
import PackageMenuTree, { type MenuOption } from "./PackageMenuTree.vue";

defineOptions({ name: "PlatformPackage" });
const { t } = useI18n();
const generated = generatedCrud("platformPackage");

/** 可选菜单树（只有租户可用的菜单，含按钮） */
const menus = ref<MenuOption[]>([]);
const menuFailed = ref(false);
onMounted(async () => {
  try {
    menus.value = (await api.platformPackageMenus({}))
      .data as unknown as MenuOption[];
  } catch {
    menuFailed.value = true;
  }
});
const titles = computed(() => {
  const map = new Map<string, string>();
  const walk = (items: MenuOption[], path: string[]) => {
    for (const item of items) {
      const next = [...path, item.title];
      map.set(String(item.id), next.join(" / "));
      if (item.children?.length) walk(item.children, next);
    }
  };
  walk(menus.value, []);
  return map;
});

/** 配额：整个对象替换，null 表示不限；阶段 2 只执行用户数和存储空间 */
const QUOTA_KEYS = [
  "maxUsers",
  "storageMb",
  "maxSites",
  "aiTokensMonthly",
  "mcpCallsMonthly"
] as const;
type Quotas = Partial<Record<(typeof QUOTA_KEYS)[number], number | null>>;
const quotasOf = (value: unknown): Quotas =>
  value && typeof value === "object" ? (value as Quotas) : {};
function setQuota(
  values: Record<string, unknown>,
  key: (typeof QUOTA_KEYS)[number],
  value: number | null | undefined
) {
  const current = quotasOf(values.quotas);
  values.quotas = Object.fromEntries(
    QUOTA_KEYS.map(k => [
      k,
      k === key
        ? typeof value === "number"
          ? value
          : null
        : (current[k] ?? null)
    ])
  );
}
const quotaText = (value: number | null | undefined) =>
  value === null || value === undefined ? t("platform.unlimited") : value;
</script>

<template>
  <CrudPage
    :port="generated.port"
    page-key="platform:package"
    :permissions="generated.permissions"
  >
    <template #form-menuIds="{ values, disabled }">
      <div class="field-stack">
        <span class="field-hint">{{ t("platform.menuHint") }}</span>
        <el-alert
          v-if="menuFailed"
          :title="t('platform.loadFailed')"
          type="error"
          :closable="false"
        />
        <PackageMenuTree
          v-else
          :options="menus"
          :model-value="(values.menuIds ?? []) as string[]"
          :disabled="disabled"
          @update:model-value="values.menuIds = $event"
        />
      </div>
    </template>
    <template #form-quotas="{ values, disabled }">
      <div class="field-stack">
        <div class="quota-grid">
          <template v-for="key in QUOTA_KEYS" :key="key">
            <span class="quota-label">{{ t(`platform.${key}`) }}</span>
            <el-input-number
              :model-value="quotasOf(values.quotas)[key] ?? undefined"
              :min="0"
              :step="1"
              step-strictly
              :controls="false"
              :placeholder="t('platform.unlimited')"
              :disabled="disabled"
              :aria-label="t(`platform.${key}`)"
              @update:model-value="setQuota(values, key, $event)"
            />
          </template>
        </div>
        <span class="field-hint">{{ t("platform.quotaHint") }}</span>
      </div>
    </template>
    <template #detail-menuIds="{ record }">
      <span v-if="!Array.isArray(record.menuIds) || !record.menuIds.length"
        >—</span
      >
      <div v-else class="menu-tags">
        <el-tag
          v-for="id in record.menuIds as string[]"
          :key="id"
          size="small"
          effect="plain"
          >{{ titles.get(String(id)) ?? id }}</el-tag
        >
      </div>
    </template>
    <template #detail-quotas="{ record }">
      <div class="quota-grid">
        <template v-for="key in QUOTA_KEYS" :key="key">
          <span class="quota-label">{{ t(`platform.${key}`) }}</span>
          <span>{{ quotaText(quotasOf(record.quotas)[key]) }}</span>
        </template>
      </div>
    </template>
  </CrudPage>
</template>

<style scoped>
.field-stack {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
}

.field-hint {
  font-size: 12px;
  line-height: 1.4;
  color: var(--el-text-color-secondary);
}

.quota-grid {
  display: grid;
  grid-template-columns: max-content minmax(120px, 200px);
  gap: 8px 12px;
  align-items: center;
}

.quota-label {
  color: var(--el-text-color-regular);
}

.menu-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}
</style>
