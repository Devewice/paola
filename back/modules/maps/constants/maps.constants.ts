export const MAPS_ROUTES = {
  PLACES: '/api/operar/places',
} as const

/** Servicios abiertos de OpenStreetMap. Nominatim pide identificarse y máximo una consulta por segundo. */
export const MAPS_SERVICES = {
  SEARCH: 'https://nominatim.openstreetmap.org/search',
  ROUTE: 'https://router.project-osrm.org/route/v1/driving',
  USER_AGENT: 'PaolaBiker/1.0 (contacto@paolabiker.com)',
  COUNTRY: 'co',
  TIMEOUT_MS: 8000,
} as const

export const MAPS_LIMITS = {
  QUERY_MIN: 3,
  QUERY_MAX: 160,
  RESULTS: 5,
  LABEL_MAX: 160,
} as const

/** "4.6615, -74.0055" pegado desde Google Maps. */
export const MAPS_COORDS_PATTERN = /^\s*(-?\d{1,2}(?:\.\d+)?)\s*,\s*(-?\d{1,3}(?:\.\d+)?)\s*$/

export const MAPS_MESSAGES = {
  QUERY_SHORT: 'Escribe al menos 3 letras para buscar el lugar.',
  SEARCH_FAIL: 'No se pudo buscar el lugar. Intenta otra vez o pega las coordenadas.',
  COORDS_LABEL: 'Punto en el mapa',
} as const
