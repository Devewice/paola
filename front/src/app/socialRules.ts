export const SOCIAL_REACTION = {
  LATE: 'late',
  AHI: 'ahi',
} as const

export const SOCIAL_LIMITS = {
  POST_PHOTOS_MAX: 6,
  POST_MAX_DEPTH: 2,
} as const

export const SOCIAL_ROLE = {
  MEMBER: 'member',
  MODERADOR: 'moderador',
} as const

/** Profundidad del padre: 0 = post raíz. El 3er nivel se rechaza. */
export function canNestReply(parentDepth: number): boolean {
  return parentDepth < SOCIAL_LIMITS.POST_MAX_DEPTH
}

export function canHidePost(input: { role?: string; isOperador: boolean }): boolean {
  return input.isOperador || input.role === SOCIAL_ROLE.MODERADOR
}
