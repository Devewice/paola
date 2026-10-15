<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { PollsModule } from '@modules/polls/composition.ts'
import { POLLS_COPY, POLLS_DATE_FORMAT, POLLS_LOCALE } from '@modules/polls/constants/copy.ts'
import {
  EMPTY_ANSWER,
  choiceLimit,
  emptyBallot,
  isAnswered,
  moveRank,
  needsTicket,
  toggleChoice,
  type Ballot,
  type BallotAnswer,
  type Poll,
  type PollQuestion,
} from '@modules/polls/domain/entities/Poll.ts'
import PollResults from '@modules/polls/presentation/PollResults.vue'
import { appRodada } from '@shared/http/constants.ts'
import Button from '@ui/Button.vue'
import Chip from '@ui/Chip.vue'
import Textarea from '@ui/Textarea.vue'
import { showToast } from '@ui/toast.ts'

const props = defineProps<{
  module: PollsModule
  poll: Poll
  accountTo: string
  compact?: boolean
}>()

const emit = defineEmits<{ voted: [poll: Poll] }>()

const copy = POLLS_COPY
const current = ref<Poll>(props.poll)
const ballot = ref<Ballot>(emptyBallot(props.poll))
const sending = ref(false)
const dragging = ref<{ questionId: string; index: number } | null>(null)
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

function answerOf(question: PollQuestion): BallotAnswer {
  return ballot.value[question.id] ?? EMPTY_ANSWER
}

function setAnswer(question: PollQuestion, answer: BallotAnswer) {
  ballot.value = { ...ballot.value, [question.id]: answer }
}

function hintOf(question: PollQuestion): string {
  switch (question.kind) {
    case 'single':
      return copy.pickOne
    case 'multiple':
      return question.maxChoices
        ? `${copy.pickUpTo} ${question.maxChoices} ${copy.pickUpToSuffix}`
        : copy.pickMany
    case 'ranking':
      return copy.rankHint
    case 'scale':
      return copy.scaleHint
    case 'text':
      return ''
  }
}

function hasImages(question: PollQuestion): boolean {
  return question.options.some((option) => Boolean(option.imageSrc))
}

function isPicked(question: PollQuestion, optionId: string): boolean {
  return answerOf(question).optionIds.includes(optionId)
}

function isBlocked(question: PollQuestion, optionId: string): boolean {
  return (
    question.kind === 'multiple' &&
    !isPicked(question, optionId) &&
    answerOf(question).optionIds.length >= choiceLimit(question)
  )
}

function pick(question: PollQuestion, optionId: string) {
  setAnswer(question, toggleChoice(question, answerOf(question), optionId))
}

function optionById(question: PollQuestion, optionId: string) {
  return question.options.find((option) => option.id === optionId)
}

function move(question: PollQuestion, from: number, to: number) {
  setAnswer(question, moveRank(answerOf(question), from, to))
}

function onDragStart(question: PollQuestion, index: number, event: DragEvent) {
  dragging.value = { questionId: question.id, index }
  event.dataTransfer?.setData('text/plain', String(index))
  if (event.dataTransfer) event.dataTransfer.effectAllowed = 'move'
}

function onDrop(question: PollQuestion, index: number) {
  const source = dragging.value
  dragging.value = null
  if (!source || source.questionId !== question.id) return
  move(question, source.index, index)
}

function scaleValues(question: PollQuestion): number[] {
  const min = question.scaleMin ?? 1
  const max = question.scaleMax ?? 5
  return Array.from({ length: max - min + 1 }, (_, index) => min + index)
}

function setScale(question: PollQuestion, value: number) {
  setAnswer(question, { ...answerOf(question), value })
}

function setText(question: PollQuestion, text: string) {
  setAnswer(question, { ...answerOf(question), text })
}

async function submit() {
  sending.value = true
  const result = await props.module.submit(current.value, ballot.value, signedIn)
  sending.value = false
  if (!result.ok) {
    showToast(result.error.message || copy.voteFail, 'bad')
    return
  }
  current.value = result.value
  showToast(copy.voted, 'ok')
  emit('voted', result.value)
}
</script>

