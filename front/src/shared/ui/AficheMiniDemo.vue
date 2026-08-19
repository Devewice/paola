<script setup lang="ts">
import AficheBlock from '@ui/AficheBlock.vue'
import BrushButton from '@ui/BrushButton.vue'
import BrushSplash from '@ui/BrushSplash.vue'
import DataBlock from '@ui/DataBlock.vue'
import KitBrushDivider from '@ui/KitBrushDivider.vue'
</script>

<template>
  <AficheBlock>
    <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:16px;flex-wrap:wrap">
      <div>
        <p class="type-brush-script">por mi</p>
        <div class="afiche-row">
          <p class="type-brush-dry type-brush-dry--sm">Rodada</p>
        </div>
        <p class="type-brush-dry type-brush-dry--blue type-brush-dry--xs">Cumpleaños</p>
      </div>
      <img src="/kit-assets/logo.png" width="72" height="72" alt="Logo" />
    </div>
    <KitBrushDivider variant="thin" style="margin:16px 0" />
    <BrushSplash label="7 DE JUNIO" size="sm" style="margin-bottom:16px" />
    <div class="grid grid-3">
      <DataBlock label="Hora" value="6:00 AM">
        <template #icon>
          <svg viewBox="0 0 32 32" width="28" height="28" fill="none"><circle cx="16" cy="16" r="11" stroke="#0088F8" stroke-width="2"/><path d="M16 10 V16 L20 18" stroke="#0088F8" stroke-width="2" stroke-linecap="round"/></svg>
        </template>
      </DataBlock>
      <DataBlock label="Punto">
        <template #icon>
          <svg viewBox="0 0 32 32" width="28" height="28" fill="none"><path d="M16 26 C16 26 9 18 9 13 C9 9 12 6 16 6 C20 6 23 9 23 13 C23 18 16 26 16 26Z" stroke="#0088F8" stroke-width="2"/></svg>
        </template>
        Por confirmar
      </DataBlock>
      <DataBlock label="Fotos">
        <template #icon>
          <svg viewBox="0 0 32 32" width="28" height="28" fill="none"><rect x="6" y="10" width="20" height="14" rx="2" stroke="#0088F8" stroke-width="2"/><circle cx="16" cy="17" r="4" stroke="#0088F8" stroke-width="2"/></svg>
        </template>
        Sí
      </DataBlock>
    </div>
    <BrushButton style="margin-top:20px">Apúntese pa rodar</BrushButton>
  </AficheBlock>
</template>
