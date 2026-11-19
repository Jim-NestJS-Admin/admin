<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { api } from "@/api/client";
import { permission } from "@/platform/system/resources";
import { useUserStoreHook } from "@/store/modules/user";
import { RequestFailure } from "@/utils/http";
import WorkflowEditor from "./WorkflowEditor.vue";
import type { Definition } from "./model";

defineOptions({ name: "WorkflowDesignPage" });
const route = useRoute();
const router = useRouter();
const user = useUserStoreHook();
const { t } = useI18n();
const mode = computed(() =>
  route.name === "WorkflowCreate"
    ? "create"
    : route.name === "WorkflowRevise"
      ? "revise"
      : "view"
);
const id = computed(() =>
  typeof route.params.id === "string" ? route.params.id : undefined
);
const allowed = computed(
  () =>
    (mode.value === "create" ||
      user.permissions.includes(permission("workflowDefinitionInfo"))) &&
    (mode.value === "view" ||
      user.permissions.includes(
        permission(
          mode.value === "create"
            ? "workflowDefinitionAdd"
            : "workflowDefinitionRevise"
        )
      ))
);
const record = ref<Definition>();
const error = ref("");
watch(
  () => [mode.value, id.value, allowed.value, user.epoch] as const,
  async ([mode, id, canOpen], _, onCleanup) => {
    record.value = undefined;
    error.value = "";
    if (!canOpen || mode === "create") return;
    if (!id || !/^[1-9]\d{0,19}$/.test(id)) {
      error.value = "crud.recordUnavailable";
      return;
    }
    const request = new AbortController();
    onCleanup(() => request.abort());
    try {
      const result = await api.workflowDefinitionInfo(
        { body: { id } },
        { signal: request.signal }
      );
      if (request.signal.aborted) return;
      if (result.data.designer) record.value = result.data;
      else error.value = "workflow.designHidden";
    } catch (reason) {
      if (!request.signal.aborted)
        error.value =
          reason instanceof RequestFailure
            ? reason.message
            : "crud.requestFailed";
    }
  },
  { immediate: true }
);
function back() {
  void router.replace("/workflow/definition");
}
</script>

<template>
  <WorkflowEditor
    v-if="allowed && (mode === 'create' || record)"
    :key="`${mode}:${id ?? ''}:${user.epoch}`"
    :mode="mode"
    :record="record ?? null"
    @close="back"
    @saved="back"
  />
  <el-card v-else shadow="never">
    <el-page-header @back="back">
      <template #content>{{ t("workflow.viewDefinition") }}</template>
    </el-page-header>
    <el-empty
      v-if="!allowed || error"
      :description="t(error || 'menus.pureAccessDenied')"
    />
    <el-skeleton v-else :rows="4" animated />
  </el-card>
</template>
