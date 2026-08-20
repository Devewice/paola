<script setup lang="ts">
defineProps<{
  voice?: 'loigca' | 'incauta' | 'armargura'
  title: string
  copy?: string
  officialHref?: string
  officialLabel?: string
  disclaimer?: string
}>()
</script>

<template>
  <div class="comparendo-card">
    <span v-if="voice" :class="`voice-badge voice-badge--${voice}`">Loigca</span>
    <h4 style="margin:8px 0;font-size:15px">{{ title }}</h4>
    <p v-if="copy">{{ copy }}</p>
    <a v-if="officialHref" class="edu-card__official" :href="officialHref">{{ officialLabel ?? 'Consulta oficial' }}</a>
    <p v-if="disclaimer" class="meta" style="margin:12px 0 0">{{ disclaimer }}</p>
  </div>
</template>
