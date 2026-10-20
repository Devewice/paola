/** Mosaicos estándar de OpenStreetMap (sin clave, con atribución); el tono oscuro lo pone el CSS. */
export const MAP_TILES = {
  URL: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
  ATTRIBUTION:
    '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>',
  MAX_ZOOM: 18,
  SINGLE_ZOOM: 13,
  /** Arriba más aire: ahí van las etiquetas de los pines. */
  FIT_PADDING_TOP: 72,
  FIT_PADDING: 36,
  /** Abajo va el aviso de zoom. */
  FIT_PADDING_BOTTOM: 44,
  FIT_PADDING_COMPACT: 22,
} as const

export const MAP_COLORS = {
  ROUTE: '#0088F8',
  GLOW: '#48B4FC',
} as const

export const MAP_LINKS = {
  DIRECTIONS: 'https://www.google.com/maps/dir/?api=1&travelmode=driving',
  WAZE: 'https://waze.com/ul?navigate=yes',
  APPLE: 'https://maps.apple.com/?dirflg=d',
} as const

export const MAP_COPY = {
  aria: 'Mapa de la ruta',
  start: 'Salida',
  end: 'Destino',
  startShort: 'S',
  endShort: 'D',
  openIn: 'Abrir en',
  googleMaps: 'Google Maps',
  waze: 'Waze',
  appleMaps: 'Apple Maps',
  howToGet: 'Cómo llegar',
  pendingPoint: 'Punto por confirmar',
  pendingRoute: 'Ruta por confirmar',
  failed: 'No se pudo cargar el mapa. Ábrelo en Google Maps, Waze o Apple Maps.',
  zoomHint: 'Toca el mapa para hacer zoom',
  straight: 'Trazo aproximado: la ruta exacta la confirmo en el grupo.',
  distance: (km: number) => `${km.toLocaleString('es-CO', { maximumFractionDigits: 1 })} km`,
  duration: (minutes: number) =>
    minutes >= 60 ? `~${Math.floor(minutes / 60)} h ${String(minutes % 60).padStart(2, '0')} min` : `~${minutes} min`,
} as const
