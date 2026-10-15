import { MASCOT } from '@shared/ui/mascot.ts'

export const SHOP_EMPTY_OWN = 'Aún no hay nada a la venta.'

export const SHOP_EMPTY_COLLAB = 'Aún no hay colaboraciones.'

export const SHOP_EMPTY_FICHA =
  'Puede que se haya agotado o que el enlace cambió. Mira lo que hay en la tienda o escríbeme y te cuento.'

export const SHOP_EMPTY_SERVICE = 'Aún no hay lavado de casco.'

export const SHOP_EMPTY_SERVICE_FICHA =
  'Puede que ya no esté publicado o que el enlace cambió. Mira los lavados en la tienda o escríbeme.'

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
  dealMysteryLead: 'Cuando haya oferta, la destapo aquí.',
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
  collabEmptyTitle: 'Sin colaboraciones aún',
  fichaEmptyTitle: 'Este producto ya no está',
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
  serviceFichaEmptyTitle: 'Este lavado ya no está',
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
  emptyCatalogTitle: 'La tienda se está surtiendo',
  emptyCatalogCopy: 'Pronto subo piezas y lavados. Si buscas algo ya, escríbeme y lo cuadramos.',
  emptyFilterTitle: 'Nada con eso',
  emptyFilterCopy: 'Prueba con otro filtro u otra palabra. Si buscas algo puntual, escríbeme y lo cuadramos.',
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
  eventsLead: 'Además de la tienda, salimos a rodar. Mira la próxima fecha y aparta tu cupo.',
  eventsCta: 'Ver rodadas',
  askPrice: 'Precio a preguntar',
  withPhoto: 'Solo con foto',
  priceBand50: 'Hasta $50.000',
  priceBand150: 'De $50.000 a $150.000',
  priceBandMore: 'Más de $150.000',
  featureOwnTitle: 'Marca propia',
  featureCollabTitle: 'Colaboraciones',
  featureWashTitle: 'Lavado de casco',
  featureOwnLead: 'Ropa, calcas y piezas con el escudo del parche.',
  featureCollabLead: 'Lo que hacemos con aliados, en estantería aparte.',
  featureWashLead: 'Te lo dejo limpio. Si quedó mal, se corrige.',
  promiseKicker: 'Así compras',
  promiseTitle: 'Sin vueltas',
  promiseWashTitle: 'Tu casco, en buenas manos',
  promiseDelivery: 'Gratis',
  promiseDeliveryLabel: 'Entrega Bogotá y Soacha',
  promisePay: 'WhatsApp',
  promisePayLabel: 'Pago humano primero',
  promiseWarranty: 'Garantía',
  promiseWarrantyLabel: 'Defectos de fabricación',
  promiseWashFix: 'Se corrige',
  promiseWashFixLabel: 'Si quedó mal',
  shelfCount: 'en la estantería',
  shelfOn: 'Quitar filtro',
  shelfOff: 'Ver solo esto',
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
  checkoutPayMeta: 'WhatsApp, correo o pago en línea.',
  checkoutZoneMeta: 'Bogotá y Soacha gratis.',
  checkoutCloseMeta: 'Garantía y el mensaje.',
  checkoutNext: 'Siguiente',
  checkoutBack: 'Atrás',
  payWaTitle: 'WhatsApp',
  payWaCopy: 'Me escribes y cuadramos precio, talla y entrega.',
  payMailTitle: 'Correo',
  payMailCopy: 'Si prefieres dejarlo por escrito.',
  paySecure: 'Primero hablamos y después pagas. Nada se cobra sin que lo confirmemos juntos.',
  dualWaLead: 'Ahí cuadramos precio, disponibilidad y cuándo te llega.',
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
  text: 'Escríbeme por WhatsApp o correo y cuadramos tu pedido.',
} as const

