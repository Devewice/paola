import type { Alliance, AllianceList } from '@modules/club/domain/entities/Alliance.ts'
import type { JoinChannel } from '@modules/club/domain/entities/JoinChannel.ts'
import type { Member, MemberList } from '@modules/club/domain/entities/Member.ts'
import type { ClubContentPort } from '@modules/club/domain/ports/ClubContentPort.ts'
import { ALLIANCES_EMPTY_COPY, MEMBERS_EMPTY_COPY } from '@modules/club/infrastructure/clubEmptyCopy.ts'

/** Snapshot de MySQL. Tabla vacía o API caída = hueco honesto, no JSON de respaldo. */
export class SnapshotClubContent implements ClubContentPort {
  private readonly alliances: readonly Alliance[]
  private readonly members: readonly Member[]
  private readonly join: JoinChannel

  constructor(
    alliances: readonly Alliance[],
    members: readonly Member[],
    join: JoinChannel,
  ) {
    this.alliances = alliances
    this.members = members
    this.join = join
  }

  getAlliances(): AllianceList {
    return { items: this.alliances, emptyCopy: ALLIANCES_EMPTY_COPY }
  }

  getJoinChannel(): JoinChannel {
    return this.join
  }

  getMembers(): MemberList {
    return { items: this.members, emptyCopy: MEMBERS_EMPTY_COPY }
  }
}
