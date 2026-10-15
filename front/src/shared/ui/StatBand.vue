<script setup lang="ts">
export type StatBandItem = {
  readonly value: string | number
  readonly label: string
}

withDefaults(
  defineProps<{
    items: readonly StatBandItem[]
    title?: string
    kicker?: string
    lead?: string
    mascotSrc?: string
    tone?: 'navy' | 'blue' | 'armargura'
  }>(),
  { tone: 'navy' },
)
</script>

<template>
  <section
    class="poster stat-band"
    :class="[`poster--${tone}`, { 'has-mascot': Boolean(mascotSrc) }]"
    :aria-label="title"
  >
    <img v-if="mascotSrc" class="poster__mascot" :src="mascotSrc" alt="" aria-hidden="true" loading="lazy" />
    <div v-if="title || kicker || lead || $slots.default" class="stat-band__copy">
      <span v-if="kicker" class="board-kicker">{{ kicker }}</span>
      <h2 v-if="title" class="stat-band__title type-brush-dry type-brush-dry--xs">{{ title }}</h2>
      <p v-if="lead" class="hub-meta">{{ lead }}</p>
      <slot />
    </div>
    <dl class="hub-stats hub-stats--dl stat-band__stats">
      <div v-for="item in items" :key="item.label" class="hub-stat">
        <dt><span>{{ item.label }}</span></dt>
        <dd><strong>{{ item.value }}</strong></dd>
      </div>
    </dl>
  </section>
</template>
