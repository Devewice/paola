import { GetAlliances } from '@modules/club/application/GetAlliances.ts'
import { GetJoinChannel } from '@modules/club/application/GetJoinChannel.ts'
import { GetMembers } from '@modules/club/application/GetMembers.ts'
import type { ClubContentPort } from '@modules/club/domain/ports/ClubContentPort.ts'
import type { ClubWritePort } from '@modules/club/domain/ports/ClubWritePort.ts'

export type ClubModule = {
  getAlliances: () => ReturnType<GetAlliances['execute']>
  getJoinChannel: () => ReturnType<GetJoinChannel['execute']>
  getMembers: () => ReturnType<GetMembers['execute']>
  createAlliance: ClubWritePort['createAlliance']
  updateAlliance: ClubWritePort['updateAlliance']
  removeAlliance: ClubWritePort['removeAlliance']
  createMember: ClubWritePort['createMember']
  updateMember: ClubWritePort['updateMember']
  removeMember: ClubWritePort['removeMember']
}

export function createClubModule(content: ClubContentPort, write: ClubWritePort): ClubModule {
  const getAlliances = new GetAlliances(content)
  const getJoinChannel = new GetJoinChannel(content)
  const getMembers = new GetMembers(content)

  return {
    getAlliances: () => getAlliances.execute(),
    getJoinChannel: () => getJoinChannel.execute(),
    getMembers: () => getMembers.execute(),
    createAlliance: (draft, clave) => write.createAlliance(draft, clave),
    updateAlliance: (id, draft, clave) => write.updateAlliance(id, draft, clave),
    removeAlliance: (id, clave) => write.removeAlliance(id, clave),
    createMember: (draft, clave) => write.createMember(draft, clave),
    updateMember: (id, draft, clave) => write.updateMember(id, draft, clave),
    removeMember: (id, clave) => write.removeMember(id, clave),
  }
}
