/** Secciones del portal que se pueden poner «en construcción» sin borrar su contenido. */
export const SECTION_IDS = [
  'parchese-rodadas',
  'parchese-memorias',
  'parchese-el-parche',
  'tu-voz-tips',
  'tu-voz-comparendos',
  'tu-voz-reportes',
  'tu-voz-encuestas',
  'tienda',
  'feed',
] as const

export const SECTIONS_TABLE = 'site_sections'

export const SECTIONS_LIMITS = {
  NOTE_MAX: 280,
} as const

export const SECTIONS_ROUTES = {
  LIST: '/api/sections',
  UPDATE: '/api/operar/sections/:id',
} as const

export const SECTIONS_MESSAGES = {
  UNKNOWN: 'Esa sección no existe.',
  NOTE_TOO_LONG: 'La nota es muy larga.',
} as const
