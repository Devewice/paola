import type { Product } from '@modules/shop/domain/entities/Product.ts'

export type MysteryHiddenCard = {
  readonly id: string
  readonly face: 'mystery'
}

export type MysteryOpenCard = {
  readonly id: string
  readonly face: 'open'
  readonly couponCode: string
  readonly product: Product
}

export type MysteryDeckCard = MysteryHiddenCard | MysteryOpenCard

export type MysteryDeck = {
  readonly enabled: boolean
  readonly cards: readonly MysteryDeckCard[]
}

export type MysteryOperatorCardDraft = {
  readonly productId: string
  readonly couponCode: string
  readonly active: boolean
}

export type MysteryOperatorConfig = {
  readonly settings: {
    readonly enabled: boolean
    readonly deckSize: number
  }
  readonly cards: readonly {
    readonly id: string
    readonly productId: string
    readonly couponCode: string
    readonly active: boolean
    readonly sortOrder: number
    readonly productTitle?: string
  }[]
}
