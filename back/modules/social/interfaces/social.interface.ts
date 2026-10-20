export interface SessionUser {
  id: string
  email: string
  alias: string
  km: number
  moto?: string
  whatsapp?: string
  isPublic: boolean
}

export interface Community {
  id: string
  slug: string
  name: string
  description: string
  rules: string
  whatsappGroupHref?: string
}

export interface PostReactionCount {
  reaction: string
  count: number
  mine?: boolean
}

export interface CommunityPost {
  id: string
  communityId: string
  authorAlias: string
  body: string
  photoSrc?: string
  photos: readonly string[]
  parentId?: string
  isPinned: boolean
  isHighlighted: boolean
  canModerate: boolean
  createdAt: string
  reactions: readonly PostReactionCount[]
  replies?: CommunityPost[]
}

export interface MemoryComment {
  id: string
  memoryId: string
  authorAlias: string
  parentId?: string
  body: string
  status: 'en_revision' | 'publicado' | 'rechazado' | 'oculto'
  createdAt: string
  isPinned: boolean
  likes: number
  /** Quien mira le dio like. */
  liked: boolean
  /** Lo escribió quien mira (ve sus comentarios en revisión). */
  mine: boolean
}

/** Fila del moderador: incluye a qué memoria pertenece. */
export interface OperatorMemoryComment extends MemoryComment {
  memoryTitle: string
  outingId: string
}

export interface MemoryCommentCounts {
  en_revision: number
  publicado: number
  rechazado: number
  oculto: number
}

export interface ChatMessage {
  id: string
  chatId: string
  authorAlias: string
  body?: string
  photoSrc?: string
  voiceSrc?: string
  pinned: boolean
  createdAt: string
}

export interface PublicParcero {
  id: string
  alias: string
  avatarSrc?: string
  km: number
  moto?: string
}

export interface FriendRow {
  id: string
  status: 'pending' | 'accepted'
  requesterId: string
  receiverId: string
  requesterAlias: string
  receiverAlias: string
}

export interface ChatThread {
  id: string
  kind: string
  title?: string
  peerAlias?: string
  peerId?: string
  outingId?: string
  silenced: boolean
}

export interface OutingChat {
  chatId: string
  status: string
  readOnly: boolean
  outingTitle: string
  messages: ChatMessage[]
}

export interface ActivityItem {
  kind: 'outing' | 'memory' | 'post'
  id: string
  title: string
  createdAt: string
  highlighted: boolean
}

export interface OutingMeta {
  id: string
  title: string
  status: string
}
