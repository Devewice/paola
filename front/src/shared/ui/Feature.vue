<script setup lang="ts">
defineProps<{
  icon: string
  title: string
  copy: string
}>()
</script>

<template>
  <div class="feature">
    <div class="feature__icon">{{ icon }}</div>
    <strong>{{ title }}</strong>
    <span>{{ copy }}</span>
  </div>
</template>
