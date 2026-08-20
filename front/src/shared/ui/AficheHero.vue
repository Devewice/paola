<script setup lang="ts">
import { computed, useSlots } from 'vue'

const props = withDefaults(
  defineProps<{
    kicker: string
    title: string
    plate?: string
    logo?: boolean
    photoSrc?: string
  }>(),
  { logo: false },
)

const slots = useSlots()

const titleParts = computed(() => {
  const parts = props.title.trim().split(/\s+/)
  if (parts.length === 2) return { main: parts[0], accent: parts[1] }
  return { main: props.title, accent: '' }
})

const photoStyle = computed(() =>
  props.photoSrc ? { backgroundImage: `url("${props.photoSrc}")` } : undefined,
)

const hasPanel = computed(() => Boolean(slots.panel))
</script>

<template>
  <header
    class="kit-hero kit-hero--classic kit-hero--page"
    :class="{ 'has-photo': Boolean(photoSrc), 'kit-hero--split': hasPanel }"
  >
    <div class="kit-hero__bg" aria-hidden="true">
      <div class="kit-hero__photo" :style="photoStyle" />
      <div class="kit-hero__veil" />
    </div>
    <div class="kit-hero__glow" aria-hidden="true" />

    <div class="kit-hero__inner" :class="{ 'kit-hero__inner--split': hasPanel }">
      <div class="kit-hero__main">
        <div class="kit-hero__top">
          <img
            v-if="logo"
            class="kit-hero__logo"
            src="/logo.png"
            alt="Paola — Rodando con propósito"
            width="120"
            height="120"
          />
          <div class="kit-hero__titles">
            <p class="type-brush-script">{{ kicker }}</p>
            <div class="kit-hero__brush-line">
              <p class="type-brush-dry type-brush-dry--sm">{{ titleParts.main }}</p>
              <p
                v-if="titleParts.accent"
                class="type-brush-dry type-brush-dry--blue type-brush-dry--sm"
              >
                {{ titleParts.accent }}
              </p>
            </div>
            <p
              v-if="plate"
              class="type-condensed type-condensed--blue"
              style="font-size: clamp(20px, 4vw, 32px); margin: 4px 0 0"
            >
              {{ plate }}
            </p>
          </div>
        </div>

        <div class="brush-divider brush-divider--thin kit-hero__divider" aria-hidden="true">
          <svg viewBox="0 0 800 12" preserveAspectRatio="none">
            <g fill="none" stroke-linecap="round">
              <path
                stroke="#0088F8"
                stroke-width="2.8"
                d="M0,6 L32,5 M42,7 L78,4 M88,6 L124,5 M134,7 L170,4 M180,6 L216,5 M226,7 L262,4 M272,6 L308,5 M318,7 L354,4 M364,6 L400,5 M410,7 L446,4 M456,6 L492,5 M502,7 L538,4 M548,6 L584,5 M594,7 L630,4 M640,6 L676,5 M686,7 L722,4 M732,6 L768,5 M778,7 L800,4"
              />
            </g>
          </svg>
        </div>

        <p v-if="$slots.lead" class="kit-hero__tagline">
          <slot name="lead" />
        </p>
        <div v-if="$slots.actions" class="kit-hero__actions">
          <slot name="actions" />
        </div>
      </div>

      <div v-if="hasPanel" class="kit-hero__side">
        <slot name="panel" />
      </div>
    </div>
  </header>
</template>
