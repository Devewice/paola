<script setup lang="ts">
withDefaults(
  defineProps<{
    photos?: readonly { src: string; alt: string }[]
    count?: number
  }>(),
  { count: 6 },
)
</script>

<template>
  <div class="paola-gallery" aria-label="Galería">
    <template v-if="photos?.length">
      <img v-for="(photo, index) in photos" :key="`${photo.src}-${index}`" :src="photo.src" :alt="photo.alt" />
    </template>
    <template v-else>
      <span v-for="n in count" :key="n" />
    </template>
  </div>
</template>
