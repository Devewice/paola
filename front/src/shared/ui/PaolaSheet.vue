<script setup lang="ts">
defineProps<{
  title: string
}>()
</script>

<template>
  <div class="paola-sheet" role="dialog" :aria-label="title">
    <p class="paola-empty__kicker">{{ title }}</p>
    <slot />
  </div>
</template>
