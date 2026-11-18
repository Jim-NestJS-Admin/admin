<script setup lang="ts">
import CrudPage from "@/components/Crud/CrudPage.vue";
import { generatedCrud } from "@/platform/generated-crud";
const generated = generatedCrud("oauthEvent");
</script>
<template><CrudPage :port="generated.port" page-key="oauth:event" /></template>
