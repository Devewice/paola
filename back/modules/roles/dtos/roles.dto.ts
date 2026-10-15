import type { Permission } from '../../../http/constants.js'

export type RoleDraftDto = {
  readonly name: string
  readonly permissions: readonly Permission[]
}

export type AccessDto = {
  readonly alias: string
  readonly email: string
  readonly role: { readonly id: string; readonly name: string }
  readonly permissions: readonly Permission[]
}
