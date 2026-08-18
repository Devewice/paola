import { GetAgenda } from '@modules/rides/application/GetAgenda.ts'
import { StaticAgendaRepository } from '@modules/rides/infrastructure/StaticAgendaRepository.ts'

export type RidesModule = {
  getAgenda: () => ReturnType<GetAgenda['execute']>
}

export function createRidesModule(): RidesModule {
  const getAgenda = new GetAgenda(new StaticAgendaRepository())

  return {
    getAgenda: () => getAgenda.execute(),
  }
}
