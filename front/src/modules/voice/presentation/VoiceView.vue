<script setup lang="ts">
import { computed, ref } from 'vue'
import type { VoiceModule } from '@modules/voice/index.ts'
import { VOICE_COPY, VOICE_HERO_PHOTO } from '@modules/voice/constants/copy.ts'
import { LEGAL_COPY } from '@app/constants/legal.ts'
import { usePageReveal } from '@shared/motion/usePageReveal.ts'
import { APP_PATHS } from '@shared/http/constants.ts'
import { showToast } from '@ui/toast.ts'
import AficheHero from '@ui/AficheHero.vue'
import Button from '@ui/Button.vue'
import ComparendoGuide from '@ui/ComparendoGuide.vue'
import DenunciaCard from '@ui/DenunciaCard.vue'
import DisclaimerBox from '@ui/DisclaimerBox.vue'
import DualChannel from '@ui/DualChannel.vue'
import Empty from '@ui/Empty.vue'
import Field from '@ui/Field.vue'
import GuidelinesList from '@ui/GuidelinesList.vue'
import Input from '@ui/Input.vue'
import PrivacyCheck from '@ui/PrivacyCheck.vue'
import Textarea from '@ui/Textarea.vue'
import VoiceBadge from '@ui/VoiceBadge.vue'
import VoiceCard from '@ui/VoiceCard.vue'

const props = defineProps<{
  module: VoiceModule
  whatsappHref: string
  whatsappLabel: string
}>()

const bindReveal = usePageReveal()
const copy = VOICE_COPY
const legal = LEGAL_COPY

const tips = computed(() => props.module.getTips())
const fines = computed(() => props.module.getFines())
const reports = computed(() => props.module.getReports())
const featured = computed(() => tips.value.items[0] ?? null)

const title = ref('')
const whatHappened = ref('')
const whereText = ref('')
const happenedAt = ref('')
const evidenceSrc = ref('')
const privacyAccepted = ref(false)
const busy = ref(false)

async function sendReport(): Promise<void> {
  busy.value = true
  try {
    const result = await props.module.submitReport({
      title: title.value,
      whatHappened: whatHappened.value,
      whereText: whereText.value,
      happenedAt: happenedAt.value,
      evidenceSrc: evidenceSrc.value,
      privacyAccepted: privacyAccepted.value,
    })
    if (!result.ok) {
      showToast(result.error.message, 'bad')
      return
    }
    title.value = ''
    whatHappened.value = ''
    whereText.value = ''
    happenedAt.value = ''
    evidenceSrc.value = ''
    privacyAccepted.value = false
    showToast(copy.sendOk, 'ok')
  } finally {
    busy.value = false
  }
}

function reportMeta(item: { whereText: string; happenedAt: string }): string {
  return `${item.whereText} · ${item.happenedAt}`
}
</script>

