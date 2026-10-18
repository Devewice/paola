export const ROLES_ROUTES = {
  ACCESS: '/api/operar/access',
  LIST: '/api/operar/roles',
  UPDATE: '/api/operar/roles/:id',
  DELETE: '/api/operar/roles/:id/delete',
  USERS: '/api/operar/users',
  USER_ROLE: '/api/operar/users/:id/role',
} as const

export const ROLES_TABLES = {
  ROLES: 'roles',
  PERMISSIONS: 'role_permissions',
  USERS: 'users',
  SESSIONS: 'sessions',
} as const

export const ROLES_LIMITS = {
  NAME_MIN: 2,
  NAME_MAX: 80,
  ID_MAX: 40,
  USERS_PAGE: 50,
  QUERY_MAX: 80,
} as const

export const ROLES_MESSAGES = {
  NAME_INVALID: 'El rol necesita un nombre de 2 a 80 caracteres.',
  NAME_TAKEN: 'Ya hay un rol con ese nombre.',
  PERMISSION_INVALID: 'Hay un permiso que no existe.',
  NOT_FOUND: 'Ese rol no existe.',
  SYSTEM_LOCKED: 'Admin y Usuario son fijos: no se editan ni se borran.',
  USER_NOT_FOUND: 'Esa cuenta no existe.',
  SELF_LOCKED: 'No puedes cambiar tu propio rol.',
  LAST_ADMIN: 'Tiene que quedar al menos un admin.',
} as const