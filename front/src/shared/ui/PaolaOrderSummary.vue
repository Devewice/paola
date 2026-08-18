<script setup lang="ts">
defineProps<{
  lines: readonly { label: string; value: string }[]
  total: string
}>()
</script>

<template>
  <aside class="paola-order">
    <p class="paola-empty__kicker">Pedido</p>
    <p v-for="line in lines" :key="line.label" class="paola-ride__meta">
      {{ line.label }} · {{ line.value }}
    </p>
    <p class="paola-product__price">{{ total }}</p>
    <slot />
  </aside>
</template>
