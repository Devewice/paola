export const KIT_LEAD =
  'Catálogo vivo. Las piezas de @ui son las mismas que usa el portal; el markup restante se va migrando de docs/index.html con extract + remap.'

export const KIT_NAV = [
  { id: 'marca', label: 'Marca' },
  { id: 'tipo', label: 'Tipo' },
  { id: 'brocha', label: 'Brocha' },
  { id: 'botones', label: 'Botones' },
  { id: 'iconos', label: 'Iconos' },
  { id: 'voces', label: 'Voces' },
  { id: 'forms', label: 'Formularios' },
  { id: 'feedback', label: 'Avisos' },
  { id: 'producto', label: 'Producto' },
  { id: 'patrones', label: 'Patrones' },
  { id: 'comunidad', label: 'Comunidad' },
  { id: 'vacios', label: 'Vacíos' },
] as const

export const KIT_ICONS = [
  'heart',
  'pin',
  'helmet',
  'bike',
  'camera',
  'spark',
  'star',
  'check',
  'arrow',
  'chat',
  'bolt',
  'fire',
  'smile',
  'scribble',
  'flag',
  'route',
  'glove',
  'wrench',
  'quote',
  'ticket',
  'shield',
  'wave',
  'cross',
  'link',
  'copy',
  'share',
  'eye',
  'vest',
] as const

export const KIT_SWATCHES = [
  { name: 'Black', hex: '#05070C' },
  { name: 'Ink', hex: '#000814' },
  { name: 'Navy', hex: '#001028' },
  { name: 'Blue', hex: '#0088F8' },
  { name: 'Cyan', hex: '#48B4FC' },
  { name: 'White', hex: '#F7FAFC' },
  { name: 'Muted', hex: '#8B9BB0' },
  { name: 'Danger', hex: '#E23B4A' },
] as const

export const ADMIN_COPY = {
  kicker: 'Solo Paola',
  title: 'Admin',
  lead: 'Desde aquí publicas rodadas, memorias, cupos, aliados, integrantes, tienda y moderas denuncias.',
  kitCta: 'Ver todos los componentes',
  claveLabel: 'Clave',
} as const

export const FEED_COPY = {
  title: 'Feed del parche',
  lead: 'Las publicaciones salen de la más nueva a la más vieja. Lo urgente del día a día sigue en WhatsApp. Paola crea las comunidades desde Admin.',
  communitiesEmpty: 'Todavía no hay comunidades en la web. Cuando Paola publique una, aparece aquí.',
  feedEmptyTitle: 'Todavía no hay publicaciones',
  feedEmpty: 'Cuando alguien publique en una comunidad, se ve aquí.',
  joinFail: 'No se pudo unir.',
  followFail: 'No se pudo seguir.',
  joinNeedAccount: 'Entra a tu cuenta para unirte. El sitio se puede mirar igual sin login.',
  followNeedAccount: 'Entra a tu cuenta para seguir. WhatsApp no se apaga.',
  joined: 'Ya estás en esa comunidad en la web. Si hay grupo de WhatsApp, es otro canal.',
  followed: 'Ahora sigues esa comunidad en la web.',
} as const
