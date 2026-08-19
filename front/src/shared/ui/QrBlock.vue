<script setup lang="ts">
defineProps<{
  title: string
  code?: string
  meta?: string
}>()
</script>

<template>
  <div class="qr-full">
    <p style="margin: 0; font-weight: 600">{{ title }}</p>
    <div class="qr-full__box">QR próximo</div>
    <p v-if="meta" class="meta" style="margin: 0; color: #666">{{ meta }}</p>
  </div>
</template>
