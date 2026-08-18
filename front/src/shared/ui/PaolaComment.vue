<script setup lang="ts">
defineProps<{
  author: string
  body: string
}>()
</script>

<template>
  <div class="paola-comment">
    <strong>{{ author }}</strong>
    <p>{{ body }}</p>
  </div>
</template>
