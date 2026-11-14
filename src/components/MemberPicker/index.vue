<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import type { ElTree } from "element-plus";
import { onSessionReset } from "@/platform/lifecycle";
import { RequestFailure } from "@/utils/http";
import type {
  MemberChoice,
  MemberDirectory,
  MemberOrganization
} from "./types";

const props = withDefaults(
  defineProps<{
    modelValue?: string | string[];
    source: MemberDirectory;
    multiple?: boolean;
    disabled?: boolean;
    limit?: number;
  }>(),
  { limit: 50 }
);
const emit = defineEmits<{ "update:modelValue": [value: string | string[]] }>();
const { t } = useI18n();
type Choice = MemberChoice & { unavailable?: boolean };
type TreeNode = MemberOrganization & { children: TreeNode[] };
const opened = ref(false),
  organizations = ref<MemberOrganization[]>([]);
const rows = ref<MemberChoice[]>([]),
  selected = ref<Choice[]>([]),
  draft = ref<Choice[]>([]);
const orgId = ref(""),
  orgKeyword = ref(""),
  keyword = ref(""),
  includeChildren = ref(true);
const page = ref(1),
  total = ref(0),
  size = 20;
const busy = ref(false),
  orgBusy = ref(false),
  resolving = ref(false);
const error = ref(""),
  orgError = ref(""),
  selectionError = ref("");
const tree = ref<InstanceType<typeof ElTree>>();
let memberRequest: AbortController | undefined,
  orgRequest: AbortController | undefined;
let resolveRequest: AbortController | undefined,
  timer: ReturnType<typeof setTimeout> | undefined;
