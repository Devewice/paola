<script setup lang="ts">
defineProps<{
  title: string
  copy?: string
}>()
</script>

<template>
  <div class="maint-card">
    <strong>{{ title }}</strong>
    <p v-if="copy" class="meta" style="margin:8px 0 0">{{ copy }}</p>
  </div>
</template>
