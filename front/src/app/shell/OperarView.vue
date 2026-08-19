<script setup lang="ts">
import { computed, ref } from 'vue'
import { getAppDependencies, refreshInventory } from '@app/bootstrap.ts'
import type { OperatorBoardOuting, OutingKind } from '@modules/rides/index.ts'
import type { ProductKind, ServiceOrder } from '@modules/shop/index.ts'
import { API, APP_PATHS, OPERADOR_CLAVE_HEADER, apiOperarCommunityModerators, apiOperarOutingChatPin, apiOperarPostHighlight, apiOperarReportStatus } from '@shared/http/constants.ts'
import { OPERAR_REPORTS_COPY } from '@app/constants/cuenta.ts'
import { ADMIN_COPY } from '@app/constants/kit.ts'
import { SOCIAL_COPY } from '@app/constants/social.ts'
import { parsePublicPost, type PublicPost } from '@app/parsePublicPost.ts'
import Alert from '@ui/Alert.vue'
import Button from '@ui/Button.vue'
import Choice from '@ui/Choice.vue'
import Field from '@ui/Field.vue'
import Input from '@ui/Input.vue'
import Select from '@ui/Select.vue'
import Textarea from '@ui/Textarea.vue'
import VoiceBadge from '@ui/VoiceBadge.vue'

const { rides, club, shop } = getAppDependencies()

type OperatorReport = {
  id: string
  title: string
  whatHappened: string
  moderationStatus: string
}

const clave = ref('')
const error = ref('')
const notice = ref('')
const board = ref<readonly OperatorBoardOuting[] | null>(null)
const orders = ref<readonly ServiceOrder[] | null>(null)
const reports = ref<readonly OperatorReport[]>([])
const busy = ref(false)

const outingTitle = ref('')
const outingDate = ref('')
const outingKind = ref<OutingKind>('rodada')
const outingPoint = ref('')
const outingRoute = ref('')
const outingCapacity = ref('12')
const outingBring = ref('')
const outingPaid = ref(false)

const memorySalidaId = ref('')
const memoryKm = ref('')
const memoryClosing = ref('')
const memoryCredit = ref('')
const memoryParticipants = ref('')
const memoryInstagram = ref('')
const memoryPhotos = ref([{ src: '', alt: '' }])

const allianceName = ref('')
const allianceSupport = ref('')
const allianceHref = ref('')
const memberAlias = ref('')
const memberMoto = ref('')
const memberInstagram = ref('')

const productTitle = ref('')
const productDescription = ref('')
const productKind = ref<ProductKind>('propia')
const productPrice = ref('')
const productStock = ref('')
const productPhoto = ref('')

const serviceTitle = ref('')
const serviceIncludes = ref('')
const serviceHandover = ref('')
const serviceTurnaround = ref('')
const servicePrice = ref('')
const tipTitle = ref('')
const tipBody = ref('')
const tipOfficialHref = ref('')
const comparendoTitle = ref('')
const comparendoGuide = ref('')
const comparendoOfficialHref = ref('')
const comparendoDisclaimer = ref('Esto orienta; la gestión es en el canal oficial.')
const denunciaNote = ref('')
const communityName = ref('')
const communityDescription = ref('')
const communityRules = ref('')
const communityWhatsapp = ref('')
const pinDrafts = ref<Record<string, string>>({})
const feedPosts = ref<readonly PublicPost[]>([])
const moderatorAlias = ref('')
const moderatorCommunity = ref('')
const moderatorRevoke = ref(false)
const communityOptions = ref<{ value: string; label: string }[]>([])

const kindOptions: { value: string; label: string }[] = [
  { value: 'rodada', label: 'Rodada' },
  { value: 'actividad', label: 'Actividad' },
]

const productKindOptions: { value: string; label: string }[] = [
  { value: 'propia', label: 'Marca propia' },
  { value: 'colaboracion', label: 'Colaboración (estantería aparte)' },
]

const realizadaOptions = computed(() => {
  const remembered = new Set(rides.getMemories().items.map((item) => item.outingId))
  return (board.value ?? [])
    .filter((outing) => outing.status === 'realizado' && !remembered.has(outing.id))
    .map((outing) => ({ value: outing.id, label: `${outing.title} · ${outing.date}` }))
})

