<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue'
import type { PollsModule } from '@modules/polls/composition.ts'
import {
  POLLS_ADMIN_COPY,
  POLLS_COPY,
  POLLS_DATE_FORMAT,
  POLLS_LOCALE,
  POLL_AUDIENCE_LABELS,
  POLL_STATUS_LABELS,
} from '@modules/polls/constants/copy.ts'
import type { PollStatus } from '@modules/polls/domain/entities/Poll.ts'
import type { OperatorPoll, PollPatch } from '@modules/polls/domain/ports/PollsPort.ts'
import PollDashboard from '@modules/polls/presentation/PollDashboard.vue'
import PollEditor from '@modules/polls/presentation/PollEditor.vue'
import { appEncuesta } from '@shared/http/constants.ts'
import type { AdminMenuItem } from '@ui/adminCopy.ts'
import AdminDrawer from '@ui/AdminDrawer.vue'
import AdminMenu from '@ui/AdminMenu.vue'
import AdminModal from '@ui/AdminModal.vue'
import AdminPane from '@ui/AdminPane.vue'
import Button from '@ui/Button.vue'
import Chip from '@ui/Chip.vue'
import FilterPills from '@ui/FilterPills.vue'
import { showToast } from '@ui/toast.ts'

const props = defineProps<{
  module: PollsModule
  clave: string
  outings: readonly { value: string; label: string }[]
}>()

const emit = defineEmits<{ published: [] }>()

const copy = POLLS_ADMIN_COPY
const polls = ref<readonly OperatorPoll[]>([])
const loaded = ref(false)
const busy = ref<string | null>(null)
const filter = ref('all')
const editorOpen = ref(false)
const editingId = ref<string | null>(null)
const dashboardId = ref<string | null>(null)
const deletingId = ref<string | null>(null)
const clearingId = ref<string | null>(null)

const filters = [
  { id: 'all', label: copy.filterAll },
  { id: 'open', label: copy.filterOpen },
  { id: 'draft', label: copy.filterDraft },
  { id: 'closed', label: copy.filterClosed },
]

const shown = computed(() => (filter.value === 'all' ? polls.value : polls.value.filter((poll) => poll.status === filter.value)))
const editing = computed(() => polls.value.find((poll) => poll.id === editingId.value))
const dashboardPoll = computed(() => polls.value.find((poll) => poll.id === dashboardId.value))
const deleting = computed(() => polls.value.find((poll) => poll.id === deletingId.value))
const clearing = computed(() => polls.value.find((poll) => poll.id === clearingId.value))

const totals = computed(() => {
  const sum = (pick: (poll: OperatorPoll) => number) => polls.value.reduce((total, poll) => total + pick(poll), 0)
  return [
    { id: 'impressions', label: copy.kpiImpressions, value: sum((poll) => poll.stats.impressions), hint: copy.hintImpressions },
    { id: 'visitors', label: copy.kpiVisitors, value: sum((poll) => poll.stats.visitors), hint: copy.hintVisitors },
    { id: 'responses', label: copy.kpiResponses, value: sum((poll) => poll.results.responses), hint: copy.hintResponses },
  ]
})

const dateFormat = new Intl.DateTimeFormat(POLLS_LOCALE, POLLS_DATE_FORMAT)

function closesLabel(poll: OperatorPoll): string {
  if (!poll.closesAt) return ''
  const date = new Date(poll.closesAt)
  if (Number.isNaN(date.valueOf())) return ''
  return `${poll.status === 'closed' ? POLLS_COPY.closedOn : POLLS_COPY.closesOn} ${dateFormat.format(date)}`
}

function statusTone(status: PollStatus): 'abierto' | 'cerrado' | 'realizado' {
  if (status === 'open') return 'abierto'
  return status === 'closed' ? 'cerrado' : 'realizado'
}

function stats(poll: OperatorPoll) {
  return [
    { id: 'impressions', label: copy.kpiImpressions, value: poll.stats.impressions },
    { id: 'visitors', label: copy.kpiVisitors, value: poll.stats.visitors },
    { id: 'responses', label: copy.kpiResponses, value: poll.results.responses },
  ]
}

