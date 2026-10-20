<script setup lang="ts">
import gsap from 'gsap'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { PollsModule } from '@modules/polls/composition.ts'
import {
  POLLS_AUTO_ADVANCE_MS,
  POLLS_COPY,
  POLLS_SECONDS_PER_QUESTION,
  POLLS_STAGE,
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
  type PollStep,
} from '@modules/polls/domain/entities/Poll.ts'
import PollCompanion from '@modules/polls/presentation/PollCompanion.vue'
import PollFinale from '@modules/polls/presentation/PollFinale.vue'
import PollIntro from '@modules/polls/presentation/PollIntro.vue'
import PollQuestionField from '@modules/polls/presentation/PollQuestionField.vue'
import PollSectionSplash from '@modules/polls/presentation/PollSectionSplash.vue'
import { MOTION } from '@shared/motion/tokens.ts'
import { prefersReducedMotion } from '@shared/motion/prefersReducedMotion.ts'
import Button from '@ui/Button.vue'
import Mascot3d from '@ui/Mascot3d.vue'
import { showToast } from '@ui/toast.ts'

const props = defineProps<{
  module: PollsModule
  poll: Poll
  /** Dentro de la tarjeta del listado: sin escena, sin pantallas de sección y teclado solo con foco adentro. */
  compact?: boolean
}>()

const emit = defineEmits<{ voted: [poll: Poll] }>()

const copy = POLLS_COPY
const signedIn = props.module.isSignedIn()
const ballot = ref<Ballot>(restore())
const currentKey = ref('intro')
const direction = ref(1)
const sending = ref(false)
const nudge = ref(false)
const root = ref<HTMLElement | null>(null)
const stage = ref<HTMLElement | null>(null)
const heading = ref<HTMLElement | null>(null)
const field = ref<InstanceType<typeof PollQuestionField> | null>(null)
const companion = ref<InstanceType<typeof PollCompanion> | null>(null)
const iris = ref<HTMLElement | null>(null)
const finale = ref<{ answered: number; total: number; elapsed: number; poll: Poll } | null>(null)
let advanceTimer = 0
let startedAt = Date.now()
let moving = false
/** Donde tocó por última vez: el iris se cierra hacia ahí. */
let point: { x: number; y: number } | null = null
/** Alto de la barra de navegación fija del sitio más un respiro. */
const SCROLL_OFFSET = 88

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

const steps = computed(() => {
  const all = buildSteps(props.poll, ballot.value)
  return props.compact ? all.filter((item) => item.type !== 'section') : all
})
const lastIndex = ref(0)
const index = computed(() => {
  const found = steps.value.findIndex((step) => step.key === currentKey.value)
  return found < 0 ? Math.min(lastIndex.value, steps.value.length - 1) : found
})
const step = computed(() => steps.value[index.value] ?? steps.value[0]!)
type QuestionStep = Extract<PollStep, { type: 'question' }>
const isCounted = (item: PollStep): item is QuestionStep => item.type === 'question' && !item.gate
const questionSteps = computed(() => steps.value.filter(isCounted))
const progress = computed(() => {
  if (steps.value.length <= 1) return 0
  const current = steps.value[index.value]
  if (current?.type === 'question' && current.gate) return 0
  return (index.value / (steps.value.length - 1)) * 100
})
const answeredCount = computed(
  () => questionSteps.value.filter((item) => isAnswered(item.question, answerOf(item.question))).length,
)
const total = computed(() => countQuestions(props.poll))
const minutes = computed(() => Math.max(1, Math.round((total.value * POLLS_SECONDS_PER_QUESTION) / 60)))
/** Lo que falta desde esta pantalla: no choca con el conteo del documento que muestra la portada. */
const remainingLabel = computed(() => {
  const left = steps.value.slice(index.value).filter(isCounted).length
  return copy.stepRemaining(Math.ceil((left * POLLS_SECONDS_PER_QUESTION) / 60))
})
const isGate = computed(() => step.value.type === 'question' && Boolean(step.value.gate))
const activeQuestion = computed<PollQuestion | undefined>(() =>
  step.value.type === 'question' ? step.value.question : undefined,
)
const sectionLabel = computed(() => {
  if (isGate.value) return copy.stepGateLabel
  return step.value.type === 'question' ? step.value.section : undefined
})
const hasGate = computed(() => steps.value.some((item) => item.type === 'question' && item.gate))
const filteredOut = computed(() => hasGate.value && questionSteps.value.length === 0)
const introSeen = ref(false)
const intro = ref<InstanceType<typeof PollIntro> | null>(null)
const sectionIndex = computed(
  () => steps.value.slice(0, index.value + 1).filter((item) => item.type === 'section').length,
)
const photo = computed(() => POLLS_STAGE.photos[sectionIndex.value % POLLS_STAGE.photos.length]!)
const pose = computed(() => POLLS_STAGE.poses[sectionIndex.value % POLLS_STAGE.poses.length]!)

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

