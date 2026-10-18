export type AccountProfile = {
  readonly id: string
  readonly email: string
  readonly alias: string
  readonly fullName?: string
  readonly whatsapp?: string
  readonly isPublic: boolean
  readonly createdAt?: string
}

export type CatalogMotorcycle = {
  readonly id: string
  readonly brand: string
  readonly model: string
  readonly cc: number
}

export type UserMotorcycle = {
  readonly id: string
  readonly catalogId?: string
  readonly brand: string
  readonly model: string
  readonly cc?: number
  readonly isPrimary: boolean
}
