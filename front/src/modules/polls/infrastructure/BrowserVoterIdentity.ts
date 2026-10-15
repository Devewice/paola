import { POLLS_VOTER_STORAGE_KEY } from '@modules/polls/constants/copy.ts'
import type { VoterIdentityPort } from '@modules/polls/domain/ports/PollsPort.ts'

function read(key: string): string {
  try {
    return localStorage.getItem(key) ?? ''
  } catch {
    return ''
  }
}

function newKey(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID()
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`
}

/** Llave anónima persistente por navegador; la sesión la decide la app. */
export class BrowserVoterIdentity implements VoterIdentityPort {
  private readonly sessionStorageKey: string

  constructor(sessionStorageKey: string) {
    this.sessionStorageKey = sessionStorageKey
  }

  sessionId(): string {
    return read(this.sessionStorageKey)
  }

  anonKey(): string {
    const current = read(POLLS_VOTER_STORAGE_KEY)
    if (current) return current
    const key = newKey()
    try {
      localStorage.setItem(POLLS_VOTER_STORAGE_KEY, key)
    } catch {
      /* sin storage, la llave dura lo que dure la pestaña */
    }
    return key
  }
}
