import { describe, expect, it } from 'vitest'
import {
  parseMemoryComment,
  parseMemoryCommentCounts,
  parseMemoryCommentLike,
} from '@modules/rides/infrastructure/parseMemoryComment.ts'

describe('parseMemoryComment', () => {
  it('lee un comentario completo', () => {
    const parsed = parseMemoryComment({
      id: 'c1',
      memoryId: 'm1',
      authorAlias: 'Toño',
      body: 'Qué rodada',
      status: 'en_revision',
      createdAt: '2026-10-19T10:00:00.000Z',
      isPinned: true,
      likes: '4',
      liked: true,
      mine: true,
    })
    expect(parsed).toMatchObject({ id: 'c1', status: 'en_revision', isPinned: true, likes: 4, liked: true, mine: true })
    expect(parsed?.parentId).toBeUndefined()
  })

  it('descarta filas sin estado válido o sin cuerpo', () => {
    expect(parseMemoryComment({ id: 'c1', body: 'x', status: 'raro' })).toBeNull()
    expect(parseMemoryComment({ id: 'c1', body: '', status: 'publicado' })).toBeNull()
  })

  it('rellena conteos faltantes con cero', () => {
    expect(parseMemoryCommentCounts({ publicado: 2 })).toEqual({ en_revision: 0, publicado: 2, rechazado: 0, oculto: 0 })
  })

  it('exige liked booleano', () => {
    expect(parseMemoryCommentLike({ likes: 1 })).toBeNull()
    expect(parseMemoryCommentLike({ likes: 1, liked: false })).toEqual({ likes: 1, liked: false })
  })
})