function toolsFor(poll: OperatorPoll): AdminMenuItem[] {
  return [
    poll.status === 'open' ? { id: 'close', label: copy.closeCta } : { id: 'open', label: copy.openCta },
    { id: 'feature', label: poll.featured ? copy.unfeatureCta : copy.featureCta },
    { id: 'results', label: poll.showResults ? copy.hidePublicResults : copy.showPublicResults },
    { id: 'view', label: copy.viewOnSite, disabled: poll.status === 'draft' },
    { id: 'clear', label: copy.clearCta, tone: 'danger', disabled: !poll.results.responses },
    { id: 'delete', label: copy.deleteTitle, tone: 'danger' },
  ]
}

async function load() {
  const result = await props.module.listOperator(props.clave)
  loaded.value = true
  if (!result.ok) {
    showToast(result.error.message || copy.loadFail, 'bad')
    return
  }
  polls.value = result.value
}

async function refresh() {
  await load()
  emit('published')
}

function openCreate() {
  editingId.value = null
  editorOpen.value = true
}

function openEdit(poll: OperatorPoll) {
  editingId.value = poll.id
  editorOpen.value = true
}

async function onSaved() {
  editorOpen.value = false
  editingId.value = null
  await refresh()
}

async function patch(poll: OperatorPoll, change: PollPatch) {
  busy.value = poll.id
  const result = await props.module.update(poll.id, change, props.clave)
  busy.value = null
  if (!result.ok) {
    showToast(result.error.message || copy.updateFail, 'bad')
    return
  }
  showToast(copy.updateOk, 'ok')
  await refresh()
}

function onTool(poll: OperatorPoll, id: string) {
  if (id === 'open') void patch(poll, { status: 'open' })
  else if (id === 'close') void patch(poll, { status: 'closed' })
  else if (id === 'feature') void patch(poll, { featured: !poll.featured })
  else if (id === 'results') void patch(poll, { showResults: !poll.showResults })
  else if (id === 'view') window.open(appEncuesta(poll.id), '_blank', 'noopener')
  else if (id === 'clear') clearingId.value = poll.id
  else if (id === 'delete') deletingId.value = poll.id
}

async function confirmDelete() {
  const poll = deleting.value
  if (!poll) return
  busy.value = poll.id
  const result = await props.module.remove(poll.id, props.clave)
  busy.value = null
  deletingId.value = null
  if (!result.ok) {
    showToast(result.error.message || copy.deleteFail, 'bad')
    return
  }
  if (dashboardId.value === poll.id) dashboardId.value = null
  showToast(copy.deleteOk, 'ok')
  await refresh()
}

async function confirmClear() {
  const poll = clearing.value
  if (!poll) return
  busy.value = poll.id
  const result = await props.module.clearResponses(poll.id, props.clave)
  busy.value = null
  clearingId.value = null
  if (!result.ok) {
    showToast(result.error.message || copy.responseDeleteFail, 'bad')
    return
  }
  showToast(copy.clearOk, 'ok')
  await refresh()
}

async function editFromDashboard() {
  const poll = dashboardPoll.value
  dashboardId.value = null
  await nextTick()
  if (poll) openEdit(poll)
}

onMounted(() => void load())
</script>

