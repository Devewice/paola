/** Bloques narrativos de la pestaña Paola (fuente: docs/paola.md). */
export type PaolaNarrativeSection = {
  readonly id: 'razon' | 'quien' | 'porque' | 'para-que'
  readonly title: string
  readonly body: string
}

export type PaolaSocialLink = {
  readonly id: 'instagram' | 'facebook' | 'tiktok' | 'youtube'
  readonly label: string
  readonly href: string
}

export type PaolaWhatsApp = {
  readonly href: string
  readonly label: string
}

export type PaolaContact = {
  readonly email: string
  readonly domain: string
  readonly whatsapp: PaolaWhatsApp
  readonly social: readonly PaolaSocialLink[]
  readonly youtube: PaolaSocialLink
}

export type PaolaPage = {
  readonly narrative: readonly PaolaNarrativeSection[]
  readonly contact: PaolaContact
}
