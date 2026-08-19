<script setup lang="ts">
defineProps<{
  copy?: string
}>()
</script>

<template>
  <div class="no-popup-banner">
    <p>{{ copy ?? 'Sin popups de venta ni rastreo agresivo — banner honesto del portal.' }}</p>
  </div>
</template>