function commit(target: number) {
  const next = steps.value[target]
  if (!next) return
  direction.value = target >= index.value ? 1 : -1
  lastIndex.value = target
  currentKey.value = next.key
}

/** Pantalla completa con obturador: no en la tarjeta del listado ni con movimiento reducido. */
function cinematic(): boolean {
  return !props.compact && !prefersReducedMotion() && Boolean(iris.value)
}

function reach(x: number, y: number): number {
  return Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y)) + 40
}

function closeOrigin(): { x: number; y: number } {
  if (point) return point
  const button = root.value?.querySelector('.poll-stepper__nav--dock > :last-child, .poll-stepper__hero .btn-primary--hero')
  const box = button?.getBoundingClientRect()
  return box ? { x: box.left + box.width / 2, y: box.top + box.height / 2 } : { x: window.innerWidth / 2, y: window.innerHeight / 2 }
}

/** El iris se cierra hacia donde tocó; `instant` cuando la pantalla ya quedó negra (salida de la portada). */
function irisClose(instant = false): Promise<void> {
  const el = iris.value
  if (!el) return Promise.resolve()
  const { x, y } = closeOrigin()
  point = null
  gsap.killTweensOf(el)
  gsap.set(el, { '--x': `${x}px`, '--y': `${y}px`, '--r': instant ? '0px' : `${reach(x, y)}px`, autoAlpha: 1 })
  if (instant) return Promise.resolve()
  return new Promise((resolve) => {
    gsap.to(el, {
      '--r': '0px',
      duration: 0.28,
      ease: 'power3.in',
      onComplete: () => resolve(),
      onInterrupt: () => resolve(),
    })
  })
}

/** Se abre en el centro de lo que quedó a la vista. */
function irisOpen(): Promise<void> {
  const el = iris.value
  if (!el) return Promise.resolve()
  const box = stage.value?.getBoundingClientRect()
  const x = box ? box.left + box.width / 2 : window.innerWidth / 2
  const top = box ? Math.max(box.top, 0) : 0
  const bottom = box ? Math.min(box.bottom, window.innerHeight) : window.innerHeight
  const y = bottom > top ? (top + bottom) / 2 : window.innerHeight / 2
  gsap.set(el, { '--x': `${x}px`, '--y': `${y}px`, '--r': '0px', autoAlpha: 1 })
  return new Promise((resolve) => {
    gsap.to(el, {
      '--r': `${reach(x, y)}px`,
      duration: 0.48,
      ease: 'power3.out',
      onComplete: () => {
        gsap.set(el, { autoAlpha: 0 })
        resolve()
      },
      onInterrupt: () => resolve(),
    })
  })
}

/** Lo que se pidió mientras corría el obturador: se cumple al terminar, gana el último pedido. */
let pendingKey: string | null = null
let leavingIntro = false

