<script setup lang="ts">
defineProps<{
  title?: string
  copy?: string
}>()
</script>

<template>
  <aside class="paola-alliances" aria-label="Alianzas">
    <p class="paola-alliances__kicker">Alianzas</p>
    <h2 class="paola-alliances__title type-display">{{ title ?? 'Quienes apoyan' }}</h2>
    <p class="paola-alliances__copy">
      {{ copy ?? 'Aquí van quienes apoyan el parche. Aún no hay aliados publicados.' }}
    </p>
  </aside>
</template>
