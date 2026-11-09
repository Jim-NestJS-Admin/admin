<script setup lang="ts">
import CrudPage from '@/components/Crud/CrudPage.vue';
import { generatedCrud } from '@/platform/generated-crud';
const { port, permissions } = generatedCrud({{operationPrefixJson}}, {{resourceJson}});
</script>

<template>
  <div class="generated-page">
    <CrudPage :port="port" :permissions="permissions" :page-key="{{pageKeyExpression}}" />
  </div>
</template>

<style scoped>
.generated-page { height: calc(100vh - 160px); min-height: 280px; }
</style>
