<script setup lang="ts">
withDefaults(
  defineProps<{
    label?: string
    aspect?: string
  }>(),
  {
    label: 'Imagen',
    aspect: '16 / 10',
  },
)
</script>

<template>
  <div class="media-placeholder" :style="{ aspectRatio: aspect }" role="img" :aria-label="label">
    <span class="media-placeholder__label">{{ label }}</span>
  </div>
</template>
