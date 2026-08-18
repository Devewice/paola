<script setup lang="ts">
defineProps<{
  tone?: 'info' | 'ok' | 'bad' | 'warn'
}>()
</script>

<template>
  <div class="paola-alert" :class="`paola-alert--${tone ?? 'info'}`">
    <slot />
  </div>
</template>
