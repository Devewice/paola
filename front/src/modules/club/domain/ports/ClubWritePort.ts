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
  updateAlliance(id: string, draft: AllianceDraft, clave: string): Promise<Result<Alliance, AppError>>
  removeAlliance(id: string, clave: string): Promise<Result<true, AppError>>
  createMember(draft: MemberDraft, clave: string): Promise<Result<Member, AppError>>
  updateMember(id: string, draft: MemberDraft, clave: string): Promise<Result<Member, AppError>>
  removeMember(id: string, clave: string): Promise<Result<true, AppError>>
}
