<script setup lang="ts">
defineProps<{
  title: string
  copy: string
}>()
</script>

<template>
  <div class="announce-bar">
    <strong>{{ title }}</strong>
    <span>{{ copy }}</span>
    <slot />
  </div>
</template>
