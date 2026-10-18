import { inject, type InjectionKey, type Ref } from 'vue'
import type { CuentaAccount } from '@app/shell/cuenta/useCuentaAccount.ts'

export type TicketRow = {
  id: string
  outing_id?: string
  outingId?: string
  name: string
  outing_title?: string
  outing_date?: string
}
export type OrderRow = { id: string; item_title?: string; itemTitle?: string; status: string }
export type NoteRow = { id: string; kind: string; message: string }
export type FriendRow = { id: string; alias: string; userId: string }
export type PanelData = { tickets: TicketRow[]; orders: OrderRow[]; notifications: NoteRow[] }

export type CuentaContext = {
  sessionId: Ref<string>
  myAlias: Ref<string>
  account: CuentaAccount
  panel: Ref<PanelData | null>
  pending: Ref<FriendRow[]>
  outgoing: Ref<FriendRow[]>
  accepted: Ref<FriendRow[]>
  rideVotes: Ref<ReadonlyMap<string, number>>
  sessionHeaders: (json?: boolean) => Record<string, string>
  reloadFriends: () => Promise<void>
  logout: () => void
}

export const CUENTA_CONTEXT: InjectionKey<CuentaContext> = Symbol('cuenta')

export function useCuenta(): CuentaContext {
  const context = inject(CUENTA_CONTEXT)
  if (!context) throw new Error('Cuenta sin contexto')
  return context
}

export async function detailOf(response: Response, fallback: string): Promise<string> {
  const body = (await response.json().catch(() => ({}))) as Record<string, unknown>
  return typeof body.detail === 'string' ? body.detail : fallback
}
