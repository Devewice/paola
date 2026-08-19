<script setup lang="ts">
import AficheBlock from '@ui/AficheBlock.vue'
import BrushSplash from '@ui/BrushSplash.vue'
import KitBrushDivider from '@ui/KitBrushDivider.vue'
</script>

<template>
  <AficheBlock label="Estilo cumpleaños" style="margin-bottom:32px">
    <div class="afiche-row">
      <p class="type-brush-dry type-brush-dry--sm">Rodada</p>
    </div>
    <div class="afiche-row" style="margin: 4px 0 0 12px">
      <p class="type-brush-script">por mi</p>
    </div>
    <div class="afiche-row">
      <p class="type-brush-dry type-brush-dry--blue type-brush-dry--xs">Cumpleaños</p>
    </div>
    <BrushSplash label="7 DE JUNIO" style="margin:16px 0" />
    <p class="type-condensed type-condensed--blue" style="font-size:clamp(22px,4vw,32px);margin:8px 0">Nezko · La amistad</p>
    <KitBrushDivider variant="thin" />
    <p class="label-brush">6:00 a.m. · punto de encuentro</p>
  </AficheBlock>
</template>
