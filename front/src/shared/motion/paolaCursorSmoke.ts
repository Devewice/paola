/** Rastro de llanta de moto · sprite de rodadura · huella persistente con fade lento. */
const TILE_ALONG = 18
const TILE_ACROSS = 15
const SPRITE_SCALE = 4
/** destination-out es exponencial: 0.01 ≈ 5 s; 0.07 ≈ 1 s en asfalto. */
const FADE_PER_FRAME = 0.07
const GHOST_WIPE_EVERY = 36
const GHOST_WIPE_ALPHA = 0.18
/** Sobre cards / botones / fotos: ~0.4 s. */
const FADE_UI_PER_FRAME = 0.16
const UI_WIPE_EVERY = 10
const UI_WIPE_ALPHA = 0.28
const STAMP_ALPHA = 0.48
const SKID_ALPHA = 0.58
const UI_TAGS = new Set([
  'IMG',
  'PICTURE',
  'VIDEO',
  'SVG',
  'BUTTON',
  'A',
  'INPUT',
  'TEXTAREA',
  'SELECT',
  'LABEL',
  'TABLE',
  'FIGURE',
  'CANVAS',
  'CODE',
  'PRE',
])

export interface PaolaCursorSmokeOptions {
  /** Fade del fondo vacío (~1 s). */
  fadePerFrame?: number
  /** Fade sobre UI (~0.4 s). */
  fadeUiPerFrame?: number
}

interface TreadStamp {
  x: number
  y: number
  angle: number
  scale: number
  skid: boolean
  onLight: boolean
}

interface TreadAtlas {
  trailDark: HTMLCanvasElement
  trailLight: HTMLCanvasElement
  skidDark: HTMLCanvasElement
  skidLight: HTMLCanvasElement
}

interface TrailLayer {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  fade: number
  wipeEvery: number
  wipeAlpha: number
}

function parseRgb(css: string): [number, number, number] | null {
  const match = css.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/)
  if (!match) return null
  return [Number(match[1]), Number(match[2]), Number(match[3])]
}

function luminance(r: number, g: number, b: number): number {
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255
}

function isCursorLayer(el: Element): boolean {
  return el.id === 'paola-cursor-fx' || el.id === 'paola-cursor-fx-ui'
}

function hitNode(x: number, y: number): Element | null {
  const el = document.elementFromPoint(x, y)
  if (!el || isCursorLayer(el)) return null
  return el
}

function isLightSurface(x: number, y: number): boolean {
  const el = hitNode(x, y)
  if (!el) return false

  let node: Element | null = el
  for (let depth = 0; depth < 8 && node; depth += 1) {
    if (isCursorLayer(node)) {
      node = node.parentElement
      continue
    }
    const bg = getComputedStyle(node).backgroundColor
    if (!bg || bg === 'transparent' || bg === 'rgba(0, 0, 0, 0)') {
      node = node.parentElement
      continue
    }
    const rgb = parseRgb(bg)
    if (rgb) return luminance(rgb[0], rgb[1], rgb[2]) > 0.2
    node = node.parentElement
  }

  return false
}

function isFullBleed(el: Element): boolean {
  const box = el.getBoundingClientRect()
  return box.width >= window.innerWidth * 0.85
}

function bodyRgb(): [number, number, number] {
  return parseRgb(getComputedStyle(document.body).backgroundColor) ?? [5, 7, 12]
}

function isFarFromBody(rgb: [number, number, number]): boolean {
  const body = bodyRgb()
  return Math.hypot(rgb[0] - body[0], rgb[1] - body[1], rgb[2] - body[2]) > 22
}

/** Cards, botones, fotos: sí. Asfalto / secciones a pantalla completa: no. */
function isOverUi(x: number, y: number): boolean {
  const el = hitNode(x, y)
  if (!el || el === document.body || el === document.documentElement) return false

  let node: Element | null = el
  for (let depth = 0; depth < 10 && node; depth += 1) {
    if (node === document.body || node === document.documentElement) return false
    if (isCursorLayer(node)) {
      node = node.parentElement
      continue
    }

    if (UI_TAGS.has(node.tagName)) return true

    const style = getComputedStyle(node)
    const image = style.backgroundImage
    if (image && image !== 'none' && !isFullBleed(node)) return true

    const bg = style.backgroundColor
    if (bg && bg !== 'transparent' && bg !== 'rgba(0, 0, 0, 0)') {
      const rgb = parseRgb(bg)
      if (rgb && isFarFromBody(rgb)) return true
    }

    node = node.parentElement
  }

  return false
}

