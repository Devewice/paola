<script setup lang="ts">
defineProps<{
  lines: readonly { label: string; value: string }[]
  total: string
}>()
</script>

<template>
  <div class="order-summary">
    <div v-for="line in lines" :key="line.label" class="order-summary__line">
      <span>{{ line.label }}</span>
      <span>{{ line.value }}</span>
    </div>
    <div class="order-summary__total">
      <span>Total</span>
      <span>{{ total }}</span>
    </div>
    <slot />
  </div>
</template>
