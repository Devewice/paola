<script setup lang="ts">
defineProps<{
  style?: string | Record<string, string>
}>()
</script>

<template>
  <div class="divider-or" :style="style">o</div>
</template>
