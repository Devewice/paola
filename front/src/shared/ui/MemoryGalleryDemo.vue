<script setup lang="ts">
import VoiceBadge from '@ui/VoiceBadge.vue'
</script>

<template>
  <VoiceBadge voice="incauta" />
  <div class="gallery" style="margin-top: 12px">
    <div
      v-for="label in ['Foto', 'Foto', '+']"
      :key="label"
      class="gallery__thumb"
      style="display: grid; place-items: center; font-size: 11px; color: var(--muted)"
    >
      {{ label }}
    </div>
  </div>
  <p class="meta" style="margin-top: 12px">
    <VoiceBadge voice="armargura" />
    Cierre emocional placeholder si hubo algo que decir.
  </p>
</template>
