<script setup lang="ts">
import Button from '@ui/Button.vue'

defineProps<{
  copy?: string
  ctaLabel?: string
  style?: string | Record<string, string>
}>()
</script>

<template>
  <div class="account-teaser" :style="style">
    <p>{{ copy ?? 'Cuenta cuando tengas ticket, pedido o denuncia a tu nombre.' }}</p>
    <Button variant="ghost" size="sm" disabled>{{ ctaLabel ?? 'Próximamente' }}</Button>
  </div>
</template>
