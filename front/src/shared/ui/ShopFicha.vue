<script setup lang="ts">
defineProps<{
  shelf: string
  title: string
  price: string
  priceNote?: string
  description?: string
  rules?: string
}>()
</script>

<template>
  <div class="shop-ficha">
    <div>
      <span class="product-card__shelf">{{ shelf }}</span>
      <h4 style="margin:8px 0;font-family:var(--display)">{{ title }}</h4>
      <p class="price">{{ price }} <span v-if="priceNote" class="price__note">{{ priceNote }}</span></p>
    </div>
    <div>
      <p v-if="description" style="margin:0 0 12px;font-size:14px">{{ description }}</p>
      <div v-if="rules" class="shop-ficha__rules" v-html="rules" />
      <slot />
    </div>
  </div>
</template>
