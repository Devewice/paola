<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { RidesModule } from '@modules/rides/composition.ts'
import { RIDES_ADMIN_COPY, RIDES_KIND, RIDES_STATUS } from '@modules/rides/constants/copy.ts'
import { remainingSpots, type OperatorOutingStatus, type OutingKind } from '@modules/rides/domain/entities/Outing.ts'
import type { OperatorBoardOuting } from '@modules/rides/domain/ports/RidesApiPort.ts'
import Button from '@ui/Button.vue'
import Choice from '@ui/Choice.vue'
import Chip from '@ui/Chip.vue'
import Field from '@ui/Field.vue'
import Input from '@ui/Input.vue'
import Select from '@ui/Select.vue'
import Textarea from '@ui/Textarea.vue'
import { showToast } from '@ui/toast.ts'

const props = defineProps<{
  module: RidesModule
  clave: string
}>()

const emit = defineEmits<{ published: [] }>()

const copy = RIDES_ADMIN_COPY
const today = new Date().toISOString().slice(0, 10)

const board = ref<readonly OperatorBoardOuting[]>([])
const openTickets = ref<string | null>(null)
const busy = ref<string | null>(null)

const emptyOuting = () => ({
  title: '',
  date: '',
  kind: RIDES_KIND.RODADA as OutingKind,
  meetingPoint: '',
  routeText: '',
  whatToBring: '',
  capacity: '20',
  paid: false,
})
const outing = ref(emptyOuting())

const emptyMemory = () => ({
  outingId: '',
  km: '',
  closingText: '',
  credit: '',
  participantsText: '',
  instagramHref: '',
  photos: '',
})
const memory = ref(emptyMemory())

const kindOptions = [
  { value: RIDES_KIND.RODADA, label: copy.kindRodada },
  { value: RIDES_KIND.ACTIVIDAD, label: copy.kindActividad },
]

const sortedBoard = computed(() => [...board.value].sort((a, b) => b.date.localeCompare(a.date)))

const memoryOutingIds = computed(() => new Set(props.module.getMemories().items.map((item) => item.outingId)))

const doneOutingOptions = computed(() =>
  board.value
    .filter((item) => item.status === RIDES_STATUS.REALIZADO && !memoryOutingIds.value.has(item.id))
    .map((item) => ({ value: item.id, label: `${item.date} · ${item.title}` })),
)

function chipTone(status: OperatorBoardOuting['status']) {
  return status
}

function isPastOpen(item: OperatorBoardOuting): boolean {
  return item.date < today && (item.status === RIDES_STATUS.ABIERTO || item.status === RIDES_STATUS.LLENO)
}

async function loadBoard() {
  const result = await props.module.listOperatorBoard(props.clave)
  if (!result.ok) {
    showToast(result.error.message || copy.boardLoadFail, 'bad')
    return
  }
  board.value = result.value
  const firstDone = doneOutingOptions.value[0]
  if (!memory.value.outingId && firstDone) memory.value.outingId = firstDone.value
}

async function setStatus(item: OperatorBoardOuting, status: OperatorOutingStatus) {
  busy.value = item.id
  const result = await props.module.setOutingStatus(item.id, status, props.clave)
  busy.value = null
  if (!result.ok) {
    showToast(result.error.message || copy.statusFail, 'bad')
    return
  }
  showToast(copy.statusOk, 'ok')
  await loadBoard()
  emit('published')
}

async function publishOuting() {
  busy.value = 'outing'
  const draft = outing.value
  const result = await props.module.publishOuting(
    {
      title: draft.title.trim(),
      date: draft.date,
      kind: draft.kind,
      meetingPoint: draft.meetingPoint.trim(),
      routeText: draft.routeText.trim(),
      whatToBring: draft.whatToBring.trim(),
      capacity: Number(draft.capacity),
      paid: draft.paid,
    },
    props.clave,
  )
  busy.value = null
  if (!result.ok) {
    showToast(result.error.message || copy.outingFail, 'bad')
    return
  }
  outing.value = emptyOuting()
  showToast(copy.outingOk, 'ok')
  await loadBoard()
  emit('published')
}

function parsePhotos(raw: string) {
  return raw
    .split('\n')
    .map((line) => line.split('|').map((part) => part.trim()))
    .filter(([src]) => Boolean(src))
    .map(([src, alt]) => ({ src: src ?? '', alt: alt || memory.value.credit.trim() || 'Foto de la rodada' }))
}

async function publishMemory() {
  busy.value = 'memory'
  const draft = memory.value
  const result = await props.module.publishMemory(
    {
      outingId: draft.outingId,
      km: Number(draft.km),
      closingText: draft.closingText.trim(),
      credit: draft.credit.trim(),
      participantsText: draft.participantsText.trim(),
      instagramHref: draft.instagramHref.trim() || undefined,
      photos: parsePhotos(draft.photos),
    },
    props.clave,
  )
  busy.value = null
  if (!result.ok) {
    showToast(result.error.message || copy.memoryFail, 'bad')
    return
  }
  memory.value = emptyMemory()
  showToast(copy.memoryOk, 'ok')
  emit('published')
  await loadBoard()
}

