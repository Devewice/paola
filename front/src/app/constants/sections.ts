export type SiteSectionId =
  | 'parchese-rodadas'
  | 'parchese-memorias'
  | 'parchese-el-parche'
  | 'tu-voz-tips'
  | 'tu-voz-comparendos'
  | 'tu-voz-reportes'
  | 'tu-voz-encuestas'
  | 'tienda'
  | 'feed'

export const SITE_SECTIONS: readonly { readonly id: SiteSectionId; readonly label: string; readonly area: string }[] = [
  { id: 'parchese-rodadas', label: 'Rodadas', area: 'Parchese' },
  { id: 'parchese-memorias', label: 'Memorias', area: 'Parchese' },
  { id: 'parchese-el-parche', label: 'El parche', area: 'Parchese' },
  { id: 'tu-voz-tips', label: 'Tips', area: 'Tu voz' },
  { id: 'tu-voz-comparendos', label: 'Comparendos', area: 'Tu voz' },
  { id: 'tu-voz-reportes', label: 'Reportes', area: 'Tu voz' },
  { id: 'tu-voz-encuestas', label: 'Encuestas', area: 'Tu voz' },
  { id: 'tienda', label: 'Tienda', area: 'Tienda' },
  { id: 'feed', label: 'Feed', area: 'Comunidad' },
]

export const SECTIONS_ADMIN_COPY = {
  title: 'Secciones',
  lead: 'Apaga una sección y el público verá «en construcción». No se borra nada: tú la sigues viendo y la enciendes cuando quieras.',
  on: 'Publicada',
  off: 'En construcción',
  noteLabel: 'Mensaje para el público (opcional)',
  notePlaceholder: 'Ej.: estoy preparando los resultados de mi investigación.',
  save: 'Guardar',
  saved: 'Sección guardada.',
  saveFail: 'No se pudo guardar la sección.',
  loadFail: 'No se pudieron cargar las secciones.',
} as const

export const TIPS_BUILDING_COPY = {
  title: 'Tips en construcción',
  body: 'Estoy terminando una investigación sobre educación vial con motociclistas de Bogotá. Cuando esté lista, aquí van los resultados.',
} as const

export const SECTION_GATE_COPY = {
  adminBanner: 'Esta sección está en construcción: el público ve el aviso. Tú la ves porque tienes acceso al panel.',
  adminCta: 'Cambiar en el panel',
} as const
