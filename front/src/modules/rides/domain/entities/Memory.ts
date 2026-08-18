export type MemoryPhoto = {
  readonly id: string
  readonly src: string
  readonly alt: string
}

/** Recuento de una salida realizada. Solo entra con permiso y fotos reales. */
export type Memory = {
  readonly id: string
  readonly salidaId: string
  readonly title: string
  readonly date: string
  readonly km: number
  readonly closingText: string
  readonly credit: string
  readonly participantsText: string
  readonly instagramHref?: string
  readonly photos: readonly MemoryPhoto[]
}

export type MemoryList = {
  readonly items: readonly Memory[]
  readonly totalKm: number
  readonly emptyCopy: string
}

export const MEMORIES_EMPTY_COPY =
  'Vamos contando. Aún no hay kilómetros publicados de una memoria realizada.'

export type MemoryDraft = {
  readonly salidaId: string
  readonly km: number
  readonly closingText: string
  readonly credit: string
  readonly participantsText: string
  readonly instagramHref?: string
  readonly photos: readonly { readonly src: string; readonly alt: string }[]
}
