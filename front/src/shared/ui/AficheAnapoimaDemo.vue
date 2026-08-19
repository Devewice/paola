<script setup lang="ts">
import AficheBlock from '@ui/AficheBlock.vue'
import KitBrushBanner from '@ui/KitBrushBanner.vue'
</script>

<template>
  <AficheBlock label="Estilo Anapoima" style="margin-bottom:32px">
    <div class="afiche-row">
      <p class="type-brush-dry type-brush-dry--blue type-brush-dry--sm">Rodada</p>
    </div>
    <div class="afiche-row">
      <p class="type-condensed" style="font-size:clamp(28px,5vw,40px)">Invitados</p>
    </div>
    <div class="afiche-row">
      <p class="type-condensed type-condensed--lg type-condensed--accent">Anapoima</p>
    </div>
    <div class="brush-divider brush-divider--thin" aria-hidden="true">
      <svg viewBox="0 0 800 14" preserveAspectRatio="none">
        <g fill="none" stroke-linecap="round">
          <path stroke="#0088F8" stroke-width="3.5" d="M0,7 L38,5 M50,9 L94,4 M108,8 L156,6 M168,9 L218,5 M232,7 L284,4 M298,8 L348,6 M362,9 L414,5 M428,7 L478,4 M492,8 L544,6 M558,9 L610,5 M624,7 L676,4 M690,8 L742,6 M756,9 L800,5"/>
          <path stroke="#48B4FC" stroke-width="1.6" opacity="0.5" d="M8,10 L46,8 M58,11 L102,7 M116,10 L164,8 M176,11 L226,7 M240,10 L292,7 M306,10 L356,8 M370,11 L420,7 M434,10 L486,7 M500,10 L552,8 M566,11 L618,7 M632,10 L684,7 M698,10 L750,8 M764,11 L800,7"/>
        </g>
      </svg>
    </div>
    <KitBrushBanner />
    <p class="meta" style="margin-top:8px">Ride · Respect · Enjoy</p>
  </AficheBlock>
</template>