async function goTo(target: number, fromBlack = false) {
  const destination = steps.value[target]
  if (!destination) return
  if (moving) {
    pendingKey = destination.key
    return
  }
  if (!cinematic()) {
    commit(target)
    return
  }
  moving = true
  try {
    await irisClose(fromBlack)
    commit(target)
    await nextTick()
    await irisOpen()
  } finally {
    moving = false
  }
  flushPending()
}

function flushPending() {
  const key = pendingKey
  pendingKey = null
  if (!key || key === currentKey.value) return
  const target = steps.value.findIndex((item) => item.key === key)
  if (target >= 0) void goTo(target)
}

function onPointerDown(event: PointerEvent) {
  point = { x: event.clientX, y: event.clientY }
}

async function next() {
  window.clearTimeout(advanceTimer)
  if (finale.value || leavingIntro) return
  if (step.value.type === 'submit') {
    if (!moving) void submit()
    return
  }
  if (step.value.type === 'intro') {
    leavingIntro = true
    try {
      if (intro.value) await intro.value.leave()
    } finally {
      leavingIntro = false
    }
    introSeen.value = true
    startedAt = Date.now()
    if (step.value.type === 'intro') void goTo(index.value + 1, true)
    return
  }
  if (!canAdvance.value) {
    nudge.value = true
    return
  }
  goTo(index.value + 1)
}

/** Las pantallas de sección solo se ven de ida; al volver se saltan. */
function back() {
  window.clearTimeout(advanceTimer)
  let target = index.value - 1
  while (target > 0 && steps.value[target]?.type === 'section') target -= 1
  goTo(target)
}

function onIntroStart() {
  introSeen.value = true
  startedAt = Date.now()
  if (step.value.type === 'intro') void goTo(index.value + 1, true)
}

function onSectionDone(key: string) {
  if (currentKey.value === key) goTo(index.value + 1)
}

function onAdvance() {
  companion.value?.snap()
  window.clearTimeout(advanceTimer)
  const key = currentKey.value
  advanceTimer = window.setTimeout(() => {
    if (currentKey.value === key && canAdvance.value) goTo(index.value + 1)
  }, POLLS_AUTO_ADVANCE_MS)
}

async function submit() {
  if (sending.value || finale.value) return
  sending.value = true
  const result = await props.module.submit(props.poll, ballot.value, signedIn)
  sending.value = false
  if (!result.ok) {
    showToast(result.error.message || copy.voteFail, 'bad')
    return
  }
  props.module.drafts.clear(props.poll.id)
  if (props.compact) {
    showToast(copy.voted, 'ok')
    emit('voted', result.value)
    return
  }
  const scene = {
    answered: answeredCount.value,
    total: questionSteps.value.length,
    elapsed: Date.now() - startedAt,
    poll: result.value,
  }
  if (!cinematic()) {
    finale.value = scene
    return
  }
  moving = true
  await irisClose()
  finale.value = scene
  await nextTick()
  window.scrollTo({ top: Math.max(0, window.scrollY + (root.value?.getBoundingClientRect().top ?? 0) - SCROLL_OFFSET) })
  await irisOpen()
  moving = false
}

function showResults() {
  if (finale.value) emit('voted', finale.value.poll)
}

function isTyping(target: EventTarget | null): boolean {
  const element = target as HTMLElement | null
  if (!element) return false
  return element.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(element.tagName)
}

