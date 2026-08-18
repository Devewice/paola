/** Aliado que banca el parche. No es producto de Tienda. */
export type Alliance = {
  readonly id: string
  readonly name: string
  readonly support: string
  readonly href?: string
}

export type AllianceList = {
  readonly items: readonly Alliance[]
  readonly emptyCopy: string
}
