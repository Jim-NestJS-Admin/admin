<script setup lang="ts">
import {
  computed,
  defineAsyncComponent,
  onBeforeUnmount,
  ref,
  watch
} from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import type { ElDropdown } from "element-plus";
import { api } from "@/api/client";
import type { components } from "@/api/schema";
import { onSessionReset } from "@/platform/lifecycle";
import { permission } from "@/platform/system/resources";
import { useUserStoreHook } from "@/store/modules/user";
import { useWorkflowCounts } from "@/store/modules/workflow-counts";
import { date, useRequestScope } from "@/views/workflow/model";
import {
  inboxFilter,
  inboxTabs,
  messageDestination,
  type InboxTab
} from "@/views/notify/inbox";
import BellIcon from "~icons/ep/bell";
import ArrowRight from "~icons/ri/arrow-right-s-line";

const WorkflowDocument = defineAsyncComponent(
  () => import("@/views/workflow/WorkflowDocument.vue")
);
defineOptions({ inheritAttrs: false });
type Message = components["schemas"]["NotifyMessageRow"];
const { t } = useI18n();
const router = useRouter();
const user = useUserStoreHook();
const counts = useWorkflowCounts();
const canList = computed(() =>
  user.permissions.includes(permission("notifyMessagePage"))
);
const canRead = computed(() =>
  user.permissions.includes(permission("notifyMessageRead"))
);
const visible = ref(false);
const dropdown = ref<InstanceType<typeof ElDropdown>>();
const activeTab = ref<InboxTab>("notice");
type Preview = { list: Message[]; total: number };
const previews = ref<Partial<Record<InboxTab, Preview>>>({});
const { busy, error, run, reset: resetRequest } = useRequestScope();
const detail = ref<{ instanceId: string; taskId?: string }>();

async function loadPreviews(signal: AbortSignal) {
  const entries = await Promise.all(
    inboxTabs.map(async ({ key }) => {
      const { data } = await api.notifyMessagePage(
        { body: { page: 1, size: 10, where: inboxFilter(key, true) } },
        { signal }
      );
      return [key, data] as const;
    })
  );
  if (!signal.aborted) previews.value = Object.fromEntries(entries);
}

async function load() {
  void counts.refreshUnread();
  await run(async signal => {
    const firstOpen = Object.keys(previews.value).length === 0;
    await loadPreviews(signal);
    if (firstOpen && !signal.aborted && !previews.value[activeTab.value]?.total)
      activeTab.value =
        inboxTabs.find(({ key }) => previews.value[key]?.total)?.key ??
        activeTab.value;
  });
}

function changeVisibility(open: boolean) {
  visible.value = open;
  if (open) void load();
}

function viewAll() {
  dropdown.value?.handleClose();
  void router.push({
    path: "/notify/message",
    query: { tab: activeTab.value }
  });
}

async function open(message: Message) {
  if (!canRead.value) return;
  await run(async (signal, key) => {
    const body = { id: message.id };
    await api.notifyMessageRead(
      { body },
      { signal, headers: { "Idempotency-Key": key(body) } }
    );
    if (signal.aborted) return;
    void counts.refreshUnread();
    const target = messageDestination(message);
    if (!target) {
      await loadPreviews(signal);
      return;
    }
    dropdown.value?.handleClose();
    if (target.kind === "mcp") {
      await router.push({
        path: "/automation/confirm",
        query: { operation: target.instanceId }
      });
    } else {
      detail.value = target;
    }
  });
}

async function markAsRead() {
  const messages = previews.value[activeTab.value]?.list ?? [];
  if (!canRead.value || !messages.length) return;
  await run(async (signal, key) => {
    const results = await Promise.allSettled(
      messages.map(({ id }) => {
        const body = { id };
        return api.notifyMessageRead(
          { body },
          { signal, headers: { "Idempotency-Key": key(body) } }
        );
      })
    );
    if (signal.aborted) return;
    void counts.refreshUnread();
    await loadPreviews(signal);
    const failed = results.find(result => result.status === "rejected");
    if (failed) throw failed.reason;
  });
}

function reset() {
  resetRequest();
  dropdown.value?.handleClose();
  visible.value = false;
  previews.value = {};
  activeTab.value = "notice";
  detail.value = undefined;
}
watch(canList, value => {
  if (!value) reset();
});
const stop = onSessionReset(reset);
onBeforeUnmount(stop);
</script>

