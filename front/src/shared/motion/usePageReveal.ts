import { ref, type ComponentPublicInstance } from 'vue'
import { staggerReveal } from '@shared/motion/staggerReveal.ts'
import { usePaolaGsap } from '@shared/motion/usePaolaGsap.ts'

/** Stagger de bloques `[data-reveal]` al montar la vista. */
export function usePageReveal() {
  const root = ref<HTMLElement | null>(null)

  usePaolaGsap(() => {
    const nodes = root.value?.querySelectorAll('[data-reveal]')
    if (nodes?.length) staggerReveal(nodes)
  }, root)

  return (el: Element | ComponentPublicInstance | null) => {
    root.value = el instanceof HTMLElement ? el : null
  }
}
