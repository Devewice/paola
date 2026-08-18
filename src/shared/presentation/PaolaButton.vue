<script setup lang="ts">
withDefaults(
  defineProps<{
    href?: string
    variant?: 'primary' | 'ghost'
  }>(),
  { variant: 'primary' },
)
</script>

<template>
  <a v-if="href" :href="href" class="paola-btn" :class="`paola-btn--${variant}`">
    <slot />
  </a>
  <button v-else type="button" class="paola-btn" :class="`paola-btn--${variant}`">
    <slot />
  </button>
</template>
