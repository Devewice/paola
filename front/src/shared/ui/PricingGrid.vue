<script setup lang="ts">
defineProps<{
  plans: readonly { name: string; price: string; note: string; featured?: boolean }[]
}>()
</script>

<template>
  <div class="pricing-grid">
    <div v-for="plan in plans" :key="plan.name" class="pricing-card" :class="{ 'is-featured': plan.featured }">
      <strong>{{ plan.name }}</strong>
      <div class="pricing-card__price">{{ plan.price }}</div>
      <p class="meta" style="margin: 0">{{ plan.note }}</p>
    </div>
  </div>
</template>
