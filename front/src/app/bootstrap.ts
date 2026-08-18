import { ComposedHomeBoardAdapter } from '@app/adapters/ComposedHomeBoardAdapter.ts'
import { createClubModule, type ClubModule } from '@modules/club/index.ts'
import { createHomeModule, type HomeModule } from '@modules/home/index.ts'
import { createPaolaModule, type PaolaModule } from '@modules/paola/index.ts'
import { createRidesModule, type RidesModule } from '@modules/rides/index.ts'

export type AppDependencies = {
  paola: PaolaModule
  club: ClubModule
  rides: RidesModule
  home: HomeModule
}

let dependencies: AppDependencies | null = null

export function createAppDependencies(): AppDependencies {
  const paola = createPaolaModule()
  const club = createClubModule()
  const rides = createRidesModule()
  const home = createHomeModule(new ComposedHomeBoardAdapter(rides, club, paola))

  dependencies = { paola, club, rides, home }
  return dependencies
}

export function getAppDependencies(): AppDependencies {
  if (!dependencies) {
    return createAppDependencies()
  }
  return dependencies
}
