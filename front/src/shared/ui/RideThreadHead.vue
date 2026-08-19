<script setup lang="ts">
defineProps<{
  title: string
  meta?: string
}>()
</script>

<template>
  <div class="ride-thread-head">
    <div><strong>{{ title }}</strong><template v-if="meta"> · {{ meta }}</template></div>
    <slot />
  </div>
</template>
