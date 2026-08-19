<script setup lang="ts">
defineProps<{
  tone?: 'info' | 'ok' | 'bad' | 'warn'
}>()
</script>

<template>
  <div class="alert" :class="tone === 'ok' ? 'alert-ok' : tone === 'bad' ? 'alert-bad' : 'alert-info'">
    <slot />
  </div>
</template>
