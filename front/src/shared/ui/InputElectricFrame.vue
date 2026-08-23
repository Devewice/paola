<script setup lang="ts">
/** Marco brocha + relleno irregular (misma forma; sin rectángulo detrás). */
const FRAME =
  'M8 10 C6 4 14 3 28 4 L292 3 C308 2 314 8 313 16 L314 40 C315 50 306 53 288 52 L26 53 C10 54 5 48 6 38 Z'
</script>

<template>
  <svg class="input-electric__stroke" viewBox="0 0 320 56" preserveAspectRatio="none" aria-hidden="true">
    <path
      class="input-electric__fill"
      :d="FRAME"
      filter="url(#paola-brush-edge)"
    />
    <path
      class="input-electric__path"
      :d="FRAME"
      fill="none"
      stroke="currentColor"
      stroke-width="2.4"
      stroke-linejoin="round"
      filter="url(#paola-brush-edge)"
    />
    <path
      class="input-electric__spark"
      d="M18 52 L42 52"
      fill="none"
      stroke="currentColor"
      stroke-width="3"
      stroke-linecap="round"
      filter="url(#paola-dry-brush-blue)"
    />
  </svg>
</template>
