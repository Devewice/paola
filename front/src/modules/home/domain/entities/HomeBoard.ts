export type HomeOutingKind = 'rodada' | 'actividad'

export type HomeNextOuting = {
  readonly title: string
  readonly date: string
  readonly kind: HomeOutingKind
  readonly point: string
}

export type HomeVoiceTip = {
  readonly title: string
  readonly body: string
  readonly officialHref?: string
}

export type HomeVoiceHole = {
  readonly tip: HomeVoiceTip | null
  readonly emptyCopy: string
  readonly to: '/tu-voz'
}

export type HomePaolaLine = {
  readonly phrase: string
  readonly to: '/paola'
}

export type HomeJoinCta = {
  readonly href: string
  readonly label: string
}

export type HomeMemoryFlash = {
  readonly title: string
  readonly date: string
  readonly km: number
  readonly credit: string
  readonly photoSrc?: string
  readonly closingText: string
  readonly photos: readonly { readonly src: string; readonly alt: string }[]
}

export type HomeBoard = {
  readonly next: HomeNextOuting | null
  readonly nextEmptyCopy: string
  readonly join: HomeJoinCta
  readonly totalKm: number | null
  readonly memory: HomeMemoryFlash | null
  readonly memoryEmptyCopy: string
  readonly voice: HomeVoiceHole
  readonly paola: HomePaolaLine
}
