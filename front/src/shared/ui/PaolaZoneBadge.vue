<script setup lang="ts">
defineProps<{
  zone: 'bogota' | 'soacha' | 'fuera'
}>()
</script>

<template>
  <span class="paola-chip" :class="zone === 'fuera' ? 'paola-chip--zona-no' : 'paola-chip--zona-ok'">
    <template v-if="zone === 'bogota'">Bogotá · entrega gratis</template>
    <template v-else-if="zone === 'soacha'">Soacha · entrega gratis</template>
    <template v-else>Fuera · aún no</template>
  </span>
</template>
