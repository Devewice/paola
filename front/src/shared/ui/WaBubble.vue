<script setup lang="ts">
defineProps<{
  body: string
  meta?: string
}>()
</script>

<template>
  <div class="wa-bubble">
    {{ body }}
    <p v-if="meta" class="wa-bubble__meta">{{ meta }}</p>
  </div>
</template>
