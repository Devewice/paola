import type { AppError } from '@core/errors/AppError.ts'
import type { Result } from '@core/result.ts'
import type {
  MysteryDeck,
  MysteryDeckCard,
  MysteryOperatorCardDraft,
  MysteryOperatorConfig,
} from '@modules/shop/domain/entities/MysteryDeck.ts'

export type MysteryDeckPort = {
  loadDeck: (sessionId: string) => Promise<MysteryDeck>
  revealCard: (cardId: string, sessionId: string) => Promise<Result<MysteryDeckCard, AppError>>
  loadOperator: (clave: string) => Promise<Result<MysteryOperatorConfig, AppError>>
  saveOperator: (
    clave: string,
    draft: {
      enabled: boolean
      deckSize: number
      cards: readonly MysteryOperatorCardDraft[]
    },
  ) => Promise<Result<MysteryOperatorConfig, AppError>>
}