<template>
  <div :ref="bindReveal" class="voice-page">
    <AficheHero
      :kicker="copy.kicker"
      :title="copy.title"
      :plate="copy.plate"
      :photo-src="VOICE_HERO_PHOTO"
      data-reveal
    >
      <template #lead>{{ copy.lead }}</template>
      <template #actions>
        <Button variant="hero" href="#reportar">{{ copy.heroCta }}</Button>
      </template>
      <template #panel>
        <VoiceCard voice="loigca">
          <p class="voice-page__featured-kicker">{{ copy.featuredKicker }}</p>
          <template v-if="featured">
            <strong>{{ featured.title }}</strong>
            <p>{{ featured.body }}</p>
          </template>
          <p v-else class="meta">{{ copy.featuredEmpty }}</p>
        </VoiceCard>
      </template>
    </AficheHero>

    <main class="wrap voice-board">
      <nav class="voice-board__nav filter-pills" :aria-label="copy.title" data-reveal>
        <a class="filter-pill" href="#tips">{{ copy.navTips }}</a>
        <a class="filter-pill" href="#comparendos">{{ copy.navFines }}</a>
        <a class="filter-pill" href="#reportes">{{ copy.navReports }}</a>
      </nav>

      <section id="tips" class="voice-board__section" data-reveal>
        <header class="voice-board__head">
          <VoiceBadge voice="loigca" />
          <div>
            <h2>{{ copy.tipsHeading }}</h2>
            <p>{{ copy.tipsLead }}</p>
          </div>
        </header>

        <div class="voice-board__split">
          <div class="voice-board__main">
            <Empty
              v-if="tips.items.length === 0"
              :title="copy.tipsEmpty"
              :copy="tips.emptyCopy"
              glyph="◎"
              compact
              hide-cta
            />
            <div v-else class="voice-board__tip-grid">
              <article v-for="tip in tips.items" :key="tip.id" class="voice-board__tip">
                <h3>{{ tip.title }}</h3>
                <p>{{ tip.body }}</p>
                <a
                  v-if="tip.officialHref"
                  class="voice-board__official"
                  :href="tip.officialHref"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {{ copy.tipOfficial }}
                </a>
              </article>
            </div>
          </div>

          <aside class="voice-board__rail">
            <h3>{{ copy.tipsRailTitle }}</h3>
            <GuidelinesList :items="copy.tipsRailItems" />
            <div class="voice-board__dual">
              <h3>{{ copy.dualTitle }}</h3>
              <DualChannel>
                <template #wa>
                  <p class="meta">{{ copy.dualWa }}</p>
                  <Button size="sm" :href="whatsappHref" target="_blank">{{ whatsappLabel }}</Button>
                </template>
                <template #web>
                  <p class="meta">{{ copy.dualWeb }}</p>
                </template>
              </DualChannel>
            </div>
          </aside>
        </div>
      </section>

      <section id="comparendos" class="voice-board__section" data-reveal>
        <header class="voice-board__head">
          <VoiceBadge voice="loigca" />
          <div>
            <h2>{{ copy.finesHeading }}</h2>
            <p>{{ copy.finesLead }}</p>
          </div>
        </header>

        <div class="voice-board__split">
          <div class="voice-board__main">
            <DisclaimerBox>{{ legal.finesDisclaimer }}</DisclaimerBox>
            <Empty
              v-if="fines.items.length === 0"
              :title="copy.finesEmpty"
              :copy="fines.emptyCopy"
              glyph="◎"
              compact
              hide-cta
            />
            <div v-else class="voice-board__fine-grid">
              <ComparendoGuide
                v-for="fine in fines.items"
                :key="fine.id"
                voice="loigca"
                :title="fine.title"
                :copy="fine.guide"
                :official-href="fine.officialHref"
                :official-label="copy.finesOfficial"
                :disclaimer="fine.disclaimer"
              />
            </div>
          </div>

          <aside class="voice-board__rail">
            <h3>{{ copy.finesRailTitle }}</h3>
            <DisclaimerBox tone="info">{{ legal.notLegalAdvice }}</DisclaimerBox>
            <Button variant="ghost" size="sm" :to="APP_PATHS.PRIVACIDAD">{{ legal.voiceLink }}</Button>
          </aside>
        </div>
      </section>

      <section id="reportes" class="voice-board__section" data-reveal>
        <header class="voice-board__head">
          <VoiceBadge voice="armargura" />
          <div>
            <h2>{{ copy.reportsHeading }}</h2>
            <p>{{ copy.reportsLead }}</p>
          </div>
        </header>

        <DisclaimerBox>{{ legal.reportsDisclaimer }}</DisclaimerBox>
        <DisclaimerBox tone="info">{{ legal.moderationShort }}</DisclaimerBox>

        <div class="voice-board__split voice-board__split--reports">
          <div class="voice-board__main">
            <h3>{{ copy.publishedHeading }}</h3>
            <Empty
              v-if="reports.items.length === 0"
              :title="copy.publishedEmpty"
              :copy="reports.emptyCopy"
              glyph="◎"
              compact
              hide-cta
            />
            <div v-else class="voice-board__report-grid">
              <DenunciaCard
                v-for="item in reports.items"
                :key="item.id"
                :title="item.title"
                :meta="reportMeta(item)"
                :status="copy.statusPublished"
              />
            </div>
          </div>

          <aside id="reportar" class="voice-board__rail voice-board__form">
            <h3>{{ copy.formHeading }}</h3>
            <p class="meta">{{ copy.formLead }}</p>
            <form class="voice-board__form-grid" @submit.prevent="sendReport">
              <Field :label="copy.formTitle">
                <Input v-model="title" type="text" autocomplete="off" />
              </Field>
              <Field :label="copy.formWhat">
                <Textarea v-model="whatHappened" />
              </Field>
              <Field :label="copy.formWhere">
                <Input v-model="whereText" type="text" autocomplete="off" />
              </Field>
              <Field :label="copy.formWhen">
                <Input v-model="happenedAt" type="text" autocomplete="off" />
              </Field>
              <Field :label="copy.formEvidence">
                <Input v-model="evidenceSrc" type="url" autocomplete="off" />
              </Field>
              <PrivacyCheck
                v-model="privacyAccepted"
                :label="legal.checkboxLabel"
                :to="APP_PATHS.PRIVACIDAD"
                :link-label="legal.checkboxLink"
              />
              <Button type="submit" :disabled="busy || !privacyAccepted">{{ copy.sendCta }}</Button>
            </form>
          </aside>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
