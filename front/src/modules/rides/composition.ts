import { GetAgenda } from '@modules/rides/application/GetAgenda.ts'
import { ListOutings } from '@modules/rides/application/ListOutings.ts'
import type { OutingCatalogPort } from '@modules/rides/domain/ports/OutingCatalogPort.ts'

const today = () => new Date().toISOString().slice(0, 10)

export type RidesModule = {
  getAgenda: () => ReturnType<GetAgenda['execute']>
  listOutings: () => ReturnType<ListOutings['execute']>
}

export function createRidesModule(catalog: OutingCatalogPort): RidesModule {
  const getAgenda = new GetAgenda(catalog, today)
  const listOutings = new ListOutings(catalog, today)

  return {
    getAgenda: () => getAgenda.execute(),
    listOutings: () => listOutings.execute(),
  }
}
