<script setup lang="ts">
defineProps<{
  tone?: 'abierto' | 'lleno' | 'cerrado' | 'realizado' | 'zona-ok' | 'zona-no'
}>()
</script>

<template>
  <span
    class="chip"
    :class="{
      'chip-open': !tone || tone === 'abierto',
      'chip-full': tone === 'lleno',
      'chip-done': tone === 'cerrado' || tone === 'realizado',
      'chip-ok': tone === 'zona-ok',
    }"
  >
    <slot />
  </span>
</template>
