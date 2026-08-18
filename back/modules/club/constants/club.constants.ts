export const CLUB_LIMITS = {
  NAME_MIN: 2,
  SUPPORT_MIN: 2,
  ALIAS_MIN: 2,
} as const

export const CLUB_TABLES = {
  ALLIANCES: 'alliances',
  MEMBERS: 'members',
} as const

export const CLUB_ROUTES = {
  LIST_ALLIANCES: '/api/alliances',
  LIST_MEMBERS: '/api/members',
  CREATE_ALLIANCE: '/api/operar/alliances',
  CREATE_MEMBER: '/api/operar/members',
} as const

export const CLUB_MESSAGES = {
  NAME_REQUIRED: 'El aliado necesita un nombre.',
  SUPPORT_REQUIRED: 'Di cómo apoya el parche.',
  ALIAS_REQUIRED: 'El integrante necesita un alias.',
} as const