let activeKey = "";
let generation = 0;
const ids = computed(() =>
  Array.isArray(props.modelValue)
    ? props.modelValue
    : props.modelValue
      ? [props.modelValue]
      : []
);
const maximum = computed(() =>
  props.multiple ? Math.max(1, Math.min(props.limit, 50)) : 1
);
const treeRows = computed(() => {
  const map = new Map(
    organizations.value.map(org => [
      org.id,
      { ...org, children: [] } as TreeNode
    ])
  );
  const roots: TreeNode[] = [];
  for (const node of map.values()) {
    const parent = node.parentId ? map.get(node.parentId) : undefined;
    if (parent) parent.children.push(node);
    else roots.push(node);
  }
  return roots;
});
const currentOrg = computed(
  () =>
    organizations.value.find(org => org.id === orgId.value)?.label ??
    t("memberPicker.allMembers")
);
const allChecked = computed(
  () =>
    rows.value.length > 0 &&
    rows.value.every(row => draft.value.some(item => item.id === row.id))
);
const partlyChecked = computed(
  () =>
    !allChecked.value &&
    rows.value.some(row => draft.value.some(item => item.id === row.id))
);
const invalid = computed(
  () =>
    draft.value.some(item => item.unavailable) ||
    draft.value.length > maximum.value
);
function message(e: unknown) {
  return e instanceof RequestFailure ? e.message : t("crud.requestFailed");
}
async function hydrate() {
  resolveRequest?.abort();
  const current = (resolveRequest = new AbortController());
  const wanted = [...ids.value];
  selected.value = wanted.map(
    id =>
      selected.value.find(item => item.id === id) ?? {
        id,
        label: t("memberPicker.loadingMember")
      }
  );
  selectionError.value = "";
  resolving.value = wanted.length > 0;
  if (!wanted.length) return;
  try {
    const members = await props.source.resolve(wanted, current.signal);
    if (current.signal.aborted) return;
    selected.value = wanted.map(
      id =>
        members.find(item => item.id === id) ?? {
          id,
          label: t("memberPicker.unavailableMember", { id }),
          unavailable: true
        }
    );
  } catch (e) {
    if (!current.signal.aborted) selectionError.value = message(e);
  } finally {
    if (!current.signal.aborted) resolving.value = false;
  }
}
async function loadMembers() {
  if (!opened.value) return;
  clearTimeout(timer);
  const key = JSON.stringify([
    orgId.value,
    includeChildren.value,
    keyword.value.trim(),
    page.value
  ]);
  if (busy.value && activeKey === key) return;
  memberRequest?.abort();
  const current = (memberRequest = new AbortController());
  activeKey = key;
  busy.value = true;
  error.value = "";
  try {
    const result = await props.source.members({
      orgId: orgId.value || undefined,
      includeChildren: includeChildren.value,
      keyword: keyword.value.trim(),
      page: page.value,
      size,
      signal: current.signal
    });
    if (current.signal.aborted) return;
    rows.value = result.list;
    total.value = result.total;
  } catch (e) {
    if (!current.signal.aborted) {
      error.value = message(e);
      rows.value = [];
      total.value = 0;
    }
  } finally {
    if (!current.signal.aborted) busy.value = false;
  }
}
async function loadOrganizations() {
  orgRequest?.abort();
  const current = (orgRequest = new AbortController());
  orgBusy.value = true;
  orgError.value = "";
  try {
    const result = await props.source.organizations(current.signal);
    if (!current.signal.aborted) organizations.value = result;
  } catch (e) {
    if (!current.signal.aborted) orgError.value = message(e);
  } finally {
    if (!current.signal.aborted) orgBusy.value = false;
  }
}
function cancelPending() {
  clearTimeout(timer);
  memberRequest?.abort();
  orgRequest?.abort();
  busy.value = orgBusy.value = false;
  activeKey = "";
}
function close() {
  generation++;
  opened.value = false;
  cancelPending();
  rows.value = [];
  organizations.value = [];
  draft.value = [];
  orgKeyword.value = keyword.value = orgId.value = "";
  total.value = 0;
  error.value = orgError.value = "";
}
async function open() {
  if (props.disabled || opened.value) return;
  const opening = generation;
  await hydrate();
  if (
    opening !== generation ||
    props.disabled ||
    selectionError.value ||
    resolveRequest?.signal.aborted
  )
    return;
  draft.value = selected.value.map(item => ({ ...item }));
  page.value = 1;
  includeChildren.value = true;
  opened.value = true;
  void loadOrganizations();
  void loadMembers();
}
function filterMembers() {
  page.value = 1;
  void loadMembers();
}
function search() {
  clearTimeout(timer);
  // 输入变动即废弃旧请求，防止旧响应短暂覆盖新搜索。
  memberRequest?.abort();
  busy.value = false;
  timer = setTimeout(filterMembers, 300);
}
function chooseOrg(value: string) {
  orgId.value = value;
  tree.value?.setCurrentKey(value || undefined);
  filterMembers();
}
function toggle(member: MemberChoice, checked: boolean) {
  if (!checked) draft.value = draft.value.filter(item => item.id !== member.id);
  else if (!draft.value.some(item => item.id === member.id)) {
    if (!props.multiple) draft.value = [member];
    else if (draft.value.length < maximum.value) draft.value.push(member);
  }
}
function togglePage(checked: boolean) {
  if (checked) {
    for (const row of rows.value) toggle(row, true);
  } else {
    const current = new Set(rows.value.map(row => row.id));
    draft.value = draft.value.filter(item => !current.has(item.id));
  }
}
function confirm() {
  if (props.disabled || invalid.value || selectionError.value) return;
  selected.value = draft.value.map(item => ({ ...item }));
  emit(
    "update:modelValue",
    props.multiple
      ? selected.value.map(item => item.id)
      : (selected.value[0]?.id ?? "")
  );
  close();
}
watch(
  () => ids.value.join(","),
  () => {
    close();
    void hydrate();
  },
  { immediate: true }
);
watch(
  () => props.source,
  () => {
    close();
    void hydrate();
  }
);
watch(
  () => props.disabled,
  value => {
    if (value) close();
  }
);
watch(orgKeyword, value => tree.value?.filter(value));
function reset() {
  close();
  resolveRequest?.abort();
  selected.value = [];
  selectionError.value = "";
  resolving.value = false;
}
const stop = onSessionReset(reset);
onBeforeUnmount(() => {
  stop();
  reset();
});
</script>

