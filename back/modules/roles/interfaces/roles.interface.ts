import type { Permission } from '../../../http/constants.js'

export type Access = {
  readonly userId: string
  readonly email: string
  readonly alias: string
  readonly roleId: string
  readonly roleName: string
  readonly permissions: readonly Permission[]
}

export type RoleRecord = {
  readonly id: string
  readonly name: string
  readonly isSystem: boolean
  readonly permissions: readonly Permission[]
  readonly users: number
}

export type UserRoleRow = {
  readonly id: string
  readonly email: string
  readonly alias: string
  readonly roleId: string
}
