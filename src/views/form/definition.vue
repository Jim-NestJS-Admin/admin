<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { permission } from "@/platform/system/resources";
import { useFillHeight } from "@/components/Crud/useFillHeight";
import { useHeadStyle } from "@/components/Crud/useHeadStyle";
import { formatValue } from "@/components/Crud/model.mjs";
import FormEditor from "./FormEditor.vue";
import { useFormWorkspace } from "./useFormWorkspace";
import type { FormRecord } from "./model";
defineOptions({ name: "FormDefinitionPage" });
const { t } = useI18n();
const workspace = useFormWorkspace();
const { records, total, page, size, search, loading, busy, listError, editor } =
  workspace;
const pageEl = ref<HTMLElement>();
const fillHeight = useFillHeight(pageEl),
  headStyle = useHeadStyle();
const editorKey = ref(0);
async function open(...args: Parameters<typeof workspace.open>) {
  ++editorKey.value;
  await workspace.open(...args);
}
function back() {
  editor.open = false;
  void workspace.load();
}
function searchNow() {
  page.value = 1;
  void workspace.load();
}
onMounted(workspace.load);
onBeforeUnmount(workspace.dispose);
</script>
<template>
  <FormEditor
    v-if="editor.open"
    :key="editorKey"
    :workspace="workspace"
    @back="back"
    @reopen="editorKey++"
  />
  <section
    v-else
    ref="pageEl"
    class="form-list"
    :style="[headStyle, { height: `${fillHeight}px` }]"
  >
    <header class="list-toolbar">
      <el-button
        v-perm="permission('formDefinitionAdd')"
        type="primary"
        :disabled="busy"
        @click="open(null, 'create')"
        >＋ {{ t("forms.newForm") }}</el-button
      >
      <span class="list-hint">{{ t("forms.versionListHint") }}</span>
      <el-input
        v-model="search"
        class="list-search"
        clearable
        :placeholder="t('forms.searchHint')"
        :aria-label="t('crud.search')"
        @keyup.enter="searchNow"
        @clear="searchNow"
      />
      <el-button :loading="loading" @click="searchNow">{{
        t("crud.search")
      }}</el-button>
      <el-button :disabled="loading" @click="workspace.load">{{
        t("crud.reload")
      }}</el-button>
    </header>
    <el-alert
      v-if="listError"
      :title="t(listError)"
      type="error"
      :closable="false"
      role="alert"
    />
    <el-table
      v-loading="loading || busy"
      :data="records"
      row-key="id"
      height="100%"
      :empty-text="t('forms.empty')"
      class="forms-table"
    >
      <el-table-column
        prop="name"
        :label="t('forms.name')"
        min-width="180"
        show-overflow-tooltip
      />
      <el-table-column
        prop="code"
        :label="t('forms.code')"
        min-width="170"
        show-overflow-tooltip
      />
      <el-table-column :label="t('forms.revision')" width="110"
        ><template #default="{ row }"
          ><el-tag effect="plain">v{{ row.revision ?? "—" }}</el-tag></template
        ></el-table-column
      >
      <el-table-column :label="t('forms.fieldCount')" width="110"
        ><template #default="{ row }">{{
          row.fields?.length ?? "—"
        }}</template></el-table-column
      >
      <el-table-column :label="t('forms.createdAt')" min-width="180"
        ><template #default="{ row }">{{
          formatValue(row.createdAt)
        }}</template></el-table-column
      >
      <el-table-column :label="t('crud.actions')" min-width="200" fixed="right"
        ><template #default="{ row }"
          ><el-button
            v-perm="permission('formDefinitionInfo')"
            link
            type="primary"
            @click="open(row as FormRecord, 'view')"
            >{{ t("forms.view") }}</el-button
          ><el-button
            v-perm="permission('formDefinitionRevise')"
            link
            type="primary"
            @click="open(row as FormRecord, 'revise')"
            >{{ t("forms.newRevision") }}</el-button
          ></template
        ></el-table-column
      >
    </el-table>
    <footer class="list-footer">
      <span>{{ t("forms.records", { n: total }) }}</span
      ><el-pagination
        v-model:current-page="page"
        v-model:page-size="size"
        :total="total"
        :page-sizes="[10, 20, 50]"
        layout="prev, pager, next, sizes"
        @current-change="workspace.load"
        @size-change="searchNow"
      />
    </footer>
  </section>
</template>
<style scoped>
.form-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-height: 360px;
  padding: 20px;
  background: var(--el-bg-color);
  border-radius: 8px;
}

.list-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
}

.list-hint {
  font-size: 13px;
  color: var(--el-text-color-secondary);
}

.list-search {
  width: 240px;
  margin-left: auto;
}

.list-toolbar :deep(.el-button + .el-button) {
  margin-left: 0;
}

.forms-table {
  flex: 1;
  min-height: 0;
}

.list-footer {
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
  font-size: 13px;
  color: var(--el-text-color-secondary);
}

@media (width <= 760px) {
  .form-list {
    padding: 12px;
  }

  .list-hint {
    display: none;
  }

  .list-search {
    order: 2;
    width: 100%;
  }

  .list-footer {
    flex-direction: column;
    align-items: flex-start;
    overflow-x: auto;
  }
}
</style>
