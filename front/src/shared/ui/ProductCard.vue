<script setup lang="ts">
import Button from '@ui/Button.vue'

withDefaults(
  defineProps<{
    title: string
    price: string
    note?: string
    collab?: boolean
    photoSrc?: string
    to?: string
    href?: string
    ctaLabel?: string
    mediaLabel?: string
    shelf?: string
  }>(),
  {
    href: 'mailto:contacto@paolabiker.com',
    ctaLabel: 'Escríbeme',
    mediaLabel: 'Producto',
  },
)
</script>

<template>
  <article class="product-card" :class="{ 'product-card--collab': collab }">
    <div class="product-card__media">
      <img v-if="photoSrc" :src="photoSrc" :alt="title" />
      <template v-else>{{ collab ? 'Foto collab' : mediaLabel }}</template>
    </div>
    <div class="product-card__body">
      <p class="product-card__shelf">{{ shelf ?? (collab ? 'Estantería collab' : 'Marca Paola') }}</p>
      <h3 class="product-card__title">{{ title }}</h3>
      <p class="price">
        {{ price }}
        <span v-if="note" class="price__note">{{ note }}</span>
      </p>
      <Button v-if="to" size="sm" variant="ghost" :to="to">Ver ficha</Button>
      <Button v-else size="sm" variant="ghost" :href="href">{{ ctaLabel }}</Button>
    </div>
  </article>
</template>
