import type { AllianceList } from '@modules/club/domain/entities/Alliance.ts'
import type { JoinChannel } from '@modules/club/domain/entities/JoinChannel.ts'
import type { MemberList } from '@modules/club/domain/entities/Member.ts'

export interface ClubContentPort {
  getAlliances(): AllianceList
  getJoinChannel(): JoinChannel
  getMembers(): MemberList
}
