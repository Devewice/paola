<script setup lang="ts">
import Button from '@ui/Button.vue'
import Chip from '@ui/Chip.vue'
import Icon from '@ui/Icon.vue'

withDefaults(
  defineProps<{
    title: string
    meta: string
    featured?: boolean
    status?: 'abierto' | 'lleno' | 'cerrado' | 'realizado'
    ctaLabel?: string
    hideCta?: boolean
    taken?: number
    capacity?: number
  }>(),
  { status: 'abierto', ctaLabel: 'Anotarse', hideCta: false },
)
</script>

<template>
  <article class="ride-card">
    <div class="ride-card__media">
      <Chip :tone="status">{{ status === 'abierto' ? 'Abierto' : status === 'lleno' ? 'Lleno' : status === 'realizado' ? 'Realizado' : 'Cerrado' }}</Chip>
    </div>
    <div class="ride-card__body">
      <h3 class="ride-card__title">{{ title }}</h3>
      <p class="ride-card__meta">
        <Icon name="pin" size="sm" :circle="false" />
        {{ meta }}
      </p>
      <div v-if="capacity != null" class="ride-card__cupo">
        <p class="meta" style="margin: 0 0 6px">Cupo {{ taken ?? 0 }} / {{ capacity }}</p>
        <div class="bar">
          <span :style="{ width: `${Math.min(100, ((taken ?? 0) / Math.max(capacity, 1)) * 100)}%` }" />
        </div>
      </div>
      <div v-if="!hideCta" class="ride-card__foot">
        <Button size="sm" :variant="featured ? 'hero' : 'primary'">{{ ctaLabel }}</Button>
      </div>
    </div>
  </article>
</template>
