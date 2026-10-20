<script setup lang="ts">
import { computed } from 'vue'
import BrushSplash from '@ui/BrushSplash.vue'
import BrushText from '@ui/BrushText.vue'
import Button from '@ui/Button.vue'

const emit = defineEmits<{
  'cta-hover': [hovered: boolean]
}>()

const props = withDefaults(
  defineProps<{
    label?: string
    mediaLabel?: string
    mediaSrc?: string
    /** Sin foto real: no usa la imagen de demo del kit. */
    blankMedia?: boolean
    /** Figura recortada que ocupa el cuadro cuando no hay foto. */
    mediaFigure?: string
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
  if (props.mediaFigure) {
    return {
      background: [
        `url("${props.mediaFigure}") center 30% / auto 122% no-repeat`,
        'radial-gradient(circle at 50% 45%, rgba(0, 136, 248, 0.45), transparent 62%)',
        'linear-gradient(160deg, #001028 0%, #05070c 100%)',
      ].join(', '),
    }
  }
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
  <div
    class="kit-hero__panel-media"
    :class="{ 'is-blank': blankMedia && !mediaSrc && !mediaFigure, 'is-figure': Boolean(mediaFigure && !mediaSrc) }"
    :style="mediaStyle"
  >
    <span v-if="!mediaFigure || mediaSrc">{{ mediaLabel }}</span>
  </div>
  <div class="kit-hero__panel-title">
    <p class="type-brush-dry type-brush-dry--blue type-brush-dry--card">
      <span class="kit-hero__panel-title-pulse"><BrushText :text="title" /></span>
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
    <span
      class="kit-hero__panel-cta-hit"
      @pointerenter="emit('cta-hover', true)"
      @pointerleave="emit('cta-hover', false)"
    >
      <Button v-if="ctaTo" variant="ghost" size="sm" :to="ctaTo">{{ ctaLabel }}</Button>
      <Button v-else variant="ghost" size="sm" :href="ctaHref">{{ ctaLabel }}</Button>
    </span>
  </div>
</template>
