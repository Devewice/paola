<script setup lang="ts">
import Icon from '@ui/Icon.vue'

defineProps<{
  items: readonly { icon: string; label: string; tone?: 'blue' | 'cyan' | 'white' }[]
}>()
</script>

<template>
  <div class="gear-grid">
    <div v-for="item in items" :key="item.label" class="gear-grid__item">
      <Icon :name="item.icon" size="sm" :tone="item.tone" :circle="false" />
      {{ item.label }}
    </div>
  </div>
</template>
