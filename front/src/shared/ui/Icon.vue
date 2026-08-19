<script setup lang="ts">
withDefaults(
  defineProps<{
    name: string
    size?: 'sm' | 'md' | 'lg'
    tone?: 'blue' | 'cyan' | 'white'
    circle?: boolean
  }>(),
  { size: 'md', tone: 'blue', circle: true },
)
</script>

<template>
  <svg
    class="brush-icon"
    :class="[
      size !== 'md' ? `brush-icon--${size}` : '',
      tone === 'cyan' ? 'brush-icon--cyan' : '',
      tone === 'white' ? 'brush-icon--white' : '',
      circle ? 'brush-icon--circle' : '',
    ]"
    viewBox="0 0 32 32"
    aria-hidden="true"
  >
    <use :href="`#bd-${name}`" />
  </svg>
</template>
