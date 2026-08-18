import gsap from 'gsap'
import { onMounted, onUnmounted, type Ref } from 'vue'

/** Contexto GSAP con cleanup al desmontar — equivalente al useGSAP de React. */
export function usePaolaGsap(
  setup: () => void,
  scope?: Ref<Element | null | undefined>,
): void {
  let ctx: gsap.Context | undefined

  onMounted(() => {
    ctx = gsap.context(setup, scope?.value ?? undefined)
  })

  onUnmounted(() => {
    ctx?.revert()
  })
}
