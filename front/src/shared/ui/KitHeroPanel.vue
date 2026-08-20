<script setup lang="ts">
import { computed } from 'vue'
import BrushSplash from '@ui/BrushSplash.vue'
import Button from '@ui/Button.vue'

const props = withDefaults(
  defineProps<{
    label?: string
    mediaLabel?: string
    mediaSrc?: string
    title?: string
    quote?: string
    km?: string
    cupo?: string
    fecha?: string
    kmCaption?: string
    cupoCaption?: string
    fechaCaption?: string
    splash?: string
    ctaLabel?: string
    ctaHref?: string
    ctaTo?: string
    hideMedia?: boolean
    hideStats?: boolean
    hideSplash?: boolean
  }>(),
  {
    label: 'Corte del día · Parchese',
    mediaLabel: 'Foto de ruta',
    title: 'Rodada Anapoima :)',
    km: '—',
    cupo: '—',
    fecha: '—',
    kmCaption: 'Km',
    cupoCaption: 'Cupo',
    fechaCaption: 'Fecha',
    splash: 'Próximamente',
    ctaLabel: 'Parchese aquí',
    ctaHref: '#producto',
    hideMedia: false,
    hideStats: false,
    hideSplash: false,
  },
)

const mediaStyle = computed(() =>
  props.mediaSrc ? { backgroundImage: `url("${props.mediaSrc}")` } : undefined,
)
</script>

<template>
  <span class="kit-hero__panel-label">{{ label }}</span>
  <div v-if="!hideMedia" class="kit-hero__panel-media" :style="mediaStyle">
    <span>{{ mediaLabel }}</span>
  </div>
  <div class="kit-hero__panel-title">
    <p class="type-brush-dry type-brush-dry--blue type-brush-dry--card">{{ title }}</p>
  </div>
  <p v-if="quote" class="kit-hero__panel-quote">{{ quote }}</p>
  <div v-if="!hideStats" class="kit-hero__panel-stats">
    <div class="kit-hero__stat">
      <strong>{{ km }}</strong>
      <span>{{ kmCaption }}</span>
    </div>
    <div class="kit-hero__stat">
      <strong>{{ cupo }}</strong>
      <span>{{ cupoCaption }}</span>
    </div>
    <div class="kit-hero__stat">
      <strong>{{ fecha }}</strong>
      <span>{{ fechaCaption }}</span>
    </div>
  </div>
  <div class="kit-hero__panel-foot">
    <BrushSplash v-if="!hideSplash" :label="splash" tone="white" size="sm" style="margin:0" />
    <Button v-if="ctaTo" variant="ghost" size="sm" :to="ctaTo">{{ ctaLabel }}</Button>
    <Button v-else variant="ghost" size="sm" :href="ctaHref">{{ ctaLabel }}</Button>
  </div>
</template>
