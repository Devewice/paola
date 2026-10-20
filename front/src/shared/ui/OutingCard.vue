<script setup lang="ts">
import { computed } from 'vue'
import Chip from '@ui/Chip.vue'
import Icon from '@ui/Icon.vue'
import MapBlock from '@ui/MapBlock.vue'
import type { MapRoute } from './mapTypes.ts'

const props = withDefaults(
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
    /** Versión de grilla: mapa bajo, texto recortado y la acción pegada al fondo. */
    compact?: boolean
  }>(),
  { taken: 0, mapHref: '', route: undefined, compact: false },
)

const shortDate = computed(() => {
  const parsed = new Date(`${props.date}T12:00:00`)
  if (Number.isNaN(parsed.getTime())) return props.date
  return parsed
    .toLocaleDateString('es-CO', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
    .replace(/\./g, '')
})

const hasMap = computed(() => Boolean(props.route?.start || props.route?.end || /\.(png|jpe?g|webp|gif|avif)(\?|$)/i.test(props.mapHref)))
const showBring = computed(() => Boolean(props.whatToBring) && !(props.compact && props.status === 'realizado'))
</script>

<template>
  <article class="paola-outing" :class="{ 'paola-outing--compact': compact }">
    <div class="paola-outing__body">
      <div class="paola-outing__info">
        <div class="paola-outing__head">
          <Chip :tone="status">{{ status }}</Chip>
          <span class="paola-outing__kind">{{ kindLabel }}</span>
          <time class="paola-outing__date" :datetime="date">{{ shortDate }}</time>
        </div>
        <h3 class="paola-outing__title">{{ title }}</h3>
        <p class="paola-outing__meta paola-outing__where">
          <Icon name="pin" size="sm" :circle="false" />
          <span>{{ meetingPoint }}</span>
        </p>
        <MapBlock
          v-if="hasMap"
          meeting-point=""
          :map-href="mapHref"
          :route="route"
          :compact="compact"
        />
        <p v-if="routeText" class="paola-outing__meta paola-outing__route">{{ routeText }}</p>
        <p class="paola-outing__facts">
          <span>Cupo {{ taken }} / {{ capacity }}</span>
          <span>{{ paid ? (compact ? 'De pago' : 'De pago · se avisa por WhatsApp') : 'Gratis' }}</span>
        </p>
        <p v-if="showBring" class="paola-outing__copy"><strong>Llevar:</strong> {{ whatToBring }}</p>
      </div>
      <div v-if="$slots.default" class="paola-outing__aside">
        <slot />
      </div>
    </div>
  </article>
</template>
