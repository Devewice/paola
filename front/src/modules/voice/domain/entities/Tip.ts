export const TIPS_EMPTY_COPY =
  'Todavía no hay un tip publicado. El hueco queda; no se fuerza una denuncia.'

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
