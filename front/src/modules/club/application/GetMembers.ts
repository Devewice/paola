import type { ClubContentPort } from '@modules/club/domain/ports/ClubContentPort.ts'
import type { MemberList } from '@modules/club/domain/entities/Member.ts'

export class GetMembers {
  private readonly content: ClubContentPort

  constructor(content: ClubContentPort) {
    this.content = content
  }

  execute(): MemberList {
    return this.content.getMembers()
  }
}
