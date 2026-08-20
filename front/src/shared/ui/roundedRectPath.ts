/** Path SVG de un rectángulo redondeado, empezando arriba al centro y en sentido horario. */
export function roundedRectPath(width: number, height: number, radius: number): string {
  if (width < 1 || height < 1) return ''
  const r = Math.min(radius, width / 2, height / 2)
  return [
    `M ${width / 2} 0`,
    `L ${width - r} 0`,
    `A ${r} ${r} 0 0 1 ${width} ${r}`,
    `L ${width} ${height - r}`,
    `A ${r} ${r} 0 0 1 ${width - r} ${height}`,
    `L ${r} ${height}`,
    `A ${r} ${r} 0 0 1 0 ${height - r}`,
    `L 0 ${r}`,
    `A ${r} ${r} 0 0 1 ${r} 0`,
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
