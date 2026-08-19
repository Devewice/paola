import { describe, expect, it } from 'vitest'
import { canHidePost, canNestReply, SOCIAL_LIMITS } from '@app/socialRules.ts'

describe('canHidePost', () => {
  it('un miembro normal no oculta', () => {
    expect(canHidePost({ role: 'member', isOperador: false })).toBe(false)
    expect(canHidePost({ isOperador: false })).toBe(false)
  })

  it('un moderador de esa comunidad sí oculta', () => {
    expect(canHidePost({ role: 'moderador', isOperador: false })).toBe(true)
  })

  it('Paola con clave de operadora sí oculta', () => {
    expect(canHidePost({ role: 'member', isOperador: true })).toBe(true)
  })
})

describe('canNestReply', () => {
  it('acepta post → respuesta → respuesta', () => {
    expect(canNestReply(0)).toBe(true)
    expect(canNestReply(1)).toBe(true)
  })

  it('rechaza profundidad mayor a 2', () => {
    expect(canNestReply(SOCIAL_LIMITS.POST_MAX_DEPTH)).toBe(false)
    expect(canNestReply(3)).toBe(false)
  })
})
