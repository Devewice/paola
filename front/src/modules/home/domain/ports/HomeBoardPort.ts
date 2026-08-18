import type { HomeBoard } from '@modules/home/domain/entities/HomeBoard.ts'

export interface HomeBoardPort {
  getBoard(): HomeBoard
}
