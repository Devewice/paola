<script setup lang="ts">
import Button from '@ui/Button.vue'
import EngageBar from '@ui/EngageBar.vue'
import Gallery from '@ui/Gallery.vue'

const props = withDefaults(
  defineProps<{
    author: string
    body: string
    meta: string
    photos?: readonly string[]
    photoAlt?: string
    highlighted?: boolean
    pinned?: boolean
    canModerate?: boolean
    hideLabel?: string
    pinLabel?: string
  }>(),
  { photoAlt: '', hideLabel: 'Ocultar', pinLabel: 'Fijar' },
)

const emit = defineEmits<{
  react: [reaction: string]
  share: []
  hide: []
  pin: []
}>()

const gallery = () => (props.photos ?? []).map((src) => ({ src, alt: props.photoAlt || props.author }))
</script>

<template>
  <article class="feed-post">
    <div class="feed-post__head">
      <span class="feed-post__from">{{ author }}</span>
      <span class="meta">
        {{ meta }}
        <template v-if="pinned"> · Fijado</template>
        <template v-if="highlighted"> · Destacado</template>
      </span>
    </div>
    <p style="margin: 0">{{ body }}</p>
    <Gallery v-if="photos?.length" :photos="gallery()" />
    <EngageBar @react="emit('react', $event)" @share="emit('share')" />
    <div v-if="canModerate" class="paola-feed__mod">
      <Button size="sm" variant="ghost" type="button" @click="emit('hide')">{{ hideLabel }}</Button>
      <Button size="sm" variant="ghost" type="button" @click="emit('pin')">{{ pinLabel }}</Button>
    </div>
    <slot />
  </article>
</template>
