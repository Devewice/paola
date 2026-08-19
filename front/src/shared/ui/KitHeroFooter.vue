<script setup lang="ts">
withDefaults(
  defineProps<{
    stamp?: string
    rodadas?: string
    km?: string
    integrantes?: string
  }>(),
  {
    stamp: '¡Nos vemos en la ruta!',
    rodadas: '—',
    km: '—',
    integrantes: '—',
  },
)
</script>

<template>
  <div class="brush-banner">
    <svg viewBox="0 0 800 52" preserveAspectRatio="none" aria-hidden="true"><use href="#brush-banner-bg" /></svg>
    <p class="type-stamped">{{ stamp }}</p>
  </div>
  <div class="kit-hero__footer-kpis" aria-label="Indicadores del parche">
    <span><strong>{{ rodadas }}</strong> rodadas</span>
    <span><strong>{{ km }}</strong> km acumulados</span>
    <span><strong>{{ integrantes }}</strong> integrantes</span>
  </div>
</template>
