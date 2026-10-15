<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { VoiceModule } from '@modules/voice/composition.ts'
import { VOICE_ADMIN_COPY } from '@modules/voice/constants/copy.ts'
import type { ReportStatus, VoiceReport } from '@modules/voice/domain/entities/Report.ts'
import Button from '@ui/Button.vue'
import Field from '@ui/Field.vue'
import Input from '@ui/Input.vue'
import Textarea from '@ui/Textarea.vue'
import { showToast } from '@ui/toast.ts'

const props = defineProps<{
  module: VoiceModule
  clave: string
}>()

const emit = defineEmits<{ published: [] }>()

const copy = VOICE_ADMIN_COPY

const tip = ref({ title: '', body: '', officialHref: '' })
const fine = ref({ title: '', guide: '', officialHref: '', disclaimer: copy.fineDisclaimerDefault })
const reports = ref<readonly VoiceReport[]>([])
const busy = ref<string | null>(null)

async function publishTip() {
  busy.value = 'tip'
  const result = await props.module.createTip(
    {
      title: tip.value.title.trim(),
      body: tip.value.body.trim(),
      officialHref: tip.value.officialHref.trim() || undefined,
    },
    props.clave,
  )
  busy.value = null
  if (!result.ok) {
    showToast(result.error.message || copy.tipFail, 'bad')
    return
  }
  tip.value = { title: '', body: '', officialHref: '' }
  showToast(copy.tipOk, 'ok')
  emit('published')
}

async function publishFine() {
  busy.value = 'fine'
  const result = await props.module.createFine(
    {
      title: fine.value.title.trim(),
      guide: fine.value.guide.trim(),
      officialHref: fine.value.officialHref.trim(),
      disclaimer: fine.value.disclaimer.trim(),
    },
    props.clave,
  )
  busy.value = null
  if (!result.ok) {
    showToast(result.error.message || copy.fineFail, 'bad')
    return
  }
  fine.value = { title: '', guide: '', officialHref: '', disclaimer: copy.fineDisclaimerDefault }
  showToast(copy.fineOk, 'ok')
  emit('published')
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

onMounted(() => {
  void loadReports()
})
</script>

<template>
  <div class="admin-stack">
    <div class="admin-grid">
      <form class="admin-card" @submit.prevent="publishTip">
        <header class="admin-card__head">
          <h3>{{ copy.tipTitle }}</h3>
          <p>{{ copy.tipLead }}</p>
        </header>
        <Field :label="copy.tipFieldTitle">
          <Input v-model="tip.title" />
        </Field>
        <Field :label="copy.tipFieldBody">
          <Textarea v-model="tip.body" />
        </Field>
        <Field :label="copy.tipFieldHref">
          <Input v-model="tip.officialHref" type="url" placeholder="https://" />
        </Field>
        <Button type="submit" size="sm" :disabled="busy === 'tip'">{{ copy.tipCta }}</Button>
      </form>

      <form class="admin-card" @submit.prevent="publishFine">
        <header class="admin-card__head">
          <h3>{{ copy.fineTitle }}</h3>
          <p>{{ copy.fineLead }}</p>
        </header>
        <Field :label="copy.fineFieldTitle">
          <Input v-model="fine.title" />
        </Field>
        <Field :label="copy.fineFieldGuide">
          <Textarea v-model="fine.guide" />
        </Field>
        <Field :label="copy.fineFieldHref">
          <Input v-model="fine.officialHref" type="url" placeholder="https://" />
        </Field>
        <Field :label="copy.fineFieldDisclaimer">
          <Textarea v-model="fine.disclaimer" />
        </Field>
        <Button type="submit" size="sm" :disabled="busy === 'fine'">{{ copy.fineCta }}</Button>
      </form>
    </div>

    <section class="admin-card">
      <header class="admin-card__head">
        <h3>{{ copy.reportsTitle }}</h3>
        <p>{{ copy.reportsLead }}</p>
      </header>
      <p v-if="!reports.length" class="admin-empty">{{ copy.reportsEmpty }}</p>
      <ul v-else class="admin-list">
        <li v-for="report in reports" :key="report.id" class="admin-list__item">
          <div class="admin-list__main">
            <strong>{{ report.title }}</strong>
            <span class="admin-list__meta">
              {{ report.whereText }} · {{ report.happenedAt }} · {{ copy.statusLabels[report.moderationStatus] }}
            </span>
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
    </section>
  </div>
</template>
