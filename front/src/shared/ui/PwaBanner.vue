<script setup lang="ts">
defineProps<{
  title: string
  copy: string
}>()
</script>

<template>
  <div class="pwa-banner">
    <div class="pwa-banner__icon">P</div>
    <div style="flex: 1">
      <strong>{{ title }}</strong>
      <p class="meta" style="margin: 4px 0 0">{{ copy }}</p>
    </div>
    <slot />
  </div>
</template>
