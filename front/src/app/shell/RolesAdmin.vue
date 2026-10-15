<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { OPERAR_PERMISSIONS, OPERAR_ROLES_COPY, type OperarPermission } from '@app/constants/operar.ts'
import {
  API,
  API_FAIL_FALLBACK,
  JSON_HEADERS,
  OPERADOR_CLAVE_HEADER,
  apiOperarRole,
  apiOperarRoleDelete,
  apiOperarUserRole,
  apiOperarUsers,
} from '@shared/http/constants.ts'
import Alert from '@ui/Alert.vue'
import Button from '@ui/Button.vue'
import Choice from '@ui/Choice.vue'
import Chip from '@ui/Chip.vue'
import Field from '@ui/Field.vue'
import Input from '@ui/Input.vue'
import Select from '@ui/Select.vue'

type Role = {
  readonly id: string
  readonly name: string
  readonly isSystem: boolean
  readonly permissions: readonly OperarPermission[]
  readonly users: number
}

type Account = {
  readonly id: string
  readonly email: string
  readonly alias: string
  readonly roleId: string
}

const props = defineProps<{
  session: string
}>()

const copy = OPERAR_ROLES_COPY
const roles = ref<Role[]>([])
const users = ref<Account[]>([])
const query = ref('')
const error = ref('')
const notice = ref('')
const busy = ref('')
const editing = ref<string | null>(null)
const confirmDelete = ref<string | null>(null)
const form = reactive<{ name: string; permissions: OperarPermission[] }>({ name: '', permissions: [] })
const roleOptions = computed(() => roles.value.map((role) => ({ value: role.id, label: role.name })))
const labelOf = (id: OperarPermission) => OPERAR_PERMISSIONS.find((item) => item.id === id)?.label ?? id

function headers(json = false): Record<string, string> {
  return json ? { ...JSON_HEADERS, [OPERADOR_CLAVE_HEADER]: props.session } : { [OPERADOR_CLAVE_HEADER]: props.session }
}

async function request<T>(url: string, init: RequestInit = {}): Promise<{ ok: true; body: T } | { ok: false; detail: string }> {
  try {
    const response = await fetch(url, init)
    const body = (await response.json().catch(() => ({}))) as T & { detail?: string }
    if (!response.ok) return { ok: false, detail: typeof body.detail === 'string' ? body.detail : copy.saveFail }
    return { ok: true, body }
  } catch {
    return { ok: false, detail: API_FAIL_FALLBACK }
  }
}

async function loadRoles(): Promise<void> {
  const result = await request<{ roles?: Role[] }>(API.OPERAR_ROLES, { headers: headers() })
  if (!result.ok) {
    error.value = result.detail || copy.loadFail
    return
  }
  roles.value = Array.isArray(result.body.roles) ? result.body.roles : []
}

async function loadUsers(): Promise<void> {
  const result = await request<{ users?: Account[] }>(apiOperarUsers(query.value.trim()), { headers: headers() })
  if (!result.ok) {
    error.value = result.detail
    return
  }
  users.value = Array.isArray(result.body.users) ? result.body.users : []
}

function usersLabel(n: number): string {
  return n === 1 ? copy.usersOne : copy.usersMany(n)
}

function permissionsLabel(role: Role): string {
  if (role.id === 'admin') return copy.allPermissions
  if (!role.permissions.length) return copy.noPermissions
  return role.permissions.map(labelOf).join(' · ')
}

function togglePermission(id: OperarPermission, on: boolean): void {
  form.permissions = on ? [...new Set([...form.permissions, id])] : form.permissions.filter((item) => item !== id)
}

function startEdit(role: Role): void {
  editing.value = role.id
  form.name = role.name
  form.permissions = [...role.permissions]
  notice.value = ''
  error.value = ''
}

function resetForm(): void {
  editing.value = null
  form.name = ''
  form.permissions = []
}

async function saveRole(): Promise<void> {
  error.value = ''
  notice.value = ''
  busy.value = 'form'
  const url = editing.value ? apiOperarRole(editing.value) : API.OPERAR_ROLES
  const result = await request(url, {
    method: 'POST',
    headers: headers(true),
    body: JSON.stringify({ name: form.name, permissions: form.permissions }),
  })
  busy.value = ''
  if (!result.ok) {
    error.value = result.detail
    return
  }
  notice.value = editing.value ? copy.saved : copy.created
  resetForm()
  await loadRoles()
}

