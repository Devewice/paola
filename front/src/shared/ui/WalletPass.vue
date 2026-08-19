<script setup lang="ts">
import Chip from '@ui/Chip.vue'

defineProps<{
  title: string
  meta: string
  chip?: string
}>()
</script>

<template>
  <div class="wallet-pass">
    <div class="wallet-pass__head">
      <img src="/kit-assets/logo.png" width="28" height="28" alt="" />
      <Chip>{{ chip ?? 'Rodada' }}</Chip>
    </div>
    <div class="wallet-pass__body">
      <strong>{{ title }}</strong>
      <p class="meta" style="margin: 4px 0 0">{{ meta }}</p>
      <div class="wallet-pass__code">BARCODE</div>
    </div>
  </div>
</template>
