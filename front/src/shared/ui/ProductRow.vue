<script setup lang="ts">
defineProps<{
  title: string
  meta: string
  price: string
  thumb?: string
}>()
</script>

<template>
  <div class="product-row">
    <div class="product-row__thumb">{{ thumb ?? 'Img' }}</div>
    <div class="product-row__body">
      <p class="product-row__title">{{ title }}</p>
      <p class="product-row__meta">{{ meta }}</p>
    </div>
    <span class="price" style="font-size: 18px">{{ price }}</span>
  </div>
</template>
