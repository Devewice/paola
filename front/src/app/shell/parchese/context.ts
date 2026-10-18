import { inject, type ComputedRef, type InjectionKey } from 'vue'
import type { getAppDependencies } from '@app/bootstrap.ts'
import type { Poll } from '@modules/polls/index.ts'

export type ParcheseContext = {
  deps: ComputedRef<ReturnType<typeof getAppDependencies>>
  pollsFor: (outingId: string) => readonly Poll[]
  orphanPolls: ComputedRef<readonly Poll[]>
  onVoted: (poll: Poll) => void
  reloadPolls: () => Promise<void>
  reloadInventory: () => Promise<void>
}

export const PARCHESE_CONTEXT: InjectionKey<ParcheseContext> = Symbol('parchese')

export function useParchese(): ParcheseContext {
  const context = inject(PARCHESE_CONTEXT)
  if (!context) throw new Error('Parchese sin layout')
  return context
}

export function shortDate(iso: string): string {
  const date = new Date(`${iso}T12:00:00`)
  if (Number.isNaN(date.getTime())) return iso
  return date.toLocaleDateString('es-CO', { day: 'numeric', month: 'short' }).replace('.', '')
}