async function removeRole(role: Role): Promise<void> {
  if (confirmDelete.value !== role.id) {
    confirmDelete.value = role.id
    return
  }
  confirmDelete.value = null
  busy.value = role.id
  const result = await request(apiOperarRoleDelete(role.id), { method: 'POST', headers: headers(true), body: '{}' })
  busy.value = ''
  if (!result.ok) {
    error.value = result.detail
    return
  }
  notice.value = copy.removed
  if (editing.value === role.id) resetForm()
  await Promise.all([loadRoles(), loadUsers()])
}

async function setRole(account: Account, roleId: string): Promise<void> {
  if (roleId === account.roleId) return
  error.value = ''
  notice.value = ''
  busy.value = account.id
  const result = await request(apiOperarUserRole(account.id), {
    method: 'POST',
    headers: headers(true),
    body: JSON.stringify({ roleId }),
  })
  busy.value = ''
  if (!result.ok) {
    error.value = result.detail
    return
  }
  notice.value = copy.userSaved
  await Promise.all([loadRoles(), loadUsers()])
}

onMounted(() => {
  void loadRoles()
  void loadUsers()
})
</script>

<template>
  <div class="admin-stack">
    <Alert v-if="error" tone="bad">{{ error }}</Alert>
    <Alert v-else-if="notice" tone="ok">{{ notice }}</Alert>

    <div class="admin-grid">
      <section class="admin-card">
        <header class="admin-card__head">
          <h3>{{ copy.title }}</h3>
          <p>{{ copy.lead }}</p>
        </header>
        <ul class="admin-list">
          <li v-for="role in roles" :key="role.id" class="admin-list__item">
            <div class="admin-list__main">
              <strong>{{ role.name }}</strong>
              <span class="admin-list__meta">{{ permissionsLabel(role) }}</span>
              <div class="admin-list__chips">
                <Chip>{{ usersLabel(role.users) }}</Chip>
                <Chip v-if="role.isSystem" tone="cerrado">{{ copy.systemTag }}</Chip>
              </div>
            </div>
            <div v-if="!role.isSystem" class="admin-list__actions">
              <Button size="sm" variant="ghost" @click="startEdit(role)">{{ copy.edit }}</Button>
              <Button size="sm" variant="danger" :disabled="busy === role.id" @click="removeRole(role)">
                {{ confirmDelete === role.id ? copy.removeConfirm(role.name) : copy.remove }}
              </Button>
            </div>
          </li>
        </ul>
      </section>

      <form class="admin-card" @submit.prevent="saveRole">
        <header class="admin-card__head">
          <h3>{{ editing ? `${copy.edit} · ${form.name}` : copy.newTitle }}</h3>
        </header>
        <Field :label="copy.nameLabel">
          <Input v-model="form.name" />
        </Field>
        <Field :label="copy.permissionsLabel">
          <div class="roles-admin__perms">
            <div v-for="item in OPERAR_PERMISSIONS" :key="item.id" class="roles-admin__perm">
              <Choice
                :model-value="form.permissions.includes(item.id)"
                :label="item.label"
                @update:model-value="togglePermission(item.id, $event)"
              />
              <span class="admin-list__meta">{{ item.hint }}</span>
            </div>
          </div>
        </Field>
        <div class="row">
          <Button type="submit" :disabled="busy === 'form'">{{ editing ? copy.save : copy.create }}</Button>
          <Button v-if="editing" type="button" variant="ghost" @click="resetForm">{{ copy.cancel }}</Button>
        </div>
      </form>
    </div>

    <section class="admin-card">
      <header class="admin-card__head">
        <h3>{{ copy.usersTitle }}</h3>
        <p>{{ copy.usersLead }}</p>
      </header>
      <form class="roles-admin__search" @submit.prevent="loadUsers">
        <Field :label="copy.searchLabel">
          <Input v-model="query" :placeholder="copy.searchPlaceholder" type="search" />
        </Field>
      </form>
      <p v-if="!users.length" class="admin-empty">{{ copy.usersEmpty }}</p>
      <ul v-else class="admin-list">
        <li v-for="account in users" :key="account.id" class="admin-list__item">
          <div class="admin-list__main">
            <strong>{{ account.alias }}</strong>
            <span class="admin-list__meta">{{ account.email }}</span>
          </div>
          <div class="roles-admin__role">
            <Select
              :model-value="account.roleId"
              :label="copy.roleLabel"
              :options="roleOptions"
              @update:model-value="setRole(account, $event)"
            />
          </div>
        </li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.roles-admin__perms {
  display: grid;
  gap: 12px;
}
.roles-admin__perm {
  display: grid;
  gap: 2px;
}
.roles-admin__perm .admin-list__meta {
  padding-left: 28px;
}
.roles-admin__search {
  max-width: 28rem;
}
.roles-admin__role {
  flex: 0 0 14rem;
  min-width: 12rem;
}
</style>
