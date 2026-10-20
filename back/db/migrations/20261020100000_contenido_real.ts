import type { Knex } from 'knex'

/**
 * Contenido real del portal: rodadas hechas con sus memorias, la próxima fecha,
 * el lavado de cascos y los llaveros. Las salidas que había eran de prueba y se retiran.
 */

const IMG = '/contenido'

type Photo = { readonly file: string; readonly alt: string }

type RealOuting = {
  readonly id: string
  readonly title: string
  readonly date: string
  readonly kind: 'rodada' | 'actividad' | 'tintada'
  readonly meetingPoint: string
  readonly routeText: string
  readonly whatToBring: string
  readonly paid: boolean
  readonly status: 'abierto' | 'realizado'
  readonly memory?: {
    readonly km: number
    readonly participants: string
    readonly closing: string
    readonly credit: string
    readonly photos: readonly Photo[]
  }
}

const CAPACITY = 30

const OUTINGS: readonly RealOuting[] = [
  {
    id: 'rodada-cumple-guatavita-2026-06-07',
    title: 'Rodada por mi cumpleaños · Guatavita',
    date: '2026-06-07',
    kind: 'rodada',
    meetingPoint: 'Bomba antes del peaje de Los Patios (salida hacia Guatavita)',
    routeText:
      'Encuentro de 6:00 a 7:00 a. m. y salida en grupo hacia Guatavita. Nezko estuvo tomando fotos en el punto de encuentro.',
    whatToBring: 'Casco, documentos al día y muchas ganas de celebrar.',
    paid: false,
    status: 'realizado',
    memory: {
      km: 110,
      participants:
        'Fue mi rodada de cumpleaños y la primera del parche. Madrugamos a la bomba antes del peaje de Los Patios y subimos juntos hacia Guatavita: no era solo rodar, era celebrar la vida, la libertad y la amistad.',
      closing:
        'Cerramos con picada en la mesa y muchas risas. Gracias a cada uno por madrugar a acompañarme: esta fue la primera de muchas.',
      credit: 'Fotos: Nezko Racing y el parche',
      photos: [
        { file: 'rodadas/guatavita-2026-06-07/parche-en-ruta.jpg', alt: 'El parche en fila con las motos, camino a Guatavita' },
        { file: 'rodadas/guatavita-2026-06-07/picada.jpg', alt: 'Picada para cerrar la rodada' },
        { file: 'rodadas/guatavita-2026-06-07/afiche.jpg', alt: 'Afiche de la rodada por mi cumpleaños, 7 de junio' },
      ],
    },
  },
  {
    id: 'tintada-2026-06-19',
    title: 'Tintada nocturna de junio',
    date: '2026-06-19',
    kind: 'tintada',
    meetingPoint: 'Bogotá · punto anunciado en el grupo de WhatsApp',
    routeText: 'Salida corta de noche para tomarnos un tinto, conocer caras nuevas y parchar sin afán.',
    whatToBring: 'Casco, chaqueta y luces funcionando.',
    paid: false,
    status: 'realizado',
    memory: {
      km: 20,
      participants: 'Una salida de noche por Bogotá para tomarnos un tinto, conocernos y hablar de motos sin afán.',
      closing:
        'Las tintadas son la excusa perfecta para conocernos antes de una rodada larga. Pendiente al grupo para la próxima.',
      credit: 'Foto: el parche',
      photos: [{ file: 'tintadas/2026-06-19/motos-de-noche.jpg', alt: 'Motos del parche parqueadas de noche en Bogotá' }],
    },
  },
  {
    id: 'rodada-anapoima-2026-07-05',
    title: 'Rodada a Anapoima',
    date: '2026-07-05',
    kind: 'rodada',
    meetingPoint: 'Ubicación compartida por el grupo privado',
    routeText:
      'Encuentro entre las 6:00 y las 7:00 a. m., con puntualidad para salir en grupo, y bajada a tierra caliente hasta Anapoima.',
    whatToBring: 'Casco, documentos al día, hidratación y bloqueador.',
    paid: false,
    status: 'realizado',
    memory: {
      km: 180,
      participants:
        'Segunda rodada oficial. Salimos puntuales entre las 6:00 y las 7:00 a. m., con la ubicación compartida por el grupo, y bajamos juntos a Anapoima.',
      closing: 'Terminamos todos en la misma mesa, cansados y felices. Ride, respect, enjoy: así se rueda en este parche.',
      credit: 'Fotos: el parche',
      photos: [
        { file: 'rodadas/anapoima-2026-07-05/parche.jpg', alt: 'El parche reunido después de la rodada a Anapoima' },
        { file: 'rodadas/anapoima-2026-07-05/afiche.jpg', alt: 'Afiche de la rodada a Anapoima, domingo 5 de julio' },
      ],
    },
  },
  {
    id: 'rodada-sasaima-2026-08-30',
    title: 'Pasadía en Sasaima',
    date: '2026-08-30',
    kind: 'rodada',
    meetingPoint: 'Punto anunciado en el grupo de WhatsApp',
    routeText:
      'Encuentro de 5:00 a 6:00 a. m. y salida a Sasaima: pasadía con almuerzo, piscina y buena onda. Valor: $45.000 por persona. Cualquier cilindraje fue bienvenido.',
    whatToBring: 'Casco, documentos al día, vestido de baño y bloqueador.',
    paid: true,
    status: 'realizado',
    memory: {
      km: 140,
      participants:
        'La rodada más grande hasta ahora: unas veinte motos de todos los cilindrajes. Salimos de madrugada y pasamos el día entre almuerzo, piscina y risas.',
      closing:
        'Gracias por confiar en el parche y por rodar con respeto y seguridad. Rodamos juntos y volvemos juntos.',
      credit: 'Fotos: Insta360 X5 y el parche',
      photos: [
        { file: 'rodadas/sasaima-2026-08-30/parche-insta360.jpg', alt: 'Foto grupal del parche con todas las motos en Sasaima' },
        { file: 'rodadas/sasaima-2026-08-30/parche-desde-arriba.jpg', alt: 'El parche visto desde arriba, motos en fila' },
        { file: 'rodadas/sasaima-2026-08-30/listos-para-salir.jpg', alt: 'Moteros listos para arrancar' },
        { file: 'rodadas/sasaima-2026-08-30/fila-de-motos.jpg', alt: 'Fila de motos con la moto de Paola adelante' },
        { file: 'rodadas/sasaima-2026-08-30/parqueadero.jpg', alt: 'Motos parqueadas en el pasadía' },
        { file: 'rodadas/sasaima-2026-08-30/piscina.jpg', alt: 'El parche jugando en la piscina' },
        { file: 'rodadas/sasaima-2026-08-30/mesa-larga.jpg', alt: 'Almuerzo del parche en una mesa larga' },
        { file: 'rodadas/sasaima-2026-08-30/almuerzo.jpg', alt: 'Paola con el parche a la hora del almuerzo' },
        { file: 'rodadas/sasaima-2026-08-30/parche-vertical.jpg', alt: 'El parche y las motos bajo el árbol' },
        { file: 'rodadas/sasaima-2026-08-30/afiche.jpg', alt: 'Afiche del pasadía en Sasaima, 30 de agosto' },
      ],
    },
  },
  {
    id: 'tintada-2026-09-01',
    title: 'Tintada de los llaveros',
    date: '2026-09-01',
    kind: 'tintada',
    meetingPoint: 'Bogotá · punto anunciado en el grupo de WhatsApp',
    routeText: 'Tintada de noche para vernos después de Sasaima y estrenar los llaveros del escudo.',
    whatToBring: 'Casco, chaqueta y luces funcionando.',
    paid: false,
    status: 'realizado',
    memory: {
      km: 20,
      participants: 'Nos vimos de noche, tomamos tinto y cada quien se llevó su llavero del escudo colgado de la moto.',
      closing:
        'Ese llavero ya es parte del parche: si lo ves en una moto por la calle, saluda. Si quieres el tuyo, escríbeme.',
      credit: 'Foto: el parche',
      photos: [
        { file: 'tintadas/2026-09-01/llaveros-del-parche.jpg', alt: 'Manos del parche mostrando los llaveros del escudo sobre una moto' },
      ],
    },
  },
  {
    id: 'rodada-2026-11-29',
    title: 'Rodada del 29 de noviembre',
    date: '2026-11-29',
    kind: 'rodada',
    meetingPoint: 'Por confirmar · lo anuncio en el grupo de WhatsApp',
    routeText:
      'Destino y punto de encuentro por confirmar. Aparta tu cupo y te aviso por el grupo apenas tenga la ruta.',
    whatToBring: 'Casco certificado, SOAT y técnico-mecánica al día, licencia, tanque lleno y buena actitud.',
    paid: false,
    status: 'abierto',
  },
]

