<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useMediaQuery } from "@vueuse/core";
import { ElDialog, ElDrawer, type ElTree } from "element-plus";
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
    required?: boolean;
    confirmLabel?: string;
    limit?: number;
    showAvatars?: boolean;
    blockedMembers?: Record<string, string>;
  }>(),
  { limit: 50 }
);
const emit = defineEmits<{ "update:modelValue": [value: string | string[]] }>();
const { t } = useI18n();
type Choice = MemberChoice & { unavailable?: boolean };
type TreeNode = MemberOrganization & { children: TreeNode[] };
type MobilePanel = "members" | "organizations" | "selected";
const opened = ref(false),
  organizations = ref<MemberOrganization[]>([]);
const narrow = useMediaQuery("(max-width: 760px)");
const openInDrawer = ref(false);
const mobilePanel = ref<MobilePanel>("members");
const departmentButton = ref<HTMLElement>();
const selectedButton = ref<HTMLElement>();
const panelBackButton = ref<HTMLElement>();
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
const selectableRows = computed(() =>
  rows.value.filter(row => !props.blockedMembers?.[row.id])
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
const departmentPath = computed(() => {
  const labels: string[] = [];
  const visited = new Set<string>();
  const byId = new Map(organizations.value.map(org => [org.id, org]));
  let current = byId.get(orgId.value);
  while (current && !visited.has(current.id)) {
    visited.add(current.id);
    labels.unshift(current.label);
    current = current.parentId ? byId.get(current.parentId) : undefined;
  }
  return labels.join(" / ") || currentOrg.value;
});
const pickerTitle = computed(() =>
  t(
    openInDrawer.value && mobilePanel.value === "organizations"
      ? "memberPicker.chooseOrg"
      : openInDrawer.value && mobilePanel.value === "selected"
        ? "memberPicker.selected"
        : "memberPicker.title"
  )
);
const allChecked = computed(
  () =>
    selectableRows.value.length > 0 &&
    selectableRows.value.every(row =>
      draft.value.some(item => item.id === row.id)
    )
);
const partlyChecked = computed(
  () =>
    !allChecked.value &&
    rows.value.some(row => draft.value.some(item => item.id === row.id))
);
const invalid = computed(
  () =>
    draft.value.some(
      item => item.unavailable || props.blockedMembers?.[item.id]
    ) || draft.value.length > maximum.value
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
  openInDrawer.value = narrow.value;
  mobilePanel.value = "members";
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
  if (openInDrawer.value) void returnToMembers();
}
async function showPanel(panel: Exclude<MobilePanel, "members">) {
  mobilePanel.value = panel;
  await nextTick();
  panelBackButton.value?.focus();
}
async function returnToMembers() {
  const from = mobilePanel.value;
  mobilePanel.value = "members";
  await nextTick();
  if (from === "organizations") departmentButton.value?.focus();
  else selectedButton.value?.focus();
}
function handlePanelEscape(event: KeyboardEvent) {
  if (!openInDrawer.value || mobilePanel.value === "members") return;
  event.stopPropagation();
  event.preventDefault();
  void returnToMembers();
}
function isPicked(id: string) {
  return draft.value.some(item => item.id === id);
}
function isPickDisabled(id: string) {
  return (
    busy.value ||
    (!isPicked(id) &&
      (Boolean(props.blockedMembers?.[id]) ||
        (props.multiple && draft.value.length >= maximum.value)))
  );
}
function toggle(member: MemberChoice, checked: boolean) {
  if (!checked) draft.value = draft.value.filter(item => item.id !== member.id);
  else if (
    !props.blockedMembers?.[member.id] &&
    !draft.value.some(item => item.id === member.id)
  ) {
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
  if (
    props.disabled ||
    invalid.value ||
    selectionError.value ||
    (props.required && !draft.value.length)
  )
    return;
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
    <slot name="trigger" :open="open" :disabled="disabled || resolving">
      <el-button
        class="member-trigger"
        :disabled="disabled || resolving"
        :loading="resolving"
        aria-haspopup="dialog"
        @click="open"
      >
        <span v-if="showAvatars && selected.length" class="member-trigger-text">
          <span v-for="item in selected" :key="item.id" class="member-identity">
            <el-avatar :size="20" :src="item.avatar">{{
              Array.from(item.label)[0]
            }}</el-avatar
            >{{ item.label }}
          </span>
        </span>
        <span v-else class="member-trigger-text">{{
          selected.length
            ? selected.map(item => item.label).join("、")
            : t("memberPicker.choose")
        }}</span>
        <span v-if="multiple && selected.length" class="member-count">{{
          selected.length
        }}</span>
      </el-button>
    </slot>
    <small v-if="selectionError" role="alert" class="member-error"
      >{{ selectionError }}
      <el-button link @click="hydrate">{{
        t("memberPicker.retry")
      }}</el-button></small
    >
    <component
      :is="openInDrawer ? ElDrawer : ElDialog"
      :model-value="opened"
      :title="pickerTitle"
      v-bind="
        openInDrawer
          ? {
              direction: 'rtl',
              size: '100%',
              bodyClass: 'member-picker-drawer-body',
              closeOnPressEscape: mobilePanel === 'members'
            }
          : { width: 'min(920px, 96vw)', top: '7vh' }
      "
      append-to-body
      :close-on-click-modal="false"
      destroy-on-close
      @update:model-value="!$event && close()"
    >
      <div
        class="member-layout"
        :class="{ 'member-layout-mobile': openInDrawer }"
        @keydown.esc="handlePanelEscape"
      >
        <button
          v-if="openInDrawer && mobilePanel !== 'members'"
          ref="panelBackButton"
          type="button"
          class="member-panel-button member-panel-back"
          @click="returnToMembers"
        >
          <span aria-hidden="true">‹</span>
          {{ t("memberPicker.backToMembers") }}
        </button>
        <aside
          v-show="!openInDrawer || mobilePanel === 'organizations'"
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
        <section
          v-show="!openInDrawer || mobilePanel === 'members'"
          class="member-results"
          :aria-label="t('memberPicker.members')"
        >
          <button
            v-if="openInDrawer"
            ref="departmentButton"
            type="button"
            class="member-panel-button member-department"
            @click="showPanel('organizations')"
          >
            <span>{{ t("memberPicker.department") }}</span>
            <span class="member-org-name" :title="departmentPath">{{
              departmentPath
            }}</span>
            <span aria-hidden="true">›</span>
          </button>
          <div class="member-search">
            <el-input
              v-model="keyword"
              :placeholder="t('memberPicker.searchMember')"
              :aria-label="t('memberPicker.searchMember')"
              clearable
              @input="search"
              @keyup.enter="filterMembers"
            />
            <el-button v-if="!openInDrawer" @click="filterMembers">{{
              t("memberPicker.search")
            }}</el-button>
          </div>
          <div v-if="!openInDrawer || orgId" class="member-scope">
            <span
              v-if="!openInDrawer"
              class="member-org-name"
              :title="currentOrg"
              >{{ currentOrg }}</span
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
          <el-checkbox
            v-if="openInDrawer && multiple && rows.length"
            class="member-page-choice"
            :model-value="allChecked"
            :indeterminate="partlyChecked"
            :disabled="busy || !selectableRows.length"
            @change="togglePage(Boolean($event))"
          >
            {{ t("memberPicker.selectPage") }}
          </el-checkbox>
          <div v-loading="busy" class="member-table" :aria-busy="busy">
            <el-scrollbar v-if="openInDrawer" class="member-list">
              <el-checkbox
                v-for="row in rows"
                :key="row.id"
                class="member-list-choice"
                :model-value="isPicked(row.id)"
                :disabled="isPickDisabled(row.id)"
                @change="toggle(row, Boolean($event))"
              >
                <span class="member-identity">
                  <el-avatar v-if="showAvatars" :size="24" :src="row.avatar">{{
                    Array.from(row.label)[0]
                  }}</el-avatar>
                  <span>
                    {{ row.label }}
                    <small v-if="blockedMembers?.[row.id]">{{
                      t("workflow.memberInBranch", {
                        name: blockedMembers[row.id]
                      })
                    }}</small>
                  </span>
                </span>
              </el-checkbox>
              <p
                v-if="!busy && !error && !rows.length"
                class="member-muted member-empty"
              >
                {{ t("memberPicker.noMembers") }}
              </p>
            </el-scrollbar>
            <el-table
              v-else
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
                    :disabled="busy || !selectableRows.length"
                    :aria-label="t('memberPicker.selectPage')"
                    @change="togglePage(Boolean($event))"
                /></template>
                <template #default="{ row }"
                  ><el-checkbox
                    :model-value="isPicked(row.id)"
                    :disabled="isPickDisabled(row.id)"
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
              >
                <template #default="{ row }">
                  <span class="member-identity">
                    <el-avatar
                      v-if="showAvatars"
                      :size="24"
                      :src="row.avatar"
                      >{{ Array.from(String(row.label))[0] }}</el-avatar
                    >
                    {{ row.label }}
                    <small v-if="blockedMembers?.[row.id]">{{
                      t("workflow.memberInBranch", {
                        name: blockedMembers[row.id]
                      })
                    }}</small>
                  </span>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <el-pagination
            v-if="!openInDrawer || total > size"
            class="member-pagination"
            :current-page="page"
            :page-size="size"
            :total="total"
            :layout="
              openInDrawer ? 'prev, pager, next' : 'total, prev, pager, next'
            "
            small
            :pager-count="5"
            :disabled="busy"
            @current-change="
              page = $event;
              loadMembers();
            "
          />
        </section>
        <section
          v-if="openInDrawer && mobilePanel === 'selected'"
          class="member-selected-mobile"
          :aria-label="t('memberPicker.selected')"
        >
          <div class="member-selected-heading">
            <span>{{
              t("memberPicker.selectedCount", {
                count: draft.length,
                limit: maximum
              })
            }}</span>
            <el-button link :disabled="!draft.length" @click="draft = []">{{
              t("memberPicker.clear")
            }}</el-button>
          </div>
          <el-scrollbar class="member-list">
            <div
              v-for="member in draft"
              :key="member.id"
              class="member-selected-row"
            >
              <span
                class="member-identity"
                :class="{
                  'member-error':
                    member.unavailable || blockedMembers?.[member.id]
                }"
              >
                <el-avatar v-if="showAvatars" :size="24" :src="member.avatar">{{
                  Array.from(member.label)[0]
                }}</el-avatar>
                <span>
                  {{ member.label }}
                  <small v-if="blockedMembers?.[member.id]">{{
                    t("workflow.memberInBranch", {
                      name: blockedMembers[member.id]
                    })
                  }}</small>
                </span>
              </span>
              <el-button
                link
                :aria-label="
                  t('memberPicker.removeMember', { name: member.label })
                "
                @click="toggle(member, false)"
                >{{ t("memberPicker.remove") }}</el-button
              >
            </div>
            <p v-if="!draft.length" class="member-muted member-empty">
              {{ t("memberPicker.noneSelected") }}
            </p>
          </el-scrollbar>
        </section>
      </div>
      <section
        v-if="!openInDrawer"
        class="member-selected"
        :aria-label="t('memberPicker.selected')"
      >
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
            :type="
              member.unavailable || blockedMembers?.[member.id]
                ? 'danger'
                : 'primary'
            "
            closable
            @close="toggle(member, false)"
            ><span class="member-identity">
              <el-avatar v-if="showAvatars" :size="16" :src="member.avatar">{{
                Array.from(member.label)[0]
              }}</el-avatar
              >{{ member.label }}
              <small v-if="blockedMembers?.[member.id]">{{
                t("workflow.memberInBranch", {
                  name: blockedMembers[member.id]
                })
              }}</small>
            </span></el-tag
          ><span v-if="!draft.length" class="member-muted">{{
            t("memberPicker.noneSelected")
          }}</span>
        </div>
        <small v-if="invalid" class="member-error" role="alert">{{
          t("memberPicker.invalidSelection")
        }}</small>
      </section>
      <template #footer>
        <div
          :class="{ 'member-drawer-footer': openInDrawer }"
          @keydown.esc="handlePanelEscape"
        >
          <small
            v-if="openInDrawer && invalid"
            class="member-error"
            role="alert"
            >{{ t("memberPicker.invalidSelection") }}</small
          >
          <div :class="{ 'member-drawer-actions': openInDrawer }">
            <button
              v-if="openInDrawer"
              ref="selectedButton"
              type="button"
              class="member-panel-button member-count-button"
              :disabled="mobilePanel === 'selected'"
              @click="showPanel('selected')"
            >
              <span aria-live="polite">{{
                t("memberPicker.selectedShort", { count: draft.length })
              }}</span>
              <span v-if="mobilePanel !== 'selected'" aria-hidden="true"
                >›</span
              >
            </button>
            <div :class="{ 'member-confirm-actions': openInDrawer }">
              <el-button @click="close">{{
                t("memberPicker.cancel")
              }}</el-button>
              <el-button
                type="primary"
                :disabled="
                  invalid ||
                  Boolean(selectionError) ||
                  disabled ||
                  (required && !draft.length)
                "
                @click="confirm"
              >
                {{ confirmLabel || t("memberPicker.confirm") }}
              </el-button>
            </div>
          </div>
        </div>
      </template>
    </component>
  </div>
</template>

<style scoped>
.member-identity {
  display: inline-flex;
  gap: 6px;
  align-items: center;
  margin-inline-end: 6px;
}

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

:global(.el-drawer__body.member-picker-drawer-body) {
  display: flex;
  min-height: 0;
  padding-block: 0;
  overflow: hidden;
}

.member-layout-mobile {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  height: auto;
  min-height: 0;
  border: 0;
}

.member-layout-mobile .member-organizations,
.member-layout-mobile .member-results,
.member-selected-mobile {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
  padding: 0;
  border: 0;
}

.member-layout-mobile .member-tree-scroll :deep(.el-tree-node__content) {
  height: 44px;
}

.member-panel-button {
  display: inline-flex;
  gap: 8px;
  align-items: center;
  min-width: 0;
  min-height: 44px;
  padding: 0 12px;
  font: inherit;
  color: var(--el-color-primary);
  text-align: start;
  cursor: pointer;
  background: transparent;
  border: 0;
  border-radius: var(--el-border-radius-base);
}

.member-panel-back {
  align-self: flex-start;
  padding-inline: 0 12px;
}

.member-department {
  margin-bottom: 8px;
  color: var(--el-text-color-regular);
  border: 1px solid var(--el-border-color);
}

.member-department .member-org-name {
  flex: 1;
  color: var(--el-text-color-primary);
}

.member-layout-mobile .member-search :deep(.el-input__wrapper) {
  min-height: 44px;
}

.member-layout-mobile .member-search :deep(.el-input__inner) {
  font-size: 16px;
}

.member-layout-mobile .member-scope {
  justify-content: flex-start;
  min-height: 36px;
}

.member-page-choice {
  flex-shrink: 0;
}

.member-list {
  flex: 1;
  height: 100%;
  min-height: 0;
}

.member-list-choice,
.member-selected-row {
  display: flex;
  align-items: center;
  width: 100%;
  height: auto;
  min-height: 44px;
  padding-block: 4px;
  margin: 0;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.member-list-choice :deep(.el-checkbox__label),
.member-selected-row .member-identity {
  min-width: 0;
  overflow-wrap: anywhere;
  white-space: normal;
}

.member-list-choice .member-identity small,
.member-selected-row .member-identity small {
  display: block;
}

.member-list-choice :deep(.el-avatar),
.member-selected-row :deep(.el-avatar) {
  flex-shrink: 0;
}

.member-selected-row {
  gap: 8px;
  justify-content: space-between;
}

.member-selected-row :deep(.el-button) {
  flex-shrink: 0;
  min-height: 44px;
}

.member-layout-mobile .member-pagination {
  justify-content: center;
}

.member-empty {
  margin-block: 12px;
}

.member-drawer-footer {
  padding-bottom: env(safe-area-inset-bottom, 0);
}

.member-drawer-actions,
.member-confirm-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.member-drawer-actions {
  flex-wrap: wrap;
  justify-content: space-between;
}

.member-count-button {
  padding-inline: 0 8px;
}

.member-count-button:disabled {
  color: var(--el-text-color-regular);
  cursor: default;
}

.member-confirm-actions :deep(.el-button) {
  min-height: 44px;
  margin: 0;
}
</style>
