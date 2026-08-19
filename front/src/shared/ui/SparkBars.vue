<script setup lang="ts">
defineProps<{
  heights: readonly string[]
}>()
</script>

<template>
  <div class="spark-bars" aria-hidden="true">
    <span v-for="(height, index) in heights" :key="index" :style="{ height }" />
  </div>
</template>
