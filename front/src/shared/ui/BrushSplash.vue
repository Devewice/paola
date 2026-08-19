<script setup lang="ts">
withDefaults(
  defineProps<{
    label: string
    tone?: 'blue' | 'white'
    size?: 'md' | 'sm'
  }>(),
  { tone: 'blue', size: 'md' },
)
</script>

<template>
  <span
    class="brush-splash"
    :class="{
      'brush-splash--blue': tone === 'blue',
      'brush-splash--white': tone === 'white',
      'brush-splash--sm': size === 'sm',
    }"
  >
    <svg viewBox="0 0 320 48" preserveAspectRatio="none" aria-hidden="true">
      <use :href="tone === 'white' ? '#brush-splash-white' : '#brush-splash-blue'" />
    </svg>
    <span class="brush-splash__label">{{ label }}</span>
  </span>
</template>
