<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import PhotoViewer from './PhotoViewer.vue'
import { GALLERY_COPY } from './galleryCopy.ts'

const props = withDefaults(
  defineProps<{
    photos?: readonly { src: string; alt: string }[]
    count?: number
  }>(),
  { count: 4 },
)

const copy = GALLERY_COPY
const SWIPE_PX = 40
const index = ref(0)

watch(
  () => props.photos,
  () => {
    index.value = 0
  },
)

const list = computed(() => props.photos ?? [])
const current = computed(() => list.value[index.value] ?? list.value[0])
const backdrop = computed(() => (current.value ? { '--gallery-backdrop': `url("${current.value.src}")` } : undefined))

function go(target: number) {
  const total = list.value.length
  if (total < 2) return
  index.value = (target + total) % total
}

const viewer = ref<number | null>(null)
let swipeStart: number | null = null
/** Un deslizamiento también dispara `click`; así no abre el visor al cambiar de foto. */
let swiped = false

function onPointerDown(event: PointerEvent) {
  swipeStart = event.clientX
  swiped = false
}

function onPointerUp(event: PointerEvent) {
  if (swipeStart === null) return
  const delta = event.clientX - swipeStart
  swipeStart = null
  if (Math.abs(delta) < SWIPE_PX) return
  swiped = true
  go(delta < 0 ? index.value + 1 : index.value - 1)
}

function openViewer() {
  if (!swiped) viewer.value = index.value
}

function onViewerChange(value: number | null) {
  if (value !== null) index.value = value
  viewer.value = value
}
</script>

<template>
  <div
    v-if="current"
    class="gallery gallery--photos"
    :aria-label="copy.aria"
    tabindex="0"
    @keydown.left.prevent="go(index - 1)"
    @keydown.right.prevent="go(index + 1)"
  >
    <figure
      class="gallery__stage"
      :style="backdrop"
      @pointerdown="onPointerDown"
      @pointerup="onPointerUp"
      @pointercancel="swipeStart = null"
    >
      <button type="button" class="gallery__open" :aria-label="copy.open" @click="openViewer">
        <img :key="current.src" class="gallery__photo" :src="current.src" :alt="current.alt" draggable="false" />
      </button>
      <template v-if="list.length > 1">
        <button type="button" class="gallery__arrow gallery__arrow--prev" :aria-label="copy.prev" @click="go(index - 1)">
          {{ copy.prevGlyph }}
        </button>
        <button type="button" class="gallery__arrow gallery__arrow--next" :aria-label="copy.next" @click="go(index + 1)">
          {{ copy.nextGlyph }}
        </button>
        <figcaption class="gallery__count">{{ index + 1 }} / {{ list.length }}</figcaption>
      </template>
    </figure>

    <div v-if="list.length > 1" class="gallery__thumbs">
      <button
        v-for="(photo, photoIndex) in list"
        :key="`${photo.src}-${photoIndex}`"
        type="button"
        class="gallery__thumb"
        :class="{ 'is-on': photoIndex === index }"
        :aria-label="copy.show(photoIndex + 1)"
        :aria-current="photoIndex === index ? 'true' : undefined"
        @click="index = photoIndex"
      >
        <img :src="photo.src" alt="" loading="lazy" />
      </button>
    </div>

    <PhotoViewer :photos="list" :model-value="viewer" @update:model-value="onViewerChange" />
  </div>

  <div v-else class="gallery" :aria-label="copy.aria">
    <button
      v-for="n in count"
      :key="n"
      type="button"
      class="gallery__thumb"
      :class="{ 'is-on': n === 1 }"
      :aria-label="copy.show(n)"
    />
  </div>
</template>