function onKeydown(event: KeyboardEvent) {
  if (finale.value || event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return
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
  const top = root.value?.getBoundingClientRect().top ?? 0
  const film = cinematic()
  if (top < 0 || (!props.compact && top > window.innerHeight * 0.4)) {
    window.scrollTo({
      top: Math.max(0, window.scrollY + top - SCROLL_OFFSET),
      behavior: prefersReducedMotion() || film ? 'auto' : 'smooth',
    })
  }
  if (step.value.type === 'section' || !stage.value || prefersReducedMotion()) return
  if (step.value.type === 'intro' && !props.compact) return
  if (film) {
    const q = gsap.utils.selector(stage.value)
    gsap.fromTo(
      q('.poll-stepper__corner'),
      { scale: 1.35, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.5, stagger: 0.05, ease: 'back.out(2.2)', delay: 0.12 },
    )
    gsap.from(q('.poll-stepper__q, .poll-stepper__q ~ *, .poll-stepper__hero-copy > *'), {
      y: 18,
      opacity: 0,
      duration: 0.5,
      stagger: 0.07,
      delay: 0.15,
      ease: MOTION.ease.enter,
      clearProps: 'transform,opacity',
    })
    return
  }
  /* Sin transform residual: la portada usa capas fijas a toda la pantalla. */
  gsap.fromTo(
    stage.value,
    { x: direction.value * (props.compact ? 24 : 40), opacity: 0 },
    { x: 0, opacity: 1, duration: MOTION.duration.reveal, ease: MOTION.ease.enter, clearProps: 'transform' },
  )
})

function onLocalKeydown(event: KeyboardEvent) {
  if (props.compact) onKeydown(event)
}

onMounted(() => {
  if (!props.compact) window.addEventListener('keydown', onKeydown)
})
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  window.clearTimeout(advanceTimer)
})
</script>

<template>
  <section
    ref="root"
    class="poll-stepper"
    :class="[finale ? 'poll-stepper--finale' : `poll-stepper--${step.type}`, { 'poll-stepper--compact': compact }]"
    :aria-label="poll.title"
    @keydown="onLocalKeydown"
    @pointerdown="onPointerDown"
  >
    <div v-if="!compact" class="poll-stepper__backdrop" aria-hidden="true">
      <Transition name="poll-photo">
        <span :key="photo" class="poll-stepper__photo" :style="{ backgroundImage: `url('${photo}')` }" />
      </Transition>
      <span class="poll-stepper__veil" />
    </div>

    <header v-if="step.type !== 'intro' && !finale" class="poll-stepper__bar">
      <div class="poll-stepper__meta">
        <span class="poll-stepper__section">
          <span v-if="!compact" class="poll-stepper__rec" aria-hidden="true" />
          {{ sectionLabel ?? poll.title }}
        </span>
        <span v-if="step.type === 'question' && !isGate" class="poll-stepper__count">{{ remainingLabel }}</span>
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

    <div class="poll-stepper__body">
    <div ref="stage" class="poll-stepper__stage">
      <span
        v-if="!compact && !finale && (step.type === 'question' || step.type === 'submit')"
        class="poll-stepper__finder"
        aria-hidden="true"
      >
        <span class="poll-stepper__corner poll-stepper__corner--tl" />
        <span class="poll-stepper__corner poll-stepper__corner--tr" />
        <span class="poll-stepper__corner poll-stepper__corner--bl" />
        <span class="poll-stepper__corner poll-stepper__corner--br" />
      </span>

      <!-- Cierre -->
      <PollFinale
        v-if="finale"
        :poll-title="poll.title"
        :answered="finale.answered"
        :total="finale.total"
        :elapsed="finale.elapsed"
        :has-results="Boolean(finale.poll.results)"
        @results="showResults"
      />

      <!-- Portada -->
      <PollIntro
        v-else-if="step.type === 'intro' && !compact"
        ref="intro"
        :title="poll.title"
        :description="poll.description"
        :total="total"
        :minutes="minutes"
        :replay="introSeen"
        @start="onIntroStart"
      />
      <template v-else-if="step.type === 'intro'">
        <p class="poll-stepper__facts">
          <span>{{ total }} {{ copy.stepQuestions }}</span>
          <span>{{ minutes }} {{ copy.stepMinutes }}</span>
        </p>
        <div class="poll-stepper__nav poll-stepper__nav--start">
          <Button @click="next">{{ copy.stepStart }}</Button>
        </div>
        <p class="poll-stepper__hint">{{ copy.stepDraftSaved }}</p>
      </template>

      <!-- Entrada de sección -->
      <PollSectionSplash
        v-else-if="step.type === 'section'"
        :key="step.key"
        :title="step.title"
        :pose="pose"
        @done="onSectionDone(step.key)"
      />

      <!-- Pregunta -->
      <template v-else-if="step.type === 'question'">
        <div class="poll-stepper__q">
          <span v-if="!step.gate && questionNumber(poll, step.question)" class="poll-stepper__num">
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
      <div v-else class="poll-stepper__hero">
        <div class="poll-stepper__hero-copy">
          <p class="poll-stepper__kicker">{{ compact ? copy.kicker : copy.stepSubmitKicker }}</p>
          <h2 ref="heading" class="poll-stepper__title" tabindex="-1">{{ copy.stepSubmitTitle }}</h2>
          <p class="poll-stepper__lead">{{ filteredOut ? copy.stepGateEnd : copy.stepSubmitLead }}</p>
          <p v-if="!filteredOut" class="poll-stepper__facts">
            <span>{{ answeredCount }} {{ copy.stepOf }} {{ questionSteps.length }} {{ copy.stepAnswered }}</span>
          </p>
          <p class="poll-card__note">{{ poll.audience === 'account' ? copy.accountNote : copy.anonymousNote }}</p>
          <div class="poll-stepper__nav poll-stepper__nav--start">
            <Button variant="ghost" @click="back">{{ copy.stepBack }}</Button>
            <Button :variant="compact ? 'primary' : 'hero'" :disabled="sending" @click="submit">
              {{ sending ? copy.sending : copy.voteCta }}
            </Button>
          </div>
        </div>
        <figure v-if="!compact" class="poll-stepper__mascot">
          <div class="poll-stepper__mascot-frame"><Mascot3d /></div>
          <figcaption class="poll-stepper__mascot-line">{{ copy.stageSubmitLine }}</figcaption>
        </figure>
      </div>
    </div>

    <footer v-if="step.type === 'question' && !finale" class="poll-stepper__nav poll-stepper__nav--dock">
      <Button variant="ghost" @click="back">{{ copy.stepBack }}</Button>
      <div class="poll-stepper__dock-mid">
        <p v-if="nudge" class="poll-stepper__nudge" role="status">{{ copy.stepRequired }}</p>
        <p v-else class="poll-stepper__hint poll-stepper__hint--keys">{{ copy.stepKeys }}</p>
        <PollCompanion v-if="!compact" ref="companion" :progress="progress / 100" :beat="index" :boundary="root" />
      </div>
      <Button :variant="isSkip ? 'ghost' : 'primary'" @click="next">{{ isSkip ? copy.stepSkip : copy.stepNext }}</Button>
    </footer>
    </div>
    <span v-if="!compact" ref="iris" class="poll-stepper__iris" aria-hidden="true" />
  </section>
