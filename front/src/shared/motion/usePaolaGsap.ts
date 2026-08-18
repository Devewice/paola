import gsap from 'gsap'
import { nextTick, onMounted, onUnmounted, type Ref } from 'vue'

/** Contexto GSAP con cleanup al desmontar — equivalente al useGSAP de React. */
export function usePaolaGsap(
  setup: () => void,
  scope?: Ref<Element | null | undefined>,
): void {
  let ctx: gsap.Context | undefined
  let cancelled = false

  onMounted(() => {
    void nextTick(() => {
      if (cancelled) return
      ctx = gsap.context(setup, scope?.value ?? undefined)
    })
  })

  onUnmounted(() => {
    cancelled = true
    ctx?.revert()
  })
}
