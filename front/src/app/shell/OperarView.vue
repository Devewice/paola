<script setup lang="ts">
import { ref } from 'vue'
import { getAppDependencies } from '@app/bootstrap.ts'
import type { OperatorBoardOuting, OutingKind } from '@modules/rides/index.ts'
import PaolaAlert from '@ui/PaolaAlert.vue'
import PaolaButton from '@ui/PaolaButton.vue'
import PaolaChoice from '@ui/PaolaChoice.vue'
import PaolaField from '@ui/PaolaField.vue'
import PaolaInput from '@ui/PaolaInput.vue'
import PaolaSelect from '@ui/PaolaSelect.vue'
import PaolaTextarea from '@ui/PaolaTextarea.vue'
import PaolaVoiceBadge from '@ui/PaolaVoiceBadge.vue'

const { rides, club } = getAppDependencies()

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

const allianceName = ref('')
const allianceSupport = ref('')
const allianceHref = ref('')
const memberAlias = ref('')
const memberMoto = ref('')
const memberInstagram = ref('')

const kindOptions: { value: string; label: string }[] = [
  { value: 'rodada', label: 'Rodada' },
  { value: 'actividad', label: 'Actividad' },
]

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
  notice.value = `${result.value.title} ya está en la base. Recarga el sitio para verla en Agenda.`
  if (clave.value) await load()
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
</script>

<template>
  <article class="paola-page">
    <header>
      <p class="paola-empty__kicker">Paola · operadora</p>
      <h1 class="paola-afiche__title type-display">Operar</h1>
      <p class="paola-afiche__lead">
        Salidas, cupos, aliados e integrantes. No es el panel gordo.
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
