<script setup lang="ts">
defineProps<{
  label: string
}>()
</script>

<template>
  <button type="button" class="paola-fab" :aria-label="label">
    <slot>{{ label }}</slot>
  </button>
</template>
