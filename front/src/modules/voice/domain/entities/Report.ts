export type ReportStatus = 'in_review' | 'published' | 'hidden' | 'rejected'

export type VoiceReport = {
  readonly id: string
  readonly title: string
  readonly whatHappened: string
  readonly whereText: string
  readonly happenedAt: string
  readonly evidenceSrc?: string
  readonly moderationStatus: ReportStatus
}

export type ReportList = {
  readonly items: readonly VoiceReport[]
  readonly emptyCopy: string
}
