import type { PaolaContentPort } from '@modules/paola/domain/ports/PaolaContentPort.ts'
import type { PaolaPage } from '@modules/paola/domain/entities/PaolaPage.ts'

export class GetPaolaPage {
  private readonly content: PaolaContentPort

  constructor(content: PaolaContentPort) {
    this.content = content
  }

  execute(): PaolaPage {
    return this.content.getPage()
  }
}
