export const SHOP_EMPTY_OWN = 'Aún no hay nada a la venta.'

export const SHOP_EMPTY_COLLAB = 'Aún no hay colaboraciones.'

export const SHOP_EMPTY_FICHA = 'Ese producto no está.'

export const SHOP_EMPTY_SERVICE = 'Aún no hay lavado de casco.'

export const SHOP_EMPTY_SERVICE_FICHA = 'Ese lavado no está.'

export const SHOP_DELIVERY_COPY =
  'La entrega es gratis en Bogotá y Soacha. Al resto del país todavía no llegamos.'

export const SHOP_WARRANTY_COPY =
  'La garantía cubre solo defectos de fábrica. No cubre golpe, desgaste ni si no te gustó.'

export const SHOP_SERVICE_WARRANTY_COPY =
  'Si el lavado quedó mal, lo corregimos.'

export const SHOP_SERVICE_ZONE_COPY =
  'El lavado es solo en Bogotá y Soacha.'

export const SHOP_KIND = {
  OWN: 'propia',
  COLLAB: 'colaboracion',
} as const

export const SHOP_LIMITS = {
  TITLE_MIN: 2,
  DESCRIPTION_MIN: 2,
  COUNT_MIN: 0,
} as const

export const SHOP_ASK_PRICE = 'Preguntar'
export const SHOP_PRICE_LOCALE = 'es-CO'

export const SHOP_FILTER = {
  ALL: 'all',
  OWN: 'own',
  COLLAB: 'collab',
  SERVICE: 'service',
} as const

export const SHOP_SORT = {
  NEWEST: 'newest',
  OLDEST: 'oldest',
  PRICE_ASC: 'price-asc',
  PRICE_DESC: 'price-desc',
  NAME: 'name',
  COLOR_ASC: 'color-asc',
  COLOR_DESC: 'color-desc',
} as const

export const SHOP_PRICE_BAND = {
  ALL: 'all',
  ASK: 'ask',
  UPTO_50: 'upto-50',
  MID: '50-150',
  FROM_150: 'from-150',
} as const

export const SHOP_PRICE_LIMITS = {
  MID_MIN: 50_000,
  MID_MAX: 150_000,
} as const

export const SHOP_STOCK = {
  ALL: 'all',
  IN: 'in',
  OUT: 'out',
  ASK: 'ask',
} as const

export const SHOP_PHOTO = {
  ALL: 'all',
  WITH: 'with',
} as const

export const SHOP_CATEGORY = {
  CHAQUETA: 'chaqueta',
  CAMISA: 'camisa',
  GORRA: 'gorra',
  CALCA: 'calca',
  PARCHE: 'parche',
  DIJE: 'dije',
  VASO: 'vaso',
  PLATO: 'plato',
  AFICHE: 'afiche',
} as const

export const SHOP_CITY = {
  BOGOTA: 'bogota',
  SOACHA: 'soacha',
  FUERA: 'fuera',
} as const

export const SHOP_PAY = {
  WA: 'whatsapp',
  MAIL: 'mail',
} as const

