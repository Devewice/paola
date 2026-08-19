<script setup lang="ts">
withDefaults(
  defineProps<{
    photos?: readonly { src: string; alt: string }[]
    count?: number
  }>(),
  { count: 4 },
)
</script>

<template>
  <div class="gallery" aria-label="Galería">
    <template v-if="photos?.length">
      <img
        v-for="(photo, index) in photos"
        :key="`${photo.src}-${index}`"
        class="gallery__thumb"
        :class="{ 'is-on': index === 0 }"
        :src="photo.src"
        :alt="photo.alt"
      />
    </template>
    <template v-else>
      <button
        v-for="n in count"
        :key="n"
        type="button"
        class="gallery__thumb"
        :class="{ 'is-on': n === 1 }"
        :aria-label="`Foto ${n}`"
      />
    </template>
  </div>
</template>
