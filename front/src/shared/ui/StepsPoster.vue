<script setup lang="ts">
import BrushText from '@ui/BrushText.vue'

withDefaults(
  defineProps<{
    title: string
    kicker?: string
    lead?: string
    steps?: readonly string[]
    mascotSrc?: string
    tone?: 'navy' | 'blue' | 'armargura'
    /** Pasos en fila y mascota grande: vacíos de página completa. */
    wide?: boolean
  }>(),
  { tone: 'navy', wide: false },
)
</script>

<template>
  <section
    class="poster steps-poster"
    :class="[`poster--${tone}`, { 'has-mascot': Boolean(mascotSrc), 'steps-poster--wide': wide }]"
    :aria-label="title"
  >
    <img v-if="mascotSrc" class="poster__mascot" :src="mascotSrc" alt="" aria-hidden="true" loading="lazy" />
    <div class="poster__copy">
      <span v-if="kicker" class="board-kicker">{{ kicker }}</span>
      <h3 class="type-brush-dry type-brush-dry--xs"><BrushText :text="title" /></h3>
      <p v-if="lead">{{ lead }}</p>
    </div>
    <ol v-if="steps?.length" class="steps-poster__steps">
      <li v-for="(step, index) in steps" :key="step">
        <span class="steps-poster__n" aria-hidden="true">{{ String(index + 1).padStart(2, '0') }}</span>
        <span>{{ step }}</span>
      </li>
    </ol>
    <div v-if="$slots.default" class="steps-poster__actions">
      <slot />
    </div>
  </section>
</template>
