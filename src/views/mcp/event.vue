<script setup lang="ts">
import CrudPage from "@/components/Crud/CrudPage.vue";
import { generatedCrud } from "@/platform/generated-crud";
const generated = generatedCrud("mcpEvent");
</script>
<template><CrudPage :port="generated.port" page-key="mcp:event" /></template>
