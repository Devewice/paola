export type ProfilePatchDto = {
  readonly alias: string
  readonly displayName: string | null
  readonly fullName: string | null
  readonly whatsapp: string | null
}

export type MotorcycleDraftDto =
  | { readonly kind: 'catalog'; readonly catalogId: string }
  | { readonly kind: 'custom'; readonly brand: string; readonly model: string; readonly cc: number }
