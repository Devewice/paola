<script setup lang="ts">
import PaolaButton from '@ui/PaolaButton.vue'

defineProps<{
  title: string
  price: string
  collab?: boolean
}>()
</script>

<template>
  <article class="paola-product" :class="{ 'paola-product--collab': collab }">
    <div class="paola-product__media">{{ collab ? 'Collab' : 'Producto' }}</div>
    <div class="paola-product__body">
      <h3 class="paola-product__title">{{ title }}</h3>
      <p class="paola-product__price">{{ price }}</p>
      <PaolaButton size="sm" href="mailto:contacto@paolabiker.com">Escribirle a Paola</PaolaButton>
    </div>
  </article>
</template>
