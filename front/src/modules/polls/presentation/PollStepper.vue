<script setup lang="ts">
import gsap from 'gsap'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { PollsModule } from '@modules/polls/composition.ts'
import {
  POLLS_AUTO_ADVANCE_MS,
  POLLS_COPY,
  POLLS_SECONDS_PER_QUESTION,
} from '@modules/polls/constants/copy.ts'
import {
  EMPTY_ANSWER,
  buildSteps,
  countQuestions,
  emptyBallot,
  isAnswered,
  needsOtherText,
  questionNumber,
  type Ballot,
  type BallotAnswer,
  type Poll,
  type PollQuestion,
} from '@modules/polls/domain/entities/Poll.ts'
import PollQuestionField from '@modules/polls/presentation/PollQuestionField.vue'
import { MOTION } from '@shared/motion/tokens.ts'
import { prefersReducedMotion } from '@shared/motion/prefersReducedMotion.ts'
import Button from '@ui/Button.vue'
import { showToast } from '@ui/toast.ts'

const props = defineProps<{
  module: PollsModule
  poll: Poll
}>()

const emit = defineEmits<{ voted: [poll: Poll] }>()

const copy = POLLS_COPY
const signedIn = props.module.isSignedIn()
const ballot = ref<Ballot>(restore())
const currentKey = ref('intro')
const direction = ref(1)
const sending = ref(false)
const nudge = ref(false)
const stage = ref<HTMLElement | null>(null)
const heading = ref<HTMLElement | null>(null)
const field = ref<InstanceType<typeof PollQuestionField> | null>(null)
let advanceTimer = 0

function restore(): Ballot {
  const base = emptyBallot(props.poll)
  const saved = props.module.drafts.load(props.poll.id)
  if (!saved) return base
  const merged: Record<string, BallotAnswer> = { ...base }
  for (const question of props.poll.questions) {
    const answer = saved[question.id]
    if (answer) merged[question.id] = question.kind === 'ranking' && !answer.ranking.length ? base[question.id]! : answer
  }
  return merged
}

watch(ballot, (next) => props.module.drafts.save(props.poll.id, next), { deep: true })

const steps = computed(() => buildSteps(props.poll, ballot.value))
const lastIndex = ref(0)
const index = computed(() => {
  const found = steps.value.findIndex((step) => step.key === currentKey.value)
  return found < 0 ? Math.min(lastIndex.value, steps.value.length - 1) : found
})
const step = computed(() => steps.value[index.value] ?? steps.value[0]!)
const questionSteps = computed(() => steps.value.filter((item) => item.type === 'question'))
const progress = computed(() => (steps.value.length > 1 ? (index.value / (steps.value.length - 1)) * 100 : 0))
const position = computed(
  () => steps.value.slice(0, index.value + 1).filter((item) => item.type === 'question').length,
)
const answeredCount = computed(
  () => questionSteps.value.filter((item) => item.type === 'question' && isAnswered(item.question, answerOf(item.question))).length,
)
const total = computed(() => countQuestions(props.poll))
const minutes = computed(() => Math.max(1, Math.round((total.value * POLLS_SECONDS_PER_QUESTION) / 60)))
const gate = computed(() => (step.value.type === 'intro' ? step.value.gate : undefined))
const activeQuestion = computed<PollQuestion | undefined>(() =>
  step.value.type === 'question' ? step.value.question : gate.value,
)
const sectionLabel = computed(() => (step.value.type === 'question' ? step.value.section : undefined))
const filteredOut = computed(() => Boolean(steps.value[0]?.type === 'intro' && steps.value[0].gate) && questionSteps.value.length === 0)

function answerOf(question: PollQuestion): BallotAnswer {
  return ballot.value[question.id] ?? EMPTY_ANSWER
}

function setAnswer(question: PollQuestion, answer: BallotAnswer) {
  ballot.value = { ...ballot.value, [question.id]: answer }
  nudge.value = false
}

