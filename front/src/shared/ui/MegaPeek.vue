<script setup lang="ts">
import Button from '@ui/Button.vue'

withDefaults(
  defineProps<{
    kicker: string
    title: string
    meta?: string
    copy?: string
    value?: string
    valueLabel?: string
    imageSrc?: string
    to?: string
    href?: string
    cta?: string
    empty?: boolean
  }>(),
  { cta: 'Ver' },
)
</script>

<template>
  <article class="mega-peek" :class="{ 'is-empty': empty }">
    <div v-if="imageSrc" class="mega-peek__media" :style="{ backgroundImage: `url('${imageSrc}')` }" />
    <p class="meta" style="margin: 0 0 6px">{{ kicker }}</p>
    <h3>{{ title }}</h3>
    <p v-if="meta" class="mega-peek__meta">{{ meta }}</p>
    <p v-if="copy" class="sm" style="color: var(--muted); margin: 0 0 12px">{{ copy }}</p>
    <p v-if="value" class="mega-peek__stat">
      <strong>{{ value }}</strong>
      <span>{{ valueLabel }}</span>
    </p>
    <slot />
    <Button v-if="to || href" size="sm" :to="to" :href="href" :target="href ? '_blank' : undefined">
      {{ cta }}
    </Button>
  </article>
</template>
