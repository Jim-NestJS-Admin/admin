<script setup lang="ts">
/**
 * 代码生成（开发环境）：入口是生成记录列表，新建或编辑进入六步字段创建器。
 * 设计见架构文档「代码生成器改版」；规格说明 docs/codegen-spec.md。
 */
import { ref } from "vue";
import SpecList from "./codegen/SpecList.vue";
import SpecWizard from "./codegen/SpecWizard.vue";
import type { components } from "@/api/schema";

type SpecRecord = components["schemas"]["SpecRecord"];
/** null = 列表；{ record: null } = 新建；{ record } = 编辑 */
const editing = ref<{ record: SpecRecord | null; key: number } | null>(null);
let counter = 0;
const open = (record: SpecRecord | null) =>
  (editing.value = { record, key: ++counter });
</script>

<template>
  <SpecWizard
    v-if="editing"
    :key="editing.key"
    :record="editing.record"
    @back="editing = null"
  />
  <SpecList v-else @open="open" />
</template>