async function load(): Promise<void> {
  busy.value = true
  error.value = ''
  notice.value = ''
  const result = await rides.listOperatorBoard(clave.value)
  busy.value = false
  if (!result.ok) {
    board.value = null
    error.value = result.error.message
    return
  }
  board.value = result.value

  const ordersResult = await shop.listOperatorOrders(clave.value)
  if (ordersResult.ok) {
    orders.value = ordersResult.value
  } else {
    orders.value = []
  }

  try {
    const response = await fetch(API.OPERAR_REPORTS, {
      headers: { [OPERADOR_CLAVE_HEADER]: clave.value },
    })
    const body = (await response.json()) as Record<string, unknown>
    reports.value = Array.isArray(body.reports) ? (body.reports as OperatorReport[]) : []
  } catch {
    reports.value = []
  }

  try {
    const response = await fetch(API.FEED)
    const body = (await response.json()) as Record<string, unknown>
    const posts = Array.isArray(body.posts) ? body.posts : []
    feedPosts.value = posts
      .map((row: unknown) => parsePublicPost(row))
      .filter((item: PublicPost | null): item is PublicPost => item !== null)
  } catch {
    feedPosts.value = []
  }

  try {
    const body = (await (await fetch(API.COMMUNITIES)).json()) as Record<string, unknown>
    const list = Array.isArray(body.communities) ? body.communities : []
    if (!moderatorCommunity.value && list[0] && typeof list[0] === 'object') {
      const first = list[0] as Record<string, unknown>
      if (typeof first.id === 'string') moderatorCommunity.value = first.id
    }
    communityOptions.value = list
      .map((row) => {
        if (!row || typeof row !== 'object') return null
        const item = row as Record<string, unknown>
        if (typeof item.id !== 'string' || typeof item.name !== 'string') return null
        return { value: item.id, label: item.name }
      })
      .filter((item): item is { value: string; label: string } => item !== null)
  } catch {
    communityOptions.value = []
  }
}

async function setStatus(id: string, status: 'cerrado' | 'realizado'): Promise<void> {
  busy.value = true
  error.value = ''
  notice.value = ''
  const result = await rides.setOutingStatus(id, status, clave.value)
  busy.value = false
  if (!result.ok) {
    error.value = result.error.message
    return
  }
  await load()
}

async function publishOuting(): Promise<void> {
  busy.value = true
  error.value = ''
  notice.value = ''
  const result = await rides.publishOuting(
    {
      title: outingTitle.value,
      date: outingDate.value,
      kind: outingKind.value === 'actividad' ? 'actividad' : 'rodada',
      meetingPoint: outingPoint.value,
      routeText: outingRoute.value,
      capacity: Number(outingCapacity.value),
      whatToBring: outingBring.value,
      paid: outingPaid.value,
    },
    clave.value,
  )
  busy.value = false
  if (!result.ok) {
    error.value = result.error.message
    return
  }
  outingTitle.value = ''
  outingDate.value = ''
  outingKind.value = 'rodada'
  outingPoint.value = ''
  outingRoute.value = ''
  outingCapacity.value = '12'
  outingBring.value = ''
  outingPaid.value = false
  await refreshInventory()
  notice.value = `${result.value.title} ya está en la base. Inicio y Parchese leen la API al entrar.`
  if (clave.value) await load()
}

function addPhotoRow(): void {
  memoryPhotos.value.push({ src: '', alt: '' })
}

function removePhotoRow(index: number): void {
  if (memoryPhotos.value.length <= 1) {
    memoryPhotos.value[0] = { src: '', alt: '' }
    return
  }
  memoryPhotos.value.splice(index, 1)
}

async function publishMemory(): Promise<void> {
  busy.value = true
  error.value = ''
  notice.value = ''
  const photos = memoryPhotos.value
    .map((row) => ({ src: row.src.trim(), alt: row.alt.trim() }))
    .filter((row) => row.src && row.alt)
  const result = await rides.publishMemory(
    {
      outingId: memorySalidaId.value,
      km: Number(memoryKm.value),
      closingText: memoryClosing.value,
      credit: memoryCredit.value,
      participantsText: memoryParticipants.value,
      instagramHref: memoryInstagram.value.trim() || undefined,
      photos,
    },
    clave.value,
  )
  busy.value = false
  if (!result.ok) {
    error.value = result.error.message
    return
  }
  memorySalidaId.value = ''
  memoryKm.value = ''
  memoryClosing.value = ''
  memoryCredit.value = ''
  memoryParticipants.value = ''
  memoryInstagram.value = ''
  memoryPhotos.value = [{ src: '', alt: '' }]
  await refreshInventory()
  notice.value = `${result.value.title} ya tiene memoria. Inicio y Parchese leen la API al entrar.`
}

