<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { LEGAL_COPY } from '@app/constants/legal.ts'
import { parseReportDraft } from '@modules/voice/application/parseReportDraft.ts'
import { FINES_EMPTY_COPY, REPORTS_EMPTY_COPY, VOICE_COPY } from '@modules/voice/constants/copy.ts'
import type { VoiceModule } from '@modules/voice/composition.ts'
import { API, APP_PATHS, JSON_HEADERS } from '@shared/http/constants.ts'
import { usePageReveal } from '@shared/motion/usePageReveal.ts'
import { MASCOT } from '@shared/ui/mascot.ts'
import AficheHero from '@ui/AficheHero.vue'
import Alert from '@ui/Alert.vue'
import Button from '@ui/Button.vue'
import Card from '@ui/Card.vue'
import Empty from '@ui/Empty.vue'
import Field from '@ui/Field.vue'
import Input from '@ui/Input.vue'
import PrivacyCheck from '@ui/PrivacyCheck.vue'
import Textarea from '@ui/Textarea.vue'
import VoiceBadge from '@ui/VoiceBadge.vue'

const props = defineProps<{ module: VoiceModule }>()

type Fine = { id: string; title: string; guide: string; officialHref: string; disclaimer: string }
type Report = { id: string; title: string; whatHappened: string; whereText: string; happenedAt: string }

const fines = ref<readonly Fine[]>([])
const reports = ref<readonly Report[]>([])
const error = ref('')
const notice = ref('')
const privacyAccepted = ref(false)
const legal = LEGAL_COPY
const copy = VOICE_COPY
const privacyPath = APP_PATHS.PRIVACIDAD
const moderationPath = `${APP_PATHS.PRIVACIDAD}#moderacion`
const bindReveal = usePageReveal()
const tips = computed(() => props.module.getTips())

const title = ref('')
const whatHappened = ref('')
const whereText = ref('')
const happenedAt = ref('')
const evidenceSrc = ref('')

onMounted(async () => {
  await Promise.all([loadFines(), loadReports()])
})

async function loadFines(): Promise<void> {
  try {
    const body = await (await fetch(API.FINES)).json()
    fines.value = Array.isArray(body.fines) ? body.fines : []
  } catch {
    fines.value = []
  }
}

async function loadReports(): Promise<void> {
  try {
    const body = await (await fetch(API.REPORTS)).json()
    reports.value = Array.isArray(body.reports) ? body.reports : []
  } catch {
    reports.value = []
  }
}

async function publishDenuncia(): Promise<void> {
  error.value = ''
  notice.value = ''
  const parsed = parseReportDraft({
    title: title.value,
    whatHappened: whatHappened.value,
    whereText: whereText.value,
    happenedAt: happenedAt.value,
    evidenceSrc: evidenceSrc.value,
    privacyAccepted: privacyAccepted.value,
  })
  if (!parsed.ok) {
    error.value = parsed.error.message
    return
  }
  const response = await fetch(API.REPORTS, {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify(parsed.value),
  })
  const body = (await response.json()) as Record<string, unknown>
  if (!response.ok) {
    error.value = typeof body.detail === 'string' ? body.detail : 'No se pudo enviar.'
    return
  }
  notice.value = 'Constancia enviada. Paola la revisa antes de publicar.'
  title.value = ''
  whatHappened.value = ''
  whereText.value = ''
  happenedAt.value = ''
  evidenceSrc.value = ''
  privacyAccepted.value = false
}
</script>