export const SHOP_COPY = {
  kicker: 'Tienda',
  title: 'El Aparador',
  plate: 'Recuerdos del parche',
  lead: 'Aquí están las piezas del parche: ropa, calcas, vasos, afiches y lo que vaya saliendo.',
  dealKicker: 'Oferta del día',
  dealCta: 'Quiero esta oferta',
  dealMysteryTitle: '¿Cuál es esa pieza?',
  dealMysteryLead: 'Cuando haya oferta, aquí la revelamos.',
  dealMediaLabel: 'Pieza',
  deckKicker: 'Mazo misterioso',
  deckLead: 'Baraja las cartas. Regístrate y revela tu pieza con cupón.',
  deckRegisterTitle: 'Regístrate para revelar',
  deckRegisterLead: 'Sin cuenta no se voltea la carta. Es rápido.',
  deckRegisterCta: 'Crear cuenta',
  deckLoginCta: 'Ya tengo cuenta',
  deckAlias: 'Alias',
  deckEmail: 'Correo',
  deckPassword: 'Clave',
  deckSubmitRegister: 'Registrarme',
  deckSubmitLogin: 'Entrar',
  deckCouponLabel: 'Tu cupón',
  deckRedeemCta: 'Quiero esta oferta',
  deckFlipFail: 'No se pudo revelar la carta.',
  deckAuthFail: 'No se pudo entrar. Revisa correo y clave.',
  heroPhotoAlt: 'Paola en moto',
  writeCta: 'Escríbeme',
  mailCta: 'Correo',
  backCta: 'Volver a Tienda',
  fichaCta: 'Ver ficha',
  rulesHeading: 'Reglas',
  rulesAria: 'Reglas',
  ownHeading: 'Marca propia',
  ownAria: 'Marca propia',
  ownEmptyTitle: 'Sin piezas propias',
  collabHeading: 'Colaboraciones',
  collabAria: 'Colaboraciones',
  collabNote: 'Las colaboraciones van en su propia lista, no mezcladas con la marca propia.',
  collabEmptyTitle: 'Sin collab',
  fichaEmptyTitle: 'Sin ficha',
  deliveryAria: 'Entrega y garantía',
  kindOwn: 'Marca propia',
  kindCollab: 'Colaboración',
  serviceHeading: 'Lavado de cascos',
  serviceAria: 'Lavado de cascos',
  serviceEmptyTitle: 'Sin lavado publicado',
  serviceKind: 'Servicio',
  serviceAskCta: 'Pedir el lavado',
  serviceIncludes: 'Qué incluye',
  serviceHandover: 'Cómo se entrega el casco',
  serviceTurnaround: 'Tiempo',
  serviceFichaEmptyTitle: 'Sin ficha de lavado',
  serviceMediaLabel: 'Lavado',
  mediaLabel: 'Pieza',
  marketKicker: 'Del oficio',
  searchPlaceholder: 'Buscar pieza o lavado…',
  filtersSearch: 'Buscar',
  sortNewest: 'Más recientes',
  sortOldest: 'Más antiguos',
  sortPriceAsc: 'Menor precio',
  sortPriceDesc: 'Mayor precio',
  sortName: 'Nombre',
  sortTime: 'Tiempo',
  sortColorAxis: 'Color',
  sortIdle: '—',
  sortColorAsc: 'A → Z',
  sortColorDesc: 'Z → A',
  countOne: '1 resultado',
  countMany: 'resultados',
  emptyFilterTitle: 'Nada con eso',
  emptyFilterCopy: 'Cambia el filtro o el texto. Si no aparece, escríbeme y lo cuadrámos.',
  filtersTitle: 'Filtros',
  filtersShelf: 'Estantería',
  filtersPiece: 'Pieza',
  filtersSort: 'Ordenar',
  filtersPrice: 'Precio',
  filtersPriceAll: 'Cualquier precio',
  filtersColor: 'Color',
  filtersColorAll: 'Cualquier color',
  filtersSize: 'Talla',
  filtersSizeAll: 'Cualquier talla',
  filtersStock: 'Disponibilidad',
  filtersStockAll: 'Cualquier stock',
  filtersPhoto: 'Foto',
  filtersPhotoAll: 'Con o sin foto',
  filtersPhotoWith: 'Solo con foto',
  filtersClear: 'Limpiar filtros',
  stockIn: 'Con stock',
  stockOut: 'Agotado',
  catChaqueta: 'Chaquetas',
  catCamisa: 'Camisas',
  catGorra: 'Gorras',
  catCalca: 'Calcas',
  catParche: 'Parches',
  catDije: 'Dijes',
  catVaso: 'Vasos',
  catPlato: 'Platos',
  catAfiche: 'Afiches',
  eventsTitle: 'Rodadas',
  eventsLead: 'Somos más de — en el parche. Apúntate a la próxima rodada.',
  eventsCta: 'Apúntate',
  askPrice: 'Precio a preguntar',
  withPhoto: 'Solo con foto',
  priceBand50: 'Hasta $50.000',
  priceBand150: 'De $50.000 a $150.000',
  priceBandMore: 'Más de $150.000',
  featureOwnTitle: 'Marca propia',
  featureCollabTitle: 'Collab aparte',
  featureWashTitle: 'Lavado de casco',
  tagOwn: 'P',
  tagCollab: 'C',
  tagWash: 'L',
  kindOwnTag: 'P · Marca propia',
  kindCollabTag: 'C · Colaboración',
  kindWashTag: 'L · Lavado',
  pedidoHeading: 'Pedido',
  payHeading: 'Cómo pedir',
  checkoutPay: 'Pedido',
  checkoutZone: 'Zona',
  checkoutClose: 'Confirmar',
  checkoutPayMeta: 'WhatsApp, correo o pasarela.',
  checkoutZoneMeta: 'Bogotá y Soacha gratis.',
  checkoutCloseMeta: 'Garantía y el mensaje.',
  checkoutNext: 'Siguiente',
  checkoutBack: 'Atrás',
  payWaTitle: 'WhatsApp',
  payWaCopy: 'El chat del día a día. Este camino no se apaga.',
  payMailTitle: 'Correo',
  payMailCopy: 'Si prefieres dejarlo por escrito.',
  paySecure: 'Pago humano primero. La pasarela se suma; el chat no se apaga.',
  dualWaLead: 'Ahí cuadrámos precio, stock y cuándo te llega.',
  dualWebLead: 'Aquí ves el aparador y abres la ficha.',
  cityLabel: '¿Dónde te cae?',
  cityOk: 'Te lo llevo sin costo.',
  cityNo: 'Todavía no despacho fuera de Bogotá y Soacha.',
  zoneBogota: 'Bogotá',
  zoneSoacha: 'Soacha',
  zoneFuera: 'Resto del país',
  zoneYes: 'Gratis',
  zoneNo: 'Aún no',
  warrantyTitle: 'Garantía',
  deliveryTitle: 'Entrega',
  specStock: 'Stock',
  specKind: 'Estantería',
  specPrice: 'Precio',
  crumbsHome: 'Tienda',
} as const

