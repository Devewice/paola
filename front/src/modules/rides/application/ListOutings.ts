import type { Outing } from '@modules/rides/domain/entities/Outing.ts'
import type { OutingCatalogPort } from '@modules/rides/domain/ports/OutingCatalogPort.ts'

export class ListOutings {
  private readonly catalog: OutingCatalogPort
  private readonly today: () => string

  constructor(catalog: OutingCatalogPort, today: () => string) {
    this.catalog = catalog
    this.today = today
  }

  execute(): readonly Outing[] {
    const today = this.today()
    const all = [...this.catalog.list()]
    const upcoming = all
      .filter((outing) => outing.status !== 'realizado' && outing.date >= today)
      .sort((a, b) => a.date.localeCompare(b.date))
    const past = all
      .filter((outing) => outing.status === 'realizado' || outing.date < today)
      .sort((a, b) => b.date.localeCompare(a.date))
    return [...upcoming, ...past]
  }
}
