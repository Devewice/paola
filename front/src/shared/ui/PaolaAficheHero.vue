<script setup lang="ts">
import PaolaBrushBanner from '@ui/PaolaBrushBanner.vue'
import PaolaBrushDivider from '@ui/PaolaBrushDivider.vue'
import PaolaBrushPlate from '@ui/PaolaBrushPlate.vue'

withDefaults(
  defineProps<{
    kicker: string
    title: string
    plate?: string
    logo?: boolean
  }>(),
  { logo: false },
)
</script>

<template>
  <header class="paola-afiche">
    <PaolaBrushBanner />
    <PaolaBrushPlate v-if="plate" :text="plate" />
    <img
      v-if="logo"
      class="paola-afiche__logo"
      src="/logo.png"
      alt="Paola — Rodando con propósito"
      width="160"
      height="160"
    />
    <p class="paola-empty__kicker">{{ kicker }}</p>
    <h1 class="paola-afiche__title type-display">{{ title }}</h1>
    <p v-if="$slots.lead" class="paola-afiche__lead">
      <slot name="lead" />
    </p>
    <div v-if="$slots.actions" class="paola-afiche__actions">
      <slot name="actions" />
    </div>
    <PaolaBrushDivider />
  </header>
</template>
