<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import type { RidesModule } from '@modules/rides/composition.ts'
import { RIDES_ADMIN_COPY, RIDES_STATUS } from '@modules/rides/constants/copy.ts'
import type { Memory } from '@modules/rides/domain/entities/Memory.ts'
import { remainingSpots } from '@modules/rides/domain/entities/Outing.ts'
import type { OperatorBoardOuting } from '@modules/rides/domain/ports/RidesApiPort.ts'
import MemoryForm from '@modules/rides/presentation/MemoryForm.vue'
import OutingAdminTools from '@modules/rides/presentation/OutingAdminTools.vue'
import OutingForm from '@modules/rides/presentation/OutingForm.vue'
import AdminDrawer from '@ui/AdminDrawer.vue'
import AdminItemTools from '@ui/AdminItemTools.vue'
import AdminPane from '@ui/AdminPane.vue'
import Button from '@ui/Button.vue'
import Chip from '@ui/Chip.vue'
import FilterPills from '@ui/FilterPills.vue'
import { showToast } from '@ui/toast.ts'

const props = defineProps<{
  module: RidesModule
  clave: string
  /** `salida` o `memoria`: abre ese formulario al entrar. */
  create?: string
  stamp?: number
}>()

const emit = defineEmits<{ published: [] }>()

const copy = RIDES_ADMIN_COPY
const today = new Date().toISOString().slice(0, 10)

const tab = ref(props.create === 'memoria' ? 'memorias' : 'salidas')
const tabs = [
  { id: 'salidas', label: copy.tabOutings },
  { id: 'memorias', label: copy.tabMemories },
]

const board = ref<readonly OperatorBoardOuting[]>([])
const openTickets = ref<string | null>(null)
const busy = ref<string | null>(null)
const outingOpen = ref(props.create === 'salida')
const memoryOpen = ref(props.create === 'memoria')

watch(
  () => props.create,
  (value) => {
    if (value === 'salida') {
      tab.value = 'salidas'
      outingOpen.value = true
    }
    if (value === 'memoria') {
      tab.value = 'memorias'
      memoryOpen.value = true
    }
  },
)

const upcoming = computed(() =>
  board.value.filter((item) => item.date >= today && item.status !== RIDES_STATUS.REALIZADO)
    .slice()
    .sort((a, b) => a.date.localeCompare(b.date)),
)
const past = computed(() =>
  board.value.filter((item) => item.date < today || item.status === RIDES_STATUS.REALIZADO)
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date)),
)
const groups = computed(() =>
  [
    { id: 'upcoming', title: copy.upcoming, items: upcoming.value },
    { id: 'past', title: copy.past, items: past.value },
  ].filter((group) => group.items.length),
)

const memories = computed((): readonly Memory[] => {
  void props.stamp
  return props.module.getMemories().items
})
const memoryOutingIds = computed(() => new Set(memories.value.map((item) => item.outingId)))
const doneOutingOptions = computed(() =>
  board.value
    .filter((item) => item.status === RIDES_STATUS.REALIZADO && !memoryOutingIds.value.has(item.id))
    .map((item) => ({ value: item.id, label: `${item.date} · ${item.title}` })),
)

function isPastOpen(item: OperatorBoardOuting): boolean {
  return item.date < today && (item.status === RIDES_STATUS.ABIERTO || item.status === RIDES_STATUS.LLENO)
}

function firmCount(item: OperatorBoardOuting): number {
  return item.tickets.filter((ticket) => ticket.confirmation === 'firme').length
}

async function loadBoard() {
  const result = await props.module.listOperatorBoard(props.clave)
  if (!result.ok) {
    showToast(result.error.message || copy.boardLoadFail, 'bad')
    return
  }
  board.value = result.value
}

async function refresh() {
  await loadBoard()
  emit('published')
}

function onOutingSaved() {
  outingOpen.value = false
  void refresh()
}

function onMemorySaved() {
  memoryOpen.value = false
  void refresh()
}

async function removeMemory(memory: Memory) {
  busy.value = memory.id
  const result = await props.module.removeMemory(memory.id, props.clave)
  busy.value = null
  if (!result.ok) {
    showToast(result.error.message || copy.memoryRemoveFail, 'bad')
    return
  }
  showToast(copy.memoryRemoved, 'ok')
  void refresh()
}

onMounted(() => {
  void loadBoard()
})
</script>

