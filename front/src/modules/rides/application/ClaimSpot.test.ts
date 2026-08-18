import { describe, expect, it } from 'vitest'
import { ClaimSpot } from '@modules/rides/application/ClaimSpot.ts'
import { PublishOuting } from '@modules/rides/application/PublishOuting.ts'
import { SetOutingStatus } from '@modules/rides/application/SetOutingStatus.ts'
import type { Outing, OutingDraft } from '@modules/rides/domain/entities/Outing.ts'
import { InMemoryOutingCatalog } from '@modules/rides/infrastructure/InMemoryOutingCatalog.ts'

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

function openOuting(capacity = 2): { catalog: InMemoryOutingCatalog; outing: Outing } {
  const catalog = new InMemoryOutingCatalog()
  const published = new PublishOuting(catalog, () => 'salida-1').execute({
    ...validDraft(),
    capacity,
  })
  if (!published.ok) throw new Error('setup')
  return { catalog, outing: published.value }
}

function claimDraft(
  over: Partial<{ name: string; whatsapp: string; moto: string; privacyAccepted: boolean }> = {},
) {
  return {
    name: 'Ana',
    whatsapp: '3123136679',
    privacyAccepted: true,
    ...over,
  }
}

describe('ClaimSpot', () => {
  it('no reserva sin leer el aviso', () => {
    const { catalog, outing } = openOuting()
    const result = new ClaimSpot(catalog, () => 'cupo-1').execute(
      outing.id,
      claimDraft({ privacyAccepted: false }),
    )
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.error.message).toMatch(/aviso/)
    expect(catalog.listTickets(outing.id)).toHaveLength(0)
  })

  it('no reserva sin nombre', () => {
    const { catalog, outing } = openOuting()
    const result = new ClaimSpot(catalog, () => 'cupo-1').execute(
      outing.id,
      claimDraft({ name: ' ' }),
    )
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.error.message).toMatch(/nombre/)
    expect(catalog.listTickets(outing.id)).toHaveLength(0)
  })

  it('no reserva sin WhatsApp', () => {
    const { catalog, outing } = openOuting()
    const result = new ClaimSpot(catalog, () => 'cupo-1').execute(
      outing.id,
      claimDraft({ whatsapp: '123' }),
    )
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.error.message).toMatch(/WhatsApp/)
    expect(catalog.listTickets(outing.id)).toHaveLength(0)
  })

  it('anota el cupo y deja moto opcional', () => {
    const { catalog, outing } = openOuting()
    const result = new ClaimSpot(catalog, () => 'cupo-1').execute(
      outing.id,
      claimDraft({ whatsapp: '+57 312 313 6679' }),
    )
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.value.ticket.moto).toBe('')
      expect(result.value.ticket.whatsapp).toBe('573123136679')
      expect(result.value.outing.taken).toBe(1)
      expect(result.value.outing.status).toBe('abierto')
    }
  })

  it('no hay overbooking: al llenarse pasa a lleno y el siguiente no entra', () => {
    const { catalog, outing } = openOuting(1)
    const first = new ClaimSpot(catalog, () => 'cupo-1').execute(outing.id, claimDraft())
    expect(first.ok).toBe(true)
    if (first.ok) expect(first.value.outing.status).toBe('lleno')

    const second = new ClaimSpot(catalog, () => 'cupo-2').execute(
      outing.id,
      claimDraft({ name: 'Luis', whatsapp: '3100000000' }),
    )
    expect(second.ok).toBe(false)
    if (!second.ok) {
      expect(second.error.code).toBe('CONFLICT')
      expect(second.error.message).toMatch(/lleno/)
    }
    expect(catalog.listTickets(outing.id)).toHaveLength(1)
  })

  it('no vende si está cerrada', () => {
    const { catalog, outing } = openOuting()
    new SetOutingStatus(catalog).execute(outing.id, 'cerrado')
    const result = new ClaimSpot(catalog, () => 'cupo-1').execute(outing.id, claimDraft())
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.error.message).toMatch(/cerrada/)
  })

  it('no vende si está realizada', () => {
    const { catalog, outing } = openOuting()
    new SetOutingStatus(catalog).execute(outing.id, 'realizado')
    const result = new ClaimSpot(catalog, () => 'cupo-1').execute(outing.id, claimDraft())
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.error.message).toMatch(/rodó/)
  })
})

describe('SetOutingStatus', () => {
  it('cierra la inscripción a mano', () => {
    const { catalog, outing } = openOuting()
    const result = new SetOutingStatus(catalog).execute(outing.id, 'cerrado')
    expect(result.ok).toBe(true)
    if (result.ok) expect(result.value.status).toBe('cerrado')
  })

  it('no reabre una realizada', () => {
    const { catalog, outing } = openOuting()
    new SetOutingStatus(catalog).execute(outing.id, 'realizado')
    const result = new SetOutingStatus(catalog).execute(outing.id, 'cerrado')
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.error.code).toBe('CONFLICT')
  })
})
