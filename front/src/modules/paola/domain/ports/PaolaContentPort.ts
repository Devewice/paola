import type { PaolaPage } from '@modules/paola/domain/entities/PaolaPage.ts'

export interface PaolaContentPort {
  getPage(): PaolaPage
}
