export interface SessionUser {
  id: string
  email: string
  alias: string
  km: number
  moto?: string
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

export interface CommunityPost {
  id: string
  communityId: string
  authorAlias: string
  body: string
  photoSrc?: string
  createdAt: string
}

export interface MemoryComment {
  id: string
  memoryId: string
  authorAlias: string
  parentId?: string
  body: string
  status: 'en_revision' | 'publicado' | 'rechazado' | 'oculto'
  createdAt: string
}

export interface ChatMessage {
  id: string
  chatId: string
  authorAlias: string
  body?: string
  photoSrc?: string
  voiceSrc?: string
  createdAt: string
}
