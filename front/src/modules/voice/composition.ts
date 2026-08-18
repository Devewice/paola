import { GetTips } from '@modules/voice/application/GetTips.ts'
import type { TipCatalogPort } from '@modules/voice/domain/ports/TipCatalogPort.ts'

export type VoiceModule = {
  getTips: () => ReturnType<GetTips['execute']>
}

export function createVoiceModule(catalog: TipCatalogPort): VoiceModule {
  const getTips = new GetTips(catalog)

  return {
    getTips: () => getTips.execute(),
  }
}
