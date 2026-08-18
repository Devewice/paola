import { GetPaolaPage } from '@modules/paola/application/GetPaolaPage.ts'
import { StaticPaolaContentRepository } from '@modules/paola/infrastructure/StaticPaolaContentRepository.ts'

export type PaolaModule = {
  getPage: () => ReturnType<GetPaolaPage['execute']>
}

export function createPaolaModule(): PaolaModule {
  const getPaolaPage = new GetPaolaPage(new StaticPaolaContentRepository())

  return {
    getPage: () => getPaolaPage.execute(),
  }
}
