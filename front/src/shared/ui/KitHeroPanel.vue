<script setup lang="ts">
import { computed } from 'vue'
import BrushSplash from '@ui/BrushSplash.vue'
import Button from '@ui/Button.vue'

const props = withDefaults(
  defineProps<{
    label?: string
    mediaLabel?: string
    mediaSrc?: string
    /** Sin foto real: no usa la imagen de demo del kit. */
    blankMedia?: boolean
    title?: string
    km?: string
    cupo?: string
    fecha?: string
    splash?: string
    ctaLabel?: string
    ctaHref?: string
    ctaTo?: string
  }>(),
  {
    label: 'Corte del día · Parchese',
    mediaLabel: 'Foto de ruta',
    blankMedia: false,
    title: 'Rodada Anapoima :)',
    km: '—',
    cupo: '—',
    fecha: '—',
    splash: 'Próximamente',
    ctaLabel: 'Parchese aquí',
    ctaHref: '#producto',
  },
)

const mediaStyle = computed(() => {
  if (props.mediaSrc) return { backgroundImage: `url("${props.mediaSrc}")` }
  if (props.blankMedia) {
    return {
      backgroundImage: 'none',
      backgroundColor: '#001028',
    }
  }
  return undefined
})
</script>

<template>
  <span class="kit-hero__panel-label">{{ label }}</span>
  <div class="kit-hero__panel-media" :style="mediaStyle">
    <span>{{ mediaLabel }}</span>
  </div>
  <div class="kit-hero__panel-title">
    <p class="type-brush-dry type-brush-dry--blue type-brush-dry--card">
      <span class="kit-hero__panel-title-pulse">{{ title }}</span>
    </p>
  </div>
  <div class="kit-hero__panel-stats">
    <div class="kit-hero__stat">
      <strong>{{ km }}</strong>
      <span>Km</span>
    </div>
    <div class="kit-hero__stat">
      <strong>{{ cupo }}</strong>
      <span>Cupo</span>
    </div>
    <div class="kit-hero__stat">
      <strong>{{ fecha }}</strong>
      <span>Fecha</span>
    </div>
  </div>
  <div class="kit-hero__panel-foot">
    <div class="kit-hero__panel-splash">
      <BrushSplash :label="splash" tone="white" size="sm" style="margin:0" />
    </div>
    <Button v-if="ctaTo" variant="ghost" size="sm" :to="ctaTo">{{ ctaLabel }}</Button>
    <Button v-else variant="ghost" size="sm" :href="ctaHref">{{ ctaLabel }}</Button>
  </div>
</template>
