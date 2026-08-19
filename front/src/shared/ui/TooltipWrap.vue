<script setup lang="ts">
defineProps<{
  tip: string
}>()
</script>

<template>
  <span class="tooltip-wrap" :data-tip="tip" tabindex="0">
    <slot />
  </span>
</template>
