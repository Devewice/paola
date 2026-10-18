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

const gate = ref<OperarGate>('loading')
const access = ref<OperarAccess | null>(null)
const session = ref('')
let pending: Promise<void> | null = null
let loaded = false
let runs = 0

async function fetchAccess(): Promise<void> {
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
  } catch {
    gate.value = 'hidden'
  }
}

/** Una sola consulta compartida; `force` la repite (al cambiar de sesión). */
function load(force = false): Promise<void> {
  if (!force && (pending || loaded)) return pending ?? Promise.resolve()
  const run = ++runs
  const job = (pending ?? Promise.resolve()).then(fetchAccess).finally(() => {
    loaded = true
    if (run === runs) pending = null
  })
  pending = job
  return job
}

function can(permission: OperarPermission): boolean {
  return Boolean(access.value?.permissions.includes(permission))
}

/** `title` reemplaza el título genérico de no encontrado solo cuando hay acceso. */
export function useOperarAccess(title?: string) {
  onMounted(async () => {
    await load()
    if (title && gate.value === 'ready') document.title = `${title} · ${OG_COPY.title}`
  })

  return { gate, access, session, can, reload: () => load(true) }
}
