import gsap from 'gsap'

function runKitHeroPhotoMotion(photo: Element | null): void {
  if (!photo) return
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduced) {
    gsap.set(photo, { scale: 1, x: 0, y: 0 })
    return
  }
  gsap.fromTo(
    photo,
    { scale: 1.1 },
    {
      scale: 1,
      duration: 2.4,
      ease: 'power2.out',
      onComplete() {
        gsap.to(photo, {
          scale: 1.07,
          x: '-1.2%',
          y: '-0.8%',
          duration: 16,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        })
      },
    },
  )
}

function isBrushType(el: Element): boolean {
  return (
    el.classList.contains('type-brush-dry') ||
    el.classList.contains('type-brush-script') ||
    el.classList.contains('type-brush-hand') ||
    el.classList.contains('type-condensed') ||
    el.classList.contains('type-stamped')
  )
}

export function runKitHeroEntrance(rootId: string): void {
  const root = document.getElementById(rootId)
  if (!root) return
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const items = [...root.querySelectorAll('.kit-hero__anim:not(.kit-hero__anim--panel)')]
  const panel = root.querySelector('.kit-hero__anim--panel')
  const photo = root.querySelector('.kit-hero__photo')
  if (!items.length && !panel && !photo) return
  const targets = [...items, panel, photo].filter(Boolean)
  if (reduced) {
    gsap.set(targets, { opacity: 1, y: 0, x: 0, scale: 1 })
    return
  }
  runKitHeroPhotoMotion(photo)
  const brush = items.filter(isBrushType)
  const rest = items.filter((el) => !isBrushType(el))
  const delay = rootId === 'hero-portal' ? 0.08 : 0.12
  if (brush.length) {
    gsap.to(brush, {
      opacity: 1,
      duration: 0.45,
      stagger: 0.06,
      ease: 'power2.out',
      delay,
    })
  }
  if (rest.length) {
    gsap.to(rest, {
      y: 0,
      opacity: 1,
      duration: 0.45,
      stagger: 0.06,
      ease: 'power2.out',
      delay,
    })
  }
  if (panel) {
    gsap.to(panel, {
      y: 0,
      x: 0,
      opacity: 1,
      duration: 0.55,
      ease: 'power2.out',
      delay: 0.35,
    })
  }
}
