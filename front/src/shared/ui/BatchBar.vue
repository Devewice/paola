<script setup lang="ts">
defineProps<{
  count: string
  visible?: boolean
}>()
</script>

<template>
  <div v-if="visible !== false" class="batch-bar">
    <span>{{ count }}</span>
    <slot />
  </div>
</template>
