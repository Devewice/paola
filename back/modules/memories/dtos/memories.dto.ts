export interface MemoryPhotoDraftDto {
  src: string
  alt: string
}

export interface CreateMemoryDto {
  outingId: string
  km: number
  closingText: string
  credit: string
  participantsText: string
  instagramHref?: string
  photos: MemoryPhotoDraftDto[]
}
