import { createLocalStorageAdapter } from '@shared/storage/LocalStorageAdapter.ts'
import {
  createCounterModule,
  createStorageCounterRepository,
  type CounterModule,
} from '@modules/counter/index.ts'

export type AppDependencies = {
  counter: CounterModule
}

export const createAppDependencies = (): AppDependencies => {
  const storage = createLocalStorageAdapter()

  return {
    counter: createCounterModule(createStorageCounterRepository(storage)),
  }
}
