import { readonly, ref } from 'vue'
import { ALIAS_STORAGE_KEY, SESSION_STORAGE_KEY } from '@app/constants/cuenta.ts'

function read(key: string): string {
  try {
    return localStorage.getItem(key) ?? ''
  } catch {
    return ''
  }
}

const sessionId = ref(read(SESSION_STORAGE_KEY))
const alias = ref(read(ALIAS_STORAGE_KEY))

/** Sesión del navegador. Otras pantallas escriben en localStorage; `syncSession` la vuelve a leer. */
export const appSession = {
  sessionId: readonly(sessionId),
  alias: readonly(alias),
}

export function syncSession(): void {
  sessionId.value = read(SESSION_STORAGE_KEY)
  alias.value = read(ALIAS_STORAGE_KEY)
}

export function rememberAlias(next: string): void {
  if (!next || next === alias.value) return
  alias.value = next
  try {
    localStorage.setItem(ALIAS_STORAGE_KEY, next)
  } catch {
    /* sin almacenamiento */
  }
}

export function clearSession(): void {
  sessionId.value = ''
  alias.value = ''
  try {
    localStorage.removeItem(SESSION_STORAGE_KEY)
    localStorage.removeItem(ALIAS_STORAGE_KEY)
  } catch {
    /* sin almacenamiento */
  }
}
