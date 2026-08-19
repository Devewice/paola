<script setup lang="ts">
import Chip from '@ui/Chip.vue'
import Icon from '@ui/Icon.vue'
import MapBlock from '@ui/MapBlock.vue'

withDefaults(
  defineProps<{
    title: string
    date: string
    kind: 'rodada' | 'actividad'
    status: 'abierto' | 'lleno' | 'cerrado' | 'realizado'
    meetingPoint: string
    routeText: string
    capacity: number
    taken?: number
    whatToBring: string
    paid: boolean
    mapHref?: string
  }>(),
  { taken: 0, mapHref: '' },
)
</script>

<template>
  <article class="paola-outing">
    <div class="paola-outing__head">
      <Chip :tone="status">{{ status }}</Chip>
      <span class="paola-outing__kind">{{ kind === 'rodada' ? 'Rodada' : 'Actividad' }}</span>
    </div>
    <h3 class="paola-outing__title">{{ title }}</h3>
    <p class="paola-outing__meta">
      <Icon name="pin" size="sm" :circle="false" />
      {{ date }} · {{ meetingPoint }}
    </p>
    <MapBlock
      v-if="routeText"
      :meeting-point="meetingPoint"
      :route-text="routeText"
      :map-href="mapHref"
    />
    <p class="paola-outing__meta">
      Cupo {{ taken }} / {{ capacity }} · {{ paid ? 'De pago · se avisa por WhatsApp' : 'Gratis' }}
    </p>
    <p v-if="whatToBring" class="paola-outing__copy">Llevar: {{ whatToBring }}</p>
    <slot />
  </article>
</template>
