<script setup lang="ts">
defineProps<{
  zone: 'bogota' | 'soacha' | 'fuera'
}>()
</script>

<template>
  <span class="zone-badge" :class="{ 'zone-badge--muted': zone === 'fuera' }">
    <template v-if="zone === 'bogota'">Bogotá · entrega gratis</template>
    <template v-else-if="zone === 'soacha'">Soacha · entrega gratis</template>
    <template v-else>Fuera · aún no</template>
  </span>
</template>