<template>
  <div class="admin-stack">
    <FilterPills v-model="tab" :pills="tabs" />

    <AdminPane
      v-if="tab === 'salidas'"
      :title="copy.boardTitle"
      :lead="copy.boardLead"
      :count="board.length"
    >
      <template #actions>
        <Button size="sm" @click="outingOpen = true">+ {{ copy.newOuting }}</Button>
      </template>
      <p v-if="!board.length" class="admin-empty">{{ copy.boardEmpty }}</p>
      <template v-for="group in groups" :key="group.id">
        <p class="meta" style="margin: 0">{{ group.title }}</p>
        <ul class="admin-list">
          <li v-for="item in group.items" :key="item.id" class="admin-list__item">
            <div class="admin-list__main">
              <strong>{{ item.title }}</strong>
              <span class="admin-list__meta">
                {{ item.date }} · {{ item.meetingPoint }} · {{ remainingSpots(item) }} / {{ item.capacity }}
                {{ copy.spots }}
              </span>
              <div class="admin-list__chips">
                <Chip :tone="item.status">{{ copy.statusLabels[item.status] }}</Chip>
                <Chip v-if="isPastOpen(item)" tone="lleno">{{ copy.pastOpen }}</Chip>
              </div>
              <button
                type="button"
                class="admin-link"
                @click="openTickets = openTickets === item.id ? null : item.id"
              >
                {{ openTickets === item.id ? copy.hideTickets : copy.showTickets }} ({{ item.tickets.length }})
              </button>
              <ul v-if="openTickets === item.id" class="admin-tickets ride-admin-tickets">
                <li v-if="!item.tickets.length">{{ copy.noTickets }}</li>
                <li v-else class="ride-admin-tickets__summary">
                  {{ copy.ticketSummary(firmCount(item), item.tickets.length) }}
                </li>
                <li v-for="ticket in item.tickets" :key="ticket.id" class="ride-admin-ticket">
                  <div class="ride-admin-ticket__head">
                    <strong>{{ ticket.name }}</strong>
                    <Chip :tone="ticket.confirmation === 'firme' ? 'abierto' : 'lleno'">
                      {{ ticket.confirmation === 'firme' ? copy.ticketFirm : copy.ticketPending }}
                    </Chip>
                  </div>
                  <span>
                    {{ ticket.moto || copy.ticketNoMoto }}
                    <template v-if="ticket.level"> · {{ copy.levelLabels[ticket.level] ?? ticket.level }}</template>
                    <template v-if="ticket.whatsapp"> · {{ ticket.whatsapp }}</template>
                  </span>
                  <span v-if="ticket.passengerName">{{ copy.ticketPassenger }}: {{ ticket.passengerName }}</span>
                  <span v-if="ticket.emergencyName">
                    {{ copy.ticketEmergency }}: {{ ticket.emergencyName }} · {{ ticket.emergencyPhone }}
                  </span>
                  <span v-else class="ride-admin-ticket__warn">{{ copy.ticketNoEmergency }}</span>
                  <span v-if="ticket.bloodType || ticket.medicalNotes">
                    <template v-if="ticket.bloodType">{{ copy.ticketBlood }} {{ ticket.bloodType }}</template>
                    <template v-if="ticket.bloodType && ticket.medicalNotes"> · </template>
                    <template v-if="ticket.medicalNotes">{{ copy.ticketMedical }}: {{ ticket.medicalNotes }}</template>
                  </span>
                </li>
              </ul>
            </div>
            <div class="admin-list__actions">
              <OutingAdminTools :module="module" :clave="clave" :outing="item" @changed="refresh" />
            </div>
          </li>
        </ul>
      </template>
    </AdminPane>

    <AdminPane v-else :title="copy.tabMemories" :lead="copy.memoriesLead" :count="memories.length">
      <template #actions>
        <Button size="sm" @click="memoryOpen = true">+ {{ copy.newMemory }}</Button>
      </template>
      <p v-if="!memories.length" class="admin-empty">{{ copy.memoriesEmpty }}</p>
      <ul v-else class="admin-list">
        <li v-for="memory in memories" :key="memory.id" class="admin-list__item admin-list__item--compact">
          <img v-if="memory.photos[0]" class="admin-list__thumb" :src="memory.photos[0].src" :alt="memory.photos[0].alt" />
          <div class="admin-list__main">
            <strong>{{ memory.title }}</strong>
            <span class="admin-list__meta">
              {{ memory.date }} · {{ copy.memoryKm(memory.km) }} · {{ copy.memoryPhotos(memory.photos.length) }}
            </span>
          </div>
          <AdminItemTools
            :editable="false"
            :remove-label="copy.remove"
            :confirm-label="copy.removeConfirm"
            :busy="busy === memory.id"
            @remove="removeMemory(memory)"
          />
        </li>
      </ul>
    </AdminPane>

    <AdminDrawer v-model="outingOpen" :title="copy.outingTitle" :lead="copy.outingLead">
      <OutingForm :module="module" :clave="clave" @saved="onOutingSaved" @cancel="outingOpen = false" />
    </AdminDrawer>
    <AdminDrawer v-model="memoryOpen" :title="copy.memoryTitle" :lead="copy.memoryLead">
      <MemoryForm
        :module="module"
        :clave="clave"
        :outings="doneOutingOptions"
        @saved="onMemorySaved"
        @cancel="memoryOpen = false"
      />
    </AdminDrawer>
  </div>
</template>

<style scoped>
.ride-admin-tickets {
  gap: 8px;
  padding-left: 0;
  list-style: none;
}

.ride-admin-tickets__summary {
  color: var(--paola-cyan, #48b4fc);
}

.ride-admin-ticket {
  display: grid;
  gap: 2px;
  padding: 8px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.ride-admin-ticket__head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  color: #fff;
}

.ride-admin-ticket__warn {
  color: #f6b26b;
}
</style>
