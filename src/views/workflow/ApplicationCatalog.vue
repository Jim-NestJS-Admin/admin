<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { api } from "@/api/client";
import type { components } from "@/api/schema";
import { useRequestScope } from "./model";

const emit = defineEmits<{ close: [] }>();
const { t } = useI18n();
const router = useRouter();
const { busy, error, run, reset } = useRequestScope();
const page = ref(1);
const total = ref(0);
const query = ref("");
const keyword = ref("");
const items = ref<components["schemas"]["WorkflowAvailableRow"][]>([]);
const groups = computed(() => {
  const grouped = new Map<string, typeof items.value>();
  for (const item of items.value) {
    const label = item.category || t("workflow.uncategorized");
    const group = grouped.get(label);
    if (group) group.push(item);
    else grouped.set(label, [item]);
  }
  return grouped;
});
async function load() {
  reset();
  items.value = [];
  await run(async signal => {
    const { data } = await api.workflowDefinitionAvailable(
      { body: { keyword: keyword.value, page: page.value, size: 20 } },
      { signal }
    );
    if (!signal.aborted) {
      items.value = data.list;
      total.value = data.total;
    }
  });
}
watch([page, keyword], load, { immediate: true });
function search() {
  page.value = 1;
  keyword.value = query.value.trim();
}
async function select(id: string) {
  await router.push({ name: "WorkflowApplicationNew", params: { id } });
  emit("close");
}
</script>

<template>
  <el-dialog
    :model-value="true"
    :title="t('workflow.applicationItems')"
    width="min(760px, 94vw)"
    append-to-body
    @update:model-value="!$event && emit('close')"
  >
    <el-input
      v-model="query"
      :placeholder="t('workflow.searchApplication')"
      :aria-label="t('workflow.searchApplication')"
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
    <div class="application-catalog">
      <el-alert v-if="error" :title="t(error)" type="error" :closable="false">
        <el-button link @click="load">{{ t("workflow.retry") }}</el-button>
      </el-alert>
      <el-skeleton v-else-if="busy" :rows="4" animated />
      <el-empty v-else-if="!total" />
      <section v-for="[label, group] in groups" :key="label">
        <h3>{{ label }}</h3>
        <div class="application-items">
          <button
            v-for="item in group"
            :key="item.id"
            type="button"
            class="application-item"
            @click="select(item.id)"
          >
            {{ item.name }}
          </button>
        </div>
      </section>
    </div>
    <el-pagination
      v-if="total > 20"
      v-model:current-page="page"
      :page-size="20"
      :total="total"
      layout="prev, pager, next"
    />
  </el-dialog>
</template>

<style scoped>
.application-catalog {
  max-height: 55dvh;
  padding: 4px;
  margin-block: 12px;
  overflow: auto;
}

.application-catalog h3 {
  margin-block: 12px;
  font-size: 14px;
}

.application-items {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(160px, 100%), 1fr));
  gap: 12px;
  padding-block-end: 12px;
}

.application-item {
  min-height: 72px;
  padding: 12px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  text-align: start;
  overflow-wrap: anywhere;
  cursor: pointer;
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color);
  border-radius: var(--el-border-radius-base);
}

.application-item:hover,
.application-item:focus-visible {
  color: var(--el-color-primary);
  background: var(--el-color-primary-light-9);
  border-color: var(--el-color-primary);
}
</style>
