<script setup lang="ts">
defineProps<{
  handle: string
}>()
</script>

<template>
  <span class="mention-chip">@{{ handle }}</span>
</template>