const OUTING_IDS = OUTINGS.map((outing) => outing.id)

const SERVICES = [
  {
    id: 'lavado-casco-pro',
    title: 'Lavado de casco · Plan Pro',
    includes_text:
      'Todo lo del Plan Básico, más: limpieza del visor, tratamiento antiempañante, limpieza de mecanismos y ventilaciones, limpieza de la carcasa externa y cera protectora para recuperar el brillo.',
    handover_text: 'Recogemos tu casco a domicilio y te lo devolvemos en tu casa (Bogotá y Soacha).',
    turnaround_text: 'Máximo 24 horas',
    price_cop: 65000,
    photo_src: `${IMG}/tienda/lavado-cascos-planes.jpg`,
    created_at: '2026-10-20 08:00:00',
  },
  {
    id: 'lavado-casco-basico',
    title: 'Lavado de casco · Plan Básico',
    includes_text:
      'Limpieza profunda de textiles internos, desinfección antibacterial, eliminación de malos olores, shampoo de pH neutro seguro para el casco, enjuague y secado controlado.',
    handover_text: 'Recogemos tu casco a domicilio y te lo devolvemos en tu casa (Bogotá y Soacha).',
    turnaround_text: 'Máximo 24 horas',
    price_cop: 50000,
    photo_src: `${IMG}/tienda/lavado-cascos-basico.jpg`,
    created_at: '2026-10-20 08:01:00',
  },
] as const

