<script setup lang="ts">
import Icon from '@ui/Icon.vue'

defineProps<{
  items: readonly { icon: string; label: string; tone?: 'cyan' | 'white' | 'muted' }[]
}>()
</script>

<template>
  <div class="brush-deco-grid">
    <div v-for="item in items" :key="item.label" class="brush-deco-item">
      <Icon
        :name="item.icon"
        :tone="item.tone === 'cyan' ? 'cyan' : item.tone === 'white' ? 'white' : 'blue'"
        :circle="false"
        :class="item.tone === 'muted' ? 'brush-icon--muted' : item.tone === 'cyan' ? 'brush-icon--cyan' : undefined"
      />
      <span class="brush-deco-item__label">{{ item.label }}</span>
    </div>
  </div>
</template>
