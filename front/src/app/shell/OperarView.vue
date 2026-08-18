<script setup lang="ts">
import { computed, ref } from 'vue'
import { getAppDependencies, refreshInventory } from '@app/bootstrap.ts'
import type { OperatorBoardOuting, OutingKind } from '@modules/rides/index.ts'
import type { ProductKind } from '@modules/shop/index.ts'
import PaolaAlert from '@ui/PaolaAlert.vue'
import PaolaButton from '@ui/PaolaButton.vue'
import PaolaChoice from '@ui/PaolaChoice.vue'
import PaolaField from '@ui/PaolaField.vue'
import PaolaInput from '@ui/PaolaInput.vue'
import PaolaSelect from '@ui/PaolaSelect.vue'
import PaolaTextarea from '@ui/PaolaTextarea.vue'
import PaolaVoiceBadge from '@ui/PaolaVoiceBadge.vue'

const { rides, club, shop } = getAppDependencies()

const clave = ref('')
const error = ref('')
const notice = ref('')
const board = ref<readonly OperatorBoardOuting[] | null>(null)
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
</script>

<template>
  <article class="paola-page">
    <header>
      <p class="paola-empty__kicker">Paola · operadora</p>
      <h1 class="paola-afiche__title type-display">Operar</h1>
      <p class="paola-afiche__lead">
        Salidas, memorias, cupos, aliados, integrantes y productos. No es el panel gordo.
      </p>
    </header>

    <form class="operar-clave" @submit.prevent="load">
      <PaolaVoiceBadge voice="loigca" />
      <PaolaField label="Clave">
        <PaolaInput v-model="clave" type="password" placeholder="OPERADOR_CLAVE" />
      </PaolaField>
      <PaolaButton type="submit" :disabled="busy">Ver lista de cupos</PaolaButton>
    </form>

    <PaolaAlert v-if="error" tone="bad">{{ error }}</PaolaAlert>
    <PaolaAlert v-if="notice" tone="ok">{{ notice }}</PaolaAlert>

    <section class="operar-publish">
      <h2 class="paola-page__heading type-display">Salida</h2>
      <p class="paola-page__copy paola-page__copy--muted">
        Rodada o actividad. El cobro, si hay, sigue por WhatsApp.
      </p>
      <form class="operar-clave" @submit.prevent="publishOuting">
        <PaolaField label="Título">
          <PaolaInput v-model="outingTitle" placeholder="Nombre de la salida" />
        </PaolaField>
        <PaolaField label="Fecha">
          <PaolaInput v-model="outingDate" type="date" />
        </PaolaField>
        <PaolaField label="Tipo">
          <PaolaSelect v-model="outingKind" :options="kindOptions" />
        </PaolaField>
        <PaolaField label="Punto de encuentro">
          <PaolaInput v-model="outingPoint" placeholder="Dónde se juntan" />
        </PaolaField>
        <PaolaField label="Ruta (texto)">
          <PaolaTextarea v-model="outingRoute" placeholder="Por dónde van, o por definir" />
        </PaolaField>
        <PaolaField label="Cupo máximo">
          <PaolaInput v-model="outingCapacity" type="number" placeholder="12" />
        </PaolaField>
        <PaolaField label="Qué llevar">
          <PaolaTextarea v-model="outingBring" placeholder="Casco, agua…" />
        </PaolaField>
        <PaolaChoice v-model="outingPaid" label="De pago (se cobra por WhatsApp)" />
        <PaolaButton type="submit" :disabled="busy">Publicar salida</PaolaButton>
      </form>
    </section>

    <section class="operar-publish">
      <h2 class="paola-page__heading type-display">Memoria</h2>
      <p class="paola-page__copy paola-page__copy--muted">
        Solo salidas marcadas como realizadas. Km, fotos con enlace, crédito y quién salió.
      </p>
      <form class="operar-clave" @submit.prevent="publishMemory">
        <PaolaField label="Salida realizada">
          <PaolaSelect
            v-model="memorySalidaId"
            :options="realizadaOptions.length ? realizadaOptions : [{ value: '', label: 'Primero marca realizada y recarga lista' }]"
          />
        </PaolaField>
        <PaolaField label="Kilómetros">
          <PaolaInput v-model="memoryKm" type="number" placeholder="42" />
        </PaolaField>
        <PaolaField label="Crédito de fotos">
          <PaolaInput v-model="memoryCredit" placeholder="Quién tomó las fotos" />
        </PaolaField>
        <PaolaField label="Quién salió (con permiso)">
          <PaolaTextarea v-model="memoryParticipants" placeholder="Alias · moto" />
        </PaolaField>
        <PaolaField label="Cierre (Armargura)">
          <PaolaTextarea v-model="memoryClosing" placeholder="Párrafo de cierre" />
        </PaolaField>
        <PaolaField label="Instagram (opcional)">
          <PaolaInput v-model="memoryInstagram" placeholder="https://instagram.com/..." />
        </PaolaField>
        <div v-for="(photo, index) in memoryPhotos" :key="index" class="operar-photo-row">
          <PaolaField :label="`Foto ${index + 1} — enlace`">
            <PaolaInput v-model="photo.src" placeholder="https://..." />
          </PaolaField>
          <PaolaField label="Texto alterno">
            <PaolaInput v-model="photo.alt" placeholder="Qué se ve" />
          </PaolaField>
          <PaolaButton
            v-if="memoryPhotos.length > 1"
            type="button"
            size="sm"
            variant="ghost"
            @click="removePhotoRow(index)"
          >
            Quitar foto
          </PaolaButton>
        </div>
        <PaolaButton type="button" size="sm" variant="ghost" @click="addPhotoRow">Otra foto</PaolaButton>
        <PaolaButton type="submit" :disabled="busy">Publicar memoria</PaolaButton>
      </form>
    </section>

    <section class="operar-publish">
      <h2 class="paola-page__heading type-display">Aliado</h2>
      <p class="paola-page__copy paola-page__copy--muted">
        Quien banca el parche. No es un producto de la tienda.
      </p>
      <form class="operar-clave" @submit.prevent="publishAlliance">
        <PaolaField label="Nombre">
          <PaolaInput v-model="allianceName" placeholder="Nombre del aliado" />
        </PaolaField>
        <PaolaField label="Cómo apoya">
          <PaolaTextarea v-model="allianceSupport" placeholder="Qué hace por el parche" />
        </PaolaField>
        <PaolaField label="Enlace (opcional)">
          <PaolaInput v-model="allianceHref" placeholder="https://" />
        </PaolaField>
        <PaolaButton type="submit" :disabled="busy">Publicar aliado</PaolaButton>
      </form>
    </section>

    <section class="operar-publish">
      <h2 class="paola-page__heading type-display">Integrante</h2>
      <p class="paola-page__copy paola-page__copy--muted">
        Solo quien ya dijo que sí. Foto entra después.
      </p>
      <form class="operar-clave" @submit.prevent="publishMember">
        <PaolaField label="Alias">
          <PaolaInput v-model="memberAlias" placeholder="Cómo sale en público" />
        </PaolaField>
        <PaolaField label="Moto (opcional)">
          <PaolaInput v-model="memberMoto" placeholder="Qué rueda" />
        </PaolaField>
        <PaolaField label="Instagram (opcional)">
          <PaolaInput v-model="memberInstagram" placeholder="https://instagram.com/..." />
        </PaolaField>
        <PaolaButton type="submit" :disabled="busy">Publicar integrante</PaolaButton>
      </form>
    </section>

    <section class="operar-publish">
      <h2 class="paola-page__heading type-display">Producto</h2>
      <p class="paola-page__copy paola-page__copy--muted">
        Marca propia o colaboración. Precio vacío = preguntar. El collab no se mezcla con lo propio.
      </p>
      <form class="operar-clave" @submit.prevent="publishProduct">
        <PaolaField label="Nombre">
          <PaolaInput v-model="productTitle" placeholder="Qué se vende" />
        </PaolaField>
        <PaolaField label="Qué es">
          <PaolaTextarea v-model="productDescription" placeholder="Uso real, no catálogo infinito" />
        </PaolaField>
        <PaolaField label="Estantería">
          <PaolaSelect v-model="productKind" :options="productKindOptions" />
        </PaolaField>
        <PaolaField label="Precio en pesos (vacío = preguntar)">
          <PaolaInput v-model="productPrice" type="number" placeholder="45000" />
        </PaolaField>
        <PaolaField label="Stock (opcional)">
          <PaolaInput v-model="productStock" type="number" placeholder="3" />
        </PaolaField>
        <PaolaField label="Foto (enlace, opcional)">
          <PaolaInput v-model="productPhoto" placeholder="https://..." />
        </PaolaField>
        <PaolaButton type="submit" :disabled="busy">Publicar producto</PaolaButton>
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
        <PaolaButton
          size="sm"
          variant="ghost"
          :disabled="busy || outing.status === 'realizado' || outing.status === 'cerrado'"
          @click="setStatus(outing.id, 'cerrado')"
        >
          Cerrar inscripción
        </PaolaButton>
        <PaolaButton
          size="sm"
          variant="ghost"
          :disabled="busy || outing.status === 'realizado'"
          @click="setStatus(outing.id, 'realizado')"
        >
          Marcar realizada
        </PaolaButton>
      </div>
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

.operar-list {
  margin: 0;
  padding-left: 1.2rem;
  display: grid;
  gap: 6px;
  color: var(--paola-white);
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
