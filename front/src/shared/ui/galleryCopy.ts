export const GALLERY_COPY = {
  aria: 'Galería',
  open: 'Ver la foto en grande',
  prev: 'Foto anterior',
  next: 'Foto siguiente',
  prevGlyph: '‹',
  nextGlyph: '›',
  show: (n: number) => `Ver foto ${n}`,
  viewer: 'Visor de fotos',
  close: 'Cerrar',
  closeGlyph: '×',
  hint: 'Pellizca o toca dos veces para acercar · desliza para cambiar',
  hintZoomed: 'Arrastra para moverte · toca dos veces para restablecer',
} as const

export const VIEWER_LIMITS = {
  MAX_SCALE: 4,
  DOUBLE_TAP_SCALE: 2.5,
  DOUBLE_TAP_MS: 300,
  DOUBLE_TAP_PX: 30,
  TAP_SLOP_PX: 8,
  SWIPE_PX: 60,
  CLOSE_SWIPE_PX: 120,
  WHEEL_SPEED: 0.0015,
} as const
