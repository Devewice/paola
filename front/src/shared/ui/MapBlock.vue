<script setup lang="ts">
import { computed } from 'vue'
import RouteMap from '@ui/RouteMap.vue'
import { MAP_COPY, MAP_LINKS } from '@ui/mapCopy.ts'
import type { MapRoute } from './mapTypes.ts'


const props = withDefaults(
  defineProps<{
    meetingPoint?: string
    routeText?: string
    mapHref?: string
    route?: MapRoute
  }>(),
  { meetingPoint: MAP_COPY.pendingPoint, routeText: '', mapHref: '', route: undefined },
)

function isStaticImage(href: string): boolean {
  return /\.(png|jpe?g|webp|gif|avif)(\?|$)/i.test(href)
}

const live = computed(() => Boolean(props.route?.start || props.route?.end))
const straight = computed(() => Boolean(props.route?.start && props.route?.end && props.route.path.length < 2))

const directionsHref = computed(() => {
  const route = props.route
  if (!route?.end && !route?.start) return ''
  const target = route.end ?? route.start
  const params = new URLSearchParams()
  if (route.start && route.end) params.set('origin', `${route.start.lat},${route.start.lng}`)
  if (target) params.set('destination', `${target.lat},${target.lng}`)
  return `${MAP_LINKS.DIRECTIONS}&${params}`
})

const stats = computed(() => {
  const route = props.route
  if (!route) return ''
  return [
    route.distanceKm ? MAP_COPY.distance(route.distanceKm) : '',
    route.durationMin ? MAP_COPY.duration(route.durationMin) : '',
  ]
    .filter(Boolean)
    .join(' · ')
})
</script>

<template>
  <div class="map-block" :class="{ 'map-block--live': live }">
    <div class="map-block__canvas">
      <RouteMap v-if="live && route" :start="route.start" :end="route.end" :path="route.path" />
      <img v-else-if="mapHref && isStaticImage(mapHref)" :src="mapHref" alt="" />
      <span v-else class="map-block__pin" aria-hidden="true" />
    </div>
    <div v-if="live && route" class="map-block__legs">
      <span v-if="route.start" class="map-block__leg map-block__leg--start">
        <small>{{ MAP_COPY.start }}</small>
        <strong>{{ route.start.label }}</strong>
      </span>
      <span v-if="route.end" class="map-block__leg map-block__leg--end">
        <small>{{ MAP_COPY.end }}</small>
        <strong>{{ route.end.label }}</strong>
      </span>
      <span v-if="stats" class="map-block__stats">{{ stats }}</span>
    </div>
    <p class="map-block__foot">
      {{ meetingPoint }}
      <template v-if="routeText"> · {{ routeText }}</template>
      <template v-if="straight"> · {{ MAP_COPY.straight }}</template>
      <template v-if="directionsHref">
        · <a :href="directionsHref" target="_blank" rel="noopener noreferrer">{{ MAP_COPY.directions }}</a>
      </template>
      <template v-else-if="mapHref && !isStaticImage(mapHref)">
        · <a :href="mapHref">{{ MAP_COPY.howToGet }}</a>
      </template>
    </p>
  </div>
</template>
