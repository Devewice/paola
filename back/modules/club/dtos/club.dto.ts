export interface CreateAllianceDto {
  name: string
  support: string
  href?: string
}

export interface CreateMemberDto {
  alias: string
  moto?: string
  instagramHref?: string
}
