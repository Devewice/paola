<script setup lang="ts">
defineProps<{
  notes: readonly string[]
}>()
</script>

<template>
  <div class="pin-board">
    <div v-for="note in notes" :key="note" class="pin-note">{{ note }}</div>
  </div>
</template>
