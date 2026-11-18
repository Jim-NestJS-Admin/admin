<script setup lang="ts">
import CrudPage from "@/components/Crud/CrudPage.vue";
import { generatedCrud } from "@/platform/generated-crud";
const { port, permissions } = generatedCrud("orderTest", "order:test");
</script>

<template>
  <div class="generated-page">
    <CrudPage
      :port="port"
      :permissions="permissions"
      :page-key="'order/test'"
    />
  </div>
</template>
