<script setup lang="ts">
import Button from '@ui/Button.vue'

withDefaults(
  defineProps<{
    title: string
    price: string
    note?: string
    /** Descripción corta; se corta a tres líneas. */
    copy?: string
    collab?: boolean
    photoSrc?: string
    /** Afiche vertical: la foto se ancla arriba para que se lea el encabezado. */
    poster?: boolean
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
  <article class="product-card" :class="{ 'product-card--collab': collab, 'product-card--poster': poster }">
    <div class="product-card__media">
      <img v-if="photoSrc" :src="photoSrc" :alt="title" loading="lazy" />
      <template v-else>{{ mediaLabel }}</template>
    </div>
    <div class="product-card__body">
      <p class="product-card__shelf">{{ shelf ?? (collab ? 'Colaboración' : 'Marca Paola') }}</p>
      <h3 class="product-card__title">{{ title }}</h3>
      <p v-if="copy" class="product-card__copy">{{ copy }}</p>
      <p class="price">
        {{ price }}
        <span v-if="note" class="price__note">{{ note }}</span>
      </p>
      <Button v-if="to" size="sm" variant="ghost" :to="to">{{ ctaLabel }}</Button>
      <Button v-else size="sm" variant="ghost" :href="href">{{ ctaLabel }}</Button>
    </div>
  </article>
</template>
