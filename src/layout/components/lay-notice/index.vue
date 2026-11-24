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
import BellIcon from "~icons/ep/bell";

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
const messages = ref<Message[]>([]);
const { busy, error, run } = useRequestScope();
const detail = ref<{ instanceId: string; taskId?: string }>();

async function load() {
  void counts.refreshUnread();
  await run(async signal => {
    const response = await api.notifyMessagePage(
      { body: { page: 1, size: 10 } },
      { signal }
    );
    if (!signal.aborted) messages.value = response.data.list;
  });
}

function changeVisibility(open: boolean) {
  visible.value = open;
  if (open) void load();
}

function viewAll() {
  dropdown.value?.handleClose();
  void router.push("/notify/message");
}

async function open(message: Message) {
  const { id, instanceId, taskId, event } = message;
  if (!canRead.value || !instanceId) return;
  await run(async (signal, key) => {
    const body = { id };
    await api.notifyMessageRead(
      { body },
      { signal, headers: { "Idempotency-Key": key(body) } }
    );
    if (signal.aborted) return;
    dropdown.value?.handleClose();
    void counts.refreshUnread();
    if (event === "mcp.exempt") {
      await router.push({
        path: "/automation/confirm",
        query: { operation: instanceId }
      });
    } else {
      detail.value = {
        instanceId,
        ...(taskId ? { taskId } : {})
      };
    }
  });
}

function reset() {
  dropdown.value?.handleClose();
  visible.value = false;
  messages.value = [];
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
          <el-tabs
            stretch
            class="dropdown-tabs"
            :style="{
              width: messages.length
                ? 'min(330px, calc(100vw - 24px))'
                : '200px'
            }"
          >
            <el-tab-pane :label="t('notifications.inbox')">
              <el-scrollbar v-loading="busy" max-height="330px">
                <div v-if="messages.length" class="notice-list-container">
                  <el-dropdown-item
                    v-for="message in messages"
                    :key="message.id"
                    class="notice-container"
                    :class="{ 'notice-unread': message.readAt === null }"
                    :disabled="busy || !canRead || !message.instanceId"
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
                  </el-dropdown-item>
                </div>
                <el-empty
                  v-else
                  :image-size="60"
                  :description="t('status.pureNoMessage')"
                />
              </el-scrollbar>
            </el-tab-pane>
          </el-tabs>
          <el-dropdown-item divided class="notice-view-all" @click="viewAll">
            {{ t("notifications.viewAll") }}
          </el-dropdown-item>
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

.notice-dropdown :deep(.notice-container) {
  padding: 12px 0;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.notice-dropdown :deep(.notice-container:not(.is-disabled):is(:hover, :focus)) {
  background: transparent;
}

.notice-dropdown :deep(.notice-container:focus-visible) {
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

.notice-unread .notice-text-title {
  font-weight: 600;
}

.notice-text-datetime {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.notice-view-all {
  justify-content: center;
  color: var(--el-color-primary);
}
</style>