<template>
  <article class="poll-card" :class="{ 'poll-card--compact': compact }">
    <header class="poll-card__head">
      <div class="poll-card__chips">
        <Chip :tone="current.isOpen ? 'abierto' : 'cerrado'">{{ copy.kicker }}</Chip>
        <span v-if="responsesLabel" class="poll-card__votes">{{ responsesLabel }}</span>
      </div>
      <h3 class="poll-card__title">{{ current.title }}</h3>
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

    <form v-else class="poll-card__form" @submit.prevent="submit">
      <fieldset v-for="(question, qIndex) in current.questions" :key="question.id" class="poll-q">
        <legend class="poll-q__legend">
          <span class="poll-q__num">{{ qIndex + 1 }}</span>
          <span class="poll-q__prompt">{{ question.prompt }}</span>
          <span class="poll-q__req" :class="{ 'is-done': isAnswered(question, answerOf(question)) }">
            {{ question.required ? copy.required : copy.optional }}
          </span>
        </legend>
        <p v-if="question.help" class="poll-q__help">{{ question.help }}</p>
        <p v-if="hintOf(question)" class="poll-q__hint">{{ hintOf(question) }}</p>

        <div
          v-if="question.kind === 'single' || question.kind === 'multiple'"
          class="poll-options"
          :class="{ 'poll-options--media': hasImages(question) }"
          :role="question.kind === 'single' ? 'radiogroup' : 'group'"
        >
          <button
            v-for="option in question.options"
            :key="option.id"
            type="button"
            class="poll-option"
            :class="{
              'is-picked': isPicked(question, option.id),
              'is-blocked': isBlocked(question, option.id),
              'poll-option--multi': question.kind === 'multiple',
            }"
            :role="question.kind === 'single' ? 'radio' : 'checkbox'"
            :aria-checked="isPicked(question, option.id)"
            :aria-disabled="isBlocked(question, option.id)"
            @click="pick(question, option.id)"
          >
            <span v-if="option.imageSrc" class="poll-option__media">
              <img :src="option.imageSrc" :alt="option.label" loading="lazy" />
            </span>
            <span class="poll-option__row">
              <span class="poll-option__mark" aria-hidden="true" />
              <span class="poll-option__label">{{ option.label }}</span>
            </span>
          </button>
        </div>

        <ol v-else-if="question.kind === 'ranking'" class="poll-rank">
          <li
            v-for="(optionId, index) in answerOf(question).ranking"
            :key="optionId"
            class="poll-rank__item"
            :class="{ 'is-dragging': dragging?.questionId === question.id && dragging.index === index }"
            draggable="true"
            @dragstart="onDragStart(question, index, $event)"
            @dragover.prevent
            @drop.prevent="onDrop(question, index)"
            @dragend="dragging = null"
          >
            <span class="poll-rank__grip" aria-hidden="true" />
            <span class="poll-rank__pos">{{ index + 1 }}</span>
            <img
              v-if="optionById(question, optionId)?.imageSrc"
              class="poll-rank__thumb"
              :src="optionById(question, optionId)?.imageSrc"
              alt=""
              loading="lazy"
            />
            <span class="poll-rank__label">{{ optionById(question, optionId)?.label }}</span>
            <span class="poll-rank__actions">
              <button
                type="button"
                class="poll-rank__btn"
                :aria-label="`${copy.moveUp}: ${optionById(question, optionId)?.label}`"
                :disabled="index === 0"
                @click="move(question, index, index - 1)"
              >
                <span class="poll-rank__arrow poll-rank__arrow--up" aria-hidden="true" />
              </button>
              <button
                type="button"
                class="poll-rank__btn"
                :aria-label="`${copy.moveDown}: ${optionById(question, optionId)?.label}`"
                :disabled="index === answerOf(question).ranking.length - 1"
                @click="move(question, index, index + 1)"
              >
                <span class="poll-rank__arrow poll-rank__arrow--down" aria-hidden="true" />
              </button>
            </span>
          </li>
        </ol>

        <div v-else-if="question.kind === 'scale'" class="poll-scale">
          <div class="poll-scale__row" role="radiogroup">
            <button
              v-for="value in scaleValues(question)"
              :key="value"
              type="button"
              class="poll-scale__btn"
              :class="{ 'is-picked': answerOf(question).value === value }"
              role="radio"
              :aria-checked="answerOf(question).value === value"
              @click="setScale(question, value)"
            >
              {{ value }}
            </button>
          </div>
          <p v-if="question.scaleMinLabel || question.scaleMaxLabel" class="poll-scale__labels">
            <span>{{ question.scaleMinLabel }}</span>
            <span>{{ question.scaleMaxLabel }}</span>
          </p>
        </div>

        <Textarea
          v-else
          :model-value="answerOf(question).text"
          :placeholder="copy.textPlaceholder"
          @update:model-value="setText(question, $event)"
        />
      </fieldset>

      <footer class="poll-card__foot">
        <p class="poll-card__note">{{ current.audience === 'account' ? copy.accountNote : copy.anonymousNote }}</p>
        <Button type="submit" :disabled="sending">{{ sending ? copy.sending : copy.voteCta }}</Button>
      </footer>
    </form>
  </article>
</template>
