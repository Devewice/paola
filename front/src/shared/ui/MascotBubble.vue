<script setup lang="ts">
defineProps<{
  sprite?: string
  text: string
}>()
</script>

<template>
  <div class="mascot-bubble">
    <div class="mascot-bubble__sprite">{{ sprite ?? '360' }}</div>
    <div class="mascot-bubble__text">{{ text }}</div>
  </div>
</template>
