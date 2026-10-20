<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type * as Leaflet from 'leaflet'
import { MAP_COLORS, MAP_COPY, MAP_TILES } from '@ui/mapCopy.ts'

import type { MapPin as Point } from './mapTypes.ts'

const props = withDefaults(
  defineProps<{
    start?: Point
    end?: Point
    /** Trazado por carretera `[lat, lng]`; sin él se une salida y destino con línea punteada. */
    path?: readonly (readonly [number, number])[]
  }>(),
  { start: undefined, end: undefined, path: () => [] },
)

const host = ref<HTMLElement | null>(null)
const failed = ref(false)
const zoomOn = ref(false)
let map: Leaflet.Map | null = null
let observer: IntersectionObserver | null = null
let resizer: ResizeObserver | null = null

function pin(L: typeof Leaflet, kind: 'start' | 'end'): Leaflet.DivIcon {
  return L.divIcon({
    className: `route-map__pin route-map__pin--${kind}`,
    html: `<span>${kind === 'start' ? MAP_COPY.startShort : MAP_COPY.endShort}</span>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  })
}

/** El texto va como nodo, no como HTML: las etiquetas vienen de la base. */
function label(caption: string, name: string): HTMLElement {
  const box = document.createElement('span')
  const small = document.createElement('small')
  small.textContent = caption
  const strong = document.createElement('strong')
  strong.textContent = name
  box.append(small, strong)
  return box
}

async function draw(): Promise<void> {
  if (!host.value) return
  try {
    const L = (await import('leaflet')).default
    await import('leaflet/dist/leaflet.css')
    map?.remove()
    zoomOn.value = false

    const instance = L.map(host.value, {
      zoomControl: false,
      zoomSnap: 0.25,
      scrollWheelZoom: false,
      attributionControl: true,
    })
    map = instance
    L.control.zoom({ position: 'bottomright' }).addTo(instance)
    instance.attributionControl.setPrefix(false)
    L.tileLayer(MAP_TILES.URL, {
      attribution: MAP_TILES.ATTRIBUTION,
      maxZoom: MAP_TILES.MAX_ZOOM,
    }).addTo(instance)

    const ends = [props.start, props.end].filter((point): point is Point => Boolean(point))
    const road = props.path.length > 1
    const line: [number, number][] = road
      ? props.path.map(([lat, lng]) => [lat, lng])
      : ends.map((point) => [point.lat, point.lng])

    if (line.length > 1) {
      L.polyline(line, { color: MAP_COLORS.GLOW, weight: 14, opacity: 0.16, lineCap: 'round', interactive: false }).addTo(instance)
      L.polyline(line, {
        color: MAP_COLORS.ROUTE,
        weight: 5,
        opacity: 0.95,
        lineCap: 'round',
        dashArray: road ? undefined : '2 10',
        interactive: false,
      }).addTo(instance)
      if (road) {
        L.polyline(line, { color: MAP_COLORS.GLOW, weight: 1.5, opacity: 0.9, interactive: false }).addTo(instance)
      }
    }

    if (props.start) {
      L.marker([props.start.lat, props.start.lng], { icon: pin(L, 'start'), keyboard: false })
        .bindTooltip(label(MAP_COPY.start, props.start.label), {
          permanent: true,
          direction: 'top',
          offset: [0, -16],
          className: 'route-map__label',
        })
        .addTo(instance)
    }
    if (props.end) {
      L.marker([props.end.lat, props.end.lng], { icon: pin(L, 'end'), keyboard: false })
        .bindTooltip(label(MAP_COPY.end, props.end.label), {
          permanent: true,
          direction: 'top',
          offset: [0, -16],
          className: 'route-map__label route-map__label--end',
        })
        .addTo(instance)
    }

    const bounds = line.length > 1 ? L.latLngBounds(line) : null
    if (bounds) {
      instance.fitBounds(bounds, {
        paddingTopLeft: [MAP_TILES.FIT_PADDING, MAP_TILES.FIT_PADDING_TOP],
        paddingBottomRight: [MAP_TILES.FIT_PADDING, MAP_TILES.FIT_PADDING_BOTTOM],
      })
    }
    else if (ends[0]) instance.setView([ends[0].lat, ends[0].lng], MAP_TILES.SINGLE_ZOOM)

    instance.on('click', () => {
      instance.scrollWheelZoom.enable()
      zoomOn.value = true
    })
    instance.on('mouseout', () => {
      instance.scrollWheelZoom.disable()
      zoomOn.value = false
    })
    resizer?.disconnect()
    if (typeof ResizeObserver !== 'undefined') {
      resizer = new ResizeObserver(() => instance.invalidateSize())
      resizer.observe(host.value)
    }
    failed.value = false
  } catch {
    failed.value = true
  }
}

onMounted(() => {
  if (!host.value) return
  if (typeof IntersectionObserver === 'undefined') {
    void draw()
    return
  }
  observer = new IntersectionObserver(
    (entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return
      observer?.disconnect()
      observer = null
      void draw()
    },
    { rootMargin: '200px' },
  )
  observer.observe(host.value)
})

watch(
  () => [props.start, props.end, props.path],
  () => {
    if (map) void draw()
  },
)

onBeforeUnmount(() => {
  observer?.disconnect()
  resizer?.disconnect()
  map?.remove()
  map = null
})
</script>

<template>
  <div class="route-map" :class="{ 'route-map--zoom': zoomOn }">
    <div ref="host" class="route-map__canvas" role="img" :aria-label="MAP_COPY.aria" />
    <span v-if="!zoomOn && !failed" class="route-map__hint">{{ MAP_COPY.zoomHint }}</span>
    <p v-if="failed" class="route-map__failed">{{ MAP_COPY.failed }}</p>
  </div>
</template>
