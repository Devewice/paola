<script setup lang="ts">
defineProps<{
  tone?: 'warn' | 'info'
}>()
</script>

<template>
  <div class="disclaimer-box" :class="tone === 'info' ? 'disclaimer-box--info' : 'disclaimer-box--warn'">
    <slot />
  </div>
</template>
