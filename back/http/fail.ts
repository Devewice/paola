import type { Fail } from './types.js'

export function fail(status: number, detail: string): Fail {
  return { ok: false, status, detail }
}
