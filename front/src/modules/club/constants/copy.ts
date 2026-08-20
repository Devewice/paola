export const ALLIANCES_EMPTY_COPY = 'Aún no hay aliados.'

export const MEMBERS_EMPTY_COPY = 'Aún no hay integrantes.'

export const JOIN_WHATSAPP_TEXT = 'Quiero unirme al parche'

export const JOIN_COPY = {
  cta: 'Únete',
  title: 'Únete',
  copy: 'Escríbele a Paola para que te agregue al grupo.',
} as const

export const PARCHESE_COPY = {
  kicker: 'Parchese',
  title: 'El club',
  plate: 'Parche',
  lead: 'Las rodadas, cómo unirse y quiénes ya son del parche.',
  cycleHeading: 'El ciclo',
  cyclePending: 'Aún no hay memoria.',
  cycleDone: 'Ya hay memoria de lo que rodamos.',
  rosterHeading: 'Así va el parche',
  rosterEmptyTitle: 'Todavía nadie',
  talkHeading: 'Dónde hablamos',
  feedLink: 'Ver publicaciones',
  alliancesKicker: 'Alianzas',
  alliancesTitle: 'Quienes apoyan',
} as const

export const PARCHESE_TABS = [
  { id: 'club', label: 'El club' },
  { id: 'actividad', label: 'Actividad' },
] as const

export const CLUB_API_MESSAGES = {
  ALLIANCE_PARSE_FAIL: 'La API devolvió un aliado que no se entiende.',
  MEMBER_PARSE_FAIL: 'La API devolvió un integrante que no se entiende.',
} as const
