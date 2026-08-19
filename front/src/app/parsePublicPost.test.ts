import { describe, expect, it } from 'vitest'
import { parsePublicPost } from '@app/parsePublicPost.ts'

describe('parsePublicPost', () => {
  it('no deja pasar un post que filtra WhatsApp o correo', () => {
    expect(
      parsePublicPost({
        id: 'p1',
        authorAlias: 'parcero',
        body: 'Salimos',
        whatsapp: '3000000000',
      }),
    ).toBeNull()
    expect(
      parsePublicPost({
        id: 'p2',
        authorAlias: 'parcero',
        body: 'Salimos',
        email: 'alguien@correo.com',
      }),
    ).toBeNull()
  })

  it('acepta alias y texto, nada de contacto', () => {
    expect(
      parsePublicPost({
        id: 'p3',
        authorAlias: 'parcero',
        body: 'Salimos',
        createdAt: '2026-08-18',
      }),
    ).toMatchObject({ authorAlias: 'parcero', body: 'Salimos' })
  })

  it('acepta álbum, padre y reacciones sin filtrar contacto de más', () => {
    const parsed = parsePublicPost({
      id: 'p4',
      authorAlias: 'parcero',
      body: 'Salimos',
      photos: ['https://ejemplo.test/f.jpg'],
      parentId: 'p3',
      reactions: [{ reaction: 'late', count: 2, mine: true }],
      isHighlighted: true,
    })
    expect(parsed).toMatchObject({
      parentId: 'p3',
      isHighlighted: true,
      photos: ['https://ejemplo.test/f.jpg'],
    })
    expect(parsed?.reactions[0]).toMatchObject({ reaction: 'late', count: 2, mine: true })
  })
})