export const SHOP_PRODUCT_PROMISES = [
  { value: SHOP_COPY.promiseDelivery, label: SHOP_COPY.promiseDeliveryLabel },
  { value: SHOP_COPY.promisePay, label: SHOP_COPY.promisePayLabel },
  { value: SHOP_COPY.promiseWarranty, label: SHOP_COPY.promiseWarrantyLabel },
] as const

export const SHOP_SERVICE_PROMISES = [
  { value: SHOP_COPY.promisePay, label: SHOP_COPY.promisePayLabel },
  { value: SHOP_COPY.promiseWashFix, label: SHOP_COPY.promiseWashFixLabel },
] as const

export const SHOP_FIGURES = {
  PRODUCT_BAND: MASCOT.EN_PIE,
  SERVICE_BAND: MASCOT.LENTE,
} as const

export const SHOP_PREFILTERS = [
  {
    id: SHOP_FILTER.OWN,
    tag: SHOP_COPY.tagOwn,
    label: SHOP_COPY.featureOwnTitle,
    lead: SHOP_COPY.featureOwnLead,
    tone: 'navy',
    mascot: MASCOT.EN_PIE,
  },
  {
    id: SHOP_FILTER.COLLAB,
    tag: SHOP_COPY.tagCollab,
    label: SHOP_COPY.featureCollabTitle,
    lead: SHOP_COPY.featureCollabLead,
    tone: 'blue',
    mascot: MASCOT.X5,
  },
  {
    id: SHOP_FILTER.SERVICE,
    tag: SHOP_COPY.tagWash,
    label: SHOP_COPY.featureWashTitle,
    lead: SHOP_COPY.featureWashLead,
    tone: 'navy',
    mascot: MASCOT.LENTE,
  },
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

export const SHOP_ADMIN_COPY = {
  productTitle: 'Nuevo producto',
  productLead: 'Marca propia o colaboración. Sin precio queda en «Preguntar».',
  fieldTitle: 'Nombre',
  fieldDescription: 'Qué es, en una frase',
  fieldKind: 'Estantería',
  kindOwn: 'Marca propia',
  kindCollab: 'Colaboración',
  fieldCategory: 'Categoría',
  categoryNone: 'Sin categoría',
  fieldPrice: 'Precio (COP, opcional)',
  fieldStock: 'Stock (opcional)',
  fieldPhoto: 'Enlace de la foto (opcional)',
  productCta: 'Publicar producto',
  productOk: 'Producto publicado.',
  productFail: 'No se pudo publicar el producto.',
  serviceTitle: 'Nuevo lavado de casco',
  serviceLead: 'Qué incluye, cómo se entrega y cuánto tarda.',
  fieldServiceTitle: 'Nombre del lavado',
  fieldIncludes: 'Qué incluye',
  fieldHandover: 'Cómo se entrega',
  fieldTurnaround: 'Cuánto tarda',
  serviceCta: 'Publicar lavado',
  serviceOk: 'Lavado publicado.',
  serviceFail: 'No se pudo publicar el lavado.',
  ordersTitle: 'Pedidos',
  ordersLead: 'Lo que llegó desde la web. El cobro y la entrega se cuadran por WhatsApp.',
  ordersEmpty: 'Aún no hay pedidos.',
  ordersLoadFail: 'No se pudieron cargar los pedidos.',
  ordersWrite: 'Escribir',
  orderPaid: 'Pagado',
  orderUnpaid: 'Sin pagar',
  zoneLabels: {
    bogota: 'Bogotá',
    soacha: 'Soacha',
    fuera: 'Fuera de zona',
  },
  statusLabels: {
    pendiente: 'Pendiente',
    cancelado: 'Cancelado',
    entregado: 'Entregado',
  },
} as const

export const SHOP_API_MESSAGES = {
  PARSE_FAIL: 'No pudimos leer el producto. Recarga la página.',
  PARSE_SERVICE_FAIL: 'No pudimos leer el lavado. Recarga la página.',
} as const
