<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import type { VoiceId } from '@shared/theme/voices.ts'
import BrushText from '@ui/BrushText.vue'
import VoiceBadge from '@ui/VoiceBadge.vue'

const props = withDefaults(
  defineProps<{
    title: string
    cta: string
    to?: string
    href?: string
    index?: string
    kicker?: string
    voice?: VoiceId
    imageSrc?: string
    mascotSrc?: string
    tone?: 'navy' | 'blue' | 'armargura'
    /** `hero`: dos filas en escritorio · `wide`: todo el ancho · `compact`: tira de filtros. */
    size?: 'base' | 'hero' | 'wide' | 'compact'
    /** Sin `to` ni `href` es un botón de alternar; `pressed` marca el estado. */
    pressed?: boolean
  }>(),
  { tone: 'navy', size: 'base', pressed: undefined },
)

const bgStyle = computed(() => (props.imageSrc ? { backgroundImage: `url("${props.imageSrc}")` } : undefined))
const tag = computed(() => (props.to ? RouterLink : props.href ? 'a' : 'button'))
const linkAttrs = computed(() => {
  if (props.to) return { to: props.to }
  if (props.href) return { href: props.href, target: '_blank', rel: 'noopener noreferrer' }
  return { type: 'button', 'aria-pressed': props.pressed }
})
</script>

<template>
  <component
    :is="tag"
    v-bind="linkAttrs"
    :aria-label="`${title}: ${cta}`"
    class="hub-tile"
    :class="[
      `hub-tile--${imageSrc ? 'photo' : tone}`,
      `hub-tile--${size}`,
      { 'has-mascot': Boolean(mascotSrc), 'is-on': pressed },
    ]"
  >
    <span v-if="imageSrc" class="hub-tile__bg" :style="bgStyle" aria-hidden="true" />
    <img v-if="mascotSrc" class="hub-tile__mascot" :src="mascotSrc" alt="" aria-hidden="true" loading="lazy" />

    <span v-if="index || voice" class="hub-tile__top">
      <span v-if="index" class="hub-tile__index">{{ index }}</span>
      <VoiceBadge v-if="voice" :voice="voice" />
    </span>

    <span class="hub-tile__body">
      <span v-if="kicker" class="hub-tile__kicker">{{ kicker }}</span>
      <span class="hub-tile__title type-brush-dry type-brush-dry--xs"><BrushText :text="title" /></span>
      <slot />
    </span>

    <span class="hub-tile__cta">
      {{ cta }}
      <span class="hub-tile__arrow" aria-hidden="true">→</span>
    </span>
  </component>
</template>
