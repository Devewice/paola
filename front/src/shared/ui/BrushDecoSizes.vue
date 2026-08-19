<script setup lang="ts">
import Icon from '@ui/Icon.vue'

const demos: {
  size: 'sm' | 'md' | 'lg'
  tone?: 'cyan' | 'white' | 'blue'
  label: string
  muted?: boolean
}[] = [
  { size: 'sm', tone: 'cyan', label: '24px · sm' },
  { size: 'md', tone: 'blue', label: '32px · md' },
  { size: 'lg', tone: 'blue', label: '40px · lg' },
  { size: 'md', tone: 'cyan', label: 'cian' },
  { size: 'md', tone: 'white', label: 'blanco' },
  { size: 'md', tone: 'blue', label: 'muted', muted: true },
]
</script>

<template>
  <div class="brush-deco-sizes">
    <div v-for="demo in demos" :key="demo.label" class="brush-deco-sizes__col">
      <Icon
        name="heart"
        :size="demo.size"
        :tone="demo.tone === 'cyan' ? 'cyan' : demo.tone === 'white' ? 'white' : 'blue'"
        :circle="false"
        :class="demo.muted ? 'brush-icon--muted' : undefined"
      />
      <span>{{ demo.label }}</span>
    </div>
  </div>
</template>
