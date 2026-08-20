export const LEGAL_EMAIL = 'contacto@paolabiker.com'
export const LEGAL_DOMAIN = 'paolabiker.com'

export const LEGAL_COPY = {
  kicker: 'Paola Biker · Legal',
  title: 'Privacidad',
  lead: 'Antes de dejarnos un nombre, un WhatsApp o una foto, esto se lee a la vista. No es un bufete.',
  notLegalAdvice:
    'Este aviso es de Paola Biker. No es asesoría jurídica ni sustituye una norma, un abogado o la autoridad.',
  checkboxLabel: 'Leí el aviso de privacidad',
  checkboxLink: 'Leer el aviso',
  privacyRequired: 'Necesitas leer el aviso de privacidad para continuar.',
  shopLink: 'Cómo tratamos tus datos',
  voiceLink: 'Aviso de privacidad y moderación',
  finesDisclaimer:
    'Esto no es asesoría jurídica. Aquí no tramitamos comparendos, no representamos y no “te lo arreglamos”. Si hay consulta o pago, el canal es el oficial.',
  reportsDisclaimer:
    'Esto es un reporte del parche. No sustituye una denuncia ante la Policía ni un proceso penal. Si hay delito o urgencia, ve al canal oficial.',
  moderationShort:
    'Linchamiento, menores identificables, doxxing o venganza personal: no se publica. Moderamos qué se ve.',
  contactLine: `Dudas o borrar un dato: ${LEGAL_EMAIL} · ${LEGAL_DOMAIN}`,
} as const

export type LegalSection = {
  readonly id: string
  readonly title: string
  readonly paragraphs: readonly string[]
}

export const LEGAL_SECTIONS: readonly LegalSection[] = [
  {
    id: 'datos',
    title: 'Qué datos pedimos',
    paragraphs: [
      'Cupo de rodada: nombre, WhatsApp y moto si la dices.',
      'Pedido de lavado: nombre, WhatsApp, talla si aplica y zona (Bogotá, Soacha u “fuera”).',
      'Cuenta: correo, alias y clave. El sitio se mira sin login; la cuenta es para lo que quede a tu nombre.',
      'Constancia comunitaria: qué pasó, dónde, cuándo, y una foto o enlace de evidencia si la subes.',
    ],
  },
  {
    id: 'para-que',
    title: 'Para qué los usamos',
    paragraphs: [
      'Para anotar el cupo, armar el pedido y responderte.',
      'Para que una cuenta recuerde tickets y pedidos a tu nombre, cuando eso aplique.',
      'Para moderar una constancia antes de publicarla. No perfilamos para vender anuncios.',
    ],
  },
  {
    id: 'whatsapp',
    title: 'WhatsApp',
    paragraphs: [
      'El parche caliente y el cobro humano van por WhatsApp. Si nos escribes por ahí, ese chat también lo trata WhatsApp (Meta) con sus propias reglas.',
      'Aquí no guardamos tu historial de WhatsApp. El número que dejas en un cupo o un pedido sí queda, para contactarte por esa vía o por correo.',
    ],
  },
  {
    id: 'fotos',
    title: 'Fotos',
    paragraphs: [
      'Memorias de rodada: las fotos las publicamos en el recuento. No hay un buzón público de galería. Si sales en una y no quieres aparecer, escríbeme.',
      'Constancia comunitaria: la foto es evidencia de un hecho (hueco, calle, abuso), no un retrato para linchar. Sin caras de menores. Sin datos de terceros para venganza. Moderamos qué se ve.',
    ],
  },
  {
    id: 'donde',
    title: 'Dónde viven',
    paragraphs: [
      'El sitio y la API viven juntos en Hostinger. Cupos, pedidos, cuenta y constancias se guardan en MySQL.',
      'Las claves de la base no van en el front ni en este aviso.',
    ],
  },
  {
    id: 'no-hacemos',
    title: 'Qué no hacemos',
    paragraphs: [
      'No vendemos datos. No hay popups de publicidad ni listas para terceros.',
      'No hay GPS en vivo. No hay marketplace de terceros. No tramitamos comparendos.',
    ],
  },
  {
    id: 'denuncias',
    title: 'Denuncias: no sustituyen autoridad',
    paragraphs: [
      'La constancia comunitaria nombra un daño del parche. No es denuncia penal, no es un tribunal y no reemplaza el canal oficial.',
      'Si hay delito, urgencia o un trámite de autoridad, ese trámite no se hace aquí.',
    ],
  },
  {
    id: 'comparendos',
    title: 'Comparendos: no son asesoría jurídica',
    paragraphs: [
      'Lo que hay en Tu voz sobre comparendos es orientación educativa: qué suele significar y por dónde consultar o pagar en el canal oficial.',
      'No radicamos recursos, no representamos y no garantizamos anulación. Esto no es un bufete.',
    ],
  },
  {
    id: 'moderacion',
    title: 'Criterio corto de moderación',
    paragraphs: [
      'No se publica linchamiento, dato de menores, doxxing ni venganza personal.',
      'Podemos publicar, ocultar o rechazar. Eso no convierte el portal en autoridad.',
    ],
  },
  {
    id: 'social',
    title: 'Cuenta, chat y comunidades',
    paragraphs: [
      'La cuenta, el feed y el chat web son otro canal del parche. WhatsApp no se apaga.',
      'En API pública no sale tu WhatsApp ni tu correo. Alias y, si tú lo aceptas, km o moto.',
      'Podemos silenciar un hilo. Los mensajes no se venden. Si quieres borrar la cuenta, escríbenos a contacto@paolabiker.com.',
    ],
  },
]
