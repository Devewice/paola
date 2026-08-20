import { ok } from '@core/result.ts'
import type { MysteryDeckPort } from '@modules/shop/domain/ports/MysteryDeckPort.ts'
import type { MysteryOperatorConfig } from '@modules/shop/domain/entities/MysteryDeck.ts'

const emptyConfig = (): MysteryOperatorConfig => ({
  settings: { enabled: false, deckSize: 3 },
  cards: [],
})

export class InMemoryMysteryDeckApi implements MysteryDeckPort {
  async loadDeck() {
    return { enabled: false, cards: [] as const }
  }

  async revealCard() {
    return ok({ id: '', face: 'mystery' as const })
  }

  async loadOperator() {
    return ok(emptyConfig())
  }

  async saveOperator(_clave: string, draft: {
    enabled: boolean
    deckSize: number
    cards: readonly { productId: string; couponCode: string; active: boolean }[]
  }) {
    return ok({
      settings: { enabled: draft.enabled, deckSize: draft.deckSize },
      cards: draft.cards.map((card, index) => ({
        id: `mem-${index}`,
        productId: card.productId,
        couponCode: card.couponCode,
        active: card.active,
        sortOrder: index,
      })),
    })
  }
}
