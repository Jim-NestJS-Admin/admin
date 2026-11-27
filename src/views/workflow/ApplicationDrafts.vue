<script setup lang="ts">
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { api } from "@/api/client";
import type { components } from "@/api/schema";
import { date, useRequestScope } from "./model";

const { t } = useI18n();
const router = useRouter();
const { busy, error, run } = useRequestScope();
const page = ref(1);
const total = ref(0);
const rows = ref<components["schemas"]["ApplicationDraftChoice"][]>([]);
async function load() {
  await run(async signal => {
    const { data } = await api.workflowInstanceDraftPage(
      { body: { page: page.value } },
      { signal }
    );
    if (!signal.aborted) {
      rows.value = data.list;
      total.value = data.total;
    }
  });
}
watch(page, load, { immediate: true });
</script>

<template>
  <div class="application-drafts">
    <div v-if="$slots.toolbar" class="drafts-toolbar">
      <slot name="toolbar" />
    </div>
    <el-alert v-if="error" :title="t(error)" type="error" :closable="false">
      <el-button link @click="load">{{ t("workflow.retry") }}</el-button>
    </el-alert>
    <el-table v-loading="busy" :data="rows" height="100%">
      <el-table-column prop="name" :label="t('workflow.applicationItems')" />
      <el-table-column :label="t('workflow.draftUpdated')" min-width="160">
        <template #default="{ row }">{{ date(row.updatedAt) }}</template>
      </el-table-column>
      <el-table-column :label="t('crud.actions')" width="140">
        <template #default="{ row }">
          <el-button
            link
            type="primary"
            @click="
              router.push({
                name: 'WorkflowApplicationDraft',
                params: { id: row.id }
              })
            "
          >
            {{ t("workflow.continueApplication") }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-if="total > 20"
      v-model:current-page="page"
      :disabled="busy"
      :page-size="20"
      :total="total"
      layout="prev, pager, next"
    />
  </div>
</template>
<style scoped>
.application-drafts {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 0;
  padding: 0 16px 12px;
}

.application-drafts :deep(.el-table) {
  flex: 1;
  min-height: 0;
}

.drafts-toolbar {
  display: flex;
  flex-shrink: 0;
  padding-top: 8px;
}
</style>
