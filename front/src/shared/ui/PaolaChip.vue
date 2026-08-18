<script setup lang="ts">
defineProps<{
  tone?: 'abierto' | 'lleno' | 'cerrado' | 'realizado' | 'zona-ok' | 'zona-no'
}>()
</script>

<template>
  <span class="paola-chip" :class="`paola-chip--${tone ?? 'abierto'}`">
    <slot />
  </span>
</template>
