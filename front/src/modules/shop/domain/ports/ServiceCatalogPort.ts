import type { ShopService } from '@modules/shop/domain/entities/ShopService.ts'

export interface ServiceCatalogPort {
  list(): readonly ShopService[]
  get(id: string): ShopService | undefined
}
