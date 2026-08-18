import type { ClubContentPort } from '@modules/club/domain/ports/ClubContentPort.ts'
import type { JoinChannel } from '@modules/club/domain/entities/JoinChannel.ts'

export class GetJoinChannel {
  private readonly content: ClubContentPort

  constructor(content: ClubContentPort) {
    this.content = content
  }

  execute(): JoinChannel {
    return this.content.getJoinChannel()
  }
}
