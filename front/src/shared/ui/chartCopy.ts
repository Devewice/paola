export type ChartType = 'bars' | 'hbars' | 'donut' | 'pie' | 'line'

export type ChartSeries = {
  readonly id: string
  readonly label: string
  readonly values: readonly number[]
}

/** Una pantalla del `ChartDeck`: el primer tipo de `types` es el que arranca. */
export type ChartSlide = {
  readonly id: string
  readonly title: string
  readonly kicker?: string
  readonly caption?: string
  readonly labels: readonly string[]
  readonly series: readonly ChartSeries[]
  readonly types: readonly ChartType[]
}

/** Azules de marca primero; luego tonos que siguen leyéndose sobre fondo oscuro. */
export const CHART_PALETTE = [
  '#0088F8',
  '#48B4FC',
  '#A6DCFF',
  '#1F5FA8',
  '#00C2D1',
  '#6F86A6',
  '#D7EEFF',
  '#3B82C4',
  '#7AD3E0',
  '#4A5D78',
] as const

export const CHART_LIMITS = {
  /** Con más etiquetas que esto, el eje solo muestra algunas. */
  AXIS_LABELS_MAX: 12,
  /** Con más pantallas que esto, el deck no pinta puntos y deja el contador. */
  DOTS_MAX: 24,
  SWIPE_PX: 40,
} as const

export const CHART_COPY = {
  types: {
    bars: 'Barras',
    hbars: 'Horizontal',
    donut: 'Dona',
    pie: 'Torta',
    line: 'Línea',
  } satisfies Record<ChartType, string>,
  typePicker: 'Tipo de gráfica',
  prev: 'Gráfica anterior',
  next: 'Gráfica siguiente',
  prevGlyph: '‹',
  nextGlyph: '›',
  goTo: 'Ir a la gráfica',
  of: 'de',
  total: 'Total',
  empty: 'Sin datos todavía.',
} as const