async function publishAlliance(): Promise<void> {
  busy.value = true
  error.value = ''
  notice.value = ''
  const result = await club.createAlliance(
    {
      name: allianceName.value,
      support: allianceSupport.value,
      href: allianceHref.value.trim() || undefined,
    },
    clave.value,
  )
  busy.value = false
  if (!result.ok) {
    error.value = result.error.message
    return
  }
  allianceName.value = ''
  allianceSupport.value = ''
  allianceHref.value = ''
  notice.value = `${result.value.name} ya está en la base. Recarga el sitio para verlo en Parchese.`
}

async function publishMember(): Promise<void> {
  busy.value = true
  error.value = ''
  notice.value = ''
  const result = await club.createMember(
    {
      alias: memberAlias.value,
      moto: memberMoto.value.trim() || undefined,
      instagramHref: memberInstagram.value.trim() || undefined,
    },
    clave.value,
  )
  busy.value = false
  if (!result.ok) {
    error.value = result.error.message
    return
  }
  memberAlias.value = ''
  memberMoto.value = ''
  memberInstagram.value = ''
  notice.value = `${result.value.alias} ya está en la base. Recarga el sitio para verlo en Parchese.`
}

async function publishProduct(): Promise<void> {
  busy.value = true
  error.value = ''
  notice.value = ''
  const priceRaw = productPrice.value.trim()
  const stockRaw = productStock.value.trim()
  const result = await shop.publishProduct(
    {
      title: productTitle.value,
      description: productDescription.value,
      kind: productKind.value === 'colaboracion' ? 'colaboracion' : 'propia',
      priceCop: priceRaw === '' ? null : Number(priceRaw),
      stock: stockRaw === '' ? null : Number(stockRaw),
      photoSrc: productPhoto.value.trim() || undefined,
    },
    clave.value,
  )
  busy.value = false
  if (!result.ok) {
    error.value = result.error.message
    return
  }
  productTitle.value = ''
  productDescription.value = ''
  productKind.value = 'propia'
  productPrice.value = ''
  productStock.value = ''
  productPhoto.value = ''
  await refreshInventory()
  notice.value = `${result.value.title} ya está en Tienda, en su estantería.`
}

async function publishService(): Promise<void> {
  busy.value = true
  error.value = ''
  notice.value = ''
  const priceRaw = servicePrice.value.trim()
  const result = await shop.publishService(
    {
      title: serviceTitle.value,
      includesText: serviceIncludes.value,
      handoverText: serviceHandover.value,
      turnaroundText: serviceTurnaround.value,
      priceCop: priceRaw === '' ? null : Number(priceRaw),
    },
    clave.value,
  )
  busy.value = false
  if (!result.ok) {
    error.value = result.error.message
    return
  }
  serviceTitle.value = ''
  serviceIncludes.value = ''
  serviceHandover.value = ''
  serviceTurnaround.value = ''
  servicePrice.value = ''
  await refreshInventory()
  notice.value = `${result.value.title} ya está en Tienda, como lavado — no como gorra.`
}

async function publishTip(): Promise<void> {
  busy.value = true
  error.value = ''
  notice.value = ''
  const response = await fetch('/api/operar/tips', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      clave: clave.value,
      title: tipTitle.value,
      body: tipBody.value,
      officialHref: tipOfficialHref.value.trim() || undefined,
    }),
  })
  busy.value = false
  if (!response.ok) {
    const body = (await response.json()) as Record<string, unknown>
    error.value = typeof body.detail === 'string' ? body.detail : 'No se pudo publicar tip.'
    return
  }
  tipTitle.value = ''
  tipBody.value = ''
  tipOfficialHref.value = ''
  notice.value = 'Tip publicado en Tu voz.'
}