function roundRectPath(
  g: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
): void {
  const radius = Math.min(r, w * 0.5, h * 0.5)
  g.beginPath()
  g.moveTo(x + radius, y)
  g.arcTo(x + w, y, x + w, y + h, radius)
  g.arcTo(x + w, y + h, x, y + h, radius)
  g.arcTo(x, y + h, x, y, radius)
  g.arcTo(x, y, x + w, y, radius)
  g.closePath()
}

function irregularPatch(
  g: CanvasRenderingContext2D,
  along: number,
  across: number,
  seed: number,
): void {
  const midY = across * 0.5
  g.beginPath()
  g.moveTo(0.4, midY)
  for (let i = 0; i <= 8; i += 1) {
    const t = i / 8
    const x = 0.4 + (along - 0.8) * t
    const wobble = Math.sin(seed + t * 9.4) * 1.1 + Math.sin(seed * 1.7 + t * 5) * 0.55
    g.lineTo(x, 1.1 + wobble * 0.35)
  }
  for (let i = 8; i >= 0; i -= 1) {
    const t = i / 8
    const x = 0.4 + (along - 0.8) * t
    const wobble = Math.cos(seed + t * 8.1) * 1.15 + Math.sin(seed * 2.1 + t * 4.2) * 0.5
    g.lineTo(x, across - 1.1 - wobble * 0.35)
  }
  g.closePath()
}

/** Sprite de contact patch: goma llena, surcos recortados (huella real, no líneas). */
function createTreadSprite(skid: boolean, onLight: boolean): HTMLCanvasElement {
  const along = TILE_ALONG
  const across = TILE_ACROSS
  const canvas = document.createElement('canvas')
  canvas.width = Math.ceil(along * SPRITE_SCALE)
  canvas.height = Math.ceil(across * SPRITE_SCALE)
  const g = canvas.getContext('2d')
  if (!g) return canvas

  g.scale(SPRITE_SCALE, SPRITE_SCALE)

  const rubber = onLight
    ? skid
      ? 'rgba(0, 16, 40, 0.48)'
      : 'rgba(0, 16, 40, 0.36)'
    : skid
      ? 'rgba(118, 128, 142, 0.52)'
      : 'rgba(108, 118, 132, 0.38)'
  const halo = onLight
    ? skid
      ? 'rgba(0, 136, 248, 0.1)'
      : 'rgba(0, 136, 248, 0.05)'
    : skid
      ? 'rgba(72, 180, 252, 0.12)'
      : 'rgba(72, 180, 252, 0.06)'

  g.save()
  g.filter = 'blur(0.85px)'
  g.fillStyle = halo
  if (skid) {
    irregularPatch(g, along, across, 2.4)
    g.fill()
  } else {
    roundRectPath(g, 0.2, 0.35, along - 0.4, across - 0.7, 4.2)
    g.fill()
  }
  g.restore()

  g.fillStyle = rubber
  if (skid) {
    irregularPatch(g, along, across, 1.1)
    g.fill()
  } else {
    roundRectPath(g, 0.55, 1.05, along - 1.1, across - 2.1, 3.4)
    g.fill()
  }

  g.globalCompositeOperation = 'destination-out'
  g.strokeStyle = '#000'
  g.lineCap = 'butt'
  g.lineJoin = 'miter'

  const mid = across * 0.5
  const period = along / 2

  g.lineWidth = skid ? 1.45 : 1.12
  for (let i = -1; i <= 2; i += 1) {
    const x = i * period + (skid ? 0.6 : 0)
    g.beginPath()
    g.moveTo(x + 0.4, mid * 0.28)
    g.lineTo(x + period * 0.58, mid)
    g.lineTo(x + 0.4, across - mid * 0.28)
    g.stroke()
  }

  g.lineWidth = skid ? 1.05 : 0.85
  g.beginPath()
  g.moveTo(0, mid)
  g.lineTo(along, mid)
  g.stroke()

  g.lineWidth = 0.62
  for (let i = 0; i < 4; i += 1) {
    const x = 1.6 + i * (along / 4)
    g.beginPath()
    g.moveTo(x, 1.35)
    g.lineTo(x + 2.4, 2.55)
    g.stroke()
    g.beginPath()
    g.moveTo(x, across - 1.35)
    g.lineTo(x + 2.4, across - 2.55)
    g.stroke()
  }

  if (skid) {
    g.lineWidth = 0.9
    g.beginPath()
    g.moveTo(along * 0.18, mid * 0.55)
    g.lineTo(along * 0.82, mid * 0.7)
    g.stroke()
    g.beginPath()
    g.moveTo(along * 0.22, across - mid * 0.5)
    g.lineTo(along * 0.78, across - mid * 0.68)
    g.stroke()
  }

  g.globalCompositeOperation = 'source-over'

  g.fillStyle = onLight ? 'rgba(0, 16, 40, 0.06)' : 'rgba(255, 255, 255, 0.04)'
  for (let n = 0; n < (skid ? 18 : 10); n += 1) {
    const gx = 1 + ((n * 37) % (along - 2))
    const gy = 2 + ((n * 19) % (across - 4))
    g.fillRect(gx, gy, 0.45, 0.45)
  }

  return canvas
}

