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
    visible.value = false;
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
    <el-popover
      v-model:visible="visible"
      trigger="click"
      placement="bottom-end"
      :width="320"
      @show="load"
    >
      <template #reference>
        <button
          v-bind="$attrs"
          type="button"
          class="notice-trigger navbar-bg-hover"
          :aria-expanded="visible"
          :aria-label="
            counts.unread
              ? t('notifications.unread', { count: counts.unread })
              : t('notifications.inbox')
          "
        >
          <el-badge :value="counts.unread" :max="99" :hidden="!counts.unread">
            <BellIcon aria-hidden="true" />
          </el-badge>
        </button>
      </template>
      <p class="notice-title">{{ t("notifications.inbox") }}</p>
      <el-alert v-if="error" :title="t(error)" type="error" :closable="false" />
      <el-scrollbar v-loading="busy" max-height="320px">
        <ul v-if="messages.length" class="notice-list">
          <li v-for="message in messages" :key="message.id">
            <button
              class="notice-row"
              :class="{ 'notice-row-unread': message.readAt === null }"
              type="button"
              :disabled="busy || !canRead || !message.instanceId"
              @click="open(message)"
            >
              <span class="notice-message-title">{{
                message.title || t("notifications.open")
              }}</span>
              <span class="notice-time">{{ date(message.createdAt) }}</span>
            </button>
          </li>
        </ul>
        <el-empty
          v-else-if="!busy && !error"
          :image-size="48"
          :description="t('status.pureNoMessage')"
        />
      </el-scrollbar>
      <router-link
        to="/notify/message"
        class="notice-view-all"
        @click="visible = false"
      >
        {{ t("notifications.viewAll") }}
      </router-link>
    </el-popover>
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

<style scoped>
.notice-trigger {
  display: grid;
  place-items: center;
  width: 40px;
  height: 48px;
  color: inherit;
  cursor: pointer;
}

.notice-trigger svg {
  display: block;
  font-size: 18px;
}

.notice-title {
  margin-block-end: 8px;
  font-weight: 600;
}

.notice-list {
  margin: 0;
  list-style: none;
}

.notice-row {
  display: grid;
  gap: 4px;
  width: 100%;
  padding: 8px;
  text-align: start;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.notice-row:not(:disabled):hover {
  cursor: pointer;
  background: var(--el-fill-color-light);
}

.notice-row-unread .notice-message-title {
  font-weight: 600;
}

.notice-time {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.notice-view-all {
  display: block;
  margin-block-start: 8px;
  color: var(--el-color-primary);
  text-align: center;
}
</style>
