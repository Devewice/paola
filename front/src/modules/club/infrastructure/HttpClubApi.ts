import { appError, type AppError } from '@core/errors/AppError.ts'
import { err, ok, type Result } from '@core/result.ts'
import { CLUB_API_MESSAGES } from '@modules/club/constants/copy.ts'
import type {
  AllianceDraft,
  ClubWritePort,
  MemberDraft,
} from '@modules/club/domain/ports/ClubWritePort.ts'
import { parseAlliance, parseMember } from '@modules/club/infrastructure/parseClub.ts'
import { API, API_FAIL_FALLBACK, HTTP_STATUS, JSON_HEADERS } from '@shared/http/constants.ts'

export class HttpClubApi implements ClubWritePort {
  async createAlliance(draft: AllianceDraft, clave: string) {
    const response = await fetch(API.OPERAR_ALLIANCES, {
      method: 'POST',
      headers: JSON_HEADERS,
      body: JSON.stringify({ ...draft, clave }),
    })
    const body = await readBody(response)
    if (!response.ok) return fail(response.status, body)
    const alliance = parseAlliance(body.alliance)
    if (!alliance) {
      return err(appError('INFRASTRUCTURE', CLUB_API_MESSAGES.ALLIANCE_PARSE_FAIL))
    }
    return ok(alliance)
  }

  async createMember(draft: MemberDraft, clave: string) {
    const response = await fetch(API.OPERAR_MEMBERS, {
      method: 'POST',
      headers: JSON_HEADERS,
      body: JSON.stringify({ ...draft, clave }),
    })
    const body = await readBody(response)
    if (!response.ok) return fail(response.status, body)
    const member = parseMember(body.member)
    if (!member) {
      return err(appError('INFRASTRUCTURE', CLUB_API_MESSAGES.MEMBER_PARSE_FAIL))
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
  const detail = typeof body.detail === 'string' ? body.detail : API_FAIL_FALLBACK
  if (status === HTTP_STATUS.BAD_REQUEST || status === HTTP_STATUS.FORBIDDEN) {
    return err(appError('VALIDATION', detail))
  }
  return err(appError('INFRASTRUCTURE', detail))
}