.voice-page {
  width: 100%;
}

.voice-page__featured-kicker {
  margin: 0 0 8px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--paola-muted, #9aa3b2);
}

.voice-board {
  display: grid;
  gap: 48px;
  padding-block: 32px 64px;
}

.voice-board__nav {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.voice-board__nav .filter-pill {
  text-decoration: none;
}

.voice-board__section {
  display: grid;
  gap: 20px;
  scroll-margin-top: 96px;
}

.voice-board__head {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 12px 16px;
}

.voice-board__head h2 {
  margin: 0 0 6px;
  font-family: var(--display, Oswald, sans-serif);
  font-size: clamp(22px, 3vw, 28px);
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.voice-board__head p {
  margin: 0;
  max-width: 54ch;
  color: var(--paola-muted, #9aa3b2);
  font-size: 14px;
  line-height: 1.5;
}

.voice-board__split {
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(240px, 0.75fr);
  gap: 24px 32px;
  align-items: start;
}

.voice-board__split--reports {
  grid-template-columns: minmax(0, 1fr) minmax(280px, 0.9fr);
}

.voice-board__main,
.voice-board__rail {
  min-width: 0;
  display: grid;
  gap: 16px;
}

.voice-board__rail {
  padding: 16px;
  border: 1px solid rgba(72, 180, 252, 0.18);
  border-radius: 12px;
  background: rgba(0, 16, 40, 0.35);
}

.voice-board__rail h3 {
  margin: 0;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.voice-board__dual {
  display: grid;
  gap: 10px;
}

.voice-board__dual :deep(.where-we-talk) {
  grid-template-columns: 1fr;
}

.voice-board__tip-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.voice-board__tip {
  display: grid;
  gap: 8px;
  padding: 16px;
  border: 1px solid rgba(26, 42, 64, 0.95);
  border-radius: 10px;
  background: rgba(5, 7, 12, 0.55);
}

.voice-board__tip h3 {
  margin: 0;
  font-size: 16px;
}

.voice-board__tip p {
  margin: 0;
  color: var(--paola-muted, #9aa3b2);
  font-size: 14px;
  line-height: 1.45;
}

.voice-board__official {
  font-size: 13px;
  color: var(--paola-cyan, #48b4fc);
}

.voice-board__fine-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.voice-board__report-grid {
  display: grid;
  gap: 12px;
}

.voice-board__form-grid {
  display: grid;
  gap: 12px;
}

.voice-board__form {
  scroll-margin-top: 96px;
}

@media (max-width: 959px) {
  .voice-board {
    gap: 32px;
    padding-block: 24px 48px;
  }

  .voice-board__split,
  .voice-board__split--reports,
  .voice-board__tip-grid,
  .voice-board__fine-grid {
    grid-template-columns: 1fr;
  }
}

@media (min-width: 640px) and (max-width: 959px) {
  .voice-board__tip-grid,
  .voice-board__fine-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
