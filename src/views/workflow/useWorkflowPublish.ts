import { ElMessage, ElMessageBox } from "element-plus";
import { useI18n } from "vue-i18n";
import { api, type OperationBody } from "@/api/client";
import type { useRequestScope } from "./model";

export function useWorkflowPublish(
  run: ReturnType<typeof useRequestScope>["run"]
) {
  const { t } = useI18n();
  return (body: OperationBody<"workflowDefinitionPublish">) =>
    run(async (signal, key) => {
      const confirmed = await ElMessageBox.confirm(
        t("workflow.publishConfirm"),
        t("workflow.publish"),
        { type: "warning" }
      ).then(
        () => true,
        () => false
      );
      if (!confirmed || signal.aborted) return false;
      await api.workflowDefinitionPublish(
        { body },
        { signal, headers: { "Idempotency-Key": key(body) } }
      );
      if (signal.aborted) return false;
      ElMessage.success(t("workflow.published"));
      return true;
    });
}