async function publishComparendo(): Promise<void> {
  busy.value = true
  error.value = ''
  notice.value = ''
  const response = await fetch('/api/operar/fines', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      clave: clave.value,
      title: comparendoTitle.value,
      guide: comparendoGuide.value,
      officialHref: comparendoOfficialHref.value,
      disclaimer: comparendoDisclaimer.value,
    }),
  })
  busy.value = false
  if (!response.ok) {
    const body = (await response.json()) as Record<string, unknown>
    error.value = typeof body.detail === 'string' ? body.detail : 'No se pudo publicar comparendo.'
    return
  }
  comparendoTitle.value = ''
  comparendoGuide.value = ''
  comparendoOfficialHref.value = ''
  notice.value = 'Guía de comparendo publicada.'
}

async function moderateDenuncia(id: string, status: 'published' | 'hidden' | 'rejected'): Promise<void> {
  busy.value = true
  error.value = ''
  notice.value = ''
  const response = await fetch(apiOperarReportStatus(id), {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      clave: clave.value,
      status,
      note: denunciaNote.value.trim() || undefined,
    }),
  })
  busy.value = false
  if (!response.ok) {
    const body = (await response.json()) as Record<string, unknown>
    error.value = typeof body.detail === 'string' ? body.detail : OPERAR_REPORTS_COPY.fail
    return
  }
  denunciaNote.value = ''
  notice.value = OPERAR_REPORTS_COPY.ok
  if (clave.value) await load()
}

async function publishCommunity(): Promise<void> {
  busy.value = true
  error.value = ''
  notice.value = ''
  const response = await fetch(API.OPERAR_COMMUNITIES, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      clave: clave.value,
      name: communityName.value,
      description: communityDescription.value,
      rules: communityRules.value,
      whatsappGroupHref: communityWhatsapp.value.trim() || undefined,
    }),
  })
  busy.value = false
  if (!response.ok) {
    const body = (await response.json()) as Record<string, unknown>
    error.value = typeof body.detail === 'string' ? body.detail : 'No se pudo publicar la comunidad.'
    return
  }
  communityName.value = ''
  communityDescription.value = ''
  communityRules.value = ''
  communityWhatsapp.value = ''
  notice.value = 'Comunidad publicada. Vive en web; el enlace de WhatsApp es opcional y paralelo.'
}

function setPinDraft(id: string, value: string): void {
  pinDrafts.value = { ...pinDrafts.value, [id]: value }
}

async function pinOutingNotice(outingId: string): Promise<void> {
  busy.value = true
  error.value = ''
  notice.value = ''
  const response = await fetch(apiOperarOutingChatPin(outingId), {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      clave: clave.value,
      body: pinDrafts.value[outingId] ?? '',
    }),
  })
  busy.value = false
  if (!response.ok) {
    const body = (await response.json()) as Record<string, unknown>
    error.value = typeof body.detail === 'string' ? body.detail : 'No se pudo fijar el aviso.'
    return
  }
  pinDrafts.value = { ...pinDrafts.value, [outingId]: '' }
  notice.value = SOCIAL_COPY.pinOutingOk
}

async function highlightFeedPost(id: string): Promise<void> {
  busy.value = true
  error.value = ''
  notice.value = ''
  const response = await fetch(apiOperarPostHighlight(id), {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ clave: clave.value }),
  })
  busy.value = false
  if (!response.ok) {
    const body = (await response.json()) as Record<string, unknown>
    error.value = typeof body.detail === 'string' ? body.detail : 'No se pudo destacar.'
    return
  }
  notice.value = SOCIAL_COPY.highlightOk
  if (clave.value) await load()
}

async function setModerator(): Promise<void> {
  busy.value = true
  error.value = ''
  notice.value = ''
  if (!moderatorCommunity.value) {
    busy.value = false
    error.value = 'Elige la comunidad.'
    return
  }
  const response = await fetch(apiOperarCommunityModerators(moderatorCommunity.value), {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      clave: clave.value,
      alias: moderatorAlias.value,
      revoke: moderatorRevoke.value,
    }),
  })
  busy.value = false
  if (!response.ok) {
    const body = (await response.json()) as Record<string, unknown>
    error.value = typeof body.detail === 'string' ? body.detail : 'No se pudo actualizar el rol.'
    return
  }
  moderatorAlias.value = ''
  moderatorRevoke.value = false
  notice.value = SOCIAL_COPY.moderatorOk
}
</script>

