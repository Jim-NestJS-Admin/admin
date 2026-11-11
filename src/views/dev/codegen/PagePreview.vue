<script setup lang="ts">
/**
 * 页面预览：用真正的通用列表组件 CrudPage 渲染生成后的列表和表单。
 * 页面描述由后端按规格算出（schema-spec，和生成后的实际页面一致），数据是本地造的示例，
 * 新增 / 修改 / 删除只在预览里提示，不发任何写请求。
 */
import { computed, onBeforeUnmount, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { ElMessage } from "element-plus";
import CrudPage from "@/components/Crud/CrudPage.vue";
import type { CrudPort, CrudRecord, CrudSchema } from "@/components/Crud/types";
import { api } from "@/api/client";
import { permission } from "@/platform/system/resources";
import { requestMessage } from "./request";
import { sampleRows, type ModuleSpec } from "./spec";

const props = defineProps<{ spec: ModuleSpec }>();
const { t } = useI18n();
const schema = ref<CrudSchema>();
const loading = ref(false),
  error = ref(""),
  generation = ref(0);
let request: AbortController | undefined;

async function load() {
  request?.abort();
  const current = new AbortController();
  request = current;
  loading.value = true;
  error.value = "";
  try {
    const response = await api.devCodegenSchemaSpec(
      { body: { spec: props.spec } },
      { signal: current.signal }
    );
    if (current.signal.aborted) return;
    schema.value = response.data as unknown as CrudSchema;
    generation.value++;
  } catch (reason) {
    if (!current.signal.aborted) {
      schema.value = undefined;
      error.value = requestMessage(reason, t);
    }
  } finally {
    if (request === current) loading.value = false;
  }
}
watch(() => props.spec, load, { immediate: true });
onBeforeUnmount(() => request?.abort());

/** 示例数据：主表 12 行（够看分页和滚动），主子表每行带 3 条明细 */
const data = computed(() => {
  const current = schema.value;
  if (!current) return { rows: [] as CrudRecord[], children: {} };
  const dicts = current.dictionaries as Record<string, { value: unknown }[]>;
  const rows = sampleRows(props.spec.fields, dicts, {
    count: 12,
    treeParent: props.spec.tree?.parentField
  });
  const children: Record<string, CrudRecord[]> = {};
  (props.spec.children ?? []).forEach((child, index) => {
    const resource = current.children[index]?.resource;
    if (resource)
      children[resource] = sampleRows(child.fields, dicts, {
        count: 3,
        idBase: 100 * (index + 1),
        dictPrefix: `${resource}.`
      });
  });
  return { rows, children };
});

const notice = () => ElMessage.info(t("codegen.previewNoSave"));
const port = computed<CrudPort>(() => ({
  describe: async () => {
    if (!schema.value) throw Error("crud.requestFailed");
    return JSON.parse(JSON.stringify(schema.value)) as CrudSchema;
  },
  list: async query => {
    const word = query.search.trim().toLowerCase();
    const rows = word
      ? data.value.rows.filter(row =>
          Object.values(row).some(
            value =>
              typeof value === "string" && value.toLowerCase().includes(word)
          )
        )
      : data.value.rows;
    const start = (query.pageNumber - 1) * query.pageSize;
    return {
      rows: rows.slice(start, start + query.pageSize),
      totalRows: rows.length
    };
  },
  ...(props.spec.template === "tree"
    ? { tree: async () => data.value.rows }
    : {}),
  detail: async id => {
    const row = data.value.rows.find(item => item.id === id);
    if (!row) throw Error("crud.requestFailed");
    return { ...row, children: data.value.children };
  },
  relatedComplete: () => true,
  create: async values => {
    notice();
    return values;
  },
  update: async (_identity, values) => {
    notice();
    return values;
  },
  remove: async () => {
    notice();
    return {};
  }
}));
/** 预览里按钮都显示：用生成器自己的权限码（能打开这个页面就有） */
const code = permission("devCodegenSchemaSpec");
const permissions = {
  create: code,
  info: code,
  update: code,
  remove: code
};
</script>

<template>
  <div class="page-preview">
    <el-alert
      :title="t('codegen.previewNotice')"
      type="info"
      :closable="false"
      show-icon
      class="preview-alert"
    />
    <el-alert
      v-if="error"
      :title="error"
      type="error"
      :closable="false"
      class="preview-alert"
    />
    <div v-loading="loading" class="preview-frame">
      <CrudPage
        v-if="schema"
        :key="generation"
        :port="port"
        :page-key="`codegen-preview:${spec.permissionPrefix}`"
        :permissions="permissions"
        :fill="false"
        class="preview-page"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.page-preview {
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: 100%;
  min-height: 0;
}

.preview-alert {
  flex-shrink: 0;
}

/* 预览区模拟后台内容区的浅灰底，列表卡片放在上面 */
.preview-frame {
  flex: 1;
  min-height: 0;
  padding: 12px;
  overflow: hidden;
  background: var(--el-bg-color-page);
  border-radius: 4px;
}

.preview-page {
  height: 100%;
}
</style>
