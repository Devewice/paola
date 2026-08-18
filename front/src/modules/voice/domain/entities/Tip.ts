export type Tip = {
  readonly id: string
  readonly title: string
  readonly body: string
  readonly officialHref?: string
}

export type TipList = {
  readonly items: readonly Tip[]
  readonly emptyCopy: string
}
