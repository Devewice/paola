export type ShopService = {
  readonly id: string
  readonly title: string
  readonly includesText: string
  readonly handoverText: string
  readonly turnaroundText: string
  readonly priceCop: number | null
}

export type ServiceDraft = {
  readonly title: string
  readonly includesText: string
  readonly handoverText: string
  readonly turnaroundText: string
  readonly priceCop?: number | null
}

export type ServiceBoard = {
  readonly items: readonly ShopService[]
  readonly emptyCopy: string
  readonly warrantyCopy: string
  readonly zoneCopy: string
}
