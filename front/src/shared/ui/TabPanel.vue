<script setup lang="ts">
defineProps<{
  show?: boolean
}>()
</script>

<template>
  <div v-show="show" class="tab-panel">
    <slot />
  </div>
</template>
