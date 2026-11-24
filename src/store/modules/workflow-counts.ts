import { computed, ref, watch } from "vue";
import { defineStore } from "pinia";
import { api } from "@/api/client";
import { permission } from "@/platform/system/resources";
import { onSessionReset } from "@/platform/lifecycle";
import { useUserStoreHook } from "./user";

export const useWorkflowCounts = defineStore("workflow-counts", () => {
  const user = useUserStoreHook();
  const unread = ref(0);
  const pending = ref(0);
  const pendingByPath = computed(() => ({
    "/workflow/instance": pending.value
  }));
  const requests = new Map<string, AbortController>();

  function reset() {
    requests.forEach(request => request.abort());
    requests.clear();
    unread.value = pending.value = 0;
  }

  async function update(
    count: typeof unread,
    operation: "notifyMessageUnread" | "workflowTaskPage",
    read: (signal: AbortSignal) => Promise<number>
  ) {
    requests.get(operation)?.abort();
    if (
      !user.isAuthenticated ||
      !user.permissions.includes(permission(operation))
    ) {
      count.value = 0;
      return;
    }
    const request = new AbortController();
    requests.set(operation, request);
    try {
      const value = await read(request.signal);
      if (!request.signal.aborted) count.value = value;
    } catch {
      // 暂时失败时沿用上次成功的数量，下一轮重新读取。
    } finally {
      if (requests.get(operation) === request) requests.delete(operation);
    }
  }

  const refreshUnread = () =>
    update(
      unread,
      "notifyMessageUnread",
      async signal => (await api.notifyMessageUnread({}, { signal })).data.count
    );
  const refreshPending = () =>
    update(
      pending,
      "workflowTaskPage",
      async signal =>
        (
          await api.workflowTaskPage(
            {
              body: {
                page: 1,
                size: 1,
                eq: { kind: "approve", status: "pending" }
              }
            },
            { signal }
          )
        ).data.total
    );
  function refresh() {
    void refreshUnread();
    void refreshPending();
  }

  watch(
    () => [
      user.epoch,
      user.userId,
      user.organizationId,
      user.isAuthenticated,
      user.permissions
    ],
    () => {
      reset();
      refresh();
    }
  );
  onSessionReset(reset);

  return { unread, pendingByPath, refresh, refreshUnread, refreshPending };
});
