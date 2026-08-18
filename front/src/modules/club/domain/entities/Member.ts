/** Integrante público. Solo quien autorizó salir. */
export type Member = {
  readonly id: string
  readonly alias: string
  readonly photoSrc?: string
  readonly moto?: string
  readonly instagramHref?: string
}

export type MemberList = {
  readonly items: readonly Member[]
  readonly emptyCopy: string
}
