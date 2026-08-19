<script setup lang="ts">
defineProps<{
  message: string
  visible?: boolean
}>()
</script>

<template>
  <div v-if="visible !== false" class="undo-bar">
    <span>{{ message }}</span>
    <slot />
  </div>
</template>
