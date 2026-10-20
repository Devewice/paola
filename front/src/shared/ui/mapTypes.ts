export type MapPin = { readonly label: string; readonly lat: number; readonly lng: number }

export type MapRoute = {
  readonly start?: MapPin
  readonly end?: MapPin
  /** Trazado por carretera `[lat, lng]`; vacío si no se pudo trazar. */
  readonly path: readonly (readonly [number, number])[]
  readonly distanceKm?: number
  readonly durationMin?: number
}
