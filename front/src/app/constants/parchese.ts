import { APP_PATHS } from '@shared/http/constants.ts'
import { MASCOT } from '@shared/ui/mascot.ts'

export const PARCHESE_HERO_PHOTO = '/kit-assets/Rodada anapoimap.png'

export const PARCHESE_COPY = {
  kicker: 'Moto Loigca',
  title: 'Parchese',
  plate: 'Rodadas con cupo',
  lead: 'Las rodadas, cómo unirte y quiénes ya son del parche. Te inscribes con tu cuenta y te confirmo el cupo por WhatsApp.',
  navAria: 'Secciones de Parchese',
  navHub: 'Resumen',
  navAgenda: 'Rodadas',
  navMemories: 'Memorias',
  navMembers: 'El parche',
  tileRidesKicker: 'Próxima salida',
  tileRidesEmpty: 'Aún no hay fecha. Te aviso por el grupo.',
  tileRidesSpots: 'Cupos libres',
  tileRidesDates: 'Fechas abiertas',
  tileRidesCta: 'Ver e inscribirme',
  tileMemoriesKicker: 'Lo último que rodamos',
  tileMemoriesEmpty: 'Después de cada salida sale aquí el recuento con fotos.',
  tileMemoriesKm: 'Km del parche',
  tileMemoriesPhotos: 'Fotos',
  tileMemoriesCta: 'Ver memorias',
  tileRosterLead: 'Quién rueda con nosotros y quién apoya.',
  tileRosterMembers: 'Integrantes',
  tileRosterAllies: 'Aliados',
  tileRosterCta: 'Conoce al parche',
  tileFeedKicker: 'Dónde hablamos',
  tileFeedTitle: 'El feed',
  tileFeedLead: 'Fotos, comentarios y lo que se mueve en el parche. Lo urgente sigue por WhatsApp.',
  heroRides: { plate: 'Próximas salidas', lead: 'Todas las fechas abiertas, con cupo y lo que hay que llevar.' },
  heroMemories: { plate: 'Lo que ya rodamos', lead: 'Fotos y recuento de cada salida. Comenta con respeto.' },
  heroRoster: { plate: 'Integrantes y alianzas', lead: 'Quién rueda con nosotros y quién apoya al parche.' },
  heroRidePlate: 'Tu cupo, encuestas y quién va',
  heroRideDonePlate: 'Así se rodó',
  heroTintadaPlate: 'Tinto, parche y buena charla',
  heroTintadaDonePlate: 'Así fue la tintada',
  bandRidesKicker: 'Agenda',
  bandRidesTitle: 'Rueda con nosotros',
  bandRidesNext: 'Próxima salida',
  bandRosterKicker: 'Integrantes y alianzas',
  bandRosterTitle: 'Somos el parche',
  bandRosterMotos: 'Motos distintas',
  bandEmptyValue: '—',
  bandRosterEmpty: 'El parche apenas arranca. Rueda una salida y sales aquí.',
  memoriesWhileTitle: 'Mientras tanto',
  memoriesWhileLead: 'La próxima memoria sale de la próxima salida. Inscríbete o cuéntalo en el feed.',
  moreTitle: 'Sigue con el parche',
  moreLead: 'Fechas, recuentos y lo que se habla entre salidas.',
  railJoinTitle: 'Únete al parche',
  railHowTitle: 'Cómo funciona',
  railHowItems: [
    'Entras con tu cuenta y te inscribes a la salida.',
    'Te escribo para confirmar el cupo.',
    'Si es de pago, el cobro se habla por WhatsApp.',
    'Inscrito, votas las encuestas y ves quién va.',
    'Después de rodar, sale la memoria aquí.',
  ],
  railTalkTitle: 'Dónde hablamos',
  railTalkWa: 'El grupo del día a día, para lo urgente.',
  railTalkWeb: 'Fechas, cupos y memorias quedan guardados aquí.',
  railFeed: 'Ir al feed',
} as const

export const PARCHESE_NAV = [
  { to: APP_PATHS.PARCHESE, tag: '01', label: PARCHESE_COPY.navHub },
  { to: APP_PATHS.PARCHESE_RODADAS, tag: '02', label: PARCHESE_COPY.navAgenda },
  { to: APP_PATHS.PARCHESE_MEMORIAS, tag: '03', label: PARCHESE_COPY.navMemories },
  { to: APP_PATHS.PARCHESE_EL_PARCHE, tag: '04', label: PARCHESE_COPY.navMembers },
] as const

export const PARCHESE_HUB = {
  DATES: 3,
  AVATARS: 5,
  RIDES_FIGURE: '/kit-assets/paola-hero.png',
} as const

export const PARCHESE_FIGURES = {
  RIDES_BAND: MASCOT.TUMBADA,
  JOIN: MASCOT.EN_PIE,
  ROSTER_BAND: PARCHESE_HUB.RIDES_FIGURE,
  MORE_RIDES: MASCOT.TUMBADA,
  MORE_MEMORIES: MASCOT.LENTE,
  MORE_FEED: MASCOT.X5,
} as const
