import { APP_PATHS, appTiendaEstanteria } from '@shared/http/constants.ts'

const SHOP_SHELVES = {
  OWN: 'own',
  COLLAB: 'collab',
  SERVICE: 'service',
} as const

export type NavLink = {
  readonly label: string
  readonly to?: string
  readonly href?: string
  readonly note?: string
}

export type MegaColumn = {
  readonly title: string
  readonly copy?: string
  readonly links: readonly NavLink[]
}

export type MegaNavItem = {
  readonly label: string
  readonly to: string
  readonly lead?: string
  readonly cta?: string
  /** Si hay columnas, abre megamenú y muestra chevron. */
  readonly columns?: readonly MegaColumn[]
}

export const MEGA_NAV: readonly MegaNavItem[] = [
  {
    label: 'Inicio',
    to: APP_PATHS.INICIO,
  },
  {
    label: 'Parchese',
    to: APP_PATHS.PARCHESE,
    lead: 'Las rodadas, cómo unirse y quiénes ya son del parche.',
    cta: 'Ir a Parchese',
    columns: [
      {
        title: 'Parchese',
        links: [
          { label: 'Rodadas', note: 'Fecha, cupo y punto de encuentro', to: APP_PATHS.PARCHESE_RODADAS },
          { label: 'Memorias', note: 'Fotos y kilómetros de cada salida', to: APP_PATHS.PARCHESE_MEMORIAS },
          { label: 'El parche', note: 'Quiénes ruedan y quiénes apoyan', to: APP_PATHS.PARCHESE_EL_PARCHE },
          { label: 'Feed', note: 'Lo que se comenta y se sube', to: APP_PATHS.FEED },
        ],
      },
    ],
  },
  {
    label: 'Tu voz',
    to: APP_PATHS.TU_VOZ,
    lead: 'Tips de vía, comparendos, reportes y encuestas.',
    cta: 'Ir a Tu voz',
    columns: [
      {
        title: 'Tu voz',
        links: [
          { label: 'Tips de vía', note: 'Seguridad y ley, sin rodeos', to: APP_PATHS.TU_VOZ_TIPS },
          { label: 'Comparendos', note: 'Cómo leerlos y dónde consultar', to: APP_PATHS.TU_VOZ_COMPARENDOS },
          { label: 'Reportes', note: 'Cuenta lo que pasó en la vía', to: APP_PATHS.TU_VOZ_REPORTES },
          { label: 'Encuestas', note: 'Decide rutas y fechas con el parche', to: APP_PATHS.TU_VOZ_ENCUESTAS },
        ],
      },
    ],
  },
  {
    label: 'Tienda',
    to: APP_PATHS.TIENDA,
    lead: 'Marca propia, colaboraciones y lavado de casco.',
    cta: 'Ir a Tienda',
    columns: [
      {
        title: 'Tienda',
        links: [
          { label: 'Marca Paola', note: 'Ropa y recuerdos con la marca del parche', to: appTiendaEstanteria(SHOP_SHELVES.OWN) },
          { label: 'Colaboraciones', note: 'Productos hechos con las alianzas', to: appTiendaEstanteria(SHOP_SHELVES.COLLAB) },
          { label: 'Lavado de casco', note: 'Si queda mal, lo corrijo', to: appTiendaEstanteria(SHOP_SHELVES.SERVICE) },
        ],
      },
    ],
  },
  {
    label: 'Paola',
    to: APP_PATHS.PAOLA,
    lead: 'Quién soy y cómo escribirme.',
    cta: 'Conóceme',
    columns: [
      {
        title: 'Paola',
        links: [
          { label: 'Quién soy', note: 'De Usme a la carretera', to: `${APP_PATHS.PAOLA}#quien` },
          { label: 'Contacto', note: 'Escríbeme por WhatsApp o correo', to: `${APP_PATHS.PAOLA}#contacto` },
        ],
      },
    ],
  },
] as const

export const MEGA_FOOTER_COLUMNS: readonly MegaColumn[] = [
  {
    title: 'Parche',
    links: [
      { label: 'Inicio', to: APP_PATHS.INICIO },
      { label: 'Rodadas', to: APP_PATHS.PARCHESE_RODADAS },
      { label: 'Memorias', to: APP_PATHS.PARCHESE_MEMORIAS },
      { label: 'El parche', to: APP_PATHS.PARCHESE_EL_PARCHE },
      { label: 'Feed', to: APP_PATHS.FEED },
    ],
  },
  {
    title: 'Tienda',
    links: [
      { label: 'Marca Paola', to: appTiendaEstanteria(SHOP_SHELVES.OWN) },
      { label: 'Colaboraciones', to: appTiendaEstanteria(SHOP_SHELVES.COLLAB) },
      { label: 'Lavado de casco', to: appTiendaEstanteria(SHOP_SHELVES.SERVICE) },
    ],
  },
  {
    title: 'Tu voz',
    links: [
      { label: 'Tips', to: APP_PATHS.TU_VOZ_TIPS },
      { label: 'Comparendos', to: APP_PATHS.TU_VOZ_COMPARENDOS },
      { label: 'Reportes', to: APP_PATHS.TU_VOZ_REPORTES },
      { label: 'Encuestas', to: APP_PATHS.TU_VOZ_ENCUESTAS },
    ],
  },
  {
    title: 'Paola',
    links: [
      { label: 'Quién soy', to: `${APP_PATHS.PAOLA}#quien` },
      { label: 'Privacidad', to: APP_PATHS.PRIVACIDAD },
      { label: 'Cuenta', to: APP_PATHS.CUENTA },
    ],
  },
] as const
