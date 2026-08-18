<script setup lang="ts">
defineProps<{
  tone?: 'notice' | 'offline' | 'consent'
}>()
</script>

<template>
  <div class="paola-notice" :class="`paola-notice--${tone ?? 'notice'}`">
    <slot />
  </div>
</template>
