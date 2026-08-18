import { describe, expect, it } from 'vitest'
import { GetAgenda } from '@modules/rides/application/GetAgenda.ts'
import { PublishOuting } from '@modules/rides/application/PublishOuting.ts'
import { InMemoryOutingCatalog } from '@modules/rides/infrastructure/InMemoryOutingCatalog.ts'
import type { OutingDraft } from '@modules/rides/domain/entities/Outing.ts'

const validDraft = (): OutingDraft => ({
  title: 'Salida de prueba',
  date: '2026-09-01',
  kind: 'rodada',
  meetingPoint: 'Usme',
  routeText: 'Usme — rumbo a definir',
  capacity: 12,
  whatToBring: 'Casco y agua',
  paid: false,
})

describe('PublishOuting', () => {
  it('no publica sin fecha', () => {
    const catalog = new InMemoryOutingCatalog()
    const useCase = new PublishOuting(catalog, () => 'salida-1')
    const result = useCase.execute({ ...validDraft(), date: '' })

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error.code).toBe('VALIDATION')
      expect(result.error.message).toMatch(/fecha/)
    }
    expect(catalog.list()).toHaveLength(0)
  })

  it('no publica con fecha inválida', () => {
    const catalog = new InMemoryOutingCatalog()
    const useCase = new PublishOuting(catalog, () => 'salida-1')
    const result = useCase.execute({ ...validDraft(), date: '01-09-2026' })

    expect(result.ok).toBe(false)
    expect(catalog.list()).toHaveLength(0)
  })

  it('no publica sin cupo máximo', () => {
    const catalog = new InMemoryOutingCatalog()
    const useCase = new PublishOuting(catalog, () => 'salida-1')
    const result = useCase.execute({ ...validDraft(), capacity: 0 })

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error.message).toMatch(/cupo/)
    }
    expect(catalog.list()).toHaveLength(0)
  })

  it('publica abierta cuando hay fecha y cupo', () => {
    const catalog = new InMemoryOutingCatalog()
    const useCase = new PublishOuting(catalog, () => 'salida-1')
    const result = useCase.execute(validDraft())

    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.value.status).toBe('abierto')
      expect(result.value.capacity).toBe(12)
      expect(result.value.date).toBe('2026-09-01')
    }
    expect(catalog.list()).toHaveLength(1)
  })
})

describe('GetAgenda', () => {
  it('lee la salida publicada como próxima', () => {
    const catalog = new InMemoryOutingCatalog()
    const published = new PublishOuting(catalog, () => 'salida-1').execute(validDraft())
    expect(published.ok).toBe(true)

    const agenda = new GetAgenda(catalog, () => '2026-08-17').execute()
    expect(agenda.items).toHaveLength(1)
    expect(agenda.items[0]?.when).toBe('proxima')
    expect(agenda.items[0]?.point).toBe('Usme')
  })

  it('marca realizado como pasada', () => {
    const catalog = new InMemoryOutingCatalog([
      {
        id: 'vieja',
        title: 'Ya rodada',
        date: '2026-07-01',
        kind: 'actividad',
        meetingPoint: 'Soacha',
        routeText: 'Lavado grupal de cascos',
        capacity: 8,
        taken: 0,
        whatToBring: 'Casco',
        paid: false,
        status: 'realizado',
      },
    ])

    const agenda = new GetAgenda(catalog, () => '2026-08-17').execute()
    expect(agenda.items[0]?.when).toBe('pasada')
    expect(agenda.items[0]?.kind).toBe('actividad')
  })
})
