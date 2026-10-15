<script setup lang="ts">
import { computed } from 'vue'

/** Carita de trazo: `mood` va de 0 (molesta) a 1 (feliz). */
const props = defineProps<{ mood: number; active?: boolean }>()

const mouth = computed(() => {
  const curve = (props.mood - 0.5) * 16
  return `M10 ${26 - curve / 4} Q20 ${26 + curve} 30 ${26 - curve / 4}`
})
const brow = computed(() => (props.mood < 0.25 ? 'M11 12 L17 14 M29 12 L23 14' : ''))
</script>

<template>
  <svg class="scale-face" :class="{ 'is-active': active }" viewBox="0 0 40 40" aria-hidden="true">
    <circle cx="20" cy="20" r="17" />
    <circle class="scale-face__eye" cx="14" cy="17" r="2" />
    <circle class="scale-face__eye" cx="26" cy="17" r="2" />
    <path v-if="brow" class="scale-face__line" :d="brow" />
    <path class="scale-face__line" :d="mouth" />
  </svg>
</template>

<style scoped>
.scale-face {
  width: 100%;
  max-width: 44px;
  fill: none;
  stroke: rgba(234, 242, 255, 0.45);
  stroke-width: 2;
  transition: transform 180ms ease, stroke 180ms ease, filter 180ms ease;
}
.scale-face__eye {
  fill: currentColor;
  stroke: none;
  color: rgba(234, 242, 255, 0.45);
}
.scale-face__line {
  stroke-linecap: round;
}
.scale-face.is-active {
  stroke: var(--cyan, #48b4fc);
  transform: scale(1.25);
  filter: drop-shadow(0 0 8px rgba(72, 180, 252, 0.55));
}
.scale-face.is-active .scale-face__eye {
  color: var(--cyan, #48b4fc);
}
</style>
