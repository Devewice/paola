import gsap from 'gsap'
import { prefersReducedMotion } from '@shared/motion/prefersReducedMotion.ts'

let flickerRoot: gsap.Context | null = null

export function stopLoginNeonFlicker(): void {
  flickerRoot?.revert()
  flickerRoot = null
}

/** Parpadeo irregular tipo tubo neon averiado (solo letras cyan = «cuenta»). */
function startFaultyFlicker(chars: HTMLElement[]): void {
  flickerRoot?.revert()
  if (!chars.length) return

  flickerRoot = gsap.context(() => {
    chars.forEach((el) => {
      const tick = () => {
        if (!el.isConnected) return
        const wait = 0.9 + Math.random() * 2.8
        gsap.delayedCall(wait, () => {
          if (!el.isConnected) return
          const burst = gsap.timeline({ onComplete: tick })
          burst.to(el, { opacity: 0.15 + Math.random() * 0.3, duration: 0.04, ease: 'none' })
          burst.to(el, { opacity: 1, duration: 0.05, ease: 'none' })
          if (Math.random() > 0.45) {
            burst.to(el, { opacity: 0.35, duration: 0.03, ease: 'none' })
            burst.to(el, { opacity: 1, duration: 0.06, ease: 'none' })
          }
          if (Math.random() > 0.75) {
            burst.to(el, { opacity: 0.2, duration: 0.025, ease: 'none' })
            burst.to(el, { opacity: 1, duration: 0.08, ease: 'none' })
          }
        })
      }
      gsap.delayedCall(0.4 + Math.random() * 1.2, tick)
    })
  })
}

/**
 * Login eléctrico: apagado → enciende de arriba abajo, uno tras otro.
 * «cuenta» (cyan) queda con parpadeo neon averiado.
 */
export function runLoginNeon(root: HTMLElement | null): gsap.core.Timeline | null {
  if (!root) return null

  stopLoginNeonFlicker()

  const chars = Array.from(root.querySelectorAll<HTMLElement>('[data-neon="char"]'))
  const cyanChars = chars.filter((el) => el.classList.contains('login-neon-char--cyan'))
  const blocks = Array.from(root.querySelectorAll<HTMLElement>('[data-neon="block"]'))
  const glow = root.querySelector<HTMLElement>('[data-neon="glow"]')

  root.classList.add('login-screen--cold')
  root.classList.remove('login-screen--lit')

  if (prefersReducedMotion()) {
    root.classList.remove('login-screen--cold')
    root.classList.add('login-screen--lit')
    return null
  }

  gsap.set(chars, { clearProps: 'opacity,color,textShadow,filter' })
  gsap.set(blocks, { clearProps: 'opacity,filter' })
  if (glow) gsap.set(glow, { clearProps: 'opacity' })

  const tl = gsap.timeline({
    defaults: { ease: 'power2.out' },
    onComplete: () => {
      gsap.set(
        chars.filter((el) => !el.classList.contains('login-neon-char--cyan')),
        { clearProps: 'opacity,color' },
      )
      gsap.set(cyanChars, { clearProps: 'color' })
      gsap.set(blocks, { clearProps: 'opacity' })
      root.classList.remove('login-screen--cold')
      root.classList.add('login-screen--lit')
      startFaultyFlicker(cyanChars)
    },
  })

  if (glow) {
    tl.fromTo(glow, { opacity: 0.06 }, { opacity: 0.55, duration: 0.85 }, 0)
  }

  const charStep = 0.08
  const charStart = 0.1
  chars.forEach((el, index) => {
    const at = charStart + index * charStep
    const litColor = el.classList.contains('login-neon-char--cyan') ? '#48b4fc' : '#f7fafc'
    tl.fromTo(
      el,
      { opacity: 0.04, color: '#1a2a40' },
      { opacity: 1, color: litColor, duration: 0.1 },
      at,
    )
    tl.to(el, { opacity: 0.3, duration: 0.03, yoyo: true, repeat: 1 }, at + 0.08)
    tl.to(el, { opacity: 1, duration: 0.06 }, at + 0.16)
  })

  const afterChars = charStart + Math.max(chars.length, 1) * charStep + 0.2
  const blockStep = 0.14
  blocks.forEach((el, index) => {
    tl.fromTo(
      el,
      { opacity: 0.04 },
      { opacity: 1, duration: 0.28 },
      afterChars + index * blockStep,
    )
  })

  return tl
}

const ALERT_COLOR = {
  bad: '#e23b4a',
  warn: '#e8a020',
  ok: '#3ddc97',
} as const

let alertTl: gsap.core.Timeline | null = null

/** Acompaña Alert: las letras cyan («cuenta») cambian de color y parpadean. */
export function flashLoginNeonAlert(
  root: HTMLElement | null,
  tone: keyof typeof ALERT_COLOR = 'bad',
): void {
  if (!root || prefersReducedMotion()) return

  const cyanChars = Array.from(
    root.querySelectorAll<HTMLElement>('.login-neon-char--cyan'),
  )
  if (!cyanChars.length) return

  stopLoginNeonFlicker()
  alertTl?.kill()

  const color = ALERT_COLOR[tone]
  alertTl = gsap.timeline({
    onComplete: () => {
      gsap.to(cyanChars, {
        color: '#48b4fc',
        opacity: 1,
        duration: 0.35,
        ease: 'power2.out',
        onComplete: () => startFaultyFlicker(cyanChars),
      })
    },
  })

  alertTl.to(cyanChars, {
    color,
    opacity: 1,
    duration: 0.12,
    stagger: 0.04,
    ease: 'power2.out',
  })
  alertTl.to(cyanChars, {
    opacity: 0.25,
    duration: 0.07,
    yoyo: true,
    repeat: 5,
    ease: 'none',
  })
  alertTl.to(cyanChars, { color, opacity: 1, duration: 0.15 })
}

export function stopLoginNeonAlert(): void {
  alertTl?.kill()
  alertTl = null
}
