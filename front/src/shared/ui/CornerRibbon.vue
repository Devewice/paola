<script setup lang="ts">
defineProps<{
  title: string
  copy?: string
}>()
</script>

<template>
  <div class="corner-ribbon">
    <strong>{{ title }}</strong>
    <p v-if="copy" class="meta" style="margin:6px 0 0">{{ copy }}</p>
  </div>
</template>