onMounted(() => {
  void loadBoard()
})
</script>

<template>
  <div class="admin-stack">
    <section class="admin-card">
      <header class="admin-card__head">
        <h3>{{ copy.boardTitle }}</h3>
        <p>{{ copy.boardLead }}</p>
      </header>
      <p v-if="!sortedBoard.length" class="admin-empty">{{ copy.boardEmpty }}</p>
      <ul v-else class="admin-list">
        <li v-for="item in sortedBoard" :key="item.id" class="admin-list__item">
          <div class="admin-list__main">
            <strong>{{ item.title }}</strong>
            <span class="admin-list__meta">
              {{ item.date }} · {{ item.meetingPoint }} · {{ remainingSpots(item) }} / {{ item.capacity }} {{ copy.spots }}
            </span>
            <div class="admin-list__chips">
              <Chip :tone="chipTone(item.status)">{{ copy.statusLabels[item.status] }}</Chip>
              <Chip v-if="isPastOpen(item)" tone="lleno">{{ copy.pastOpen }}</Chip>
            </div>
            <button
              type="button"
              class="admin-link"
              @click="openTickets = openTickets === item.id ? null : item.id"
            >
              {{ openTickets === item.id ? copy.hideTickets : copy.showTickets }} ({{ item.tickets.length }})
            </button>
            <ul v-if="openTickets === item.id" class="admin-tickets">
              <li v-if="!item.tickets.length">{{ copy.noTickets }}</li>
              <li v-for="ticket in item.tickets" :key="ticket.id">
                {{ ticket.name }} · {{ ticket.whatsapp }}<template v-if="ticket.moto"> · {{ ticket.moto }}</template>
              </li>
            </ul>
          </div>
          <div class="admin-list__actions">
            <Button
              v-if="item.status === 'abierto' || item.status === 'lleno'"
              size="sm"
              variant="ghost"
              :disabled="busy === item.id"
              @click="setStatus(item, 'cerrado')"
            >
              {{ copy.markClosed }}
            </Button>
            <Button
              v-if="item.status !== 'realizado'"
              size="sm"
              :disabled="busy === item.id"
              @click="setStatus(item, 'realizado')"
            >
              {{ copy.markDone }}
            </Button>
          </div>
        </li>
      </ul>
    </section>

    <div class="admin-grid">
      <form class="admin-card" @submit.prevent="publishOuting">
        <header class="admin-card__head">
          <h3>{{ copy.outingTitle }}</h3>
          <p>{{ copy.outingLead }}</p>
        </header>
        <Field :label="copy.fieldTitle">
          <Input v-model="outing.title" />
        </Field>
        <div class="admin-fields">
          <Field :label="copy.fieldDate">
            <Input v-model="outing.date" type="date" />
          </Field>
          <Select v-model="outing.kind" :label="copy.fieldKind" :options="kindOptions" />
        </div>
        <Field :label="copy.fieldMeeting">
          <Input v-model="outing.meetingPoint" />
        </Field>
        <Field :label="copy.fieldRoute">
          <Textarea v-model="outing.routeText" />
        </Field>
        <Field :label="copy.fieldBring">
          <Input v-model="outing.whatToBring" />
        </Field>
        <Field :label="copy.fieldCapacity">
          <Input v-model="outing.capacity" type="number" />
        </Field>
        <Choice v-model="outing.paid" :label="copy.fieldPaid" />
        <Button type="submit" size="sm" :disabled="busy === 'outing'">{{ copy.outingCta }}</Button>
      </form>

      <form class="admin-card" @submit.prevent="publishMemory">
        <header class="admin-card__head">
          <h3>{{ copy.memoryTitle }}</h3>
          <p>{{ copy.memoryLead }}</p>
        </header>
        <p v-if="!doneOutingOptions.length" class="admin-empty">{{ copy.memoryNoOutings }}</p>
        <template v-else>
          <Select v-model="memory.outingId" :label="copy.fieldOuting" :options="doneOutingOptions" />
          <Field :label="copy.fieldKm">
            <Input v-model="memory.km" type="number" />
          </Field>
          <Field :label="copy.fieldClosing">
            <Textarea v-model="memory.closingText" />
          </Field>
          <div class="admin-fields">
            <Field :label="copy.fieldCredit">
              <Input v-model="memory.credit" />
            </Field>
            <Field :label="copy.fieldInstagram">
              <Input v-model="memory.instagramHref" type="url" placeholder="https://" />
            </Field>
          </div>
          <Field :label="copy.fieldParticipants">
            <Input v-model="memory.participantsText" />
          </Field>
          <Field :label="copy.fieldPhotos">
            <Textarea v-model="memory.photos" :placeholder="copy.photosPlaceholder" />
          </Field>
          <Button type="submit" size="sm" :disabled="busy === 'memory'">{{ copy.memoryCta }}</Button>
        </template>
      </form>
    </div>
  </div>
</template>