function ready(question: PollQuestion | undefined): boolean {
  if (!question) return true
  const answer = answerOf(question)
  if (needsOtherText(question, answer)) return false
  return !question.required || isAnswered(question, answer)
}

const canAdvance = computed(() => ready(activeQuestion.value))
const isSkip = computed(
  () => step.value.type === 'question' && !step.value.question.required && !isAnswered(step.value.question, answerOf(step.value.question)),
)

function goTo(target: number) {
  const next = steps.value[target]
  if (!next) return
  direction.value = target >= index.value ? 1 : -1
  lastIndex.value = target
  currentKey.value = next.key
}

function next() {
  window.clearTimeout(advanceTimer)
  if (step.value.type === 'submit') {
    void submit()
    return
  }
  if (!canAdvance.value) {
    nudge.value = true
    return
  }
  goTo(index.value + 1)
}

function back() {
  window.clearTimeout(advanceTimer)
  goTo(index.value - 1)
}

function onAdvance() {
  window.clearTimeout(advanceTimer)
  const key = currentKey.value
  advanceTimer = window.setTimeout(() => {
    if (currentKey.value === key && canAdvance.value) goTo(index.value + 1)
  }, POLLS_AUTO_ADVANCE_MS)
}

async function submit() {
  if (sending.value) return
  sending.value = true
  const result = await props.module.submit(props.poll, ballot.value, signedIn)
  sending.value = false
  if (!result.ok) {
    showToast(result.error.message || copy.voteFail, 'bad')
    return
  }
  props.module.drafts.clear(props.poll.id)
  showToast(copy.voted, 'ok')
  emit('voted', result.value)
}

function isTyping(target: EventTarget | null): boolean {
  const element = target as HTMLElement | null
  if (!element) return false
  return element.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(element.tagName)
}

function onKeydown(event: KeyboardEvent) {
  if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return
  const typing = isTyping(event.target)
  if (event.key === 'Enter') {
    if (typing && (event.target as HTMLElement).tagName === 'TEXTAREA' && !event.shiftKey) return
    if ((event.target as HTMLElement | null)?.tagName === 'BUTTON') return
    event.preventDefault()
    next()
    return
  }
  if (typing || !/^[1-9]$/.test(event.key)) return
  if (field.value?.pickIndex(Number(event.key) - 1)) event.preventDefault()
}

watch(currentKey, async () => {
  nudge.value = false
  await nextTick()
  heading.value?.focus({ preventScroll: true })
  if (!stage.value || prefersReducedMotion()) return
  gsap.fromTo(
    stage.value,
    { x: direction.value * 40, opacity: 0 },
    { x: 0, opacity: 1, duration: MOTION.duration.reveal, ease: MOTION.ease.enter },
  )
})

onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  window.clearTimeout(advanceTimer)
})
</script>

