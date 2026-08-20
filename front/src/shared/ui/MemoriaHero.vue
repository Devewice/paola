<script setup lang="ts">
import { computed } from 'vue'
import MediaPlaceholder from '@ui/MediaPlaceholder.vue'

const props = defineProps<{
  title: string
  meta: string
  photoSrc?: string
  photoLabel?: string
}>()

const heroStyle = computed(() => {
  if (!props.photoSrc) return undefined
  return {
    backgroundImage: `linear-gradient(180deg, transparent 30%, rgba(5, 7, 12, 0.95)), url("${props.photoSrc}")`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }
})
</script>

<template>
  <div
    class="memoria-hero"
    :class="{ 'memoria-hero--photo': !!photoSrc, 'memoria-hero--empty': !photoSrc }"
    :style="heroStyle"
  >
    <MediaPlaceholder
      v-if="!photoSrc"
      class="memoria-hero__placeholder"
      :label="photoLabel ?? 'Imagen'"
      aspect="16 / 9"
    />
    <div class="memoria-hero__text">
      <h3>{{ title }}</h3>
      <p>{{ meta }}</p>
    </div>
  </div>
</template>
