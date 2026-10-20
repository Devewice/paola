export interface MapPoint {
  label: string
  lat: number
  lng: number
}

export interface PlaceResult extends MapPoint {
  detail: string
}

export interface RoadRoute {
  /** Polyline codificada (precisión 5), como la entrega OSRM. */
  path: string
  distanceM: number
  durationS: number
}
