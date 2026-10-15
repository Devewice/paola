<script setup lang="ts">
import { computed } from 'vue'
import { POLLS_ADMIN_COPY, POLLS_COPY } from '@modules/polls/constants/copy.ts'
import type { OptionTally, PollQuestion, PollResults, QuestionResult } from '@modules/polls/domain/entities/Poll.ts'

const props = defineProps<{
  questions: readonly PollQuestion[]
  results: PollResults
  showTexts?: boolean
}>()

const copy = POLLS_COPY

type Row = {
  question: PollQuestion
  result: QuestionResult | undefined
}

const rows = computed<Row[]>(() =>
  props.questions.map((question) => ({
    question,
    result: props.results.questions.find((item) => item.questionId === question.id),
  })),
)

function optionLabel(question: PollQuestion, optionId: string): string {
  return question.options.find((option) => option.id === optionId)?.label ?? ''
}

function optionImage(question: PollQuestion, optionId: string): string | undefined {
  return question.options.find((option) => option.id === optionId)?.imageSrc
}

function answeredLabel(count: number): string {
  return count === 1 ? copy.answeredOne : `${count} ${copy.answeredMany}`
}

function rankMeta(option: OptionTally): string {
  const average = `${copy.averageRankLabel} ${option.averageRank?.toFixed(1) ?? '—'}`
  if (!option.count) return average
  const firsts = option.count === 1 ? copy.firstPlaceOne : `${option.count} ${copy.firstPlaceMany}`
  return `${average} · ${firsts}`
}

function leader(options: readonly OptionTally[]): number {
  return options.reduce((max, option) => Math.max(max, option.count), 0)
}

function maxDistribution(result: QuestionResult): number {
  return (result.distribution ?? []).reduce((max, item) => Math.max(max, item.count), 0)
}

function scaleSpan(question: PollQuestion, average: number): number {
  const min = question.scaleMin ?? 1
  const max = question.scaleMax ?? 5
  return max > min ? ((average - min) / (max - min)) * 100 : 0
}
</script>

<template>
  <div class="poll-results">
    <section v-for="{ question, result } in rows" :key="question.id" class="poll-results__q">
      <header class="poll-results__head">
        <h4 class="poll-results__prompt">{{ question.prompt }}</h4>
        <span v-if="result" class="poll-results__answered">{{ answeredLabel(result.answered) }}</span>
      </header>

      <p v-if="!result || !result.answered" class="poll-results__empty">{{ copy.noVotes }}</p>

      <ol v-else-if="question.kind === 'ranking'" class="poll-results__rank">
        <li
          v-for="(option, index) in result.options"
          :key="option.optionId"
          class="poll-results__rank-item"
          :class="{ 'is-leader': index === 0 }"
        >
          <span class="poll-results__rank-pos">{{ index + 1 }}</span>
          <img
            v-if="optionImage(question, option.optionId)"
            class="poll-results__thumb"
            :src="optionImage(question, option.optionId)"
            alt=""
            loading="lazy"
          />
          <span class="poll-results__label">{{ optionLabel(question, option.optionId) }}</span>
          <span class="poll-results__meta">{{ rankMeta(option) }}</span>
        </li>
      </ol>

      <div v-else-if="question.kind === 'scale'" class="poll-results__scale">
        <p class="poll-results__average">
          <span class="poll-results__average-label">{{ copy.averageLabel }}</span>
          <strong>{{ result.average?.toFixed(1) }}</strong>
          <span class="poll-results__average-range">/ {{ question.scaleMax ?? 5 }}</span>
        </p>
        <div class="poll-results__gauge" aria-hidden="true">
          <span :style="{ width: `${scaleSpan(question, result.average ?? 0)}%` }" />
        </div>
        <ul class="poll-results__dist">
          <li v-for="item in result.distribution ?? []" :key="item.value">
            <span
              class="poll-results__dist-bar"
              :style="{ height: `${maxDistribution(result) ? (item.count / maxDistribution(result)) * 100 : 0}%` }"
            />
            <span class="poll-results__dist-value">{{ item.value }}</span>
          </li>
        </ul>
        <p v-if="question.scaleMinLabel || question.scaleMaxLabel" class="poll-results__scale-labels">
          <span>{{ question.scaleMinLabel }}</span>
          <span>{{ question.scaleMaxLabel }}</span>
        </p>
      </div>

      <div v-else-if="question.kind === 'text'" class="poll-results__texts">
        <template v-if="showTexts">
          <p v-if="!result.texts?.length" class="poll-results__empty">{{ POLLS_ADMIN_COPY.noTexts }}</p>
          <ul v-else class="poll-results__text-list">
            <li v-for="(text, index) in result.texts" :key="index">{{ text }}</li>
          </ul>
        </template>
        <p v-else class="poll-results__empty">{{ copy.textResultsNote }}</p>
      </div>

      <ul v-else class="poll-results__bars">
        <li
          v-for="option in result.options"
          :key="option.optionId"
          class="poll-results__bar"
          :class="{ 'is-leader': option.count > 0 && option.count === leader(result.options) }"
        >
          <img
            v-if="optionImage(question, option.optionId)"
            class="poll-results__thumb"
            :src="optionImage(question, option.optionId)"
            alt=""
            loading="lazy"
          />
          <div class="poll-results__bar-body">
            <div class="poll-results__bar-row">
              <span class="poll-results__label">{{ optionLabel(question, option.optionId) }}</span>
              <span class="poll-results__percent">{{ Math.round(option.percent) }}%</span>
            </div>
            <div class="poll-results__track" aria-hidden="true">
              <span :style="{ width: `${option.percent}%` }" />
            </div>
          </div>
        </li>
      </ul>
    </section>
  </div>
</template>
