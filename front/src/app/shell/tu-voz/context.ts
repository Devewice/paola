import { inject, type ComputedRef, type InjectionKey } from 'vue'
import type { getAppDependencies } from '@app/bootstrap.ts'

export type TuVozContext = {
  deps: ComputedRef<ReturnType<typeof getAppDependencies>>
  whatsapp: ComputedRef<{ href: string; label: string }>
}

export const TU_VOZ_CONTEXT: InjectionKey<TuVozContext> = Symbol('tu-voz')

export function useTuVoz(): TuVozContext {
  const context = inject(TU_VOZ_CONTEXT)
  if (!context) throw new Error('Tu voz sin layout')
  return context
}
