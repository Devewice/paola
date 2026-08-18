import { GetAlliances } from '@modules/club/application/GetAlliances.ts'
import { GetJoinChannel } from '@modules/club/application/GetJoinChannel.ts'
import { GetMembers } from '@modules/club/application/GetMembers.ts'
import { StaticClubContentRepository } from '@modules/club/infrastructure/StaticClubContentRepository.ts'

export type ClubModule = {
  getAlliances: () => ReturnType<GetAlliances['execute']>
  getJoinChannel: () => ReturnType<GetJoinChannel['execute']>
  getMembers: () => ReturnType<GetMembers['execute']>
}

export function createClubModule(): ClubModule {
  const content = new StaticClubContentRepository()
  const getAlliances = new GetAlliances(content)
  const getJoinChannel = new GetJoinChannel(content)
  const getMembers = new GetMembers(content)

  return {
    getAlliances: () => getAlliances.execute(),
    getJoinChannel: () => getJoinChannel.execute(),
    getMembers: () => getMembers.execute(),
  }
}