export const SHOP_HERO_PHOTO = '/kit-assets/paola-moto.png'

export const SHOP_PROMO = {
  on: false,
  kicker: 'Pedido',
  text: 'Escríbeme por WhatsApp o correo. La pasarela viene después; este camino no se apaga.',
} as const

export const SHOP_PREFILTERS = [
  { id: SHOP_FILTER.OWN, tag: SHOP_COPY.tagOwn, label: SHOP_COPY.featureOwnTitle },
  { id: SHOP_FILTER.COLLAB, tag: SHOP_COPY.tagCollab, label: SHOP_COPY.featureCollabTitle },
  { id: SHOP_FILTER.SERVICE, tag: SHOP_COPY.tagWash, label: SHOP_COPY.featureWashTitle },
] as const

export const SHOP_SORT_OPTIONS = [
  { value: SHOP_SORT.NEWEST, label: SHOP_COPY.sortNewest },
  { value: SHOP_SORT.PRICE_ASC, label: SHOP_COPY.sortPriceAsc },
  { value: SHOP_SORT.PRICE_DESC, label: SHOP_COPY.sortPriceDesc },
  { value: SHOP_SORT.NAME, label: SHOP_COPY.sortName },
] as const

export const SHOP_SORT_IDLE = ''

export const SHOP_SORT_TIME_OPTIONS = [
  { value: SHOP_SORT_IDLE, label: SHOP_COPY.sortIdle, muted: true },
  { value: SHOP_SORT.NEWEST, label: SHOP_COPY.sortNewest },
  { value: SHOP_SORT.OLDEST, label: SHOP_COPY.sortOldest },
] as const

