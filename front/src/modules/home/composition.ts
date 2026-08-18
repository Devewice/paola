import { GetHomeBoard } from '@modules/home/application/GetHomeBoard.ts'
import type { HomeBoardPort } from '@modules/home/domain/ports/HomeBoardPort.ts'

export type HomeModule = {
  getBoard: () => ReturnType<GetHomeBoard['execute']>
}

export function createHomeModule(board: HomeBoardPort): HomeModule {
  const getHomeBoard = new GetHomeBoard(board)

  return {
    getBoard: () => getHomeBoard.execute(),
  }
}
