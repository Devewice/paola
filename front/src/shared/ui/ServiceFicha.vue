<script setup lang="ts">
defineProps<{
  voiceLabel?: string
  title: string
  copy?: string
  steps: readonly string[]
  note?: string
}>()
</script>

<template>
  <div class="service-ficha">
    <span class="voice-badge voice-badge--loigca">{{ voiceLabel ?? 'Servicio · no producto' }}</span>
    <h4 style="margin:8px 0 0">{{ title }}</h4>
    <p v-if="copy" class="meta" style="margin:0">{{ copy }}</p>
    <ol class="service-steps">
      <li v-for="step in steps" :key="step">{{ step }}</li>
    </ol>
    <p v-if="note" class="meta" style="margin-top:12px" v-html="note" />
  </div>
</template>
