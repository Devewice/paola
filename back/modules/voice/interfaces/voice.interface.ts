export interface Tip {
  id: string
  title: string
  body: string
  officialHref?: string
}

export interface FineGuide {
  id: string
  title: string
  guide: string
  officialHref: string
  disclaimer: string
}

export interface Report {
  id: string
  title: string
  whatHappened: string
  whereText: string
  happenedAt: string
  evidenceSrc?: string
  moderationStatus: 'in_review' | 'published' | 'hidden' | 'rejected'
  moderationNote?: string
}