<template>
  <div class="admin-stack">
    <AdminPane :title="copy.paneTitle" :lead="copy.paneLead" :count="polls.length">
      <template #actions>
        <Button size="sm" variant="ghost" @click="load">{{ copy.refreshCta }}</Button>
        <Button size="sm" @click="openCreate">+ {{ copy.newCta }}</Button>
      </template>

      <dl v-if="polls.length" class="poll-admin__totals" :aria-label="copy.totalsAria">
        <div v-for="item in totals" :key="item.id" class="poll-admin__total" :title="item.hint">
          <dt>{{ item.label }}</dt>
          <dd>{{ item.value }}</dd>
        </div>
      </dl>

      <FilterPills v-if="polls.length" v-model="filter" :pills="filters" />

      <p v-if="loaded && !polls.length" class="admin-empty">{{ copy.listEmpty }}</p>
      <p v-else-if="loaded && !shown.length" class="admin-empty">{{ copy.filterEmpty }}</p>

      <ul v-else class="poll-admin__list">
        <li v-for="poll in shown" :key="poll.id" class="poll-admin__row" :class="{ 'is-busy': busy === poll.id }">
          <div class="poll-admin__main">
            <button type="button" class="poll-admin__title" @click="dashboardId = poll.id">{{ poll.title }}</button>
            <div class="admin-list__chips">
              <Chip :tone="statusTone(poll.status)">{{ POLL_STATUS_LABELS[poll.status] }}</Chip>
              <Chip v-if="poll.featured" tone="zona-ok">{{ copy.featuredChip }}</Chip>
              <Chip v-if="!poll.showResults" tone="lleno">{{ copy.resultsHiddenChip }}</Chip>
            </div>
            <span class="admin-list__meta">
              {{ POLL_AUDIENCE_LABELS[poll.audience] }} · {{ copy.questionsCount(poll.questions.length) }}
              <template v-if="poll.outingTitle"> · {{ POLLS_COPY.linkedRide }} {{ poll.outingTitle }}</template>
              <template v-if="closesLabel(poll)"> · {{ closesLabel(poll) }}</template>
            </span>
          </div>

          <dl class="poll-admin__stats">
            <div v-for="item in stats(poll)" :key="item.id" class="poll-admin__stat">
              <dd>{{ item.value }}</dd>
              <dt>{{ item.label }}</dt>
            </div>
          </dl>

          <div class="poll-admin__actions">
            <Button size="sm" @click="dashboardId = poll.id">{{ copy.dataCta }}</Button>
            <Button size="sm" variant="ghost" @click="openEdit(poll)">{{ copy.editCta }}</Button>
            <AdminMenu :label="copy.toolsLabel" :items="toolsFor(poll)" @select="onTool(poll, $event)" />
          </div>
        </li>
      </ul>
    </AdminPane>

    <AdminDrawer
      v-model="editorOpen"
      wide
      :title="editing ? copy.editTitle : copy.formTitle"
      :lead="editing ? editing.title : copy.formLead"
    >
      <PollEditor
        v-if="editorOpen"
        :module="module"
        :clave="clave"
        :outings="outings"
        :poll="editing"
        @saved="onSaved"
        @cancel="editorOpen = false"
      />
    </AdminDrawer>

    <AdminDrawer
      :model-value="dashboardPoll !== undefined"
      wide
      :title="dashboardPoll?.title ?? ''"
      :lead="copy.dashboardLead"
      @update:model-value="dashboardId = $event ? dashboardId : null"
    >
      <PollDashboard
        v-if="dashboardPoll"
        :module="module"
        :clave="clave"
        :poll="dashboardPoll"
        @changed="refresh"
        @edit="editFromDashboard"
      />
    </AdminDrawer>

    <AdminModal
      :model-value="deleting !== undefined"
      :title="copy.deleteTitle"
      :copy="copy.deleteCopy"
      tone="danger"
      @update:model-value="deletingId = $event ? deletingId : null"
    >
      <p v-if="deleting" class="poll-admin__modal-target">{{ deleting.title }}</p>
      <template #actions>
        <Button variant="ghost" size="sm" @click="deletingId = null">{{ copy.cancelCta }}</Button>
        <Button variant="danger" size="sm" :disabled="busy !== null" @click="confirmDelete">{{ copy.deleteYes }}</Button>
      </template>
    </AdminModal>

    <AdminModal
      :model-value="clearing !== undefined"
      :title="copy.clearTitle"
      :copy="copy.clearCopy(clearing?.results.responses ?? 0)"
      tone="danger"
      @update:model-value="clearingId = $event ? clearingId : null"
    >
      <p v-if="clearing" class="poll-admin__modal-target">{{ clearing.title }}</p>
      <template #actions>
        <Button variant="ghost" size="sm" @click="clearingId = null">{{ copy.cancelCta }}</Button>
        <Button variant="danger" size="sm" :disabled="busy !== null" @click="confirmClear">{{ copy.deleteYes }}</Button>
      </template>
    </AdminModal>
  </div>
</template>
