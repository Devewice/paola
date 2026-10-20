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
    /** Mapa bajo sin etiquetas flotantes; la ruta va en una sola línea. */
    compact?: boolean
  }>(),
  { meetingPoint: MAP_COPY.pendingPoint, routeText: '', mapHref: '', route: undefined, compact: false },
)

function isStaticImage(href: string): boolean {
  return /\.(png|jpe?g|webp|gif|avif)(\?|$)/i.test(href)
}

const live = computed(() => Boolean(props.route?.start || props.route?.end))
const straight = computed(() => Boolean(props.route?.start && props.route?.end && props.route.path.length < 2))
const staticImage = computed(() => !live.value && Boolean(props.mapHref) && isStaticImage(props.mapHref))

const navApps = computed(() => {
  const route = props.route
  const target = route?.end ?? route?.start
  if (!route || !target) return []
  const to = `${target.lat},${target.lng}`
  const from = route.start && route.end ? `${route.start.lat},${route.start.lng}` : ''

  const google = new URLSearchParams({ destination: to })
  if (from) google.set('origin', from)
  const apple = new URLSearchParams({ daddr: to })
  if (from) apple.set('saddr', from)

  return [
    { id: 'google', label: MAP_COPY.googleMaps, href: `${MAP_LINKS.DIRECTIONS}&${google}` },
    { id: 'waze', label: MAP_COPY.waze, href: `${MAP_LINKS.WAZE}&${new URLSearchParams({ ll: to })}` },
    { id: 'apple', label: MAP_COPY.appleMaps, href: `${MAP_LINKS.APPLE}&${apple}` },
  ]
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

const footText = computed(() =>
  [props.meetingPoint, props.routeText, straight.value && !props.compact ? MAP_COPY.straight : '']
    .filter(Boolean)
    .join(' · '),
)
const footLink = computed(() => {
  if (props.compact || navApps.value.length) return null
  if (props.mapHref && !isStaticImage(props.mapHref)) return { href: props.mapHref, label: MAP_COPY.howToGet }
  return null
})
const showApps = computed(() => !props.compact && navApps.value.length > 0)
</script>

<template>
  <div class="map-block" :class="{ 'map-block--live': live, 'map-block--compact': compact }">
    <div v-if="live || staticImage || (!footText && !footLink)" class="map-block__canvas">
      <RouteMap v-if="live && route" :start="route.start" :end="route.end" :path="route.path" :compact="compact" />
      <img v-else-if="staticImage" :src="mapHref" alt="" />
      <span v-else class="map-block__pin" aria-hidden="true" />
    </div>
    <div v-if="live && route && compact" class="map-block__line">
      <span class="map-block__trip">
        <template v-if="route.start">{{ route.start.label }}</template>
        <template v-if="route.start && route.end"> → </template>
        <template v-if="route.end">{{ route.end.label }}</template>
      </span>
      <span v-if="stats" class="map-block__stats">{{ stats }}</span>
    </div>
    <div v-else-if="live && route" class="map-block__legs">
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
    <p v-if="footText || footLink" class="map-block__foot">
      {{ footText }}
      <template v-if="footLink">
        <template v-if="footText"> · </template>
        <a :href="footLink.href">{{ footLink.label }}</a>
      </template>
    </p>
    <nav v-if="showApps" class="map-block__apps" :aria-label="MAP_COPY.openIn">
      <span class="map-block__apps-label">{{ MAP_COPY.openIn }}</span>
      <a
        v-for="app in navApps"
        :key="app.id"
        class="map-block__app"
        :href="app.href"
        target="_blank"
        rel="noopener noreferrer"
      >{{ app.label }}</a>
    </nav>
  </div>
</template>
