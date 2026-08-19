<script setup lang="ts">
defineProps<{
  lines: readonly { title: string; qty: string; price: string; thumb?: string }[]
  total: string
}>()
</script>

<template>
  <div class="cart-panel">
    <div v-for="line in lines" :key="line.title" class="cart-line">
      <div class="cart-line__thumb">{{ line.thumb ?? 'Img' }}</div>
      <div>
        <strong>{{ line.title }}</strong><br />
        <span class="meta">{{ line.qty }}</span>
      </div>
      <span class="cart-line__price">{{ line.price }}</span>
    </div>
    <div class="cart-panel__total"><span>Total</span><span>{{ total }}</span></div>
    <slot />
  </div>
</template>
