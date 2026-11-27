<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import {
  addWorkflowBranch,
  copy,
  type Node,
  type Field,
  type Branch
} from "./model";
import ResourceSelect from "./ResourceSelect.vue";
import ConditionEditor from "./ConditionEditor.vue";
const props = defineProps<{
  modelValue: Node;
  fields: Field[];
  formDefinitionId: string;
  formLabel: string;
  formState: "loading" | "ready" | "unavailable" | "error";
  initialTab: "approval" | "fields";
  blockedMembers?: Record<string, string>;
  readonly?: boolean;
}>();
const emit = defineEmits<{
  "update:modelValue": [value: Node];
  "bind-form": [];
  "retry-form": [];
}>();
const tab = ref<string | number>(props.initialTab);
const { t } = useI18n();
function set(change: Partial<Node>) {
  emit("update:modelValue", { ...copy(props.modelValue), ...change });
}
function branch(index: number, change: Partial<Branch>) {
  const branches = copy(props.modelValue.branches ?? []);
  Object.assign(branches[index], change);
  set({ branches });
}
function addBranch() {
  const node = copy(props.modelValue);
  addWorkflowBranch(
    node,
    `${t("workflow.branch")} ${(node.branches?.length ?? 0) + 1}`,
    props.fields[0]?.field ?? ""
  );
  emit("update:modelValue", node);
}
function removeBranch(index: number) {
  const branches = copy(props.modelValue.branches ?? []);
  branches.splice(index, 1);
  set({ branches });
}
function fieldState(key: string, state: string) {
  const fieldPermissions = copy(props.modelValue.fieldPermissions ?? {});
  if (state === "normal") delete fieldPermissions[key];
  else
    fieldPermissions[key] = state as NonNullable<
      Node["fieldPermissions"]
    >[string];
  set({ fieldPermissions });
}
</script>
<template>
  <div class="node-settings">
    <el-tabs
      v-if="modelValue.type === 'approve' || modelValue.type === 'copy'"
      v-model="tab"
      stretch
    >
      <el-tab-pane name="approval" :label="t('workflow.approvalSettings')">
        <el-form label-position="top" :disabled="readonly">
          <el-form-item :label="t('workflow.nodeName')" required
            ><el-input
              :model-value="modelValue.name"
              maxlength="50"
              show-word-limit
              @update:model-value="set({ name: $event })"
          /></el-form-item>
          <el-form-item :label="t('workflow.actorSource')" required
            ><el-select
              :model-value="modelValue.actor?.type"
              @update:model-value="
                set({
                  actor: {
                    type: $event,
                    ...(['users', 'roles'].includes($event) ? { ids: [] } : {}),
                    ...(['supervisor', 'department_leader'].includes($event)
                      ? { level: 1 }
                      : {})
                  }
                })
              "
              ><el-option
                v-for="kind in [
                  'users',
                  'roles',
                  'department_leader',
                  'supervisor',
                  'self_select',
                  'applicant'
                ]"
                :key="kind"
                :value="kind"
                :label="t(`workflow.actors.${kind}`)" /></el-select
          ></el-form-item>
          <el-form-item
            v-if="
              modelValue.actor &&
              ['users', 'roles'].includes(modelValue.actor.type)
            "
            :label="t('workflow.people')"
            required
            ><ResourceSelect
              :kind="modelValue.actor.type === 'roles' ? 'roles' : 'users'"
              :model-value="modelValue.actor.ids ?? []"
              multiple
              :disabled="readonly"
              :blocked-members="
                modelValue.type === 'approve' ? blockedMembers : undefined
              "
              show-avatars
              @update:model-value="
                set({
                  actor: { ...modelValue.actor!, ids: $event as string[] }
                })
              "
          /></el-form-item>
          <el-form-item
            v-if="
              modelValue.actor &&
              ['supervisor', 'department_leader'].includes(
                modelValue.actor.type
              )
            "
            :label="t('workflow.level')"
            ><el-input-number
              :model-value="modelValue.actor.level ?? 1"
              :min="1"
              :max="10"
              @update:model-value="
                set({ actor: { ...modelValue.actor!, level: $event ?? 1 } })
              "
          /></el-form-item>
          <template v-if="modelValue.type === 'approve'">
            <el-form-item :label="t('workflow.approvalMode')"
              ><el-select
                :model-value="modelValue.mode"
                @update:model-value="set({ mode: $event })"
                ><el-option
                  v-for="kind in ['sequential', 'all', 'any']"
                  :key="kind"
                  :value="kind"
                  :label="t(`workflow.modes.${kind}`)" /></el-select
            ></el-form-item>
          </template>
        </el-form>
      </el-tab-pane>
      <el-tab-pane name="fields" :label="t('workflow.formFieldPermissions')">
        <div v-if="!formDefinitionId" class="form-context">
          <el-alert
            :title="t('workflow.noBoundForm')"
            type="info"
            :closable="false"
          />
          <el-button
            v-if="!readonly"
            link
            type="primary"
            @click="emit('bind-form')"
          >
            {{ t("workflow.formVersion") }}
          </el-button>
        </div>
        <el-skeleton v-else-if="formState === 'loading'" :rows="3" animated />
        <div v-else-if="formState !== 'ready'" class="form-context">
          <el-alert
            :title="
              t(
                formState === 'error'
                  ? 'workflow.boundFormLoadError'
                  : 'workflow.boundFormUnavailable'
              )
            "
            type="warning"
            :closable="false"
          />
          <el-button
            v-if="formState === 'error'"
            link
            type="primary"
            @click="emit('retry-form')"
          >
            {{ t("workflow.retry") }}
          </el-button>
        </div>
        <template v-else>
          <p class="form-context">
            {{ t("workflow.boundForm", { form: formLabel }) }}
          </p>
          <p class="hint">{{ t("workflow.fieldPermissionHint") }}</p>
          <el-form label-position="top" :disabled="readonly">
            <el-form-item
              v-for="field in fields"
              :key="field.field"
              :label="field.title"
              ><el-select
                :model-value="
                  modelValue.fieldPermissions?.[field.field] ?? 'normal'
                "
                @update:model-value="fieldState(field.field, $event)"
                ><el-option
                  v-for="state in [
                    'normal',
                    'editable',
                    'readonly',
                    'masked',
                    'hidden'
                  ]"
                  :key="state"
                  :value="state"
                  :disabled="
                    state === 'editable' &&
                    (Boolean(field.generated) || modelValue.type === 'copy')
                  "
                  :label="t(`workflow.fields.${state}`)" /></el-select
            ></el-form-item>
          </el-form>
        </template>
      </el-tab-pane>
      <el-tab-pane
        v-if="modelValue.type === 'approve'"
        name="advanced"
        :label="t('workflow.advancedSettings')"
      >
        <el-form label-position="top" :disabled="readonly">
          <el-form-item :label="t('workflow.emptyPolicy')"
            ><el-select
              :model-value="modelValue.empty ?? 'stop'"
              @update:model-value="set({ empty: $event })"
              ><el-option
                v-for="kind in ['stop', 'pass', 'administrator']"
                :key="kind"
                :value="kind"
                :label="t(`workflow.empty.${kind}`)" /></el-select
          ></el-form-item>
          <p class="hint">{{ t("workflow.emptyPolicyHint") }}</p>
          <el-form-item :label="t('workflow.skipRepeated')"
            ><el-switch
              :model-value="modelValue.skipRepeated"
              @update:model-value="set({ skipRepeated: Boolean($event) })"
          /></el-form-item>
          <p class="hint">{{ t("workflow.skipRepeatedHint") }}</p>
          <el-form-item :label="t('workflow.timeout')"
            ><el-switch
              :model-value="Boolean(modelValue.timeout)"
              @update:model-value="
                set({
                  timeout: $event
                    ? { minutes: 60, action: 'remind' }
                    : undefined
                })
              "
          /></el-form-item>
          <el-form-item
            v-if="modelValue.timeout"
            :label="t('workflow.timeoutMinutes')"
            ><el-input-number
              :model-value="modelValue.timeout.minutes"
              :min="1"
              :max="525600"
              @update:model-value="
                set({
                  timeout: { ...modelValue.timeout!, minutes: $event ?? 1 }
                })
              "
          /></el-form-item>
          <el-form-item
            v-if="modelValue.timeout"
            :label="t('workflow.timeoutAction')"
            ><el-select
              :model-value="modelValue.timeout.action"
              @update:model-value="
                set({ timeout: { ...modelValue.timeout!, action: $event } })
              "
              ><el-option
                value="remind"
                :label="t('workflow.remind')" /><el-option
                value="supervisor"
                :label="t('workflow.transferSupervisor')" /></el-select
          ></el-form-item>
          <p class="hint">{{ t("workflow.timeoutHint") }}</p>
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <el-form v-else label-position="top" :disabled="readonly">
      <el-form-item :label="t('workflow.nodeName')" required
        ><el-input
          :model-value="modelValue.name"
          maxlength="50"
          show-word-limit
          @update:model-value="set({ name: $event })"
      /></el-form-item>
      <template v-if="modelValue.branches">
        <section
          v-for="(b, i) in modelValue.branches"
          :key="b.id"
          class="branch-settings"
        >
          <el-form-item
            :label="
              b.default ? t('workflow.defaultBranch') : t('workflow.branchName')
            "
            required
            ><el-input
              :model-value="b.name"
              maxlength="50"
              @update:model-value="branch(i, { name: $event })"
          /></el-form-item>
          <ConditionEditor
            v-if="b.condition"
            :model-value="b.condition"
            :fields="fields"
            :disabled="readonly"
            @update:model-value="branch(i, { condition: $event })"
          />
          <el-button
            v-if="!b.default"
            link
            type="danger"
            :disabled="readonly || modelValue.branches.length <= 2"
            @click="removeBranch(i)"
            >{{ t("workflow.removeBranch") }}</el-button
          >
        </section>
        <el-button
          :disabled="readonly || modelValue.branches.length >= 10"
          @click="addBranch"
          >{{ t("workflow.addBranch") }}</el-button
        >
      </template>
    </el-form>
  </div>
</template>
<style scoped>
.node-settings :deep(.el-select),
.node-settings :deep(.el-input-number) {
  width: 100%;
}

.branch-settings {
  padding: 12px 0;
  border-top: 1px solid var(--el-border-color-lighter);
}

.form-context {
  margin-bottom: 12px;
}

.hint {
  margin-bottom: 16px;
  font-size: 12px;
  line-height: 1.6;
  color: var(--el-text-color-secondary);
}
</style>
