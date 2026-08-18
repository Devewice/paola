import gsap from 'gsap'
import { prefersReducedMotion } from '@shared/motion/prefersReducedMotion.ts'
import { MOTION } from '@shared/motion/tokens.ts'

export type StaggerRevealOptions = {
  y?: number
  stagger?: number
  delay?: number
  duration?: number
}

export function staggerReveal(
  targets: gsap.TweenTarget,
  options?: StaggerRevealOptions,
): gsap.core.Tween | null {
  if (prefersReducedMotion()) {
    gsap.set(targets, { opacity: 1, y: 0 })
    return null
  }

  return gsap.fromTo(
    targets,
    { y: options?.y ?? MOTION.offset.y, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: options?.duration ?? MOTION.duration.reveal,
      stagger: options?.stagger ?? MOTION.stagger.cards,
      delay: options?.delay ?? 0,
      ease: MOTION.ease.enter,
    },
  )
}