<template>
  <section class="poll-stepper" :aria-label="poll.title">
    <header class="poll-stepper__bar">
      <div class="poll-stepper__meta">
        <span class="poll-stepper__section">{{ sectionLabel ?? poll.title }}</span>
        <span v-if="step.type === 'question'" class="poll-stepper__count">
          {{ position }} {{ copy.stepOf }} {{ questionSteps.length }}
        </span>
      </div>
      <div
        class="poll-stepper__progress"
        role="progressbar"
        :aria-valuenow="Math.round(progress)"
        aria-valuemin="0"
        aria-valuemax="100"
      >
        <span :style="{ width: `${progress}%` }" />
      </div>
    </header>

    <div ref="stage" class="poll-stepper__stage">
      <!-- Portada -->
      <template v-if="step.type === 'intro'">
        <p class="poll-stepper__kicker">{{ copy.kicker }}</p>
        <h1 ref="heading" class="poll-stepper__title" tabindex="-1">{{ poll.title }}</h1>
        <p v-if="poll.description" class="poll-stepper__lead">{{ poll.description }}</p>
        <p class="poll-stepper__facts">
          <span>{{ total }} {{ copy.stepQuestions }}</span>
          <span>{{ minutes }} {{ copy.stepMinutes }}</span>
        </p>

        <div v-if="gate" class="poll-stepper__gate">
          <h2 class="poll-stepper__prompt">{{ gate.prompt }}</h2>
          <p v-if="gate.help" class="poll-stepper__help">{{ gate.help }}</p>
          <PollQuestionField
            ref="field"
            :question="gate"
            :answer="answerOf(gate)"
            step
            @update:answer="setAnswer(gate, $event)"
            @advance="onAdvance"
          />
        </div>
        <div v-else class="poll-stepper__nav poll-stepper__nav--start">
          <Button variant="hero" @click="next">{{ copy.stepStart }}</Button>
        </div>
        <p class="poll-stepper__hint">{{ copy.stepDraftSaved }}</p>
      </template>

      <!-- Entrada de sección -->
      <template v-else-if="step.type === 'section'">
        <p class="poll-stepper__kicker">{{ copy.stepSection }}</p>
        <h2 ref="heading" class="poll-stepper__section-title type-brush-dry" tabindex="-1">{{ step.title }}</h2>
        <div class="poll-stepper__nav poll-stepper__nav--start">
          <Button variant="ghost" @click="back">{{ copy.stepBack }}</Button>
          <Button @click="next">{{ copy.stepContinue }}</Button>
        </div>
      </template>

      <!-- Pregunta -->
      <template v-else-if="step.type === 'question'">
        <div class="poll-stepper__q">
          <span v-if="questionNumber(poll, step.question)" class="poll-stepper__num">
            {{ questionNumber(poll, step.question) }}
          </span>
          <div class="poll-stepper__q-text">
            <h2 ref="heading" class="poll-stepper__prompt" tabindex="-1">{{ step.question.prompt }}</h2>
            <p v-if="step.question.help" class="poll-stepper__help">{{ step.question.help }}</p>
          </div>
        </div>
        <PollQuestionField
          ref="field"
          :key="step.question.id"
          :question="step.question"
          :answer="answerOf(step.question)"
          step
          @update:answer="setAnswer(step.question, $event)"
          @advance="onAdvance"
        />
      </template>

      <!-- Envío -->
      <template v-else>
        <p class="poll-stepper__kicker">{{ copy.kicker }}</p>
        <h2 ref="heading" class="poll-stepper__title" tabindex="-1">{{ copy.stepSubmitTitle }}</h2>
        <p class="poll-stepper__lead">{{ filteredOut ? copy.stepGateEnd : copy.stepSubmitLead }}</p>
        <p v-if="!filteredOut" class="poll-stepper__facts">
          <span>{{ answeredCount }} {{ copy.stepOf }} {{ questionSteps.length }} {{ copy.stepAnswered }}</span>
        </p>
        <p class="poll-card__note">{{ poll.audience === 'account' ? copy.accountNote : copy.anonymousNote }}</p>
        <div class="poll-stepper__nav poll-stepper__nav--start">
          <Button variant="ghost" @click="back">{{ copy.stepBack }}</Button>
          <Button variant="hero" :disabled="sending" @click="submit">
            {{ sending ? copy.sending : copy.voteCta }}
          </Button>
        </div>
      </template>
    </div>

    <footer v-if="step.type === 'question'" class="poll-stepper__nav">
      <Button variant="ghost" @click="back">{{ copy.stepBack }}</Button>
      <p v-if="nudge" class="poll-stepper__nudge" role="status">{{ copy.stepRequired }}</p>
      <p v-else class="poll-stepper__hint poll-stepper__hint--keys">{{ copy.stepKeys }}</p>
      <Button :variant="isSkip ? 'ghost' : 'primary'" @click="next">{{ isSkip ? copy.stepSkip : copy.stepNext }}</Button>
    </footer>
  </section>
</template>

