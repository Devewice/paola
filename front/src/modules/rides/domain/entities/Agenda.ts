/** Ítem de agenda (fase 6). Sin cupo, km ni fotos. */
export type AgendaKind = 'rodada' | 'actividad'
export type AgendaWhen = 'proxima' | 'pasada'

export type AgendaItem = {
  readonly id: string
  /** Fecha ISO `YYYY-MM-DD`. */
  readonly date: string
  readonly title: string
  readonly kind: AgendaKind
  readonly point: string
  readonly when: AgendaWhen
}

export type Agenda = {
  readonly items: readonly AgendaItem[]
  readonly emptyCopy: string
}
