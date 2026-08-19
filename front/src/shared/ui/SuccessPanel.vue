<script setup lang="ts">
defineProps<{
  title: string
  copy: string
}>()
</script>

<template>
  <div class="success-panel">
    <div class="success-panel__icon">✓</div>
    <h3>{{ title }}</h3>
    <p>{{ copy }}</p>
    <slot />
  </div>
</template>
