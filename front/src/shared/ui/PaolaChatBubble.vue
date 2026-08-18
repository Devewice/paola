<script setup lang="ts">
defineProps<{
  mine?: boolean
  body: string
}>()
</script>

<template>
  <p class="paola-chat" :class="{ 'paola-chat--me': mine }">{{ body }}</p>
</template>
