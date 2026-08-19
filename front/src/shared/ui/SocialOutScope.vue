<script setup lang="ts">
defineProps<{
  style?: string | Record<string, string>
}>()
</script>

<template>
  <div class="social-out-scope" :style="style">
    <slot />
  </div>
</template>
