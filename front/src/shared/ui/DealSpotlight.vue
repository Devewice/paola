<script setup lang="ts">
import Button from '@ui/Button.vue'

withDefaults(
  defineProps<{
    kicker: string
    title: string
    price?: string
    lead?: string
    photoSrc?: string
    mediaLabel?: string
    ctaLabel?: string
    ctaTo?: string
    mystery?: boolean
  }>(),
  {
    mediaLabel: 'Pieza',
    mystery: false,
  },
)
</script>

<template>
  <aside class="deal-spotlight" :class="{ 'deal-spotlight--mystery': mystery }">
    <p class="deal-spotlight__kicker">{{ kicker }}</p>
    <div class="deal-spotlight__media" :aria-hidden="mystery ? true : undefined">
      <img v-if="photoSrc && !mystery" :src="photoSrc" :alt="title" />
      <div v-else class="deal-spotlight__mystery" role="img" :aria-label="title">
        <span class="deal-spotlight__silhouette" />
        <span class="deal-spotlight__mark">?</span>
      </div>
    </div>
    <h2 class="deal-spotlight__title">{{ title }}</h2>
    <p v-if="price && !mystery" class="deal-spotlight__price">{{ price }}</p>
    <p v-if="lead" class="meta deal-spotlight__lead">{{ lead }}</p>
    <Button v-if="ctaTo && ctaLabel" size="sm" :to="ctaTo">{{ ctaLabel }}</Button>
  </aside>
</template>
