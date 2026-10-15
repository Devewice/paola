import { fail } from '../../../http/fail.js'
import { ADMIN_ROLE_ID, HTTP_MESSAGES, HTTP_STATUS, PERMISSION_LIST } from '../../../http/constants.js'
import type { Parsed } from '../../../http/types.js'
import { hashPassword } from '../../social/schemas/social.schema.js'
import { ROLES_ENV, ROLES_LIMITS, ROLES_MESSAGES } from '../constants/roles.constants.js'
import type { AccessDto } from '../dtos/roles.dto.js'
import type { Access, RoleRecord, UserRoleRow } from '../interfaces/roles.interface.js'
import {
  aliasTaken,
  deleteRole,
  findAccess,
  findRole,
  findUserById,
  findUserIdByEmail,
  insertAdminUser,
  insertRole,
  listRoles,
  listUsers,
  roleIdTaken,
  roleNameTaken,
  setUserRole,
  updateRole,
} from '../providers/roles.provider.js'
import { aliasFromEmail, parseRoleDraft, roleIdFromName } from '../schemas/roles.schema.js'

function ownerEmail(): string {
  return (process.env[ROLES_ENV.ADMIN_EMAIL] ?? '').trim().toLowerCase()
}

export async function readAccess(sessionId: string): Promise<Parsed<AccessDto>> {
  const access = await findAccess(sessionId)
  if (!access) return fail(HTTP_STATUS.FORBIDDEN, HTTP_MESSAGES.SESSION_REQUIRED)
  return {
    ok: true,
    value: {
      alias: access.alias,
      email: access.email,
      role: { id: access.roleId, name: access.roleName },
      permissions: access.permissions,
    },
  }
}

export async function readRolesBoard(): Promise<{ roles: RoleRecord[]; permissions: readonly string[] }> {
  return { roles: await listRoles(), permissions: PERMISSION_LIST }
}

async function freeRoleId(name: string): Promise<string> {
  const base = roleIdFromName(name)
  let id = base
  for (let n = 2; await roleIdTaken(id); n += 1) {
    id = `${base.slice(0, ROLES_LIMITS.ID_MAX - 4)}-${n}`
  }
  return id
}

export async function createRole(draft: Record<string, unknown>): Promise<Parsed<{ id: string }>> {
  const parsed = parseRoleDraft(draft)
  if (!parsed.ok) return parsed
  if (await roleNameTaken(parsed.value.name)) return fail(HTTP_STATUS.CONFLICT, ROLES_MESSAGES.NAME_TAKEN)
  const id = await freeRoleId(parsed.value.name)
  await insertRole({ id, ...parsed.value })
  return { ok: true, value: { id } }
}

export async function editRole(id: string, draft: Record<string, unknown>): Promise<Parsed<{ id: string }>> {
  const role = await findRole(id)
  if (!role) return fail(HTTP_STATUS.NOT_FOUND, ROLES_MESSAGES.NOT_FOUND)
  if (role.isSystem) return fail(HTTP_STATUS.FORBIDDEN, ROLES_MESSAGES.SYSTEM_LOCKED)
  const parsed = parseRoleDraft(draft)
  if (!parsed.ok) return parsed
  if (await roleNameTaken(parsed.value.name, id)) return fail(HTTP_STATUS.CONFLICT, ROLES_MESSAGES.NAME_TAKEN)
  await updateRole({ id, ...parsed.value })
  return { ok: true, value: { id } }
}

export async function removeRole(id: string): Promise<Parsed<{ id: string }>> {
  const role = await findRole(id)
  if (!role) return fail(HTTP_STATUS.NOT_FOUND, ROLES_MESSAGES.NOT_FOUND)
  if (role.isSystem) return fail(HTTP_STATUS.FORBIDDEN, ROLES_MESSAGES.SYSTEM_LOCKED)
  await deleteRole(id)
  return { ok: true, value: { id } }
}

export async function readUsers(query: string): Promise<UserRoleRow[]> {
  return listUsers(query.trim().slice(0, ROLES_LIMITS.QUERY_MAX))
}

export async function changeUserRole(
  actor: Access,
  userId: string,
  roleId: unknown,
): Promise<Parsed<{ id: string }>> {
  if (typeof roleId !== 'string' || !(await findRole(roleId))) {
    return fail(HTTP_STATUS.BAD_REQUEST, ROLES_MESSAGES.NOT_FOUND)
  }
  const user = await findUserById(userId)
  if (!user) return fail(HTTP_STATUS.NOT_FOUND, ROLES_MESSAGES.USER_NOT_FOUND)
  if (user.id === actor.userId) return fail(HTTP_STATUS.FORBIDDEN, ROLES_MESSAGES.SELF_LOCKED)
  if (user.email.toLowerCase() === ownerEmail() && roleId !== ADMIN_ROLE_ID) {
    return fail(HTTP_STATUS.FORBIDDEN, ROLES_MESSAGES.OWNER_LOCKED)
  }
  await setUserRole(user.id, roleId)
  return { ok: true, value: { id: user.id } }
}

async function freeAlias(email: string): Promise<string> {
  const base = aliasFromEmail(email)
  let alias = base
  for (let n = 2; n < ROLES_LIMITS.ALIAS_TRIES && (await aliasTaken(alias)); n += 1) {
    alias = `${base}${n}`
  }
  return alias
}

export async function ensureAdminAccount(): Promise<void> {
  const email = ownerEmail()
  if (!email) return
  try {
    const existing = await findUserIdByEmail(email)
    if (existing) {
      await setUserRole(existing, ADMIN_ROLE_ID)
      console.log(ROLES_MESSAGES.ADMIN_READY(email))
      return
    }
    const password = (process.env[ROLES_ENV.ADMIN_PASSWORD] ?? '').trim()
    if (password.length < ROLES_LIMITS.PASSWORD_MIN) {
      console.warn(ROLES_MESSAGES.ADMIN_SKIPPED)
      return
    }
    await insertAdminUser({ email, alias: await freeAlias(email), passwordHash: hashPassword(password) })
    console.log(ROLES_MESSAGES.ADMIN_READY(email))
  } catch (error) {
    console.warn(ROLES_MESSAGES.ADMIN_FAIL(error instanceof Error ? error.message : String(error)))
  }
}
