import type { AppError } from '@core/errors/AppError.ts'
import type { Result } from '@core/result.ts'
import type { Alliance } from '@modules/club/domain/entities/Alliance.ts'
import type { Member } from '@modules/club/domain/entities/Member.ts'

export type AllianceDraft = {
  readonly name: string
  readonly support: string
  readonly href?: string
}

export type MemberDraft = {
  readonly alias: string
  readonly moto?: string
  readonly instagramHref?: string
}

export interface ClubWritePort {
  createAlliance(draft: AllianceDraft, clave: string): Promise<Result<Alliance, AppError>>
  createMember(draft: MemberDraft, clave: string): Promise<Result<Member, AppError>>
}
