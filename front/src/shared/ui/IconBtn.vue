<script setup lang="ts">
import Icon from '@ui/Icon.vue'

defineProps<{
  name: string
  label: string
  tone?: 'blue' | 'cyan' | 'white'
  wa?: boolean
}>()
</script>

<template>
  <button type="button" class="icon-btn" :class="{ 'icon-btn--wa': wa }" :aria-label="label">
    <Icon :name="name" :circle="false" size="sm" :tone="tone" />
  </button>
</template>
