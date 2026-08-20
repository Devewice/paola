<script setup lang="ts">
import { onMounted, ref } from 'vue'
import gsap from 'gsap'
import { prefersReducedMotion } from '@shared/motion/prefersReducedMotion.ts'
import { usePaolaGsap } from '@shared/motion/usePaolaGsap.ts'
import { MASCOT_FLASH, MASCOT_FRAMES } from '@shared/ui/mascot.ts'

const props = withDefaults(
  defineProps<{
    frames?: readonly string[]
    alt?: string
  }>(),
  { frames: () => MASCOT_FRAMES, alt: '' },
)

const root = ref<HTMLElement | null>(null)
const burst = ref<HTMLElement | null>(null)
const shot = ref<HTMLElement | null>(null)
const index = ref(0)

onMounted(() => {
  for (const src of props.frames) {
    const preload = new Image()
    preload.src = src
  }
})

usePaolaGsap(() => {
  const flash = burst.value
  const photo = shot.value
  if (!flash || !photo || props.frames.length < 2 || prefersReducedMotion()) return

  gsap.set(flash, { opacity: 0 })
  gsap.set(photo, { scale: 1, transformOrigin: '50% 55%' })

  const tl = gsap.timeline({ repeat: -1 })
  tl.to({}, { duration: MASCOT_FLASH.hold })
  tl.to(flash, { opacity: 1, duration: MASCOT_FLASH.pop, ease: 'power1.out' })
  tl.add(() => {
    index.value = (index.value + 1) % props.frames.length
  })
  tl.fromTo(photo, { scale: 1.08 }, { scale: 1, duration: 0.4, ease: 'power2.out' }, '<')
  tl.to(flash, { opacity: 0, duration: MASCOT_FLASH.fade, ease: 'power2.in' }, '<')
}, root)
</script>

<template>
  <div ref="root" class="mascot-flash">
    <img
      ref="shot"
      class="mascot-flash__shot paola-empty__mascot"
      :src="frames[index]"
      :alt="alt"
      width="150"
      height="150"
    />
    <span ref="burst" class="mascot-flash__burst" aria-hidden="true" />
  </div>
</template>