<template>
  <article class="paola-page">
    <header>
      <p class="paola-empty__kicker">{{ ADMIN_COPY.kicker }}</p>
      <h1 class="paola-afiche__title type-display">{{ ADMIN_COPY.title }}</h1>
      <p class="paola-afiche__lead">{{ ADMIN_COPY.lead }}</p>
      <Button :to="APP_PATHS.ADMIN_UI" variant="ghost" size="sm">{{ ADMIN_COPY.kitCta }}</Button>
    </header>

    <form class="operar-clave" @submit.prevent="load">
      <VoiceBadge voice="loigca" />
      <Field label="Clave">
        <Input v-model="clave" type="password" placeholder="OPERADOR_CLAVE" />
      </Field>
      <Button type="submit" :disabled="busy">Ver lista de cupos</Button>
    </form>

    <Alert v-if="error" tone="bad">{{ error }}</Alert>
    <Alert v-if="notice" tone="ok">{{ notice }}</Alert>

    <section class="operar-publish">
      <h2 class="paola-page__heading type-display">Salida</h2>
      <p class="paola-page__copy paola-page__copy--muted">
        Rodada o actividad. El cobro, si hay, sigue por WhatsApp.
      </p>
      <form class="operar-clave" @submit.prevent="publishOuting">
        <Field label="Título">
          <Input v-model="outingTitle" placeholder="Nombre de la salida" />
        </Field>
        <Field label="Fecha">
          <Input v-model="outingDate" type="date" />
        </Field>
        <Field label="Tipo">
          <Select v-model="outingKind" :options="kindOptions" />
        </Field>
        <Field label="Punto de encuentro">
          <Input v-model="outingPoint" placeholder="Dónde se juntan" />
        </Field>
        <Field label="Ruta (texto)">
          <Textarea v-model="outingRoute" placeholder="Por dónde van, o por definir" />
        </Field>
        <Field label="Cupo máximo">
          <Input v-model="outingCapacity" type="number" placeholder="12" />
        </Field>
        <Field label="Qué llevar">
          <Textarea v-model="outingBring" placeholder="Casco, agua…" />
        </Field>
        <Choice v-model="outingPaid" label="De pago (se cobra por WhatsApp)" />
        <Button type="submit" :disabled="busy">Publicar salida</Button>
      </form>
    </section>

    <section class="operar-publish">
      <h2 class="paola-page__heading type-display">Memoria</h2>
      <p class="paola-page__copy paola-page__copy--muted">
        Solo salidas marcadas como realizadas. Km, fotos con enlace, crédito y quién salió.
      </p>
      <form class="operar-clave" @submit.prevent="publishMemory">
        <Field label="Salida realizada">
          <Select
            v-model="memorySalidaId"
            :options="realizadaOptions.length ? realizadaOptions : [{ value: '', label: 'Primero marca realizada y recarga lista' }]"
          />
        </Field>
        <Field label="Kilómetros">
          <Input v-model="memoryKm" type="number" placeholder="42" />
        </Field>
        <Field label="Crédito de fotos">
          <Input v-model="memoryCredit" placeholder="Quién tomó las fotos" />
        </Field>
        <Field label="Quién salió (con permiso)">
          <Textarea v-model="memoryParticipants" placeholder="Alias · moto" />
        </Field>
        <Field label="Cierre (Armargura)">
          <Textarea v-model="memoryClosing" placeholder="Párrafo de cierre" />
        </Field>
        <Field label="Instagram (opcional)">
          <Input v-model="memoryInstagram" placeholder="https://instagram.com/..." />
        </Field>
        <div v-for="(photo, index) in memoryPhotos" :key="index" class="operar-photo-row">
          <Field :label="`Foto ${index + 1} — enlace`">
            <Input v-model="photo.src" placeholder="https://..." />
          </Field>
          <Field label="Texto alterno">
            <Input v-model="photo.alt" placeholder="Qué se ve" />
          </Field>
          <Button
            v-if="memoryPhotos.length > 1"
            type="button"
            size="sm"
            variant="ghost"
            @click="removePhotoRow(index)"
          >
            Quitar foto
          </Button>
        </div>
        <Button type="button" size="sm" variant="ghost" @click="addPhotoRow">Otra foto</Button>
        <Button type="submit" :disabled="busy">Publicar memoria</Button>
      </form>
    </section>

    <section class="operar-publish">
      <h2 class="paola-page__heading type-display">Aliado</h2>
      <p class="paola-page__copy paola-page__copy--muted">
        Quien banca el parche. No es un producto de la tienda.
      </p>
      <form class="operar-clave" @submit.prevent="publishAlliance">
        <Field label="Nombre">
          <Input v-model="allianceName" placeholder="Nombre del aliado" />
        </Field>
        <Field label="Cómo apoya">
          <Textarea v-model="allianceSupport" placeholder="Qué hace por el parche" />
        </Field>
        <Field label="Enlace (opcional)">
          <Input v-model="allianceHref" placeholder="https://" />
        </Field>
        <Button type="submit" :disabled="busy">Publicar aliado</Button>
      </form>
    </section>

    <section class="operar-publish">
      <h2 class="paola-page__heading type-display">Integrante</h2>
      <p class="paola-page__copy paola-page__copy--muted">
        Solo quien ya dijo que sí. Foto entra después.
      </p>
      <form class="operar-clave" @submit.prevent="publishMember">
        <Field label="Alias">
          <Input v-model="memberAlias" placeholder="Cómo sale en público" />
        </Field>
        <Field label="Moto (opcional)">
          <Input v-model="memberMoto" placeholder="Qué rueda" />
        </Field>
        <Field label="Instagram (opcional)">
          <Input v-model="memberInstagram" placeholder="https://instagram.com/..." />
        </Field>
        <Button type="submit" :disabled="busy">Publicar integrante</Button>
      </form>
    </section>

    <section class="operar-publish">
      <h2 class="paola-page__heading type-display">Lavado de cascos</h2>
      <p class="paola-page__copy paola-page__copy--muted">
        Servicio, no producto. Precio vacío = preguntar. Garantía: si quedó mal, se corrige.
      </p>
      <form class="operar-clave" @submit.prevent="publishService">
        <Field label="Nombre">
          <Input v-model="serviceTitle" placeholder="Cómo se pide" />
        </Field>
        <Field label="Qué incluye">
          <Textarea v-model="serviceIncludes" placeholder="Qué cubre el trabajo" />
        </Field>
        <Field label="Cómo se entrega el casco">
          <Textarea v-model="serviceHandover" placeholder="Dónde y cómo se deja o se recoge" />
        </Field>
        <Field label="Tiempo">
          <Input v-model="serviceTurnaround" placeholder="Cuánto tarda" />
        </Field>
        <Field label="Precio en pesos (vacío = preguntar)">
          <Input v-model="servicePrice" type="number" placeholder="" />
        </Field>
        <Button type="submit" :disabled="busy">Publicar lavado</Button>
      </form>
    </section>

    <section class="operar-orders">
      <h2 class="paola-page__heading type-display">Pedidos por Paola</h2>
      <p class="paola-page__copy paola-page__copy--muted">
        Pedidos registrados desde la ficha de lavado. Paola decide entrega/garantía y responde por WhatsApp.
      </p>
      <ul v-if="orders && orders.length" class="operar-list">
        <li v-for="order in orders" :key="order.id">
          <strong>Pedido #{order.id.slice(0, 8)}</strong>
          · {{ order.itemTitle }}
          · Zona: {{ order.deliveryZone }}
          <span v-if="order.size"> · Talla: {{ order.size }}</span>
          <br />
          <span class="paola-page__copy paola-page__copy--muted">
            {{ order.customerName }} · {{ order.customerWhatsapp }}
          </span>
        </li>
      </ul>
      <p v-else class="paola-page__copy paola-page__copy--muted">Aún no hay pedidos registrados.</p>
    </section>

    <section class="operar-publish">
      <h2 class="paola-page__heading type-display">Tu voz · Tip</h2>
      <form class="operar-clave" @submit.prevent="publishTip">
        <Field label="Título"><Input v-model="tipTitle" /></Field>
        <Field label="Contenido"><Textarea v-model="tipBody" /></Field>
        <Field label="Enlace oficial (opcional)"><Input v-model="tipOfficialHref" /></Field>
        <Button type="submit" :disabled="busy">Publicar tip</Button>
      </form>
    </section>

    <section class="operar-publish">
      <h2 class="paola-page__heading type-display">Tu voz · Comparendo</h2>
      <form class="operar-clave" @submit.prevent="publishComparendo">
        <Field label="Título"><Input v-model="comparendoTitle" /></Field>
        <Field label="Guía"><Textarea v-model="comparendoGuide" /></Field>
        <Field label="Enlace oficial"><Input v-model="comparendoOfficialHref" /></Field>
        <Field label="Disclaimer"><Textarea v-model="comparendoDisclaimer" /></Field>
        <Button type="submit" :disabled="busy">Publicar guía</Button>
      </form>
    </section>

    <section class="operar-publish">
      <h2 class="paola-page__heading type-display">{{ OPERAR_REPORTS_COPY.heading }}</h2>
      <p class="paola-page__copy paola-page__copy--muted">{{ OPERAR_REPORTS_COPY.lead }}</p>
      <Field :label="OPERAR_REPORTS_COPY.note"><Textarea v-model="denunciaNote" /></Field>
      <ul v-if="reports.length" class="operar-list">
        <li v-for="report in reports" :key="report.id" class="operar-report">
          <strong>{{ report.title }}</strong>
          · {{ report.moderationStatus }}
          <p class="paola-page__copy">{{ report.whatHappened }}</p>
          <div class="operar-actions">
            <Button size="sm" type="button" :disabled="busy" @click="moderateDenuncia(report.id, 'published')">
              {{ OPERAR_REPORTS_COPY.publish }}
            </Button>
            <Button size="sm" variant="ghost" type="button" :disabled="busy" @click="moderateDenuncia(report.id, 'hidden')">
              {{ OPERAR_REPORTS_COPY.hide }}
            </Button>
            <Button size="sm" variant="ghost" type="button" :disabled="busy" @click="moderateDenuncia(report.id, 'rejected')">
              {{ OPERAR_REPORTS_COPY.reject }}
            </Button>
          </div>
        </li>
      </ul>
      <p v-else class="paola-page__copy paola-page__copy--muted">{{ OPERAR_REPORTS_COPY.empty }}</p>
    </section>

    <section class="operar-publish">
      <h2 class="paola-page__heading type-display">Comunidad web</h2>
      <p class="paola-page__copy paola-page__copy--muted">
        Paola publica el hogar. El parcero se une. WhatsApp es opcional y no se apaga.
      </p>
      <form class="operar-clave" @submit.prevent="publishCommunity">
        <Field label="Nombre"><Input v-model="communityName" placeholder="Cómo se llama el hogar" /></Field>
        <Field label="Qué es"><Textarea v-model="communityDescription" /></Field>
        <Field label="Reglas"><Textarea v-model="communityRules" /></Field>
        <Field label="Grupo WhatsApp (opcional)"><Input v-model="communityWhatsapp" placeholder="https://chat.whatsapp.com/..." /></Field>
        <Button type="submit" :disabled="busy">Publicar comunidad</Button>
      </form>
    </section>

    <section class="operar-publish">
      <h2 class="paola-page__heading type-display">{{ SOCIAL_COPY.moderator }}</h2>
      <p class="paola-page__copy paola-page__copy--muted">{{ SOCIAL_COPY.moderatorLead }}</p>
      <form class="operar-clave" @submit.prevent="setModerator">
        <Field :label="SOCIAL_COPY.moderatorCommunity">
          <Select
            v-model="moderatorCommunity"
            :options="communityOptions.length ? communityOptions : [{ value: '', label: 'Primero publica una comunidad' }]"
          />
        </Field>
        <Field :label="SOCIAL_COPY.moderatorAlias"><Input v-model="moderatorAlias" /></Field>
        <Choice v-model="moderatorRevoke" :label="SOCIAL_COPY.moderatorRevoke" />
        <Button type="submit" :disabled="busy">{{ SOCIAL_COPY.moderatorName }}</Button>
      </form>
    </section>

    <section class="operar-publish">
      <h2 class="paola-page__heading type-display">{{ SOCIAL_COPY.highlight }}</h2>
      <p class="paola-page__copy paola-page__copy--muted">{{ SOCIAL_COPY.highlightLead }}</p>
      <ul v-if="feedPosts.length" class="operar-list">
        <li v-for="post in feedPosts" :key="post.id" class="operar-report">
          <strong>{{ post.authorAlias }}</strong>
          <span v-if="post.isHighlighted"> · {{ SOCIAL_COPY.activityHighlighted }}</span>
          <p class="paola-page__copy">{{ post.body }}</p>
          <Button size="sm" type="button" :disabled="busy" @click="highlightFeedPost(post.id)">
            {{ SOCIAL_COPY.highlight }}
          </Button>
        </li>
      </ul>
      <p v-else class="paola-page__copy paola-page__copy--muted">Sin posts aún.</p>
    </section>

    <section class="operar-publish">
      <h2 class="paola-page__heading type-display">Producto</h2>
      <p class="paola-page__copy paola-page__copy--muted">
        Marca propia o colaboración. Precio vacío = preguntar. El collab no se mezcla con lo propio.
      </p>
      <form class="operar-clave" @submit.prevent="publishProduct">
        <Field label="Nombre">
          <Input v-model="productTitle" placeholder="Qué se vende" />
        </Field>
        <Field label="Qué es">
          <Textarea v-model="productDescription" placeholder="Uso real, no catálogo infinito" />
        </Field>
        <Field label="Estantería">
          <Select v-model="productKind" :options="productKindOptions" />
        </Field>
        <Field label="Precio en pesos (vacío = preguntar)">
          <Input v-model="productPrice" type="number" placeholder="45000" />
        </Field>
        <Field label="Stock (opcional)">
          <Input v-model="productStock" type="number" placeholder="3" />
        </Field>
        <Field label="Foto (enlace, opcional)">
          <Input v-model="productPhoto" placeholder="https://..." />
        </Field>
        <Button type="submit" :disabled="busy">Publicar producto</Button>
      </form>
    </section>

    <p v-if="board && board.length === 0" class="paola-page__copy paola-page__copy--muted">
      No hay salidas en la base. Cuando Paola publique una, aparecen aquí.
    </p>

    <section v-for="outing in board ?? []" :key="outing.id" class="operar-outing">
      <h2 class="paola-page__heading type-display">{{ outing.title }}</h2>
      <p class="paola-page__copy paola-page__copy--muted">
        {{ outing.date }} · {{ outing.status }} · {{ outing.taken }} / {{ outing.capacity }}
      </p>
      <ul v-if="outing.tickets.length" class="operar-list">
        <li v-for="ticket in outing.tickets" :key="ticket.id">
          <strong>{{ ticket.name }}</strong>
          · {{ ticket.whatsapp }}
          <span v-if="ticket.moto"> · {{ ticket.moto }}</span>
        </li>
      </ul>
      <p v-else class="paola-page__copy paola-page__copy--muted">Nadie anotado aún.</p>
      <div class="operar-actions">
        <Button
          size="sm"
          variant="ghost"
          :disabled="busy || outing.status === 'realizado' || outing.status === 'cerrado'"
          @click="setStatus(outing.id, 'cerrado')"
        >
          Cerrar inscripción
        </Button>
        <Button
          size="sm"
          variant="ghost"
          :disabled="busy || outing.status === 'realizado'"
          @click="setStatus(outing.id, 'realizado')"
        >
          Marcar realizada
        </Button>
      </div>
      <Field :label="SOCIAL_COPY.pinOutingLead">
        <Textarea :model-value="pinDrafts[outing.id] ?? ''" @update:model-value="setPinDraft(outing.id, $event)" />
      </Field>
      <Button size="sm" type="button" :disabled="busy" @click="pinOutingNotice(outing.id)">
        {{ SOCIAL_COPY.pinOuting }}
      </Button>
    </section>
  </article>
</template>

<style scoped>
.operar-photo-row {
  display: grid;
  gap: 12px;
  padding-top: 8px;
  border-top: 1px solid var(--paola-line);
}

.operar-clave,
.operar-outing,
.operar-actions {
  display: grid;
  gap: 12px;
}

.operar-publish,
.operar-outing {
  padding-top: calc(var(--paola-space) * 3);
  border-top: 1px solid var(--paola-line);
}

.operar-orders {
  padding-top: calc(var(--paola-space) * 3);
  border-top: 1px solid var(--paola-line);
  display: grid;
  gap: 12px;
}

.operar-report {
  display: grid;
  gap: 8px;
}

.operar-actions {
  grid-template-columns: 1fr;
}

@media (min-width: 640px) {
  .operar-actions {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
