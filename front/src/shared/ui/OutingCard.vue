<script setup lang="ts">
import Chip from '@ui/Chip.vue'
import Icon from '@ui/Icon.vue'
import MapBlock from '@ui/MapBlock.vue'
import type { MapRoute } from './mapTypes.ts'

withDefaults(
  defineProps<{
    title: string
    date: string
    kindLabel: string
    status: 'abierto' | 'lleno' | 'cerrado' | 'realizado'
    meetingPoint: string
    routeText: string
    capacity: number
    taken?: number
    whatToBring: string
    paid: boolean
    mapHref?: string
    route?: MapRoute
  }>(),
  { taken: 0, mapHref: '', route: undefined },
)
</script>

<template>
  <article class="paola-outing">
    <div class="paola-outing__body">
      <div class="paola-outing__info">
        <div class="paola-outing__head">
          <Chip :tone="status">{{ status }}</Chip>
          <span class="paola-outing__kind">{{ kindLabel }}</span>
        </div>
        <h3 class="paola-outing__title">{{ title }}</h3>
        <p class="paola-outing__meta">
          <Icon name="pin" size="sm" :circle="false" />
          {{ date }} · {{ meetingPoint }}
        </p>
        <MapBlock
          v-if="routeText || route"
          :meeting-point="meetingPoint"
          :route-text="routeText"
          :map-href="mapHref"
          :route="route"
        />
        <p class="paola-outing__meta">
          Cupo {{ taken }} / {{ capacity }} · {{ paid ? 'De pago · se avisa por WhatsApp' : 'Gratis' }}
        </p>
        <p v-if="whatToBring" class="paola-outing__copy">Llevar: {{ whatToBring }}</p>
      </div>
      <div v-if="$slots.default" class="paola-outing__aside">
        <slot />
      </div>
    </div>
  </article>
</template>
