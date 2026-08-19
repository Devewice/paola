<script setup lang="ts">
defineProps<{
  title: string
  copy: string
  tone?: 'info' | 'warn'
}>()
</script>

<template>
  <div class="callout" :class="{ 'callout--warn': tone === 'warn' }">
    <div>
      <strong>{{ title }}</strong>
      {{ copy }}
    </div>
  </div>
</template>
