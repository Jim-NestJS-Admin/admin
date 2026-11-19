<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { api } from "@/api/client";
import type { components } from "@/api/schema";
import { useRequestScope, date } from "./model";

const { t } = useI18n();
const router = useRouter();
const { busy, error, run, reset } = useRequestScope();
const tab = ref("available");
const page = ref(1);
const total = ref(0);
const query = ref("");
const keyword = ref("");
const available = ref<components["schemas"]["WorkflowAvailableRow"][]>([]);
const drafts = ref<components["schemas"]["ApplicationDraftChoice"][]>([]);
const groups = computed(() => {
  const grouped = new Map<string, typeof available.value>();
  for (const item of available.value) {
    const label = item.category || t("workflow.uncategorized");
    if (!grouped.has(label)) grouped.set(label, []);
    grouped.get(label)!.push(item);
  }
  return grouped;
});
async function load() {
  reset();
  available.value = [];
  drafts.value = [];
  total.value = 0;
  await run(async signal => {
    if (tab.value === "drafts") {
      const { data } = await api.workflowInstanceDraftPage(
        { body: { page: page.value } },
        { signal }
      );
      if (signal.aborted) return;
      drafts.value = data.list;
      total.value = data.total;
    } else {
      const { data } = await api.workflowDefinitionAvailable(
        { body: { keyword: keyword.value, page: page.value, size: 20 } },
        { signal }
      );
      if (signal.aborted) return;
      available.value = data.list;
      total.value = data.total;
    }
  });
}
watch([tab, page, keyword], load, { immediate: true });
function search() {
  const next = query.value.trim();
  if (page.value === 1 && keyword.value === next) return;
  page.value = 1;
  keyword.value = next;
}
</script>

<template>
  <el-card shadow="never">
    <el-page-header @back="router.push('/workflow/instance')">
      <template #content>{{ t("workflow.startApplication") }}</template>
    </el-page-header>
    <el-tabs v-model="tab" @tab-change="page = 1">
      <el-tab-pane :label="t('workflow.applicationItems')" name="available" />
      <el-tab-pane :label="t('workflow.applicationDrafts')" name="drafts" />
    </el-tabs>
    <el-alert v-if="error" :title="t(error)" type="error" :closable="false">
      <el-button link @click="load">{{ t("workflow.retry") }}</el-button>
    </el-alert>
    <el-skeleton v-if="busy" :rows="4" animated />
    <template v-else-if="tab === 'available'">
      <el-input
        v-model="query"
        :placeholder="t('workflow.searchApplication')"
        clearable
        @clear="search"
        @keyup.enter="search"
      >
        <template #append
          ><el-button @click="search">{{
            t("workflow.searchApplication")
          }}</el-button></template
        >
      </el-input>
      <el-empty v-if="!total && !error" />
      <section
        v-for="[label, items] in groups"
        :key="label"
        class="application-group"
      >
        <h3>{{ label }}</h3>
        <el-space wrap>
          <el-button
            v-for="item in items"
            :key="item.id"
            @click="
              router.push({
                name: 'WorkflowApplicationNew',
                params: { id: item.id }
              })
            "
          >
            {{ item.name }}
          </el-button>
        </el-space>
      </section>
    </template>
    <el-table v-else :data="drafts">
      <el-table-column prop="name" :label="t('workflow.applicationItems')" />
      <el-table-column :label="t('workflow.draftUpdated')">
        <template #default="{ row }">{{ date(row.updatedAt) }}</template>
      </el-table-column>
      <el-table-column>
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
      :page-size="20"
      :total="total"
      layout="prev, pager, next"
    />
  </el-card>
</template>

<style scoped>
.application-group {
  margin-block: 20px;
}
</style>
