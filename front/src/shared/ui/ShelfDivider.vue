<script setup lang="ts">
defineProps<{
  label: string
  collab?: boolean
}>()
</script>

<template>
  <div class="shelf-divider" :class="{ 'shelf-divider--collab': collab }">{{ label }}</div>
</template>
