<script setup lang="ts">
/** 平台 · 套餐管理（阶段 2，契约 tenant.md 第 2、7 节；只有平台用户能打开） */
import { computed, onMounted, ref } from "vue";
import { useMediaQuery } from "@vueuse/core";
import { useI18n } from "vue-i18n";
import CrudPage from "@/components/Crud/CrudPage.vue";
import DictionaryValue from "@/components/Crud/DictionaryValue.vue";
import { defaultCell } from "@/components/Crud/model.mjs";
import { api } from "@/api/client";
import { generatedCrud } from "@/platform/generated-crud";
import PackageMenuTree, { type MenuOption } from "./PackageMenuTree.vue";

defineOptions({ name: "PlatformPackage" });
const { t } = useI18n();
const generated = generatedCrud("platformPackage");
const mobile = useMediaQuery("(max-width: 760px)");
const detailLabelWidth = computed(() => (mobile.value ? 92 : 120));

/** 可选菜单树（只有租户可用的菜单，含按钮） */
const menus = ref<MenuOption[]>([]);
const menuFailed = ref(false);
const menuLoading = ref(true);
onMounted(async () => {
  try {
    menus.value = (await api.platformPackageMenus({}))
      .data as unknown as MenuOption[];
  } catch {
    menuFailed.value = true;
  } finally {
    menuLoading.value = false;
  }
});

/** 配额：整个对象替换，null 表示不限；各额度的执行状态见表单提示。 */
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
const quotaRows = (value: unknown) => {
  const quotas = quotasOf(value);
  return QUOTA_KEYS.map(key => ({
    item: t(`platform.${key}`),
    limit: quotaText(quotas[key])
  }));
};
const detailSections = new Set(["quotas", "menuIds"]);
const separateDetailFields = new Set(["version", "remark", ...detailSections]);
</script>

<template>
  <CrudPage
    :port="generated.port"
    page-key="platform:package"
    :permissions="generated.permissions"
    :add-defaults="{
      enabled: true,
      menuIds: [],
      quotas: Object.fromEntries(QUOTA_KEYS.map(k => [k, null]))
    }"
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
    <template #detail-content="{ record, items, display, dictionaries }">
      <section class="detail-section">
        <h3>{{ t("platform.packageBasicInfo") }}</h3>
        <el-descriptions
          v-if="items.some(item => !separateDetailFields.has(item.field))"
          class="package-info"
          border
          :column="mobile ? 1 : 2"
          :label-width="detailLabelWidth"
        >
          <el-descriptions-item
            v-for="item in items.filter(
              item => !separateDetailFields.has(item.field)
            )"
            :key="item.field"
            :label="item.label"
            :span="item.wide && !mobile ? 2 : 1"
            :width="`calc(${mobile ? '100%' : '50%'} - ${detailLabelWidth}px)`"
          >
            <DictionaryValue
              v-if="item.dict"
              :cell="defaultCell(record, item.field)"
              :options="dictionaries[item.dict]"
              :text="display(record, item)"
            />
            <el-tag
              v-else-if="
                item.type === 'boolean' &&
                defaultCell(record, item.field).state === 'visible' &&
                typeof record[item.field] === 'boolean'
              "
              size="small"
              effect="light"
              :type="record[item.field] ? 'success' : 'info'"
            >
              {{ display(record, item) }}
            </el-tag>
            <template v-else>{{ display(record, item) }}</template>
          </el-descriptions-item>
        </el-descriptions>
        <el-descriptions
          v-for="item in items.filter(item => item.field === 'remark')"
          :key="item.field"
          class="package-info package-remark"
          border
          :column="1"
          :label-width="detailLabelWidth"
        >
          <el-descriptions-item :label="item.label">
            {{ display(record, item) }}
          </el-descriptions-item>
        </el-descriptions>
      </section>
      <section
        v-for="item in items.filter(item => detailSections.has(item.field))"
        :key="item.field"
        class="detail-section"
      >
        <h3>{{ item.label }}</h3>
        <span v-if="defaultCell(record, item.field).state === 'masked'">
          {{ display(record, item) }}
        </span>
        <el-table
          v-else-if="item.field === 'quotas'"
          :data="quotaRows(record.quotas)"
          border
          size="small"
        >
          <el-table-column prop="item" :label="t('platform.usageItem')" />
          <el-table-column prop="limit" :label="t('platform.usageLimit')" />
        </el-table>
        <el-alert
          v-else-if="menuFailed"
          :title="t('platform.loadFailed')"
          type="error"
          :closable="false"
        />
        <PackageMenuTree
          v-else-if="
            !menuLoading &&
            Array.isArray(record.menuIds) &&
            record.menuIds.length
          "
          :options="menus"
          :model-value="record.menuIds as string[]"
          read-only
        />
        <el-card
          v-else
          v-loading="menuLoading"
          shadow="never"
          :body-style="{ padding: '12px' }"
        >
          <span>—</span>
        </el-card>
      </section>
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

.detail-section {
  min-width: 0;
  overflow-wrap: anywhere;
}

.detail-section + .detail-section {
  margin-top: 16px;
}

.detail-section h3 {
  margin: 0 0 8px;
  font-size: var(--el-font-size-base);
  font-weight: 600;
}

.package-info :deep(.el-descriptions__table) {
  width: 100%;
  table-layout: fixed;
}

.package-info :deep(.el-descriptions__label) {
  font-weight: normal;
  color: var(--el-text-color-secondary);
}

.package-info + .package-remark {
  margin-top: -1px;
}

.package-remark :deep(.el-descriptions__content) {
  white-space: pre-wrap;
}
</style>
