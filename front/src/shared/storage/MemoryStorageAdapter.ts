import type { StoragePort } from './StoragePort.ts'

export const createMemoryStorage = (): StoragePort => {
  const store = new Map<string, string>()

  return {
    async get(key) {
      return store.get(key) ?? null
    },
    async set(key, value) {
      store.set(key, value)
    },
    async remove(key) {
      store.delete(key)
    },
  }
}
