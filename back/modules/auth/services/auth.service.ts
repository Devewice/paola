import { HTTP_STATUS } from '../../../http/constants.js'
import type { Fail } from '../../../http/types.js'
import {
  AUTH_CREDENTIAL_KEYS,
  AUTH_MESSAGES,
  AUTH_PROVIDER,
  AUTH_STATUS,
  GOOGLE_AUTH_URL,
  GOOGLE_SCOPES,
} from '../constants/auth.constants.js'
import {
  findAuthProvider,
  mergeCredentials,
  upsertAuthProvider,
  type AuthCredentials,
  type AuthProviderRow,
} from '../providers/auth.provider.js'

export type OperatorAuthConfig = {
  provider: typeof AUTH_PROVIDER.GOOGLE
  enabled: boolean
  status: string
  filled: readonly string[]
  redirectUri: string
}

export type PublicAuthMethods = {
  password: true
  google: boolean
}

function filledKeys(credentials: AuthCredentials): string[] {
  return Object.values(AUTH_CREDENTIAL_KEYS).filter((key) => Boolean(credentials[key]?.trim()))
}

function isComplete(credentials: AuthCredentials): boolean {
  return filledKeys(credentials).length === Object.keys(AUTH_CREDENTIAL_KEYS).length
}

function toOperator(row: AuthProviderRow | undefined): OperatorAuthConfig {
  const credentials = row?.credentials ?? {}
  return {
    provider: AUTH_PROVIDER.GOOGLE,
    enabled: Boolean(row?.enabled && row.status === AUTH_STATUS.LIVE),
    status: row?.status ?? AUTH_STATUS.OFF,
    filled: filledKeys(credentials),
    redirectUri: credentials[AUTH_CREDENTIAL_KEYS.REDIRECT_URI] ?? '',
  }
}

export async function getPublicAuthMethods(): Promise<PublicAuthMethods> {
  const row = await findAuthProvider(AUTH_PROVIDER.GOOGLE)
  return {
    password: true,
    google: Boolean(row?.enabled && row.status === AUTH_STATUS.LIVE && isComplete(row.credentials)),
  }
}

export async function getOperatorAuthConfig(): Promise<OperatorAuthConfig> {
  return toOperator(await findAuthProvider(AUTH_PROVIDER.GOOGLE))
}

export async function saveOperatorAuthConfig(draft: {
  enabled: boolean
  credentials: AuthCredentials
}): Promise<Fail | { ok: true; config: OperatorAuthConfig }> {
  const previous = await findAuthProvider(AUTH_PROVIDER.GOOGLE)
  const credentials = mergeCredentials(previous?.credentials ?? {}, draft.credentials)
  const complete = isComplete(credentials)
  const enabled = complete ? draft.enabled : false
  const status = !complete
    ? AUTH_STATUS.DRAFT
    : enabled
      ? AUTH_STATUS.LIVE
      : AUTH_STATUS.READY
  await upsertAuthProvider({
    provider: AUTH_PROVIDER.GOOGLE,
    enabled,
    status,
    credentials,
  })
  return { ok: true, config: await getOperatorAuthConfig() }
}

export async function buildGoogleStartUrl(
  state = 'portal',
): Promise<Fail | { ok: true; url: string }> {
  const row = await findAuthProvider(AUTH_PROVIDER.GOOGLE)
  if (!row || !row.enabled || row.status !== AUTH_STATUS.LIVE || !isComplete(row.credentials)) {
    return { ok: false, status: HTTP_STATUS.FORBIDDEN, detail: AUTH_MESSAGES.NOT_READY }
  }
  const params = new URLSearchParams({
    client_id: row.credentials[AUTH_CREDENTIAL_KEYS.CLIENT_ID] ?? '',
    redirect_uri: row.credentials[AUTH_CREDENTIAL_KEYS.REDIRECT_URI] ?? '',
    response_type: 'code',
    scope: GOOGLE_SCOPES,
    access_type: 'online',
    prompt: 'select_account',
    state,
  })
  return { ok: true, url: `${GOOGLE_AUTH_URL}?${params.toString()}` }
}
