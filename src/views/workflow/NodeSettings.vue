<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { copy, uid, type Node, type Field, type Branch } from "./model";
import ResourceSelect from "./ResourceSelect.vue";
import ConditionEditor from "./ConditionEditor.vue";
const props = defineProps<{
  modelValue: Node;
  fields: Field[];
  readonly?: boolean;
}>();
const emit = defineEmits<{ "update:modelValue": [value: Node] }>();
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
  const branches = copy(props.modelValue.branches ?? []);
  const b: Branch = {
    id: uid(),
    name: `${t("workflow.branch")} ${branches.length + 1}`,
    nodes: []
  };
  if (props.modelValue.type === "condition") {
    b.condition = {
      source: "field",
      field: props.fields[0]?.field ?? "",
      operator: "eq",
      value: ""
    };
    branches.splice(branches.length - 1, 0, b);
  } else branches.push(b);
  set({ branches });
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
  <el-form label-position="top" :disabled="readonly" class="node-settings">
    <el-form-item :label="t('workflow.nodeName')" required
      ><el-input
        :model-value="modelValue.name"
        maxlength="50"
        show-word-limit
        @update:model-value="set({ name: $event })"
    /></el-form-item>
    <template v-if="modelValue.actor">
      <el-form-item :label="t('workflow.actorSource')" required
        ><el-select
          :model-value="modelValue.actor.type"
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
        v-if="['users', 'roles'].includes(modelValue.actor.type)"
        :label="t('workflow.people')"
        required
        ><ResourceSelect
          :kind="modelValue.actor.type === 'roles' ? 'roles' : 'users'"
          :model-value="modelValue.actor.ids ?? []"
          multiple
          :disabled="readonly"
          @update:model-value="
            set({ actor: { ...modelValue.actor!, ids: $event as string[] } })
          "
      /></el-form-item>
      <el-form-item
        v-if="
          ['supervisor', 'department_leader'].includes(modelValue.actor.type)
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
      <el-form-item
        v-if="modelValue.type === 'approve'"
        :label="t('workflow.emptyPolicy')"
        ><el-select
          :model-value="modelValue.empty ?? 'stop'"
          @update:model-value="set({ empty: $event })"
          ><el-option
            v-for="kind in ['stop', 'pass', 'administrator']"
            :key="kind"
            :value="kind"
            :label="t(`workflow.empty.${kind}`)" /></el-select
      ></el-form-item>
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
        <el-form-item :label="t('workflow.skipRepeated')"
          ><el-switch
            :model-value="modelValue.skipRepeated"
            @update:model-value="set({ skipRepeated: Boolean($event) })"
        /></el-form-item>
        <el-form-item :label="t('workflow.timeout')"
          ><el-switch
            :model-value="Boolean(modelValue.timeout)"
            @update:model-value="
              set({
                timeout: $event ? { minutes: 60, action: 'remind' } : undefined
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
              set({ timeout: { ...modelValue.timeout!, minutes: $event ?? 1 } })
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
      </template>
      <el-divider content-position="left">{{
        t("workflow.fieldPermissions")
      }}</el-divider>
      <p class="hint">{{ t("workflow.fieldPermissionHint") }}</p>
      <el-form-item
        v-for="field in fields"
        :key="field.field"
        :label="field.title"
        ><el-select
          :model-value="modelValue.fieldPermissions?.[field.field] ?? 'normal'"
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
    </template>
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

.hint {
  margin-bottom: 16px;
  font-size: 12px;
  line-height: 1.6;
  color: var(--el-text-color-secondary);
}
</style>
