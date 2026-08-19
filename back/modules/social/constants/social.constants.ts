export const SOCIAL_TABLES = {
  USERS: 'users',
  SESSIONS: 'sessions',
  TICKETS: 'tickets',
  ORDERS: 'orders',
  OUTINGS: 'outings',
  MEMORIES: 'memories',
  MEMORY_COMMENTS: 'memory_comments',
  COMMENT_REACTIONS: 'comment_reactions',
  COMMUNITIES: 'communities',
  COMMUNITY_MEMBERS: 'community_members',
  COMMUNITY_FOLLOWS: 'community_follows',
  POSTS: 'posts',
  POST_PHOTOS: 'post_photos',
  POST_REACTIONS: 'post_reactions',
  MODERATION_ACTIONS: 'moderation_actions',
  NOTIFICATIONS: 'notifications',
  FRIENDSHIPS: 'friendships',
  USER_FOLLOWS: 'user_follows',
  CHATS: 'chats',
  CHAT_MEMBERS: 'chat_members',
  CHAT_MESSAGES: 'chat_messages',
} as const

export const SOCIAL_ROUTES = {
  REGISTER: '/api/users/register',
  LOGIN: '/api/users/login',
  PANEL: '/api/me/panel',
  VISIBILITY: '/api/me/visibility',
  PROFILE: '/api/parcero/:alias',
  MEMORY_COMMENTS: '/api/memories/:id/comments',
  COMMENT_REACTION: '/api/comments/:id/reactions',
  COMMUNITIES: '/api/communities',
  COMMUNITY_JOIN: '/api/communities/:id/join',
  COMMUNITY_LEAVE: '/api/communities/:id/leave',
  COMMUNITY_FOLLOW: '/api/communities/:id/follow',
  COMMUNITY_POSTS: '/api/communities/:id/posts',
  LEGACY_COMMUNITIES: '/api/comunidades',
  LEGACY_COMMUNITY_JOIN: '/api/comunidades/:id/join',
  LEGACY_COMMUNITY_LEAVE: '/api/comunidades/:id/leave',
  LEGACY_COMMUNITY_FOLLOW: '/api/comunidades/:id/follow',
  LEGACY_COMMUNITY_POSTS: '/api/comunidades/:id/posts',
  ACTIVITY: '/api/activity',
  POST_REACTIONS: '/api/posts/:id/reactions',
  POST_HIDE: '/api/posts/:id/hide',
  POST_PIN: '/api/posts/:id/pin',
  FEED: '/api/feed',
  FRIENDS: '/api/friends',
  FRIEND_REQUEST: '/api/friends/request',
  FRIEND_ACCEPT: '/api/friends/:id/accept',
  FRIEND_BLOCK: '/api/friends/:id/block',
  USER_FOLLOW: '/api/users/:id/follow',
  CHATS: '/api/chats',
  CHAT_MESSAGES: '/api/chats/:id/messages',
  CHAT_SILENCE: '/api/operar/chats/:id/silence',
  OUTING_CHAT: '/api/outings/:id/chat',
  OUTING_CHAT_MESSAGES: '/api/outings/:id/chat/messages',
  OPERAR_OUTING_CHAT_PIN: '/api/operar/outings/:id/chat/pin',
  OPERAR_POST_HIGHLIGHT: '/api/operar/posts/:id/highlight',
  OPERAR_COMMUNITIES: '/api/operar/communities',
  OPERAR_COMMUNITY_MODERATORS: '/api/operar/communities/:id/moderators',
} as const

export const SOCIAL_CHAT_KIND = {
  DIRECT: 'direct',
  GROUP: 'group',
  OUTING: 'outing',
} as const

export const SOCIAL_POST_STATUS = {
  PUBLISHED: 'publicado',
  HIDDEN: 'oculto',
} as const

export const SOCIAL_ROLE = {
  MEMBER: 'member',
  MODERADOR: 'moderador',
} as const

export const SOCIAL_REACTION = {
  LATE: 'late',
  AHI: 'ahi',
} as const

export const SOCIAL_REACTION_SET = new Set<string>(Object.values(SOCIAL_REACTION))

export const SOCIAL_LIMITS = {
  POST_PHOTOS_MAX: 6,
  POST_MAX_DEPTH: 2,
  FEED_LIMIT: 40,
  FEED_FOLLOW_LIMIT: 60,
  ACTIVITY_LIMIT: 40,
} as const

export const SOCIAL_OUTING_READONLY = new Set(['cerrado', 'realizado'])

export const SOCIAL_MESSAGES = {
  PRIVACY_REQUIRED: 'Necesitas leer el aviso de privacidad para continuar.',
  SESSION_REQUIRED: 'Sesión requerida.',
  SESSION_INVALID: 'Sesión inválida o vencida.',
  PROFILE_NOT_FOUND: 'Ese parcero no aparece en público.',
  CHAT_FORBIDDEN: 'Ese hilo no es tuyo.',
  CHAT_SILENCED: 'Paola silenció este hilo.',
  CHAT_NOT_FOUND: 'Chat no encontrado.',
  CHAT_READ_ONLY: 'Ese hilo ya es solo lectura: la salida está cerrada o se rodó.',
  OUTING_CHAT_FORBIDDEN: 'El hilo es para quien tiene ticket a su nombre, o para Paola.',
  OUTING_NOT_FOUND: 'Esa salida no está.',
  FRIEND_NOT_FOUND: 'Solicitud no encontrada.',
  FRIEND_SELF: 'No te puedes agregar a ti.',
  USER_NOT_FOUND: 'No hay parcero con ese alias.',
  EMPTY_MESSAGE: 'Mensaje vacío.',
  PHOTOS_MAX: 'Máximo 6 fotos por post.',
  REPLY_TOO_DEEP: 'Solo hay dos niveles: post, respuesta y una respuesta más.',
  POST_NOT_FOUND: 'Ese post no está.',
  COMMUNITY_NOT_FOUND: 'Esa comunidad no está.',
  MODERATE_FORBIDDEN: 'Solo Paola o un moderador de esa comunidad puede hacer eso.',
  REACTION_INVALID: 'Esa reacción no existe.',
  PINNED_AUTHOR: 'Paola',
} as const