<style scoped>
.poll-stepper {
  display: grid;
  gap: 24px;
  min-height: min(78vh, 760px);
  align-content: start;
}
.poll-stepper__bar {
  position: sticky;
  top: 72px;
  z-index: 2;
  display: grid;
  gap: 8px;
  padding: 12px 0;
  background: linear-gradient(180deg, var(--bg, #05070c) 70%, transparent);
}
.poll-stepper__meta {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--muted, rgba(234, 242, 255, 0.7));
}
.poll-stepper__count {
  color: var(--cyan, #48b4fc);
  white-space: nowrap;
}
.poll-stepper__progress {
  height: 6px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  overflow: hidden;
}
.poll-stepper__progress span {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, var(--blue, #0088f8), var(--cyan, #48b4fc));
  box-shadow: 0 0 12px rgba(72, 180, 252, 0.6);
  transition: width 320ms ease;
}

.poll-stepper__stage {
  display: grid;
  gap: 20px;
  align-content: start;
}
.poll-stepper__kicker {
  margin: 0;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--cyan, #48b4fc);
}
.poll-stepper__title {
  margin: 0;
  font: 700 clamp(32px, 6vw, 52px) / 1.02 var(--display, Oswald, sans-serif);
  letter-spacing: 0.01em;
  text-transform: uppercase;
  outline: none;
}
.poll-stepper__section-title {
  margin: 0;
  font-size: clamp(34px, 7vw, 64px);
  line-height: 1;
  outline: none;
}
.poll-stepper__lead {
  margin: 0;
  max-width: 60ch;
  font-size: 16px;
  line-height: 1.6;
  color: var(--muted, rgba(234, 242, 255, 0.78));
}
.poll-stepper__facts {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 0;
}
.poll-stepper__facts span {
  padding: 4px 12px;
  border: 1px solid rgba(72, 180, 252, 0.3);
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
}
.poll-stepper__gate {
  display: grid;
  gap: 12px;
  margin-top: 8px;
  padding: clamp(20px, 4vw, 28px);
  border-radius: 16px;
  border: 1px solid rgba(72, 180, 252, 0.22);
  border-top: 6px solid var(--blue, #0088f8);
  background: rgba(0, 16, 40, 0.6);
}

.poll-stepper__q {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 16px;
  align-items: start;
}
.poll-stepper__q-text {
  display: grid;
  gap: 8px;
  grid-column: 2;
}
.poll-stepper__q > .poll-stepper__q-text:only-child {
  grid-column: 1 / -1;
}
.poll-stepper__num {
  display: grid;
  place-items: center;
  min-width: 48px;
  height: 48px;
  padding: 0 10px;
  border-radius: 12px;
  background: var(--blue, #0088f8);
  font: 700 22px/1 var(--display, Oswald, sans-serif);
  box-shadow: 0 0 18px rgba(0, 136, 248, 0.4);
}
.poll-stepper__prompt {
  margin: 0;
  font: 600 clamp(22px, 3.4vw, 30px) / 1.25 var(--ui, Montserrat, sans-serif);
  outline: none;
}
.poll-stepper__help {
  margin: 0;
  font-size: 14px;
  font-style: italic;
  color: var(--muted, rgba(234, 242, 255, 0.7));
}

.poll-stepper__nav {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px 16px;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}
.poll-stepper__nav--start {
  justify-content: flex-start;
  border-top: 0;
}
.poll-stepper__hint {
  margin: 0;
  font-size: 12px;
  color: var(--muted, rgba(234, 242, 255, 0.6));
}
.poll-stepper__hint--keys {
  display: none;
}
@media (hover: hover) and (min-width: 720px) {
  .poll-stepper__hint--keys {
    display: block;
  }
}
.poll-stepper__nudge {
  margin: 0;
  font-size: 13px;
  font-weight: 600;
  color: #f2b84b;
  animation: poll-nudge 380ms ease;
}
@keyframes poll-nudge {
  25%, 75% { transform: translateX(-4px); }
  50% { transform: translateX(4px); }
}
</style>
