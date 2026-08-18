import { autoAnimatePlugin } from '@formkit/auto-animate/vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { initPaolaCursorSmoke } from '@shared/motion/paolaCursorSmoke.ts'
import type { App } from 'vue'

let registered = false

export function registerPaolaMotion(): void {
  if (registered) return
  gsap.registerPlugin(ScrollTrigger)
  registered = true
}

export function createMotionPlugin() {
  registerPaolaMotion()

  return {
    install(app: App) {
      app.use(autoAnimatePlugin)
      if (typeof window !== 'undefined') {
        initPaolaCursorSmoke()
      }
    },
  }
}
