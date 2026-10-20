import type { MemoryCommentStatus } from '@modules/rides/domain/entities/MemoryComment.ts'

const DATE_FORMAT = new Intl.DateTimeFormat('es-CO', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })

export function formatCommentDate(iso: string): string {
  const date = new Date(iso)
  return Number.isNaN(date.getTime()) ? '' : DATE_FORMAT.format(date)
}

export function statusTone(status: MemoryCommentStatus): 'abierto' | 'lleno' | 'cerrado' {
  if (status === 'publicado') return 'abierto'
  if (status === 'en_revision') return 'lleno'
  return 'cerrado'
}
