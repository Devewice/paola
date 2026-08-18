import type { PaolaContentPort } from '@modules/paola/domain/ports/PaolaContentPort.ts'
import type { PaolaPage } from '@modules/paola/domain/entities/PaolaPage.ts'
import { PAOLA_PAGE } from '@modules/paola/constants/copy.ts'

/** Contenido estático de docs/paola.md — no se reescribe desde código. */
export class StaticPaolaContentRepository implements PaolaContentPort {
  getPage(): PaolaPage {
    return PAOLA_PAGE
  }
}
