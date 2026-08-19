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
    mediaLabel: 'Memoria de ruta · placeholder',
    title: 'Rodada',
    km: '—',
    cupo: '—',
    fecha: '—',
    splash: 'Próximamente',
    ctaLabel: 'Ver Parchese',
    ctaHref: '#producto',
  },
)

const mediaStyle = computed(() =>
  props.mediaSrc ? { backgroundImage: `url("${props.mediaSrc}")` } : undefined,
)
</script>

<template>
  <span class="kit-hero__panel-label">{{ label }}</span>
  <div class="kit-hero__panel-media" :style="mediaStyle">
    <span>{{ mediaLabel }}</span>
  </div>
  <div class="kit-hero__panel-title">
    <p class="type-brush-dry type-brush-dry--blue type-brush-dry--card">{{ title }}</p>
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
    <BrushSplash :label="splash" tone="white" size="sm" style="margin:0" />
    <Button v-if="ctaTo" variant="ghost" size="sm" :to="ctaTo">{{ ctaLabel }}</Button>
    <Button v-else variant="ghost" size="sm" :href="ctaHref">{{ ctaLabel }}</Button>
  </div>
</template>
