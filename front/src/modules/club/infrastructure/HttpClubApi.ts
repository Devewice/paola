import { appError, type AppError } from '@core/errors/AppError.ts'
import { err, ok, type Result } from '@core/result.ts'
import type {
  AllianceDraft,
  ClubWritePort,
  MemberDraft,
} from '@modules/club/domain/ports/ClubWritePort.ts'
import { parseAlliance, parseMember } from '@modules/club/infrastructure/parseClub.ts'

export class HttpClubApi implements ClubWritePort {
  async createAlliance(draft: AllianceDraft, clave: string) {
    const response = await fetch('/api/operar/alianzas', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ ...draft, clave }),
    })
    const body = await readBody(response)
    if (!response.ok) return fail(response.status, body)
    const alliance = parseAlliance(body.alliance)
    if (!alliance) {
      return err(appError('INFRASTRUCTURE', 'La API devolvió un aliado que no se entiende.'))
    }
    return ok(alliance)
  }

  async createMember(draft: MemberDraft, clave: string) {
    const response = await fetch('/api/operar/integrantes', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ ...draft, clave }),
    })
    const body = await readBody(response)
    if (!response.ok) return fail(response.status, body)
    const member = parseMember(body.member)
    if (!member) {
      return err(appError('INFRASTRUCTURE', 'La API devolvió un integrante que no se entiende.'))
    }
    return ok(member)
  }
}

async function readBody(response: Response): Promise<Record<string, unknown>> {
  try {
    const body: unknown = await response.json()
    if (body && typeof body === 'object') return body as Record<string, unknown>
  } catch {
    /* vacío */
  }
  return {}
}

function fail(status: number, body: Record<string, unknown>): Result<never, AppError> {
  const detail = typeof body.detail === 'string' ? body.detail : 'No se pudo completar.'
  if (status === 400 || status === 403) return err(appError('VALIDATION', detail))
  return err(appError('INFRASTRUCTURE', detail))
}
