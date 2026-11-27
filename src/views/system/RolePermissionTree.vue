<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import type { TreeInstance } from "element-plus";
import { api } from "@/api/client";
import type { components } from "@/api/schema";
import { useUserStoreHook } from "@/store/modules/user";

const props = defineProps<{ modelValue: string[]; disabled?: boolean }>();
const emit = defineEmits<{ "update:modelValue": [value: string[]] }>();
const { t } = useI18n();
const user = useUserStoreHook();
type Permission = components["schemas"]["GrantablePermissionItem"];
type PermissionNode = {
  value: string;
  label: string;
  search: string;
  children?: PermissionNode[];
};
const catalog = ref<Permission[]>([]);
const loading = ref(false);
const error = ref(false);
const search = ref("");
const treeRef = ref<TreeInstance>();
let request: AbortController | undefined;

const tree = computed(() => {
  const roots: PermissionNode[] = [];
  const groups = new Map<
    string,
    PermissionNode & { children: PermissionNode[] }
  >();
  for (const item of catalog.value) {
    let children = roots;
    for (const [index, label] of item.groups.entries()) {
      const path = item.groups.slice(0, index + 1);
      const key = `group:${JSON.stringify(path)}`;
      let group = groups.get(key);
      if (!group) {
        group = { value: key, label, search: path.join(" "), children: [] };
        groups.set(key, group);
        children.push(group);
      }
      children = group.children;
    }
    children.push({
      value: item.code,
      label: item.label,
      search: [...item.groups, item.label, item.code].join(" ")
    });
  }
  return roots;
});
const unavailable = computed(() => {
  const available = new Set(catalog.value.map(item => item.code));
  return props.modelValue.filter(code => !available.has(code));
});

async function load() {
  request?.abort();
  const controller = (request = new AbortController());
  loading.value = true;
  error.value = false;
  catalog.value = [];
  try {
    const { data } = await api.systemRoleGrantablePermissions(
      {},
      { signal: controller.signal }
    );
    if (!controller.signal.aborted) catalog.value = data.list;
  } catch {
    if (!controller.signal.aborted) error.value = true;
  } finally {
    if (request === controller) loading.value = false;
  }
}

watch(() => user.epoch, load, { immediate: true });
watch(
  [treeRef, tree, () => props.modelValue],
  ([instance]) => instance?.setCheckedKeys(props.modelValue, true),
  { flush: "post" }
);
watch([treeRef, search], ([instance, keyword]) => instance?.filter(keyword), {
  flush: "post"
});
onBeforeUnmount(() => request?.abort());

function matches(keyword: string, node: PermissionNode) {
  return node.search.toLowerCase().includes(keyword.trim().toLowerCase());
}

function updateChecked() {
  const checked = treeRef.value?.getCheckedKeys(true);
  if (checked && !props.disabled)
    emit("update:modelValue", [...unavailable.value, ...checked.map(String)]);
}
</script>

<template>
  <div class="permission-picker">
    <el-input
      v-model="search"
      class="permission-search"
      :aria-label="t('system.permissions')"
      :placeholder="t('system.permissionTreePlaceholder')"
      :disabled="loading || error"
      clearable
    />
    <el-scrollbar height="280px" class="permission-scroll">
      <div v-if="loading" role="status">
        {{ t("system.permissionTreeLoading") }}
      </div>
      <div v-else-if="error" role="alert">
        {{ t("system.lookupFailed") }}
        <el-button link type="primary" @click="load">{{
          t("admin.retry")
        }}</el-button>
      </div>
      <template v-else>
        <el-tree
          ref="treeRef"
          :data="tree"
          node-key="value"
          :props="{ disabled: () => !!disabled }"
          :filter-node-method="matches"
          :aria-label="t('system.permissions')"
          show-checkbox
          @check="updateChecked"
        >
          <template #default="{ data }">
            <span>{{ data.label }}</span>
            <span
              v-if="!data.children && data.label !== data.value"
              class="permission-code"
            >
              {{ data.value }}
            </span>
          </template>
        </el-tree>
        <div v-if="unavailable.length" class="permission-unavailable">
          <div>{{ t("system.permissionTreeUnavailable") }}</div>
          <el-space wrap>
            <el-tag
              v-for="code in unavailable"
              :key="code"
              type="info"
              :closable="!disabled"
              @close="
                emit(
                  'update:modelValue',
                  modelValue.filter(item => item !== code)
                )
              "
              >{{ code }}</el-tag
            >
          </el-space>
        </div>
      </template>
    </el-scrollbar>
  </div>
</template>

<style scoped>
.permission-picker {
  width: 100%;
  min-width: 0;
  padding: 8px;
  border: 1px solid var(--el-border-color);
  border-radius: var(--el-border-radius-base);
}

.permission-search {
  margin-bottom: 8px;
}

.permission-unavailable {
  color: var(--el-text-color-secondary);
}

.permission-code {
  margin-inline-start: 8px;
  font-size: var(--el-font-size-extra-small);
  color: var(--el-text-color-secondary);
}
</style>
