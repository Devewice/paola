<script setup lang="ts">
defineProps<{
  title: string
  copy: string
}>()
</script>

<template>
  <div class="service-card">
    <h4>{{ title }}</h4>
    <p>{{ copy }}</p>
    <slot />
  </div>
</template>
