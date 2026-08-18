export type HomeOutingKind = 'rodada' | 'actividad'

export type HomeNextOuting = {
  readonly title: string
  readonly date: string
  readonly kind: HomeOutingKind
  readonly point: string
}

export type HomeVoiceHole = {
  readonly copy: string
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

export type HomeBoard = {
  readonly next: HomeNextOuting | null
  readonly nextEmptyCopy: string
  readonly join: HomeJoinCta
  readonly kmCopy: string
  readonly voice: HomeVoiceHole
  readonly paola: HomePaolaLine
}
