import { appError, type AppError } from '@core/errors/AppError.ts'
import { err, ok, type Result } from '@core/result.ts'
import { CLUB_API_MESSAGES } from '@modules/club/constants/copy.ts'
import type { Alliance } from '@modules/club/domain/entities/Alliance.ts'
import type { Member } from '@modules/club/domain/entities/Member.ts'
import type {
  AllianceDraft,
  ClubWritePort,
  MemberDraft,
} from '@modules/club/domain/ports/ClubWritePort.ts'
import { parseAlliance, parseMember } from '@modules/club/infrastructure/parseClub.ts'
import {
  API,
  API_FAIL_FALLBACK,
  HTTP_STATUS,
  JSON_HEADERS,
  apiOperarItem,
  apiOperarItemDelete,
} from '@shared/http/constants.ts'

export class HttpClubApi implements ClubWritePort {
  createAlliance(draft: AllianceDraft, clave: string) {
    return this.saveAlliance(API.OPERAR_ALLIANCES, draft, clave)
  }

  updateAlliance(id: string, draft: AllianceDraft, clave: string) {
    return this.saveAlliance(apiOperarItem(API.OPERAR_ALLIANCES, id), draft, clave)
  }

  removeAlliance(id: string, clave: string) {
    return postDone(apiOperarItemDelete(API.OPERAR_ALLIANCES, id), clave)
  }

  createMember(draft: MemberDraft, clave: string) {
    return this.saveMember(API.OPERAR_MEMBERS, draft, clave)
  }

  updateMember(id: string, draft: MemberDraft, clave: string) {
    return this.saveMember(apiOperarItem(API.OPERAR_MEMBERS, id), draft, clave)
  }

  removeMember(id: string, clave: string) {
    return postDone(apiOperarItemDelete(API.OPERAR_MEMBERS, id), clave)
  }

  private async saveAlliance(url: string, draft: AllianceDraft, clave: string): Promise<Result<Alliance, AppError>> {
    const response = await fetch(url, {
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

  private async saveMember(url: string, draft: MemberDraft, clave: string): Promise<Result<Member, AppError>> {
    const response = await fetch(url, {
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

async function postDone(url: string, clave: string): Promise<Result<true, AppError>> {
  const response = await fetch(url, { method: 'POST', headers: JSON_HEADERS, body: JSON.stringify({ clave }) })
  const body = await readBody(response)
  if (!response.ok) return fail(response.status, body)
  return ok(true)
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
  if (status === HTTP_STATUS.NOT_FOUND) return err(appError('NOT_FOUND', detail))
  return err(appError('INFRASTRUCTURE', detail))
}
