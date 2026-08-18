/** Bloques narrativos de la pestaña Paola (fuente: docs/paola.md). */
export type PaolaNarrativeSection = {
  readonly id: 'razon' | 'quien' | 'porque' | 'para-que'
  readonly title: string
  readonly body: string
}

export type PaolaPendingChannel = {
  readonly status: 'pending'
  readonly label: string
}

export type PaolaContact = {
  readonly email: string
  readonly domain: string
  readonly whatsapp: PaolaPendingChannel
  readonly social: PaolaPendingChannel
  readonly video: PaolaPendingChannel
}

export type PaolaPage = {
  readonly narrative: readonly PaolaNarrativeSection[]
  readonly contact: PaolaContact
}
