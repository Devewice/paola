<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import type { VoiceModule } from '@modules/voice/composition.ts'
import { VOICE_ADMIN_COPY } from '@modules/voice/constants/copy.ts'
import type { ReportStatus, VoiceReport } from '@modules/voice/domain/entities/Report.ts'
import FineForm from '@modules/voice/presentation/FineForm.vue'
import TipForm from '@modules/voice/presentation/TipForm.vue'
import VoiceItemTools from '@modules/voice/presentation/VoiceItemTools.vue'
import AdminDrawer from '@ui/AdminDrawer.vue'
import AdminPane from '@ui/AdminPane.vue'
import Button from '@ui/Button.vue'
import Chip from '@ui/Chip.vue'
import FilterPills from '@ui/FilterPills.vue'
import { showToast } from '@ui/toast.ts'

const props = defineProps<{
  module: VoiceModule
  clave: string
  /** `tip` o `comparendo`: abre ese formulario al entrar. */
  create?: string
  stamp?: number
}>()

const emit = defineEmits<{ published: [] }>()

const copy = VOICE_ADMIN_COPY

function tabFor(create?: string): string {
  if (create === 'tip') return 'tips'
  if (create === 'comparendo') return 'comparendos'
  return 'reportes'
}

const tab = ref(tabFor(props.create))
const tipOpen = ref(props.create === 'tip')
const fineOpen = ref(props.create === 'comparendo')

watch(
  () => props.create,
  (value) => {
    if (!value) return
    tab.value = tabFor(value)
    tipOpen.value = value === 'tip'
    fineOpen.value = value === 'comparendo'
  },
)

const reports = ref<readonly VoiceReport[]>([])
const busy = ref<string | null>(null)

const tips = computed(() => {
  void props.stamp
  return props.module.getTips().items
})
const fines = computed(() => {
  void props.stamp
  return props.module.getFines().items
})
const pending = computed(() => reports.value.filter((item) => item.moderationStatus === 'in_review').length)
const sortedReports = computed(() =>
  [...reports.value].sort(
    (a, b) => Number(b.moderationStatus === 'in_review') - Number(a.moderationStatus === 'in_review'),
  ),
)

const tabs = computed(() => [
  { id: 'reportes', label: pending.value ? `${copy.tabReports} · ${pending.value}` : copy.tabReports },
  { id: 'tips', label: `${copy.tabTips} · ${tips.value.length}` },
  { id: 'comparendos', label: `${copy.tabFines} · ${fines.value.length}` },
])

function statusTone(status: ReportStatus): 'abierto' | 'lleno' | 'cerrado' {
  if (status === 'published') return 'abierto'
  if (status === 'in_review') return 'lleno'
  return 'cerrado'
}

async function loadReports() {
  const result = await props.module.listOperatorReports(props.clave)
  if (!result.ok) {
    showToast(result.error.message || copy.reportsLoadFail, 'bad')
    return
  }
  reports.value = result.value
}

async function moderate(report: VoiceReport, status: ReportStatus) {
  busy.value = report.id
  const result = await props.module.moderateReport(report.id, status, props.clave)
  busy.value = null
  if (!result.ok) {
    showToast(result.error.message || copy.reportFail, 'bad')
    return
  }
  reports.value = reports.value.map((item) =>
    item.id === report.id ? { ...item, moderationStatus: status } : item,
  )
  showToast(copy.reportOk, 'ok')
  emit('published')
}

function onTipSaved() {
  tipOpen.value = false
  emit('published')
}

function onFineSaved() {
  fineOpen.value = false
  emit('published')
}

onMounted(() => {
  void loadReports()
})
</script>

<template>
  <div class="admin-stack">
    <FilterPills v-model="tab" :pills="tabs" />

    <AdminPane v-if="tab === 'reportes'" :title="copy.reportsTitle" :lead="copy.reportsLead" :count="pending">
      <p v-if="!reports.length" class="admin-empty">{{ copy.reportsEmpty }}</p>
      <ul v-else class="admin-list">
        <li v-for="report in sortedReports" :key="report.id" class="admin-list__item">
          <div class="admin-list__main">
            <strong>{{ report.title }}</strong>
            <span class="admin-list__meta">{{ report.whereText }} · {{ report.happenedAt }}</span>
            <div class="admin-list__chips">
              <Chip :tone="statusTone(report.moderationStatus)">{{ copy.statusLabels[report.moderationStatus] }}</Chip>
            </div>
            <p class="admin-list__text">{{ report.whatHappened }}</p>
            <a v-if="report.evidenceSrc" :href="report.evidenceSrc" target="_blank" rel="noopener noreferrer">
              {{ copy.reportEvidence }}
            </a>
          </div>
          <div class="admin-list__actions">
            <Button
              size="sm"
              :disabled="busy === report.id || report.moderationStatus === 'published'"
              @click="moderate(report, 'published')"
            >
              {{ copy.reportPublish }}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              :disabled="busy === report.id || report.moderationStatus === 'hidden'"
              @click="moderate(report, 'hidden')"
            >
              {{ copy.reportHide }}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              :disabled="busy === report.id || report.moderationStatus === 'rejected'"
              @click="moderate(report, 'rejected')"
            >
              {{ copy.reportReject }}
            </Button>
          </div>
        </li>
      </ul>
    </AdminPane>

    <AdminPane v-else-if="tab === 'tips'" :title="copy.tipsTitle" :lead="copy.tipsLead" :count="tips.length">
      <template #actions>
        <Button size="sm" @click="tipOpen = true">+ {{ copy.newTip }}</Button>
      </template>
      <p v-if="!tips.length" class="admin-empty">{{ copy.tipsEmpty }}</p>
      <ul v-else class="admin-list">
        <li v-for="tip in tips" :key="tip.id" class="admin-list__item admin-list__item--compact">
          <div class="admin-list__main">
            <strong>{{ tip.title }}</strong>
            <span class="admin-list__meta">{{ tip.body }}</span>
          </div>
          <VoiceItemTools :module="module" :clave="clave" :tip="tip" @changed="emit('published')" />
        </li>
      </ul>
    </AdminPane>

    <AdminPane v-else :title="copy.finesTitle" :lead="copy.finesLead" :count="fines.length">
      <template #actions>
        <Button size="sm" @click="fineOpen = true">+ {{ copy.newFine }}</Button>
      </template>
      <p v-if="!fines.length" class="admin-empty">{{ copy.finesEmpty }}</p>
      <ul v-else class="admin-list">
        <li v-for="fine in fines" :key="fine.id" class="admin-list__item admin-list__item--compact">
          <div class="admin-list__main">
            <strong>{{ fine.title }}</strong>
            <span class="admin-list__meta">{{ fine.guide }}</span>
          </div>
          <VoiceItemTools :module="module" :clave="clave" :fine="fine" @changed="emit('published')" />
        </li>
      </ul>
    </AdminPane>

    <AdminDrawer v-model="tipOpen" :title="copy.tipTitle" :lead="copy.tipLead">
      <TipForm :module="module" :clave="clave" @saved="onTipSaved" @cancel="tipOpen = false" />
    </AdminDrawer>
    <AdminDrawer v-model="fineOpen" :title="copy.fineTitle" :lead="copy.fineLead">
      <FineForm :module="module" :clave="clave" @saved="onFineSaved" @cancel="fineOpen = false" />
    </AdminDrawer>
  </div>
</template>