<template>
  <template v-if="canList">
    <el-dropdown
      ref="dropdown"
      v-bind="$attrs"
      trigger="click"
      placement="bottom-end"
      :hide-on-click="false"
      @visible-change="changeVisibility"
    >
      <button
        type="button"
        class="dropdown-badge navbar-bg-hover select-none"
        :class="{ 'mr-[10px]': counts.unread > 0 }"
        :aria-expanded="visible"
        :aria-label="
          counts.unread
            ? t('notifications.unread', { count: counts.unread })
            : t('notifications.inbox')
        "
      >
        <el-badge :value="counts.unread" :max="99" :hidden="!counts.unread">
          <span class="header-notice-icon" aria-hidden="true">
            <IconifyIconOffline :icon="BellIcon" />
          </span>
        </el-badge>
      </button>
      <template #dropdown>
        <el-dropdown-menu class="notice-dropdown">
          <el-alert
            v-if="error"
            :title="t(error)"
            type="error"
            :closable="false"
          />
          <el-tabs v-model="activeTab" stretch class="dropdown-tabs">
            <el-tab-pane
              v-for="tab in inboxTabs"
              :key="tab.key"
              :name="tab.key"
              :label="
                t(tab.label) +
                (previews[tab.key]?.total ? `(${previews[tab.key].total})` : '')
              "
            >
              <el-scrollbar v-loading="busy" max-height="345px">
                <div
                  v-if="previews[tab.key]?.list.length"
                  class="notice-list-container"
                >
                  <button
                    v-for="message in previews[tab.key]?.list"
                    :key="message.id"
                    class="notice-container"
                    type="button"
                    :disabled="busy || !canRead"
                    @click="open(message)"
                  >
                    <div class="notice-container-text">
                      <div class="notice-text-title" :title="message.title">
                        {{ message.title || t("notifications.open") }}
                      </div>
                      <div class="notice-text-datetime">
                        {{ date(message.createdAt) }}
                      </div>
                    </div>
                  </button>
                </div>
                <el-empty v-else :image-size="60" :description="t(tab.empty)" />
              </el-scrollbar>
            </el-tab-pane>
          </el-tabs>
          <div class="notice-footer">
            <el-button type="primary" size="small" text @click="viewAll">
              {{ t("notifications.viewMore") }}
              <IconifyIconOffline :icon="ArrowRight" />
            </el-button>
            <el-button
              v-if="canRead"
              type="primary"
              size="small"
              text
              :disabled="busy || !previews[activeTab]?.list.length"
              :title="t('notifications.markPreviewRead')"
              @click="markAsRead"
            >
              {{ t("notifications.markRead") }}
            </el-button>
          </div>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <WorkflowDocument
      v-if="detail"
      :key="
        detail.taskId
          ? `${detail.instanceId}:${detail.taskId}`
          : detail.instanceId
      "
      :instance-id="detail.instanceId"
      :task-id="detail.taskId"
      @close="detail = undefined"
    />
  </template>
</template>

<style lang="scss" scoped>
.dropdown-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 48px;
  color: inherit;
  appearance: none;
  cursor: pointer;
  background-color: transparent;
  border: 0;
}

.dropdown-badge:focus-visible {
  outline: 2px solid var(--el-color-primary);
  outline-offset: -2px;
}

.header-notice-icon {
  font-size: 18px;
}

.dropdown-tabs {
  width: min(330px, calc(100vw - 24px));

  .notice-list-container {
    padding: 15px 24px 0;
  }

  :deep(.el-tabs__header) {
    margin: 0;
  }

  :deep(.el-tabs__nav-wrap)::after {
    height: 1px;
  }

  :deep(.el-tabs__nav-wrap) {
    padding: 0 36px;
  }
}

.notice-container {
  display: block;
  width: 100%;
  padding: 12px 0;
  text-align: start;
  cursor: pointer;
  background: transparent;
  border: 0;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.notice-container:disabled {
  cursor: default;
}

.notice-container:focus-visible {
  outline: 2px solid var(--el-color-primary);
  outline-offset: -2px;
}

.notice-container-text {
  flex: 1;
  min-width: 0;
  line-height: 1.5715;
  color: var(--el-text-color-primary);
}

.notice-text-title {
  margin-block-end: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 14px;
  white-space: nowrap;
}

.notice-container:not(:disabled):hover .notice-text-title {
  color: var(--el-color-primary);
}

.notice-text-datetime {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.notice-footer {
  display: flex;
  justify-content: space-between;
  padding: 4px;
  border-top: 1px solid var(--el-border-color-light);
}
</style>
