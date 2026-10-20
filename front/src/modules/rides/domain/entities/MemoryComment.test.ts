import { describe, expect, it } from 'vitest'
import {
  applyMemoryCommentLike,
  sortMemoryComments,
  threadMemoryComments,
  type MemoryComment,
} from '@modules/rides/domain/entities/MemoryComment.ts'

function comment(id: string, extra: Partial<MemoryComment> = {}): MemoryComment {
  return {
    id,
    memoryId: 'm1',
    authorAlias: id,
    body: `cuerpo ${id}`,
    status: 'publicado',
    createdAt: `2026-10-0${id.length}T10:00:00.000Z`,
    isPinned: false,
    likes: 0,
    liked: false,
    mine: false,
    ...extra,
  }
}

describe('MemoryComment', () => {
  it('ordena fijados primero y luego por fecha', () => {
    const list = sortMemoryComments([
      comment('a', { createdAt: '2026-10-02' }),
      comment('b', { createdAt: '2026-10-01' }),
      comment('c', { createdAt: '2026-10-03', isPinned: true }),
    ])
    expect(list.map((item) => item.id)).toEqual(['c', 'b', 'a'])
  })

  it('agrupa respuestas bajo su raíz y sube las huérfanas', () => {
    const threads = threadMemoryComments([
      comment('a'),
      comment('r2', { parentId: 'a', createdAt: '2026-10-05' }),
      comment('r1', { parentId: 'a', createdAt: '2026-10-04' }),
      comment('h', { parentId: 'borrado' }),
    ])
    expect(threads.map((item) => item.comment.id)).toEqual(['a', 'h'])
    expect(threads[0]?.replies.map((item) => item.id)).toEqual(['r1', 'r2'])
  })

  it('aplica el like solo al comentario tocado', () => {
    const list = applyMemoryCommentLike([comment('a'), comment('b')], 'b', { likes: 3, liked: true })
    expect(list[0]).toMatchObject({ likes: 0, liked: false })
    expect(list[1]).toMatchObject({ likes: 3, liked: true })
  })
})
