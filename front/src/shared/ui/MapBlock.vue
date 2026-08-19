<script setup lang="ts">
withDefaults(
  defineProps<{
    meetingPoint?: string
    routeText?: string
    mapHref?: string
  }>(),
  { meetingPoint: 'Punto por confirmar', routeText: '', mapHref: '' },
)

function isStaticImage(href: string): boolean {
  return /\.(png|jpe?g|webp|gif|avif)(\?|$)/i.test(href)
}
</script>

<template>
  <div class="map-block">
    <div class="map-block__canvas">
      <img v-if="mapHref && isStaticImage(mapHref)" :src="mapHref" alt="" />
      <span v-else class="map-block__pin" aria-hidden="true" />
    </div>
    <p class="map-block__foot">
      {{ meetingPoint }}
      <template v-if="routeText"> · {{ routeText }}</template>
      <template v-if="mapHref && !isStaticImage(mapHref)"> · <a :href="mapHref">Cómo llegar</a></template>
    </p>
  </div>
</template>