<template>
  <div class="member-picker">
    <el-button
      class="member-trigger"
      :disabled="disabled || resolving"
      :loading="resolving"
      aria-haspopup="dialog"
      @click="open"
    >
      <span class="member-trigger-text">{{
        selected.length
          ? selected.map(item => item.label).join("、")
          : t("memberPicker.choose")
      }}</span>
      <span v-if="multiple && selected.length" class="member-count">{{
        selected.length
      }}</span>
    </el-button>
    <small v-if="selectionError" role="alert" class="member-error"
      >{{ selectionError }}
      <el-button link @click="hydrate">{{
        t("memberPicker.retry")
      }}</el-button></small
    >
    <el-dialog
      :model-value="opened"
      :title="t('memberPicker.title')"
      width="min(920px, 96vw)"
      top="7vh"
      append-to-body
      :close-on-click-modal="false"
      destroy-on-close
      @update:model-value="!$event && close()"
    >
      <div class="member-layout">
        <aside
          v-loading="orgBusy"
          class="member-organizations"
          :aria-label="t('memberPicker.organizations')"
        >
          <el-input
            v-model="orgKeyword"
            :placeholder="t('memberPicker.searchOrg')"
            :aria-label="t('memberPicker.searchOrg')"
            clearable
          />
          <el-button
            class="member-all"
            :type="!orgId ? 'primary' : 'default'"
            plain
            @click="chooseOrg('')"
            >{{ t("memberPicker.allMembers") }}</el-button
          >
          <div v-if="orgError" class="member-error" role="alert">
            {{ orgError }}
            <el-button link @click="loadOrganizations">{{
              t("memberPicker.retry")
            }}</el-button>
          </div>
          <el-scrollbar class="member-tree-scroll">
            <el-tree
              ref="tree"
              :data="treeRows"
              node-key="id"
              :props="{ label: 'label', children: 'children' }"
              highlight-current
              :expand-on-click-node="false"
              :default-expanded-keys="treeRows.map(node => node.id)"
              :empty-text="t('memberPicker.noOrganizations')"
              :filter-node-method="
                (value: string, node: TreeNode) =>
                  !value ||
                  node.label
                    .toLocaleLowerCase()
                    .includes(value.toLocaleLowerCase())
              "
              @node-click="(node: TreeNode) => chooseOrg(node.id)"
            >
              <template #default="{ data }"
                ><span class="member-org-name" :title="data.label">{{
                  data.label
                }}</span></template
              >
            </el-tree>
          </el-scrollbar>
        </aside>
        <section class="member-results" :aria-label="t('memberPicker.members')">
          <div class="member-search">
            <el-input
              v-model="keyword"
              :placeholder="t('memberPicker.searchMember')"
              :aria-label="t('memberPicker.searchMember')"
              clearable
              @input="search"
              @keyup.enter="filterMembers"
            />
            <el-button @click="filterMembers">{{
              t("memberPicker.search")
            }}</el-button>
          </div>
          <div class="member-scope">
            <span class="member-org-name" :title="currentOrg">{{
              currentOrg
            }}</span
            ><el-checkbox
              v-model="includeChildren"
              :disabled="!orgId"
              @change="filterMembers"
              >{{ t("memberPicker.includeChildren") }}</el-checkbox
            >
          </div>
          <div v-if="error" class="member-error" role="alert">
            {{ error }}
            <el-button link @click="loadMembers">{{
              t("memberPicker.retry")
            }}</el-button>
          </div>
          <div v-loading="busy" class="member-table" :aria-busy="busy">
            <el-table
              :data="rows"
              row-key="id"
              height="100%"
              :empty-text="t('memberPicker.noMembers')"
            >
              <el-table-column width="48">
                <template #header
                  ><el-checkbox
                    v-if="multiple"
                    :model-value="allChecked"
                    :indeterminate="partlyChecked"
                    :disabled="busy || !rows.length"
                    :aria-label="t('memberPicker.selectPage')"
                    @change="togglePage(Boolean($event))"
                /></template>
                <template #default="{ row }"
                  ><el-checkbox
                    :model-value="draft.some(item => item.id === row.id)"
                    :disabled="
                      busy ||
                      (multiple &&
                        draft.length >= maximum &&
                        !draft.some(item => item.id === row.id))
                    "
                    :aria-label="
                      t('memberPicker.selectMember', { name: row.label })
                    "
                    @change="toggle(row as MemberChoice, Boolean($event))"
                /></template>
              </el-table-column>
              <el-table-column
                prop="label"
                :label="t('memberPicker.name')"
                show-overflow-tooltip
              />
            </el-table>
          </div>
          <el-pagination
            class="member-pagination"
            :current-page="page"
            :page-size="size"
            :total="total"
            layout="total, prev, pager, next"
            small
            :pager-count="5"
            :disabled="busy"
            @current-change="
              page = $event;
              loadMembers();
            "
          />
        </section>
      </div>
      <section class="member-selected" :aria-label="t('memberPicker.selected')">
        <div class="member-selected-heading">
          <span>{{
            t("memberPicker.selectedCount", {
              count: draft.length,
              limit: maximum
            })
          }}</span
          ><el-button link :disabled="!draft.length" @click="draft = []">{{
            t("memberPicker.clear")
          }}</el-button>
        </div>
        <div class="member-selected-tags">
          <el-tag
            v-for="member in draft"
            :key="member.id"
            :type="member.unavailable ? 'danger' : 'primary'"
            closable
            @close="toggle(member, false)"
            >{{ member.label }}</el-tag
          ><span v-if="!draft.length" class="member-muted">{{
            t("memberPicker.noneSelected")
          }}</span>
        </div>
        <small v-if="invalid" class="member-error" role="alert">{{
          t("memberPicker.invalidSelection")
        }}</small>
      </section>
      <template #footer
        ><el-button @click="close">{{ t("memberPicker.cancel") }}</el-button
        ><el-button
          type="primary"
          :disabled="invalid || Boolean(selectionError) || disabled"
          @click="confirm"
          >{{ t("memberPicker.confirm") }}</el-button
        ></template
      >
    </el-dialog>
  </div>
