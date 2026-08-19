/** Paleta Paola — misma fuente que `docs/visual.md` y el catálogo `/admin/ui`. */
export const PAOLA_COLORS = {
  black: '#05070C',
  ink: '#000814',
  navy: '#001028',
  navyMid: '#003060',
  surface: '#0B1018',
  line: '#1A2A40',
  blue: '#0088F8',
  blueDeep: '#0068C8',
  cyan: '#48B4FC',
  cyanSoft: '#70C0F8',
  white: '#F7FAFC',
  muted: '#8B9BB0',
  danger: '#E23B4A',
  ok: '#3DDC97',
  warn: '#E8A020',
  /** Canal WhatsApp (paralelo) — apoyo, no color de marca. */
  wa: '#3DDC97',
  waText: '#7DD4A0',
  chipMuted: '#1A1F28',
  /** Tríada de voces (tono UI, no font-family). */
  loigca: '#0088F8',
  loigcaSoft: '#48B4FC',
  incauta: '#E2E8F0',
  armargura: '#C878B4',
  armarguraSoft: '#D8A0E0',
  armarguraDeep: '#783C8C',
} as const

export type PaolaColorToken = keyof typeof PAOLA_COLORS
