<script setup lang="ts">
import BrushSplash from '@ui/BrushSplash.vue'
import Button from '@ui/Button.vue'
</script>

<template>
  <span class="kit-hero__panel-label">Corte del día · Parchese</span>
  <div class="kit-hero__panel-media">
    <span>Memoria de ruta · placeholder</span>
  </div>
  <div class="kit-hero__panel-title">
    <p class="type-brush-dry type-brush-dry--blue type-brush-dry--card">Rodada</p>
  </div>
  <div class="kit-hero__panel-stats">
    <div class="kit-hero__stat">
      <strong>—</strong>
      <span>Km</span>
    </div>
    <div class="kit-hero__stat">
      <strong>—</strong>
      <span>Cupo</span>
    </div>
    <div class="kit-hero__stat">
      <strong>—</strong>
      <span>Fecha</span>
    </div>
  </div>
  <div class="kit-hero__panel-foot">
    <BrushSplash label="Próximamente" tone="white" size="sm" style="margin:0" />
    <Button variant="ghost" size="sm" href="#producto">Ver Parchese</Button>
  </div>
</template>
