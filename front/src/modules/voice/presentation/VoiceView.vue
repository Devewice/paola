<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { LEGAL_COPY } from '@app/constants/legal.ts'
import { parseReportDraft } from '@modules/voice/application/parseReportDraft.ts'
import type { VoiceModule } from '@modules/voice/composition.ts'
import { API, APP_PATHS, JSON_HEADERS } from '@shared/http/constants.ts'
import PaolaAlert from '@ui/PaolaAlert.vue'
import PaolaButton from '@ui/PaolaButton.vue'
import PaolaField from '@ui/PaolaField.vue'
import PaolaInput from '@ui/PaolaInput.vue'
import PaolaPrivacyCheck from '@ui/PaolaPrivacyCheck.vue'
import PaolaTextarea from '@ui/PaolaTextarea.vue'

defineProps<{ module: VoiceModule }>()

type Fine = { id: string; title: string; guide: string; officialHref: string; disclaimer: string }
type Report = { id: string; title: string; whatHappened: string; whereText: string; happenedAt: string; evidenceSrc?: string }

const tips = ref<readonly { id: string; title: string; body: string; officialHref?: string }[]>([])
const fines = ref<readonly Fine[]>([])
const reports = ref<readonly Report[]>([])
const error = ref('')
const notice = ref('')
const privacyAccepted = ref(false)
const legal = LEGAL_COPY
const privacyPath = APP_PATHS.PRIVACIDAD
const moderationPath = `${APP_PATHS.PRIVACIDAD}#moderacion`

const title = ref('')
const whatHappened = ref('')
const whereText = ref('')
const happenedAt = ref('')
const evidenceSrc = ref('')

onMounted(async () => {
  await Promise.all([loadTips(), loadFines(), loadReports()])
})

async function loadTips(): Promise<void> {
  tips.value = (await (await fetch(API.TIPS)).json()).tips ?? []
}

async function loadFines(): Promise<void> {
  const body = await (await fetch(API.FINES)).json()
  fines.value = Array.isArray(body.fines) ? body.fines : Array.isArray(body.comparendos) ? body.comparendos : []
}

async function loadReports(): Promise<void> {
  const body = await (await fetch(API.REPORTS)).json()
  reports.value = Array.isArray(body.reports) ? body.reports : Array.isArray(body.denuncias) ? body.denuncias : []
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
  notice.value = 'Denuncia enviada. Paola la revisa antes de publicar.'
  title.value = ''
  whatHappened.value = ''
  whereText.value = ''
  happenedAt.value = ''
  evidenceSrc.value = ''
  privacyAccepted.value = false
}
</script>

<template>
  <article class="paola-page">
    <header>
      <p class="paola-empty__kicker">Tu voz · Loigca + Incauta + Armargura</p>
      <h1 class="paola-afiche__title type-display">Tu voz</h1>
      <p class="paola-afiche__lead">Educación vial, comparendos y constancia comunitaria sin fingir autoridad.</p>
      <p class="paola-page__copy">
        <router-link class="voice-legal" :to="privacyPath">{{ legal.voiceLink }}</router-link>
      </p>
    </header>

    <PaolaAlert v-if="error" tone="bad">{{ error }}</PaolaAlert>
    <PaolaAlert v-if="notice" tone="ok">{{ notice }}</PaolaAlert>

    <section class="voice-block">
      <h2 class="paola-page__heading type-display">Tips Loigca</h2>
      <ul class="voice-list">
        <li v-for="tip in tips" :key="tip.id">
          <strong>{{ tip.title }}</strong> · {{ tip.body }}
        </li>
      </ul>
    </section>

    <section class="voice-block">
      <h2 class="paola-page__heading type-display">Comparendos básicos</h2>
      <PaolaAlert tone="warn">{{ legal.finesDisclaimer }}</PaolaAlert>
      <ul v-if="fines.length" class="voice-list">
        <li v-for="item in fines" :key="item.id">
          <strong>{{ item.title }}</strong> · {{ item.guide }}
          <a :href="item.officialHref" target="_blank" rel="noopener noreferrer">Canal oficial</a>
          <p class="paola-page__copy paola-page__copy--muted">{{ item.disclaimer }}</p>
        </li>
      </ul>
    </section>

    <section class="voice-block">
      <h2 class="paola-page__heading type-display">Denuncia comunitaria</h2>
      <PaolaAlert tone="warn">{{ legal.reportsDisclaimer }}</PaolaAlert>
      <p class="paola-page__copy paola-page__copy--muted">{{ legal.moderationShort }}</p>
      <p class="paola-page__copy">
        <router-link class="voice-legal" :to="moderationPath">Criterio de moderación</router-link>
      </p>
      <form class="voice-form" @submit.prevent="publishDenuncia">
        <PaolaPrivacyCheck
          v-model="privacyAccepted"
          :label="legal.checkboxLabel"
          :to="privacyPath"
          :link-label="legal.checkboxLink"
        />
        <PaolaField label="Qué pasó"><PaolaInput v-model="title" /></PaolaField>
        <PaolaField label="Detalle"><PaolaTextarea v-model="whatHappened" /></PaolaField>
        <PaolaField label="Dónde"><PaolaInput v-model="whereText" /></PaolaField>
        <PaolaField label="Cuándo"><PaolaInput v-model="happenedAt" type="datetime-local" /></PaolaField>
        <PaolaField label="Evidencia (foto enlace, opcional)"><PaolaInput v-model="evidenceSrc" /></PaolaField>
        <PaolaButton type="submit" :disabled="!privacyAccepted">Enviar denuncia</PaolaButton>
      </form>
    </section>

    <section class="voice-block">
      <h2 class="paola-page__heading type-display">Publicadas por Paola</h2>
      <ul class="voice-list">
        <li v-for="item in reports" :key="item.id">
          <strong>{{ item.title }}</strong> · {{ item.whereText }} · {{ item.happenedAt }}
        </li>
      </ul>
    </section>
  </article>
</template>

<style scoped>
.voice-block { padding-top: 24px; border-top: 1px solid var(--paola-line); display: grid; gap: 10px; }
.voice-list { margin: 0; padding-left: 1.2rem; display: grid; gap: 8px; }
.voice-form { display: grid; gap: 12px; }
.voice-legal {
  color: var(--paola-cyan, #48b4fc);
  text-decoration: underline;
  text-underline-offset: 2px;
}
</style>
