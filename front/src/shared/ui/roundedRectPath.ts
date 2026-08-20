/** Path SVG de un rectángulo redondeado, empezando arriba al centro y en sentido horario. */
export function roundedRectPath(width: number, height: number, radius: number): string {
  if (width < 1 || height < 1) return ''
  const r = Math.min(radius, width / 2, height / 2)
  return asymmetricRoundedRectPath(
    width,
    height,
    [r / width, r / width, r / width, r / width],
    [r / height, r / height, r / height, r / height],
  )
}

/**
 * Misma forma que `border-radius: hx0 hx1 hx2 hx3 / hy0 hy1 hy2 hy3` (fracciones 0–1).
 * Orden: top-left, top-right, bottom-right, bottom-left.
 */
export function asymmetricRoundedRectPath(
  width: number,
  height: number,
  hx: readonly [number, number, number, number],
  hy: readonly [number, number, number, number],
): string {
  if (width < 1 || height < 1) return ''

  const clampPair = (a: number, b: number, max: number): [number, number] => {
    const sum = a + b
    if (sum <= max || sum <= 0) return [a, b]
    const scale = max / sum
    return [a * scale, b * scale]
  }

  let rtlX = Math.max(0, hx[0]) * width
  let rtrX = Math.max(0, hx[1]) * width
  let rbrX = Math.max(0, hx[2]) * width
  let rblX = Math.max(0, hx[3]) * width
  let rtlY = Math.max(0, hy[0]) * height
  let rtrY = Math.max(0, hy[1]) * height
  let rbrY = Math.max(0, hy[2]) * height
  let rblY = Math.max(0, hy[3]) * height

  ;[rtlX, rtrX] = clampPair(rtlX, rtrX, width)
  ;[rblX, rbrX] = clampPair(rblX, rbrX, width)
  ;[rtlY, rblY] = clampPair(rtlY, rblY, height)
  ;[rtrY, rbrY] = clampPair(rtrY, rbrY, height)

  return [
    `M ${width / 2} 0`,
    `L ${width - rtrX} 0`,
    `A ${rtrX} ${rtrY} 0 0 1 ${width} ${rtrY}`,
    `L ${width} ${height - rbrY}`,
    `A ${rbrX} ${rbrY} 0 0 1 ${width - rbrX} ${height}`,
    `L ${rblX} ${height}`,
    `A ${rblX} ${rblY} 0 0 1 0 ${height - rblY}`,
    `L 0 ${rtlY}`,
    `A ${rtlX} ${rtlY} 0 0 1 ${rtlX} 0`,
    `L ${width / 2} 0`,
  ].join(' ')
}

export function pointOnRoundedRectPath(
  path: SVGPathElement,
  progress: number,
): { x: number; y: number; tangent: number } {
  const total = path.getTotalLength()
  if (total < 1) return { x: 0, y: 0, tangent: -90 }
  const t = Math.max(0, Math.min(1, progress / 100))
  const at = t * total
  const pt = path.getPointAtLength(at)
  const ahead = path.getPointAtLength(Math.min(at + 2, total))
  const tangent = (Math.atan2(ahead.y - pt.y, ahead.x - pt.x) * 180) / Math.PI
  return { x: pt.x, y: pt.y, tangent }
}
