<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { PollsModule } from '@modules/polls/composition.ts'
import { POLLS_COPY, POLLS_DATE_FORMAT, POLLS_INLINE_MAX, POLLS_LOCALE } from '@modules/polls/constants/copy.ts'
import {
  EMPTY_ANSWER,
  emptyBallot,
  isAnswered,
  needsTicket,
  questionNumber,
  visibleQuestions,
  type Ballot,
  type BallotAnswer,
  type Poll,
  type PollQuestion,
} from '@modules/polls/domain/entities/Poll.ts'
import PollQuestionField from '@modules/polls/presentation/PollQuestionField.vue'
import PollResults from '@modules/polls/presentation/PollResults.vue'
import PollStepper from '@modules/polls/presentation/PollStepper.vue'
import { appEncuesta, appRodada } from '@shared/http/constants.ts'
import Button from '@ui/Button.vue'
import Chip from '@ui/Chip.vue'
import { showToast } from '@ui/toast.ts'

const props = defineProps<{
  module: PollsModule
  poll: Poll
  accountTo: string
  compact?: boolean
  /** Vista propia de la encuesta: se responde una pregunta por pantalla. */
  standalone?: boolean
}>()

const emit = defineEmits<{ voted: [poll: Poll] }>()

const copy = POLLS_COPY
const current = ref<Poll>(props.poll)
const ballot = ref<Ballot>(emptyBallot(props.poll))
const sending = ref(false)
const signedIn = props.module.isSignedIn()

watch(
  () => props.poll,
  (poll) => {
    current.value = poll
    ballot.value = emptyBallot(poll)
  },
)

const showResults = computed(() => Boolean(current.value.results) && (current.value.hasVoted || !current.value.isOpen))
const needsAccount = computed(() => current.value.audience === 'account' && !signedIn)
const ticketGate = computed(() => needsTicket(current.value))
const canAnswer = computed(() => !showResults.value && !ticketGate.value && !needsAccount.value && current.value.isOpen)
const stepper = computed(() => props.standalone && canAnswer.value)
const long = computed(() => current.value.questions.length > POLLS_INLINE_MAX)
const responses = computed(() => current.value.results?.responses)
const responsesLabel = computed(() => {
  if (responses.value === undefined) return ''
  return responses.value === 1 ? copy.responsesOne : `${responses.value} ${copy.responsesMany}`
})

const dateFormat = new Intl.DateTimeFormat(POLLS_LOCALE, POLLS_DATE_FORMAT)
const closesLabel = computed(() => {
  if (!current.value.closesAt) return ''
  const date = new Date(current.value.closesAt)
  if (Number.isNaN(date.valueOf())) return ''
  return `${current.value.isOpen ? copy.closesOn : copy.closedOn} ${dateFormat.format(date)}`
})

const resultsLead = computed(() => (current.value.isOpen ? copy.alreadyVoted : copy.closedNote))
const shown = computed(() => visibleQuestions(current.value, ballot.value))

function answerOf(question: PollQuestion): BallotAnswer {
  return ballot.value[question.id] ?? EMPTY_ANSWER
}

function setAnswer(question: PollQuestion, answer: BallotAnswer) {
  ballot.value = { ...ballot.value, [question.id]: answer }
}

function onVoted(poll: Poll) {
  current.value = poll
  emit('voted', poll)
}

async function submit() {
  sending.value = true
  const result = await props.module.submit(current.value, ballot.value, signedIn)
  sending.value = false
  if (!result.ok) {
    showToast(result.error.message || copy.voteFail, 'bad')
    return
  }
  showToast(copy.voted, 'ok')
  onVoted(result.value)
}
</script>

<template>
  <PollStepper v-if="stepper" :module="module" :poll="current" @voted="onVoted" />

  <article
    v-else
    class="poll-card"
    :class="{ 'poll-card--compact': compact && !standalone, 'poll-card--standalone': standalone }"
  >
    <header class="poll-card__head">
      <div class="poll-card__chips">
        <Chip :tone="current.isOpen ? 'abierto' : 'cerrado'">{{ copy.kicker }}</Chip>
        <span v-if="responsesLabel" class="poll-card__votes">{{ responsesLabel }}</span>
      </div>
      <h1 v-if="standalone" class="poll-card__title">{{ current.title }}</h1>
      <h3 v-else class="poll-card__title">
        <RouterLink class="poll-card__link" :to="appEncuesta(current.id)">{{ current.title }}</RouterLink>
      </h3>
      <p v-if="current.description" class="poll-card__lead">{{ current.description }}</p>
      <p v-if="current.outingTitle || closesLabel" class="poll-card__meta">
        <span v-if="current.outingTitle">{{ copy.linkedRide }} {{ current.outingTitle }}</span>
        <span v-if="closesLabel">{{ closesLabel }}</span>
      </p>
    </header>

    <template v-if="showResults && current.results">
      <p class="poll-card__note">{{ resultsLead }}</p>
      <PollResults :questions="current.questions" :results="current.results" />
    </template>

    <div v-else-if="ticketGate" class="poll-card__gate">
      <ol class="poll-card__preview">
        <li v-for="question in current.questions" :key="question.id">{{ question.prompt }}</li>
      </ol>
      <p>{{ copy.ridersOnly }}</p>
      <Button v-if="current.outingId" :to="`${appRodada(current.outingId)}#inscripcion`" size="sm">
        {{ copy.ridersCta }}
      </Button>
    </div>

    <div v-else-if="needsAccount" class="poll-card__gate">
      <p>{{ copy.accountRequired }}</p>
      <Button :to="accountTo" size="sm">{{ copy.accountCta }}</Button>
    </div>

    <PollStepper v-else-if="long" compact :module="module" :poll="current" @voted="onVoted" />

    <form v-else class="poll-card__form" @submit.prevent="submit">
      <template v-for="question in shown" :key="question.id">
        <h4 v-if="question.section" class="poll-section">{{ question.section }}</h4>
        <fieldset class="poll-q">
          <legend class="poll-q__legend">
            <span v-if="questionNumber(current, question)" class="poll-q__num">{{ questionNumber(current, question) }}</span>
            <span class="poll-q__prompt">{{ question.prompt }}</span>
            <span class="poll-q__req" :class="{ 'is-done': isAnswered(question, answerOf(question)) }">
              {{ question.required ? copy.required : copy.optional }}
            </span>
          </legend>
          <p v-if="question.help" class="poll-q__help">{{ question.help }}</p>
          <PollQuestionField
            :question="question"
            :answer="answerOf(question)"
            @update:answer="setAnswer(question, $event)"
          />
        </fieldset>
      </template>

      <footer class="poll-card__foot">
        <p class="poll-card__note">{{ current.audience === 'account' ? copy.accountNote : copy.anonymousNote }}</p>
        <Button type="submit" :disabled="sending">{{ sending ? copy.sending : copy.voteCta }}</Button>
      </footer>
    </form>
  </article>
</template>