</template>

<style scoped>
.member-picker,
.member-trigger {
  width: 100%;
  min-width: 0;
}

.member-trigger {
  justify-content: space-between;
  font-weight: normal;
}

.member-trigger :deep(> span) {
  display: flex;
  justify-content: space-between;
  width: 100%;
  min-width: 0;
}

.member-trigger-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.member-count {
  margin-left: 8px;
  color: var(--el-color-primary);
}

.member-layout {
  display: grid;
  grid-template-columns: 230px minmax(0, 1fr);
  height: clamp(300px, 48dvh, 440px);
  border: 1px solid var(--el-border-color-lighter);
  border-radius: var(--el-border-radius-base);
}

.member-organizations,
.member-results {
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
  padding: 16px;
}

.member-organizations {
  gap: 12px;
  border-right: 1px solid var(--el-border-color-lighter);
}

.member-all {
  width: 100%;
  margin: 0;
}

.member-tree-scroll,
.member-table {
  flex: 1;
  min-height: 0;
}

.member-org-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.member-tree-scroll :deep(.el-tree-node__content) {
  height: 34px;
}

.member-search {
  display: flex;
  gap: 8px;
}

.member-scope,
.member-selected-heading {
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
}

.member-scope {
  min-height: 44px;
}

.member-pagination {
  justify-content: flex-end;
  padding-top: 12px;
}

.member-selected {
  margin-top: 16px;
}

.member-selected-heading {
  margin-bottom: 8px;
}

.member-selected-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  max-height: 96px;
  overflow-y: auto;
}

.member-muted {
  color: var(--el-text-color-secondary);
}

.member-error {
  color: var(--el-color-danger);
}

@media (width <= 640px) {
  .member-layout {
    grid-template-columns: 150px minmax(0, 1fr);
    height: 42dvh;
    min-height: 280px;
  }

  .member-organizations,
  .member-results {
    padding: 8px;
  }

  .member-scope {
    flex-wrap: wrap;
    gap: 0;
    padding: 4px 0;
  }

  .member-pagination {
    justify-content: center;
  }

  .member-pagination :deep(.el-pagination__total) {
    display: none;
  }
}

@media (width <= 420px) {
  .member-layout {
    grid-template-columns: 115px minmax(0, 1fr);
  }

  .member-search {
    flex-wrap: wrap;
  }

  .member-search .el-button {
    display: none;
  }
}
</style>