<template>
  <article :ref="bindReveal" class="paola-page">
    <AficheHero :kicker="copy.kicker" :title="copy.title" :plate="copy.plate" data-reveal>
      <template #lead>{{ copy.lead }}</template>
    </AficheHero>

    <p class="paola-page__copy" data-reveal>
      <router-link class="voice-legal" :to="privacyPath">{{ legal.voiceLink }}</router-link>
    </p>

    <Alert v-if="error" tone="bad">{{ error }}</Alert>
    <Alert v-if="notice" tone="ok">{{ notice }}</Alert>

    <section class="paola-page__block" data-reveal>
      <VoiceBadge voice="loigca" />
      <h2 class="paola-page__heading type-display">{{ copy.tipsHeading }}</h2>
      <div v-if="tips.items.length" class="voice-cards">
        <Card v-for="tip in tips.items" :key="tip.id">
          <h3 class="paola-product__title">{{ tip.title }}</h3>
          <p class="paola-page__copy">{{ tip.body }}</p>
          <a
            v-if="tip.officialHref"
            class="voice-legal"
            :href="tip.officialHref"
            target="_blank"
            rel="noopener noreferrer"
          >Norma oficial</a>
        </Card>
      </div>
      <Empty
        v-else
        compact
        hide-cta
        :title="copy.tipsEmpty"
        :copy="tips.emptyCopy"
        :mascot-src="MASCOT.TUMBADA"
      />
    </section>

    <section class="paola-page__block" data-reveal>
      <VoiceBadge voice="loigca" />
      <h2 class="paola-page__heading type-display">{{ copy.finesHeading }}</h2>
      <Alert tone="warn">{{ legal.finesDisclaimer }}</Alert>
      <div v-if="fines.length" class="voice-cards">
        <Card v-for="item in fines" :key="item.id">
          <h3 class="paola-product__title">{{ item.title }}</h3>
          <p class="paola-page__copy">{{ item.guide }}</p>
          <a class="voice-legal" :href="item.officialHref" target="_blank" rel="noopener noreferrer">Canal oficial</a>
          <p class="paola-page__copy paola-page__copy--muted">{{ item.disclaimer }}</p>
        </Card>
      </div>
      <Empty
        v-else
        compact
        hide-cta
        :title="copy.finesEmpty"
        :copy="FINES_EMPTY_COPY"
        :mascot-src="MASCOT.EN_PIE"
      />
    </section>

    <section class="paola-page__block" data-reveal>
      <VoiceBadge voice="armargura" />
      <h2 class="paola-page__heading type-display">{{ copy.reportsHeading }}</h2>
      <Alert tone="warn">{{ legal.reportsDisclaimer }}</Alert>
      <p class="paola-page__copy paola-page__copy--muted">{{ legal.moderationShort }}</p>
      <p class="paola-page__copy">
        <router-link class="voice-legal" :to="moderationPath">Criterio de moderación</router-link>
      </p>
      <form class="voice-form" @submit.prevent="publishDenuncia">
        <PrivacyCheck
          v-model="privacyAccepted"
          :label="legal.checkboxLabel"
          :to="privacyPath"
          :link-label="legal.checkboxLink"
        />
        <Field label="Qué pasó"><Input v-model="title" /></Field>
        <Field label="Detalle"><Textarea v-model="whatHappened" /></Field>
        <Field label="Dónde"><Input v-model="whereText" /></Field>
        <Field label="Cuándo"><Input v-model="happenedAt" type="datetime-local" /></Field>
        <Field label="Evidencia (foto enlace, opcional)"><Input v-model="evidenceSrc" /></Field>
        <Button type="submit" :disabled="!privacyAccepted">{{ copy.sendCta }}</Button>
      </form>
    </section>

    <section class="paola-page__block" data-reveal>
      <VoiceBadge voice="incauta" />
      <h2 class="paola-page__heading type-display">{{ copy.publishedHeading }}</h2>
      <ul v-if="reports.length" class="voice-list">
        <li v-for="item in reports" :key="item.id">
          <strong>{{ item.title }}</strong> · {{ item.whereText }}
        </li>
      </ul>
      <Empty
        v-else
        compact
        hide-cta
        title="Nada publicado"
        :copy="REPORTS_EMPTY_COPY"
        :mascot-src="MASCOT.TUMBADA"
      />
    </section>
  </article>
</template>

<style scoped>
.voice-cards,
.voice-form,
.voice-list {
  display: grid;
  gap: 12px;
}

.voice-list {
  margin: 0;
  padding-left: 1.2rem;
}

.voice-legal {
  color: var(--paola-cyan, #48b4fc);
  text-decoration: underline;
  text-underline-offset: 2px;
}
</style>
