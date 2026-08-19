<script setup lang="ts">
defineProps<{
  copy?: string
}>()
</script>

<template>
  <div class="loading-row">
    <span class="spinner" aria-hidden="true" />
    {{ copy ?? 'Cargando…' }}
  </div>
</template>
