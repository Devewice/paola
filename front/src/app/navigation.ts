export const TABS = [
  { to: '/', label: 'Inicio' },
  { to: '/parchese', label: 'Parchese' },
  { to: '/tu-voz', label: 'Tu voz' },
  { to: '/tienda', label: 'Tienda' },
  { to: '/paola', label: 'Paola' },
] as const

export type TabTo = (typeof TABS)[number]['to']