function createTreadAtlas(): TreadAtlas {
  return {
    trailDark: createTreadSprite(false, false),
    trailLight: createTreadSprite(false, true),
    skidDark: createTreadSprite(true, false),
    skidLight: createTreadSprite(true, true),
  }
}

function pickSprite(atlas: TreadAtlas, skid: boolean, onLight: boolean): HTMLCanvasElement {
  if (skid) return onLight ? atlas.skidLight : atlas.skidDark
  return onLight ? atlas.trailLight : atlas.trailDark
}

export function initPaolaCursorSmoke(options: PaolaCursorSmokeOptions = {}): () => void {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return () => {}
  }

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return () => {}
  }

  if (window.matchMedia('(pointer: coarse)').matches) {
    return () => {}
  }

  const fadePerFrame = options.fadePerFrame ?? FADE_PER_FRAME
  const fadeUiPerFrame = options.fadeUiPerFrame ?? FADE_UI_PER_FRAME
  const atlas = createTreadAtlas()
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  const buffer = document.createElement('canvas')
  const bufferCtx = buffer.getContext('2d')

  function makeLayer(id: string, fade: number, wipeEvery: number, wipeAlpha: number): TrailLayer | null {
    const canvas = document.createElement('canvas')
    canvas.id = id
    canvas.setAttribute('aria-hidden', 'true')
    Object.assign(canvas.style, {
      position: 'fixed',
      inset: '0',
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      zIndex: id.endsWith('-ui') ? '10000' : '9999',
    })
    document.body.appendChild(canvas)
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      canvas.remove()
      return null
    }
    return { canvas, ctx, fade, wipeEvery, wipeAlpha }
  }

  const bg = makeLayer('paola-cursor-fx', fadePerFrame, GHOST_WIPE_EVERY, GHOST_WIPE_ALPHA)
  const ui = makeLayer('paola-cursor-fx-ui', fadeUiPerFrame, UI_WIPE_EVERY, UI_WIPE_ALPHA)
  if (!bg || !ui) {
    bg?.canvas.remove()
    ui?.canvas.remove()
    return () => {}
  }

  const ground: TrailLayer = bg
  const overlay: TrailLayer = ui
  const layers: TrailLayer[] = [ground, overlay]
  let raf = 0
  let lastX = 0
  let lastY = 0
  let moveAngle = 0
  let stampAccum = 0
  let primed = false
  let fadeClock = 0
  let lastScrollX = window.scrollX
  let lastScrollY = window.scrollY
  let pendingScrollX = 0
  let pendingScrollY = 0

  function sizeLayer(layer: TrailLayer): void {
    layer.canvas.width = Math.floor(window.innerWidth * dpr)
    layer.canvas.height = Math.floor(window.innerHeight * dpr)
    layer.canvas.style.width = `${window.innerWidth}px`
    layer.canvas.style.height = `${window.innerHeight}px`
    layer.ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  }

  function resize(): void {
    sizeLayer(ground)
    sizeLayer(overlay)
    buffer.width = ground.canvas.width
    buffer.height = ground.canvas.height
  }

  function shiftLayer(layer: TrailLayer, dx: number, dy: number): void {
    if (!bufferCtx) return
    const w = layer.canvas.width
    const h = layer.canvas.height
    bufferCtx.setTransform(1, 0, 0, 1, 0, 0)
    bufferCtx.clearRect(0, 0, w, h)
    bufferCtx.drawImage(layer.canvas, 0, 0)
    layer.ctx.save()
    layer.ctx.setTransform(1, 0, 0, 1, 0, 0)
    layer.ctx.clearRect(0, 0, w, h)
    layer.ctx.drawImage(buffer, -dx * dpr, -dy * dpr)
    layer.ctx.restore()
    layer.ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  }

  function shiftTrail(dx: number, dy: number): void {
    if (dx === 0 && dy === 0) return
    for (const layer of layers) shiftLayer(layer, dx, dy)
  }

  function onScroll(): void {
    const sx = window.scrollX
    const sy = window.scrollY
    pendingScrollX += sx - lastScrollX
    pendingScrollY += sy - lastScrollY
    lastScrollX = sx
    lastScrollY = sy
  }

  function drawStamp(layer: TrailLayer, stamp: TreadStamp): void {
    const sprite = pickSprite(atlas, stamp.skid, stamp.onLight)
    const w = TILE_ALONG * stamp.scale
    const h = TILE_ACROSS * stamp.scale
    layer.ctx.save()
    layer.ctx.globalAlpha = stamp.skid ? SKID_ALPHA : STAMP_ALPHA
    layer.ctx.translate(stamp.x, stamp.y)
    layer.ctx.rotate(stamp.angle)
    layer.ctx.drawImage(sprite, -w * 0.5, -h * 0.5, w, h)
    layer.ctx.restore()
  }

  function layStamp(x: number, y: number, angle: number, speed: number, skid = false): void {
    const intensity = Math.min(1, 0.28 + speed * 0.06)
    drawStamp(isOverUi(x, y) ? overlay : ground, {
      x,
      y,
      angle,
      scale: skid ? 1.08 + intensity * 0.2 : 0.84 + intensity * 0.12,
      skid,
      onLight: isLightSurface(x, y),
    })
  }

  function stampAlongSegment(
    x0: number,
    y0: number,
    x1: number,
    y1: number,
    speed: number,
    skid = false,
  ): void {
    const dx = x1 - x0
    const dy = y1 - y0
    const dist = Math.hypot(dx, dy)
    if (dist < 0.5) return

    const angle = Math.atan2(dy, dx)
    const spacing = skid ? TILE_ALONG * 0.55 : TILE_ALONG * 0.72
    let traveled = stampAccum

    while (traveled <= dist) {
      const t = traveled / dist
      layStamp(x0 + dx * t, y0 + dy * t, angle, speed, skid)
      traveled += spacing
    }

    stampAccum = traveled - dist
  }

  function onMove(event: MouseEvent): void {
    if (!primed) {
      lastX = event.clientX
      lastY = event.clientY
      primed = true
      return
    }

    const dx = event.clientX - lastX
    const dy = event.clientY - lastY
    const dist = Math.hypot(dx, dy)
    if (dist > 0.5) {
      moveAngle = Math.atan2(dy, dx)
    }

    if (dist > 1) {
      stampAlongSegment(lastX, lastY, event.clientX, event.clientY, Math.min(dist, 28))
    }

    lastX = event.clientX
    lastY = event.clientY
  }

  function onDown(event: MouseEvent): void {
    primed = true
    lastX = event.clientX
    lastY = event.clientY

    const back = moveAngle + Math.PI
    for (let i = 0; i < 7; i += 1) {
      const t = i / 6
      layStamp(
        event.clientX + Math.cos(back) * t * 22,
        event.clientY + Math.sin(back) * t * 22,
        back + (Math.random() - 0.5) * 0.18,
        16 + i,
        true,
      )
    }

    for (let i = 0; i < 10; i += 1) {
      const a = back + (Math.random() - 0.5) * 1.35
      const r = 4 + Math.random() * 16
      layStamp(
        event.clientX + Math.cos(a) * r,
        event.clientY + Math.sin(a) * r,
        a + (Math.random() - 0.5) * 0.4,
        12 + Math.random() * 10,
        true,
      )
    }

    layStamp(event.clientX, event.clientY, moveAngle, 20, true)
  }

  function fadeLayer(layer: TrailLayer): void {
    layer.ctx.save()
    layer.ctx.globalCompositeOperation = 'destination-out'
    layer.ctx.fillStyle = `rgba(0, 0, 0, ${layer.fade})`
    layer.ctx.fillRect(0, 0, window.innerWidth, window.innerHeight)
    if (fadeClock % layer.wipeEvery === 0) {
      layer.ctx.fillStyle = `rgba(0, 0, 0, ${layer.wipeAlpha})`
      layer.ctx.fillRect(0, 0, window.innerWidth, window.innerHeight)
    }
    layer.ctx.restore()
  }

  function tick(): void {
    if (pendingScrollX !== 0 || pendingScrollY !== 0) {
      shiftTrail(pendingScrollX, pendingScrollY)
      pendingScrollX = 0
      pendingScrollY = 0
    }

    fadeClock += 1
    fadeLayer(ground)
    fadeLayer(overlay)

    raf = window.requestAnimationFrame(tick)
  }

  resize()
  window.addEventListener('resize', resize)
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('mousemove', onMove, { passive: true })
  window.addEventListener('mousedown', onDown, { passive: true })
  raf = window.requestAnimationFrame(tick)

  return () => {
    window.cancelAnimationFrame(raf)
    window.removeEventListener('resize', resize)
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('mousemove', onMove)
    window.removeEventListener('mousedown', onDown)
    ground.canvas.remove()
    overlay.canvas.remove()
  }
}
