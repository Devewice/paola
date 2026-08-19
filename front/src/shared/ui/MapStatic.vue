<script setup lang="ts">
defineProps<{
  overlay?: string
}>()
</script>

<template>
  <div class="map-static">
    <div class="map-static__overlay">{{ overlay ?? 'Mapa embebido / imagen recorrido · sin GPS en vivo' }}</div>
    <div class="map-static__pin" aria-hidden="true" />
  </div>
</template>
