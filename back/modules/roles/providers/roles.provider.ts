import { getDb } from '../../../db/knex.js'
import { ADMIN_ROLE_ID, DEFAULT_ROLE_ID, PERMISSION_LIST, type Permission } from '../../../http/constants.js'
import { ROLES_LIMITS, ROLES_TABLES } from '../constants/roles.constants.js'
import type { Access, RoleRecord, UserRoleRow } from '../interfaces/roles.interface.js'
import { isPermission } from '../schemas/roles.schema.js'

const db = () => getDb()

async function permissionsOf(roleId: string): Promise<Permission[]> {
  if (roleId === ADMIN_ROLE_ID) return [...PERMISSION_LIST]
  const rows = await db()(ROLES_TABLES.PERMISSIONS).select('permission').where({ role_id: roleId })
  return rows.map((row) => row.permission).filter(isPermission)
}

export async function findAccess(sessionId: string): Promise<Access | null> {
  if (!sessionId) return null
  const row = await db()(ROLES_TABLES.SESSIONS)
    .join(ROLES_TABLES.USERS, `${ROLES_TABLES.USERS}.id`, `${ROLES_TABLES.SESSIONS}.user_id`)
    .leftJoin(ROLES_TABLES.ROLES, `${ROLES_TABLES.ROLES}.id`, `${ROLES_TABLES.USERS}.role_id`)
    .select(
      `${ROLES_TABLES.USERS}.id as user_id`,
      `${ROLES_TABLES.USERS}.email`,
      `${ROLES_TABLES.USERS}.alias`,
      `${ROLES_TABLES.USERS}.role_id`,
      `${ROLES_TABLES.ROLES}.name as role_name`,
      `${ROLES_TABLES.SESSIONS}.expires_at`,
    )
    .where(`${ROLES_TABLES.SESSIONS}.id`, sessionId)
    .first()
  if (!row) return null
  const expiresAt = new Date(String(row.expires_at))
  if (Number.isNaN(expiresAt.valueOf()) || expiresAt.getTime() < Date.now()) return null
  const roleId = row.role_name ? String(row.role_id) : DEFAULT_ROLE_ID
  return {
    userId: String(row.user_id),
    email: String(row.email),
    alias: String(row.alias),
    roleId,
    roleName: row.role_name ? String(row.role_name) : '',
    permissions: await permissionsOf(roleId),
  }
}

export async function listRoles(): Promise<RoleRecord[]> {
  const [roles, perms, counts] = await Promise.all([
    db()(ROLES_TABLES.ROLES).select('id', 'name', 'is_system').orderBy('created_at', 'asc'),
    db()(ROLES_TABLES.PERMISSIONS).select('role_id', 'permission'),
    db()(ROLES_TABLES.USERS).select('role_id').count({ total: '*' }).groupBy('role_id'),
  ])
  const byRole = new Map<string, Permission[]>()
  for (const row of perms) {
    if (!isPermission(row.permission)) continue
    const list = byRole.get(String(row.role_id)) ?? []
    list.push(row.permission)
    byRole.set(String(row.role_id), list)
  }
  const usersByRole = new Map(
    (counts as Array<{ role_id: unknown; total?: unknown }>).map((row) => [String(row.role_id), Number(row.total ?? 0)]),
  )
  return roles.map((row) => {
    const id = String(row.id)
    return {
      id,
      name: String(row.name),
      isSystem: Boolean(row.is_system),
      permissions: id === ADMIN_ROLE_ID ? [...PERMISSION_LIST] : (byRole.get(id) ?? []),
      users: usersByRole.get(id) ?? 0,
    }
  })
}

export async function findRole(id: string): Promise<{ id: string; name: string; isSystem: boolean } | null> {
  const row = await db()(ROLES_TABLES.ROLES).select('id', 'name', 'is_system').where({ id }).first()
  if (!row) return null
  return { id: String(row.id), name: String(row.name), isSystem: Boolean(row.is_system) }
}

export async function roleNameTaken(name: string, exceptId = ''): Promise<boolean> {
  const row = await db()(ROLES_TABLES.ROLES).select('id').where({ name }).whereNot({ id: exceptId }).first()
  return Boolean(row)
}

export async function roleIdTaken(id: string): Promise<boolean> {
  return Boolean(await db()(ROLES_TABLES.ROLES).select('id').where({ id }).first())
}

export async function insertRole(role: { id: string; name: string; permissions: readonly Permission[] }): Promise<void> {
  await db().transaction(async (trx) => {
    await trx(ROLES_TABLES.ROLES).insert({ id: role.id, name: role.name, is_system: false })
    if (role.permissions.length) {
      await trx(ROLES_TABLES.PERMISSIONS).insert(
        role.permissions.map((permission) => ({ role_id: role.id, permission })),
      )
    }
  })
}

export async function updateRole(role: { id: string; name: string; permissions: readonly Permission[] }): Promise<void> {
  await db().transaction(async (trx) => {
    await trx(ROLES_TABLES.ROLES).where({ id: role.id }).update({ name: role.name })
    await trx(ROLES_TABLES.PERMISSIONS).where({ role_id: role.id }).delete()
    if (role.permissions.length) {
      await trx(ROLES_TABLES.PERMISSIONS).insert(
        role.permissions.map((permission) => ({ role_id: role.id, permission })),
      )
    }
  })
}

export async function deleteRole(id: string): Promise<void> {
  await db().transaction(async (trx) => {
    await trx(ROLES_TABLES.USERS).where({ role_id: id }).update({ role_id: DEFAULT_ROLE_ID })
    await trx(ROLES_TABLES.PERMISSIONS).where({ role_id: id }).delete()
    await trx(ROLES_TABLES.ROLES).where({ id }).delete()
  })
}

export async function listUsers(query: string): Promise<UserRoleRow[]> {
  const builder = db()(ROLES_TABLES.USERS)
    .select('id', 'email', 'alias', 'role_id')
    .orderBy('created_at', 'desc')
    .limit(ROLES_LIMITS.USERS_PAGE)
  if (query) {
    const like = `%${query.replace(/[%_\\]/g, (char) => `\\${char}`)}%`
    builder.where((where) => where.whereLike('email', like).orWhereLike('alias', like))
  }
  const rows = await builder
  return rows.map((row) => ({
    id: String(row.id),
    email: String(row.email),
    alias: String(row.alias),
    roleId: String(row.role_id ?? DEFAULT_ROLE_ID),
  }))
}

export async function findUserById(id: string): Promise<UserRoleRow | null> {
  const row = await db()(ROLES_TABLES.USERS).select('id', 'email', 'alias', 'role_id').where({ id }).first()
  if (!row) return null
  return { id: String(row.id), email: String(row.email), alias: String(row.alias), roleId: String(row.role_id) }
}

export async function setUserRole(userId: string, roleId: string): Promise<void> {
  await db()(ROLES_TABLES.USERS).where({ id: userId }).update({ role_id: roleId })
}

export async function countAdmins(): Promise<number> {
  const row = await db()(ROLES_TABLES.USERS).where({ role_id: ADMIN_ROLE_ID }).count({ total: '*' }).first()
  return Number((row as { total?: unknown } | undefined)?.total ?? 0)
}
