<script setup lang="ts">
defineProps<{
  title: string
  copy: string
}>()
</script>

<template>
  <div class="emergency-strip">
    <strong>{{ title }}</strong>
    {{ copy }}
  </div>
</template>
