import type { StoragePort } from './StoragePort.ts'

export const createLocalStorageAdapter = (
  storage: Pick<Storage, 'getItem' | 'setItem' | 'removeItem'> = localStorage,
): StoragePort => ({
  async get(key) {
    return storage.getItem(key)
  },
  async set(key, value) {
    storage.setItem(key, value)
  },
  async remove(key) {
    storage.removeItem(key)
  },
})
