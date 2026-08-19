<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'base' | 'hot' | 'double'
  }>(),
  { variant: 'base' },
)
</script>

<template>
  <article
    class="card"
    :class="{
      'card-hot': variant === 'hot',
      'card-double': variant === 'double',
    }"
  >
    <slot />
  </article>
</template>
