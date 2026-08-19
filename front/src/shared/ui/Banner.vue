<script setup lang="ts">
defineProps<{
  tone?: 'notice' | 'offline' | 'consent'
}>()
</script>

<template>
  <div
    :class="{
      'notice-bar': !tone || tone === 'notice',
      'offline-banner': tone === 'offline',
      'consent-banner': tone === 'consent',
    }"
  >
    <slot />
  </div>
</template>
