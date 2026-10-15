import { onMounted, ref } from 'vue'
import { OG_COPY } from '@app/constants/copy.ts'
import { SESSION_STORAGE_KEY } from '@app/constants/cuenta.ts'
import type { OperarPermission } from '@app/constants/operar.ts'
import { API, SESSION_HEADER } from '@shared/http/constants.ts'

export type OperarAccess = {
  readonly alias: string
  readonly role: { readonly id: string; readonly name: string }
  readonly permissions: readonly OperarPermission[]
}

/** `hidden` cubre sin sesión, sin permisos y fallos: el panel no se delata. */
export type OperarGate = 'loading' | 'hidden' | 'ready'

function readSession(): string {
  try {
    return localStorage.getItem(SESSION_STORAGE_KEY) ?? ''
  } catch {
    return ''
  }
}

/** `title` reemplaza el título genérico de no encontrado solo cuando hay acceso. */
export function useOperarAccess(title?: string) {
  const gate = ref<OperarGate>('loading')
  const access = ref<OperarAccess | null>(null)
  const session = ref('')

  async function load(): Promise<void> {
    session.value = readSession()
    access.value = null
    if (!session.value) {
      gate.value = 'hidden'
      return
    }
    gate.value = 'loading'
    try {
      const response = await fetch(API.OPERAR_ACCESS, { headers: { [SESSION_HEADER]: session.value } })
      const body = (await response.json().catch(() => ({}))) as { access?: OperarAccess }
      if (!response.ok || !body.access?.permissions?.length) {
        gate.value = 'hidden'
        return
      }
      access.value = body.access
      gate.value = 'ready'
      if (title) document.title = `${title} · ${OG_COPY.title}`
    } catch {
      gate.value = 'hidden'
    }
  }

  function can(permission: OperarPermission): boolean {
    return Boolean(access.value?.permissions.includes(permission))
  }

  onMounted(load)

  return { gate, access, session, can, reload: load }
}
