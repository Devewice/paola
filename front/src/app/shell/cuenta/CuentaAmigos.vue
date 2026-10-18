<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { CUENTA_COPY, CUENTA_NAV_COPY, CUENTA_SECTIONS_COPY } from '@app/constants/cuenta.ts'
import { detailOf, useCuenta } from '@app/shell/cuenta/context.ts'
import { API, apiFriendAccept, apiFriendBlock, appCuentaChat, appParcero } from '@shared/http/constants.ts'
import { MASCOT } from '@shared/ui/mascot.ts'
import Alert from '@ui/Alert.vue'
import Button from '@ui/Button.vue'
import Empty from '@ui/Empty.vue'
import Field from '@ui/Field.vue'
import Input from '@ui/Input.vue'
import './cuenta-card.css'

const copy = CUENTA_COPY
const sections = CUENTA_SECTIONS_COPY
const router = useRouter()
const { pending, outgoing, accepted, sessionHeaders, reloadFriends } = useCuenta()

const friendAlias = ref('')
const error = ref('')
const busy = ref(false)

async function post(url: string, body: Record<string, unknown> = {}): Promise<Response | null> {
  error.value = ''
  busy.value = true
  try {
    const response = await fetch(url, { method: 'POST', headers: sessionHeaders(true), body: JSON.stringify(body) })
    if (!response.ok) {
      error.value = await detailOf(response, copy.failGeneric)
      return null
    }
    return response
  } catch {
    error.value = copy.failGeneric
    return null
  } finally {
    busy.value = false
  }
}

async function requestFriend(): Promise<void> {
  if (!friendAlias.value.trim()) return
  if (!(await post(API.FRIEND_REQUEST, { alias: friendAlias.value.trim() }))) return
  friendAlias.value = ''
  await reloadFriends()
}

async function accept(id: string): Promise<void> {
  if (await post(apiFriendAccept(id))) await reloadFriends()
}

async function block(id: string): Promise<void> {
  if (await post(apiFriendBlock(id))) await reloadFriends()
}

async function startChat(peerUserId: string): Promise<void> {
  const response = await post(API.CHATS, { peerUserId })
  if (!response) return
  const body = (await response.json().catch(() => ({}))) as Record<string, unknown>
  if (typeof body.chatId === 'string') await router.push(appCuentaChat(body.chatId))
}
</script>

<template>
  <section class="cuenta-card" aria-labelledby="cuenta-amigos-title" data-reveal>
    <header class="cuenta-card__head">
      <span class="board-kicker">{{ CUENTA_NAV_COPY.friendsNote }}</span>
      <h2 id="cuenta-amigos-title" class="cuenta-card__title">{{ sections.friendsTitle }}</h2>
      <p class="meta-text">{{ copy.friendsLead }}</p>
    </header>

    <Alert v-if="error" tone="bad">{{ error }}</Alert>

    <form class="cuenta-card__inline" @submit.prevent="requestFriend">
      <Field :label="sections.friendsAdd">
        <Input v-model="friendAlias" :placeholder="copy.aliasPlaceholder" />
      </Field>
      <Button type="submit" size="sm" :disabled="busy || !friendAlias.trim()">{{ copy.request }}</Button>
    </form>

    <div v-if="pending.length" class="cuenta-card__block">
      <h3 class="cuenta-card__subtitle">{{ copy.pending }}</h3>
      <ul class="cuenta-rows">
        <li v-for="row in pending" :key="row.id" class="cuenta-row">
          <strong class="cuenta-row__title">{{ row.alias }}</strong>
          <div class="cuenta-row__actions">
            <Button size="sm" :disabled="busy" @click="accept(row.id)">{{ copy.accept }}</Button>
            <Button size="sm" variant="ghost" :disabled="busy" @click="block(row.id)">{{ copy.block }}</Button>
          </div>
        </li>
      </ul>
    </div>

    <div class="cuenta-card__block">
      <h3 class="cuenta-card__subtitle">{{ sections.friendsMine }}</h3>
      <ul v-if="accepted.length" class="cuenta-rows">
        <li v-for="row in accepted" :key="row.id" class="cuenta-row">
          <RouterLink class="cuenta-row__title cuenta-row__link" :to="appParcero(row.alias)">{{ row.alias }}</RouterLink>
          <div class="cuenta-row__actions">
            <Button size="sm" variant="ghost" :disabled="busy" @click="startChat(row.userId)">{{ copy.chatOpen }}</Button>
          </div>
        </li>
      </ul>
      <Empty
        v-else
        compact
        hide-cta
        :title="copy.friends"
        :copy="copy.friendsEmpty"
        :mascot-src="MASCOT.TUMBADA"
      />
    </div>

    <div v-if="outgoing.length" class="cuenta-card__block">
      <h3 class="cuenta-card__subtitle">{{ copy.outgoing }}</h3>
      <ul class="cuenta-rows">
        <li v-for="row in outgoing" :key="row.id" class="cuenta-row">
          <span>{{ row.alias }}</span>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.cuenta-row__link {
  color: inherit;
  text-decoration: none;
}

.cuenta-row__link:hover {
  color: var(--paola-cyan, #48b4fc);
}
</style>
