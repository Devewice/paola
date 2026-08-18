<script setup lang="ts">
import PaolaButton from '@ui/PaolaButton.vue'

withDefaults(
  defineProps<{
    title: string
    price: string
    collab?: boolean
    photoSrc?: string
    to?: string
    href?: string
    ctaLabel?: string
    mediaLabel?: string
  }>(),
  {
    href: 'mailto:contacto@paolabiker.com',
    ctaLabel: 'Escribirle a Paola',
    mediaLabel: 'Producto',
  },
)
</script>

<template>
  <article class="paola-product" :class="{ 'paola-product--collab': collab }">
    <div class="paola-product__media">
      <img v-if="photoSrc" class="paola-product__photo" :src="photoSrc" :alt="title" />
      <template v-else>{{ collab ? 'Collab' : mediaLabel }}</template>
    </div>
    <div class="paola-product__body">
      <h3 class="paola-product__title">{{ title }}</h3>
      <p class="paola-product__price">{{ price }}</p>
      <PaolaButton v-if="to" size="sm" :to="to">Ver ficha</PaolaButton>
      <PaolaButton v-else size="sm" :href="href">{{ ctaLabel }}</PaolaButton>
    </div>
  </article>
</template>
