<script setup lang="ts">
withDefaults(
  defineProps<{
    count?: number
  }>(),
  { count: 6 },
)
</script>

<template>
  <div class="paola-gallery" aria-label="Galería">
    <span v-for="n in count" :key="n" />
  </div>
</template>