</template>

<style scoped>
/* Alto fijo de pantalla: cada paso se centra en vertical y no salta según su contenido. */
.poll-stepper {
  position: relative;
  isolation: isolate;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  gap: 24px;
  min-height: calc(100svh - 220px);
  padding-bottom: 32px;
  overflow-x: clip;
}
.poll-stepper__bar {
  grid-row: 1;
}
.poll-stepper__body {
  grid-row: 2;
  align-self: center;
  display: grid;
  gap: 16px;
  min-width: 0;
}
@media (max-width: 959px) {
  .poll-stepper {
    min-height: calc(100svh - 280px);
    padding-bottom: 16px;
  }
}

.poll-stepper__backdrop {
  position: fixed;
  inset: 0;
  z-index: -1;
  overflow: hidden;
  pointer-events: none;
}
.poll-stepper__photo {
  position: absolute;
  inset: -4%;
  background: center 40% / cover no-repeat;
  filter: saturate(0.85) brightness(0.45) blur(1px);
  animation: poll-kenburns 26s ease-in-out infinite alternate;
}
.poll-stepper__veil {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at 80% 10%, rgba(0, 136, 248, 0.28), transparent 55%),
    radial-gradient(ellipse at 10% 90%, rgba(72, 180, 252, 0.16), transparent 50%),
    linear-gradient(180deg, rgba(5, 7, 12, 0.72) 0%, rgba(5, 7, 12, 0.86) 45%, #05070c 100%);
}
.poll-stepper--question .poll-stepper__veil {
  background:
    radial-gradient(ellipse at 80% 10%, rgba(0, 136, 248, 0.2), transparent 55%),
    linear-gradient(180deg, rgba(5, 7, 12, 0.84) 0%, rgba(5, 7, 12, 0.93) 50%, #05070c 100%);
}
.poll-photo-enter-active,
.poll-photo-leave-active {
  transition: opacity 900ms ease;
}
.poll-photo-enter-from,
.poll-photo-leave-to {
  opacity: 0;
}
@keyframes poll-kenburns {
  from { transform: scale(1) translate3d(0, 0, 0); }
  to { transform: scale(1.12) translate3d(-2%, -1.5%, 0); }
}

.poll-stepper--submit:not(.poll-stepper--compact) .poll-stepper__stage {
  padding: clamp(20px, 4vw, 36px);
}
.poll-stepper__hero {
  display: grid;
  grid-template-columns: minmax(0, 1.25fr) minmax(220px, 0.75fr);
  gap: clamp(24px, 4vw, 48px);
  align-items: center;
}
.poll-stepper__hero-copy {
  display: grid;
  gap: 20px;
  align-content: start;
}
.poll-stepper__mascot {
  display: grid;
  justify-items: center;
  gap: 12px;
  margin: 0;
}
.poll-stepper__mascot-frame {
  width: min(320px, 100%);
  aspect-ratio: 1;
  border-radius: 46% 54% 42% 58% / 48% 42% 58% 52%;
  overflow: hidden;
  background: radial-gradient(ellipse at 50% 38%, rgba(0, 16, 40, 0.96) 0%, #05070c 74%);
  border: 1px solid rgba(72, 180, 252, 0.35);
  box-shadow:
    0 0 0 6px rgba(5, 7, 12, 0.72),
    0 0 40px rgba(0, 136, 248, 0.45),
    0 0 90px rgba(72, 180, 252, 0.2);
}
.poll-stepper__mascot-line {
  position: relative;
  padding: 8px 14px;
  border-radius: 999px;
  background: rgba(0, 16, 40, 0.85);
  border: 1px solid rgba(72, 180, 252, 0.3);
  font-size: 13px;
  font-weight: 600;
  text-align: center;
}
@media (max-width: 760px) {
  .poll-stepper__hero {
    grid-template-columns: minmax(0, 1fr) 112px;
    gap: 16px;
    align-items: start;
  }
  .poll-stepper__mascot-line {
    display: none;
  }
  .poll-stepper__hero-copy .poll-stepper__lead {
    grid-column: 1 / -1;
  }
}

.poll-stepper--question .poll-stepper__stage {
  padding: clamp(20px, 4vw, 36px);
  border-radius: 20px;
  background: rgba(0, 16, 40, 0.55);
  border: 1px solid rgba(72, 180, 252, 0.18);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(10px);
}
@media (prefers-reduced-motion: reduce) {
  .poll-stepper__photo {
    animation: none;
  }
}

.poll-stepper--compact {
  gap: 16px;
  min-height: 0;
  padding-bottom: 0;
  overflow: hidden;
}
.poll-stepper--compact .poll-stepper__body {
  align-self: start;
}
.poll-stepper--compact .poll-stepper__bar {
  position: static;
  padding: 0;
  background: none;
}
.poll-stepper--compact .poll-stepper__hero {
  grid-template-columns: 1fr;
}
.poll-stepper--compact .poll-stepper__title {
  font-size: clamp(24px, 4vw, 32px);
}
.poll-stepper--compact .poll-stepper__prompt {
  font-size: clamp(18px, 2.6vw, 22px);
}
.poll-stepper--compact .poll-stepper__num {
  min-width: 40px;
  height: 40px;
  font-size: 18px;
}
.poll-stepper--compact.poll-stepper--question .poll-stepper__stage {
  padding: 0;
  background: none;
  border: 0;
  box-shadow: none;
  backdrop-filter: none;
}
.poll-stepper--compact .poll-stepper__hint--keys {
  display: none;
}
.poll-stepper__bar {
  position: sticky;
  top: 72px;
  z-index: 2;
  display: grid;
  gap: 8px;
  padding: 12px 0;
  background: linear-gradient(180deg, rgba(5, 7, 12, 0.7) 60%, transparent);
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
  position: relative;
  display: grid;
  gap: 20px;
  align-content: start;
}

/* Obturador entre pantallas: agujero que se cierra y se abre, con borde cian de lente. */
.poll-stepper__iris {
  --x: 50vw;
  --y: 50vh;
  --r: 0px;
  position: fixed;
  inset: 0;
  z-index: 39;
  visibility: hidden;
  opacity: 0;
  pointer-events: none;
  background: radial-gradient(
    circle at var(--x) var(--y),
    transparent var(--r),
    rgba(72, 180, 252, 0.9) calc(var(--r) + 1px),
    rgba(0, 16, 40, 0.98) calc(var(--r) + 6px),
    #05070c calc(var(--r) + 70px)
  );
}

/* Visor que enfoca cada pregunta */
.poll-stepper__finder {
  position: absolute;
  inset: 8px;
  z-index: 1;
  pointer-events: none;
}
.poll-stepper__corner {
  position: absolute;
  width: 22px;
  aspect-ratio: 1;
  border: 0 solid rgba(72, 180, 252, 0.85);
  filter: drop-shadow(0 0 6px rgba(72, 180, 252, 0.6));
}
.poll-stepper__corner--tl { top: 0; left: 0; border-top-width: 2px; border-left-width: 2px; border-top-left-radius: 10px; }
.poll-stepper__corner--tr { top: 0; right: 0; border-top-width: 2px; border-right-width: 2px; border-top-right-radius: 10px; }
.poll-stepper__corner--bl { bottom: 0; left: 0; border-bottom-width: 2px; border-left-width: 2px; border-bottom-left-radius: 10px; }
.poll-stepper__corner--br { bottom: 0; right: 0; border-bottom-width: 2px; border-right-width: 2px; border-bottom-right-radius: 10px; }
.poll-stepper__section {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.poll-stepper__rec {
  flex: none;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ff3b3b;
  box-shadow: 0 0 8px #ff3b3b;
  animation: poll-stepper-rec 1.2s steps(2, jump-none) infinite;
}
@keyframes poll-stepper-rec {
  50% { opacity: 0.15; }
}
@media (prefers-reduced-motion: reduce) {
  .poll-stepper__rec {
    animation: none;
  }
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
/* Atrás / Siguiente siempre a mano: se pega abajo aunque la pregunta sea larga. */
.poll-stepper__nav--dock {
  position: sticky;
  bottom: 0;
  z-index: 3;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  margin-inline: -8px;
  padding: 16px 8px;
  border-top: 0;
  background: linear-gradient(180deg, rgba(5, 7, 12, 0) 0%, rgba(5, 7, 12, 0.9) 35%);
}
.poll-stepper__dock-mid {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-width: 0;
}
@media (max-width: 959px) {
  .poll-stepper__nav--dock {
    bottom: calc(64px + env(safe-area-inset-bottom));
    margin-inline: -16px;
    padding: 10px 16px;
    background: #05070c;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: 0 -16px 20px -8px #05070c;
  }
  .poll-stepper__dock-mid .poll-stepper__nudge {
    position: absolute;
    inset: auto 0 100%;
    padding: 8px 16px;
    background: #05070c;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    font-size: 13px;
    text-align: center;
  }
}
.poll-stepper--compact .poll-stepper__nav--dock {
  position: static;
  margin-inline: 0;
  padding: 16px 0 0;
  background: none;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
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
