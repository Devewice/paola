import { ComposedHomeBoardAdapter } from '@app/adapters/ComposedHomeBoardAdapter.ts'
import { createClubModule, type ClubModule } from '@modules/club/index.ts'
import { createHomeModule, type HomeModule } from '@modules/home/index.ts'
import { createPaolaModule, type PaolaModule } from '@modules/paola/index.ts'
import { createRidesModule, loadOutingCatalog, type RidesModule } from '@modules/rides/index.ts'
import type { OutingCatalogPort } from '@modules/rides/domain/ports/OutingCatalogPort.ts'
import { HttpRidesApi } from '@modules/rides/infrastructure/HttpRidesApi.ts'
import { InMemoryOutingCatalog } from '@modules/rides/infrastructure/InMemoryOutingCatalog.ts'

export type AppDependencies = {
  paola: PaolaModule
  club: ClubModule
  rides: RidesModule
  home: HomeModule
}

let dependencies: AppDependencies | null = null

function wire(catalog: OutingCatalogPort): AppDependencies {
  const paola = createPaolaModule()
  const contact = paola.getPage().contact
  const club = createClubModule()
  const rides = createRidesModule(
    catalog,
    new HttpRidesApi({
      email: contact.email,
      whatsappHref: contact.whatsapp.href,
    }),
  )
  const home = createHomeModule(new ComposedHomeBoardAdapter(rides, club, paola))
  dependencies = { paola, club, rides, home }
  return dependencies
}

export async function createAppDependencies(): Promise<AppDependencies> {
  try {
    return wire(await loadOutingCatalog())
  } catch {
    return wire(new InMemoryOutingCatalog())
  }
}

export function getAppDependencies(): AppDependencies {
  if (!dependencies) {
    return wire(new InMemoryOutingCatalog())
  }
  return dependencies
}
