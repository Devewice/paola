import { APP_PATHS } from '@shared/http/constants.ts'

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
  readonly lead: string
  readonly cta: string
  readonly columns: readonly MegaColumn[]
}

export const MEGA_NAV: readonly MegaNavItem[] = [
  {
    label: 'Inicio',
    to: APP_PATHS.INICIO,
    lead: 'La próxima rodada, los kilómetros y un recorte del parche.',
    cta: 'Ir al inicio',
    columns: [
      {
        title: 'Hoy',
        links: [
          { label: 'Inicio', to: APP_PATHS.INICIO },
          { label: 'Próxima salida', to: APP_PATHS.PARCHESE },
          { label: 'Publicaciones', to: APP_PATHS.FEED },
        ],
      },
      {
        title: 'Parche',
        links: [
          { label: 'Parchese', to: APP_PATHS.PARCHESE },
          { label: 'Feed', to: APP_PATHS.FEED },
        ],
      },
      {
        title: 'Tu sitio',
        links: [
          { label: 'Cuenta', to: APP_PATHS.CUENTA },
          { label: 'Privacidad', to: APP_PATHS.PRIVACIDAD },
        ],
      },
    ],
  },
  {
    label: 'Parchese',
    to: APP_PATHS.PARCHESE,
    lead: 'Las rodadas, cómo unirse y quiénes ya son del parche.',
    cta: 'Ir a Parchese',
    columns: [
      {
        title: 'Rodar',
        links: [
          { label: 'Próxima rodada', to: APP_PATHS.PARCHESE },
          { label: 'Memorias', to: APP_PATHS.PARCHESE },
        ],
      },
      {
        title: 'Comunidad',
        links: [
          { label: 'Publicaciones', to: APP_PATHS.FEED },
          { label: 'Así va el parche', to: APP_PATHS.PARCHESE },
        ],
      },
      {
        title: 'Más',
        links: [
          { label: 'Inicio', to: APP_PATHS.INICIO },
          { label: 'Cuenta', to: APP_PATHS.CUENTA },
        ],
      },
    ],
  },
  {
    label: 'Tu voz',
    to: APP_PATHS.TU_VOZ,
    lead: 'Tips de vía, comparendos y reportes.',
    cta: 'Ir a Tu voz',
    columns: [
      {
        title: 'Educación',
        links: [
          { label: 'Tips de vía', to: APP_PATHS.TU_VOZ },
          { label: 'Comparendos · guía', to: APP_PATHS.TU_VOZ },
        ],
      },
      {
        title: 'Parche',
        links: [
          { label: 'Reportes', to: APP_PATHS.TU_VOZ },
          { label: 'Moderación', to: `${APP_PATHS.PRIVACIDAD}#moderacion` },
        ],
      },
      {
        title: 'Legal',
        links: [
          { label: 'Aviso de privacidad', to: APP_PATHS.PRIVACIDAD },
          { label: 'Cómo leer un comparendo', to: APP_PATHS.TU_VOZ },
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
          { label: 'Marca Paola', to: APP_PATHS.TIENDA },
          { label: 'Colaboraciones', to: APP_PATHS.TIENDA },
        ],
      },
      {
        title: 'Servicio',
        links: [
          { label: 'Lavado de casco', to: APP_PATHS.TIENDA },
          { label: 'Escríbeme', to: APP_PATHS.PAOLA },
        ],
      },
      {
        title: 'Reglas',
        links: [
          { label: 'Bogotá y Soacha', to: APP_PATHS.TIENDA },
          { label: 'Privacidad', to: APP_PATHS.PRIVACIDAD },
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
          { label: 'Quién soy', to: APP_PATHS.PAOLA },
          { label: 'Contacto', to: APP_PATHS.PAOLA },
        ],
      },
      {
        title: 'Cuenta',
        links: [
          { label: 'Tu cuenta', to: APP_PATHS.CUENTA },
          { label: 'Feed', to: APP_PATHS.FEED },
        ],
      },
      {
        title: 'Legal',
        links: [
          { label: 'Privacidad', to: APP_PATHS.PRIVACIDAD },
          { label: 'Moderación', to: `${APP_PATHS.PRIVACIDAD}#moderacion` },
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
      { label: 'Parchese', to: APP_PATHS.PARCHESE },
      { label: 'Feed', to: APP_PATHS.FEED },
    ],
  },
  {
    title: 'Tienda',
    links: [
      { label: 'Marca Paola', to: APP_PATHS.TIENDA },
      { label: 'Colaboraciones', to: APP_PATHS.TIENDA },
      { label: 'Lavado de casco', to: APP_PATHS.TIENDA },
    ],
  },
  {
    title: 'Tu voz',
    links: [
      { label: 'Tips', to: APP_PATHS.TU_VOZ },
      { label: 'Comparendos', to: APP_PATHS.TU_VOZ },
      { label: 'Reportes', to: APP_PATHS.TU_VOZ },
    ],
  },
  {
    title: 'Paola',
    links: [
      { label: 'Quién soy', to: APP_PATHS.PAOLA },
      { label: 'Privacidad', to: APP_PATHS.PRIVACIDAD },
      { label: 'Cuenta', to: APP_PATHS.CUENTA },
    ],
  },
] as const
