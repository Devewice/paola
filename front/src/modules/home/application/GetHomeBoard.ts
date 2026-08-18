import type { HomeBoard } from '@modules/home/domain/entities/HomeBoard.ts'
import type { HomeBoardPort } from '@modules/home/domain/ports/HomeBoardPort.ts'

export class GetHomeBoard {
  private readonly board: HomeBoardPort

  constructor(board: HomeBoardPort) {
    this.board = board
  }

  execute(): HomeBoard {
    return this.board.getBoard()
  }
}
