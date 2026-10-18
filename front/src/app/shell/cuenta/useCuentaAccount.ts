import { computed, ref, type Ref } from 'vue'
import {
  API,
  API_FAIL_FALLBACK,
  JSON_HEADERS,
  SESSION_HEADER,
  apiMeMotorcycleDelete,
  apiMeMotorcyclePrimary,
} from '@shared/http/constants.ts'

export type AccountProfile = {
  id: string
  email: string
  alias: string
  fullName?: string
  whatsapp?: string
  isPublic: boolean
  createdAt?: string
  safety?: AccountSafety
}

export type AccountSafety = {
  emergencyName?: string
  emergencyPhone?: string
  bloodType?: string
  medicalNotes?: string
}

export type UserMotorcycle = {
  id: string
  catalogId?: string
  brand: string
  model: string
  cc?: number
  isPrimary?: boolean
}

export type CatalogMotorcycle = {
  id: string
  brand: string
  model: string
  cc: number
}

export type ProfileDraft = {
  alias: string
  fullName: string
  whatsapp: string
}

export type MotorcycleDraft = { catalogId: string } | { brand: string; model: string; cc: number }

type Outcome = { ok: true } | { ok: false; detail: string }

export function useCuentaAccount(sessionId: Ref<string>) {
  const profile = ref<AccountProfile | null>(null)
  const motorcycles = ref<UserMotorcycle[]>([])
  const catalog = ref<CatalogMotorcycle[]>([])
  const catalogFailed = ref(false)
  const busy = ref(false)

  const headers = computed(() => ({ ...JSON_HEADERS, [SESSION_HEADER]: sessionId.value }))

  function applyView(body: Record<string, unknown>): void {
    if (body.profile && typeof body.profile === 'object') profile.value = body.profile as AccountProfile
    if (Array.isArray(body.motorcycles)) motorcycles.value = body.motorcycles as UserMotorcycle[]
  }

  async function send(url: string, init: RequestInit = {}): Promise<Outcome> {
    busy.value = true
    try {
      const response = await fetch(url, { ...init, headers: headers.value })
      const body = (await response.json().catch(() => ({}))) as Record<string, unknown>
      if (!response.ok) return { ok: false, detail: typeof body.detail === 'string' ? body.detail : API_FAIL_FALLBACK }
      applyView(body)
      return { ok: true }
    } catch {
      return { ok: false, detail: API_FAIL_FALLBACK }
    } finally {
      busy.value = false
    }
  }

  async function load(): Promise<Outcome> {
    return send(API.ME_PROFILE)
  }

  async function loadCatalog(): Promise<void> {
    try {
      const response = await fetch(API.MOTORCYCLE_CATALOG)
      const body = (await response.json().catch(() => ({}))) as Record<string, unknown>
      catalog.value = response.ok && Array.isArray(body.catalog) ? (body.catalog as CatalogMotorcycle[]) : []
      catalogFailed.value = !catalog.value.length
    } catch {
      catalog.value = []
      catalogFailed.value = true
    }
  }

  function saveProfile(draft: ProfileDraft): Promise<Outcome> {
    return send(API.ME_PROFILE, { method: 'POST', body: JSON.stringify(draft) })
  }

  async function saveVisibility(isPublic: boolean): Promise<Outcome> {
    const result = await send(API.ME_VISIBILITY, { method: 'POST', body: JSON.stringify({ isPublic }) })
    if (result.ok && profile.value) profile.value = { ...profile.value, isPublic }
    return result
  }

  function saveSafety(draft: AccountSafety): Promise<Outcome> {
    return send(API.ME_SAFETY, { method: 'POST', body: JSON.stringify(draft) })
  }

  function addMotorcycle(draft: MotorcycleDraft): Promise<Outcome> {
    return send(API.ME_MOTORCYCLES, { method: 'POST', body: JSON.stringify(draft) })
  }

  function removeMotorcycle(id: string): Promise<Outcome> {
    return send(apiMeMotorcycleDelete(id), { method: 'POST', body: '{}' })
  }

  function makePrimary(id: string): Promise<Outcome> {
    return send(apiMeMotorcyclePrimary(id), { method: 'POST', body: '{}' })
  }

  return {
    profile,
    motorcycles,
    catalog,
    catalogFailed,
    busy,
    load,
    loadCatalog,
    saveProfile,
    saveVisibility,
    saveSafety,
    addMotorcycle,
    removeMotorcycle,
    makePrimary,
  }
}

export type CuentaAccount = ReturnType<typeof useCuentaAccount>
