export interface MemoryPhoto {
  id: string
  src: string
  alt: string
}

export interface Memory {
  id: string
  outingId: string
  title: string
  date: string
  km: number
  closingText: string
  credit: string
  participantsText: string
  instagramHref?: string
  photos: MemoryPhoto[]
}

export interface MemoryList {
  memories: Memory[]
  totalKm: number
}
