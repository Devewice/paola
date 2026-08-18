import type { ClubContentPort } from '@modules/club/domain/ports/ClubContentPort.ts'
import type { AllianceList } from '@modules/club/domain/entities/Alliance.ts'

export class GetAlliances {
  private readonly content: ClubContentPort

  constructor(content: ClubContentPort) {
    this.content = content
  }

  execute(): AllianceList {
    return this.content.getAlliances()
  }
}