export const SHOP_SORT_PRICE_AXIS_OPTIONS = [
  { value: SHOP_SORT_IDLE, label: SHOP_COPY.sortIdle, muted: true },
  { value: SHOP_SORT.PRICE_ASC, label: SHOP_COPY.sortPriceAsc },
  { value: SHOP_SORT.PRICE_DESC, label: SHOP_COPY.sortPriceDesc },
] as const

export const SHOP_SORT_COLOR_AXIS_OPTIONS = [
  { value: SHOP_SORT_IDLE, label: SHOP_COPY.sortIdle, muted: true },
  { value: SHOP_SORT.COLOR_ASC, label: SHOP_COPY.sortColorAsc },
  { value: SHOP_SORT.COLOR_DESC, label: SHOP_COPY.sortColorDesc },
] as const

export const SHOP_PRICE_CHECKS = [
  { value: SHOP_PRICE_BAND.ASK, label: SHOP_COPY.askPrice },
  { value: SHOP_PRICE_BAND.UPTO_50, label: SHOP_COPY.priceBand50 },
  { value: SHOP_PRICE_BAND.MID, label: SHOP_COPY.priceBand150 },
  { value: SHOP_PRICE_BAND.FROM_150, label: SHOP_COPY.priceBandMore },
] as const

export const SHOP_STOCK_CHECKS = [
  { value: SHOP_STOCK.IN, label: SHOP_COPY.stockIn },
  { value: SHOP_STOCK.OUT, label: SHOP_COPY.stockOut },
] as const

export const SHOP_CATEGORY_CHECKS = [
  { value: SHOP_CATEGORY.CHAQUETA, label: SHOP_COPY.catChaqueta },
  { value: SHOP_CATEGORY.CAMISA, label: SHOP_COPY.catCamisa },
  { value: SHOP_CATEGORY.GORRA, label: SHOP_COPY.catGorra },
  { value: SHOP_CATEGORY.CALCA, label: SHOP_COPY.catCalca },
  { value: SHOP_CATEGORY.PARCHE, label: SHOP_COPY.catParche },
  { value: SHOP_CATEGORY.DIJE, label: SHOP_COPY.catDije },
  { value: SHOP_CATEGORY.VASO, label: SHOP_COPY.catVaso },
  { value: SHOP_CATEGORY.PLATO, label: SHOP_COPY.catPlato },
  { value: SHOP_CATEGORY.AFICHE, label: SHOP_COPY.catAfiche },
] as const

export const SHOP_CITY_OPTIONS = [
  { id: SHOP_CITY.BOGOTA, label: SHOP_COPY.zoneBogota },
  { id: SHOP_CITY.SOACHA, label: SHOP_COPY.zoneSoacha },
  { id: SHOP_CITY.FUERA, label: SHOP_COPY.zoneFuera, blocked: true },
] as const

export const SHOP_ZONE_ROWS = [
  { zone: SHOP_COPY.zoneBogota, value: SHOP_COPY.zoneYes, ok: true },
  { zone: SHOP_COPY.zoneSoacha, value: SHOP_COPY.zoneYes, ok: true },
  { zone: SHOP_COPY.zoneFuera, value: SHOP_COPY.zoneNo, ok: false },
] as const

export const SHOP_PAY_OPTIONS = [
  { id: SHOP_PAY.WA, icon: 'W', title: SHOP_COPY.payWaTitle, copy: SHOP_COPY.payWaCopy },
  { id: SHOP_PAY.MAIL, icon: '@', title: SHOP_COPY.payMailTitle, copy: SHOP_COPY.payMailCopy },
] as const

export function shopStockCopy(stock: number): string {
  return `${stock} en stock`
}

export function shopResultCopy(count: number): string {
  if (count === 1) return SHOP_COPY.countOne
  return `${count} ${SHOP_COPY.countMany}`
}

export const SHOP_API_MESSAGES = {
  PARSE_FAIL: 'La API devolvió un producto que no se entiende.',
  PARSE_SERVICE_FAIL: 'La API devolvió un lavado que no se entiende.',
} as const
