import { createPaolaModule, type PaolaModule } from '@modules/paola/index.ts'

export type AppDependencies = {
  paola: PaolaModule
}

let dependencies: AppDependencies | null = null

export function createAppDependencies(): AppDependencies {
  dependencies = {
    paola: createPaolaModule(),
  }
  return dependencies
}

export function getAppDependencies(): AppDependencies {
  if (!dependencies) {
    return createAppDependencies()
  }
  return dependencies
}
