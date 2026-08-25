export type FineGuide = {
  readonly id: string
  readonly title: string
  readonly guide: string
  readonly officialHref: string
  readonly disclaimer: string
}

export type FineList = {
  readonly items: readonly FineGuide[]
  readonly emptyCopy: string
}