const SERVICE_IDS = SERVICES.map((service) => service.id)

const PRODUCT = {
  id: 'llavero-escudo-paola',
  title: 'Llavero escudo Paola · Rodando con propósito',
  description:
    'Llavero con el escudo del parche: Paola en la moto, la ciudad y la ruta. Para las llaves de la moto, el maletín o el casco. Pregúntame por disponibilidad.',
  kind: 'propia',
  price_cop: null,
  stock: null,
  photo_src: `${IMG}/tienda/llaveros-escudo.jpg`,
  category: 'dije',
} as const

async function removeOutings(knex: Knex, ids: readonly string[]): Promise<void> {
  if (!ids.length) return
  const memoryIds = (await knex('memories').whereIn('outing_id', ids).select('id')).map((row) => String(row.id))
  if (memoryIds.length) {
    if (await knex.schema.hasTable('memory_comments')) {
      await knex('memory_comments').whereIn('memory_id', memoryIds).delete()
    }
    await knex('memory_photos').whereIn('memory_id', memoryIds).delete()
    await knex('memories').whereIn('id', memoryIds).delete()
  }
  if (await knex.schema.hasTable('polls')) await knex('polls').whereIn('outing_id', ids).update({ outing_id: null })
  await knex('tickets').whereIn('outing_id', ids).delete()
  if (await knex.schema.hasTable('outing_routes')) await knex('outing_routes').whereIn('outing_id', ids).delete()
  if (await knex.schema.hasTable('chats') && (await knex.schema.hasColumn('chats', 'outing_id'))) {
    await knex('chats').whereIn('outing_id', ids).delete()
  }
  await knex('outings').whereIn('id', ids).delete()
}

export async function up(knex: Knex): Promise<void> {
  const stale = (await knex('outings').whereNotIn('id', OUTING_IDS).select('id')).map((row) => String(row.id))
  await removeOutings(knex, stale)

  const hasRoutes = await knex.schema.hasTable('outing_routes')
  for (const outing of OUTINGS) {
    if (await knex('outings').where({ id: outing.id }).first()) continue
    await knex('outings').insert({
      id: outing.id,
      title: outing.title,
      date: outing.date,
      kind: outing.kind,
      meeting_point: outing.meetingPoint,
      route_text: outing.routeText,
      capacity: CAPACITY,
      what_to_bring: outing.whatToBring,
      paid: outing.paid,
      status: outing.status,
    })
    if (hasRoutes) {
      await knex('outing_routes').insert({
        id: `ruta-${outing.id}`,
        outing_id: outing.id,
        preview_text: outing.routeText,
        map_href: null,
      })
    }
    if (!outing.memory) continue
    const memoryId = `memoria-${outing.id}`
    await knex('memories').insert({
      id: memoryId,
      outing_id: outing.id,
      km: outing.memory.km,
      closing_text: outing.memory.closing,
      credit: outing.memory.credit,
      participants_text: outing.memory.participants,
      instagram_href: null,
    })
    await knex('memory_photos').insert(
      outing.memory.photos.map((photo, index) => ({
        id: `${memoryId}-${index + 1}`,
        memory_id: memoryId,
        src: `${IMG}/${photo.file}`,
        alt: photo.alt,
        sort_order: index,
      })),
    )
  }

  const ordered = new Set(
    (await knex('orders').whereNotNull('service_id').select('service_id')).map((row) => String(row.service_id)),
  )
  const staleServices = (await knex('services').whereNotIn('id', SERVICE_IDS).select('id'))
    .map((row) => String(row.id))
    .filter((id) => !ordered.has(id))
  if (staleServices.length) await knex('services').whereIn('id', staleServices).delete()

  for (const service of SERVICES) {
    if (await knex('services').where({ id: service.id }).first()) continue
    await knex('services').insert(service)
  }

  if (!(await knex('products').where({ id: PRODUCT.id }).first())) {
    const hasCategory = await knex.schema.hasColumn('products', 'category')
    const { category, ...base } = PRODUCT
    await knex('products').insert(hasCategory ? { ...base, category } : base)
  }
}

export async function down(knex: Knex): Promise<void> {
  await knex('products').where({ id: PRODUCT.id }).delete()
  await knex('services').whereIn('id', SERVICE_IDS).delete()
  await removeOutings(knex, OUTING_IDS)
}
