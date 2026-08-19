/** Tokens de movimiento Paola — misma fuente en Vue (`/admin/ui`). */
export const MOTION = {
  duration: {
    ui: 0.18,
    uiSlow: 0.22,
    reveal: 0.35,
    hero: 2.8,
  },
  ease: {
    ui: 'power2.out',
    enter: 'power2.out',
    exit: 'power2.in',
  },
  stagger: {
    tight: 0.04,
    cards: 0.06,
    sections: 0.1,
  },
  offset: {
    y: 24,
    ySubtle: 12,
  },
} as const

export type MotionTokens = typeof MOTION
