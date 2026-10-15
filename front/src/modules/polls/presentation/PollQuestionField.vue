<script setup lang="ts">
import gsap from 'gsap'
import { computed, nextTick, ref, watch } from 'vue'
import { POLLS_COPY, POLLS_LIMITS } from '@modules/polls/constants/copy.ts'
import {
  choiceLimit,
  moveRank,
  needsOtherText,
  pickCell,
  resolveDisplay,
  rowsOf,
  toggleChoice,
  type BallotAnswer,
  type PollQuestion,
} from '@modules/polls/domain/entities/Poll.ts'
import ScaleTrack from '@modules/polls/presentation/ScaleTrack.vue'
import { MOTION } from '@shared/motion/tokens.ts'
import { prefersReducedMotion } from '@shared/motion/prefersReducedMotion.ts'
import Input from '@ui/Input.vue'
import Textarea from '@ui/Textarea.vue'

const props = defineProps<{
  question: PollQuestion
  answer: BallotAnswer
  /** Pantalla completa del recorrido: controles más grandes y baraja animada. */
  step?: boolean
}>()

const emit = defineEmits<{
  'update:answer': [answer: BallotAnswer]
  /** La respuesta quedó completa y se puede pasar a la siguiente pantalla. */
  advance: []
}>()

const copy = POLLS_COPY
const display = computed(() => resolveDisplay(props.question))
const rows = computed(() => rowsOf(props.question))
const columns = computed(() => props.question.options.map((option) => ({ id: option.id, label: option.label })))
const shaking = ref<string | null>(null)
const limitHit = ref(false)
const dragging = ref<number | null>(null)
const otherInput = ref<HTMLElement | null>(null)
const card = ref<HTMLElement | null>(null)
const rowIndex = ref(firstOpenRow())

watch(
  () => props.question.id,
  () => {
    rowIndex.value = firstOpenRow()
    limitHit.value = false
  },
)

function firstOpenRow(): number {
  const index = rowsOf(props.question).findIndex((row) => !props.answer.grid[row.id])
  return index < 0 ? 0 : index
}

function update(answer: BallotAnswer) {
  emit('update:answer', answer)
}

/* Opciones */

const isMulti = computed(() => props.question.kind === 'multiple')
const limit = computed(() => choiceLimit(props.question))
const hasLimit = computed(() => isMulti.value && limit.value < props.question.options.length)
const counter = computed(() => {
  const chosen = props.answer.optionIds.length
  return hasLimit.value ? `${chosen} ${copy.counterOf} ${limit.value}` : `${chosen} ${copy.counterChosen}`
})
const otherPicked = computed(() =>
  props.question.options.some((option) => option.isOther && props.answer.optionIds.includes(option.id)),
)

function isPicked(optionId: string): boolean {
  return props.answer.optionIds.includes(optionId)
}

function pick(optionId: string) {
  const next = toggleChoice(props.question, props.answer, optionId)
  if (next === props.answer) {
    shaking.value = optionId
    limitHit.value = true
    window.setTimeout(() => {
      if (shaking.value === optionId) shaking.value = null
    }, 420)
    return
  }
  limitHit.value = false
  update(next)
  const option = props.question.options.find((item) => item.id === optionId)
  if (option?.isOther && next.optionIds.includes(optionId)) {
    void nextTick(() => otherInput.value?.querySelector('input')?.focus())
    return
  }
  if (props.question.kind === 'single') emit('advance')
}

function setOther(otherText: string) {
  update({ ...props.answer, otherText })
}

/* Cuadrícula */

function cellOf(rowId: string): string | null {
  return props.answer.grid[rowId] ?? null
}

function animateCard(direction: number) {
  if (!props.step || !card.value || prefersReducedMotion()) return
  gsap.fromTo(
    card.value,
    { x: direction * 48, opacity: 0, rotate: direction * 2 },
    { x: 0, opacity: 1, rotate: 0, duration: MOTION.duration.reveal, ease: MOTION.ease.enter },
  )
}

function goToRow(index: number) {
  if (index === rowIndex.value || index < 0 || index >= rows.value.length) return
  const direction = index > rowIndex.value ? 1 : -1
  rowIndex.value = index
  void nextTick(() => animateCard(direction))
}

function setCell(rowId: string, optionId: string, commit: boolean) {
  const next = pickCell(props.answer, rowId, optionId)
  update(next)
  if (!commit || display.value !== 'deck') return
  window.setTimeout(() => {
    const open = rows.value.findIndex((row) => !next.grid[row.id])
    if (open < 0) emit('advance')
    else goToRow(open)
  }, 260)
}

const currentRow = computed(() => rows.value[rowIndex.value])
const answeredRows = computed(() => rows.value.filter((row) => props.answer.grid[row.id]).length)

/* Escala */

const scaleStops = computed(() => {
  const min = props.question.scaleMin ?? 1
  const max = props.question.scaleMax ?? 5
  return Array.from({ length: max - min + 1 }, (_, index) => ({ id: String(min + index), label: String(min + index) }))
})

function setScale(id: string, commit: boolean) {
  update({ ...props.answer, value: Number(id) })
  if (commit) emit('advance')
}

/* Ordenar */

function optionById(optionId: string) {
  return props.question.options.find((option) => option.id === optionId)
}

function move(from: number, to: number) {
  update(moveRank(props.answer, from, to))
}

function onDrop(index: number) {
  if (dragging.value !== null) move(dragging.value, index)
  dragging.value = null
}

/** Atajo de teclado: la opción, el punto de la escala o la columna de la fila en curso. */
function pickIndex(index: number): boolean {
  const kind = props.question.kind
  if (kind === 'single' || kind === 'multiple') {
    const option = props.question.options[index]
    if (!option) return false
    pick(option.id)
    return true
  }
  if (kind === 'scale') {
    const stop = scaleStops.value[index]
    if (!stop) return false
    setScale(stop.id, true)
    return true
  }
  if (kind === 'grid' && display.value === 'deck' && currentRow.value) {
    const option = props.question.options[index]
    if (!option) return false
    setCell(currentRow.value.id, option.id, true)
    return true
  }
  return false
}

defineExpose({ pickIndex })
</script>

<template>
  <div class="poll-field" :class="[`poll-field--${display}`, { 'poll-field--step': step }]">
    <!-- Una o varias opciones -->
    <template v-if="question.kind === 'single' || question.kind === 'multiple'">
      <div v-if="isMulti" class="poll-field__counter" :class="{ 'is-full': hasLimit && answer.optionIds.length >= limit }">
        <span class="poll-field__counter-dots" aria-hidden="true">
          <span v-for="index in hasLimit ? limit : 0" :key="index" :class="{ 'is-on': index <= answer.optionIds.length }" />
        </span>
        <span aria-live="polite">{{ counter }}</span>
      </div>

      <div
        class="poll-field__options"
        :role="question.kind === 'single' ? 'radiogroup' : 'group'"
        :aria-label="question.prompt"
      >
        <button
          v-for="(option, index) in question.options"
          :key="option.id"
          type="button"
          class="poll-field__option"
          :class="{
            'is-picked': isPicked(option.id),
            'is-shaking': shaking === option.id,
            'is-exclusive': option.exclusive,
            'is-multi': isMulti,
          }"
          :role="question.kind === 'single' ? 'radio' : 'checkbox'"
          :aria-checked="isPicked(option.id)"
          @click="pick(option.id)"
        >
          <img v-if="option.imageSrc" class="poll-field__media" :src="option.imageSrc" :alt="option.label" loading="lazy" />
          <span v-if="display !== 'chips'" class="poll-field__mark" aria-hidden="true" />
          <span class="poll-field__label">{{ option.label }}</span>
          <span v-if="step && index < 9" class="poll-field__key" aria-hidden="true">{{ index + 1 }}</span>
        </button>
      </div>

      <p v-if="limitHit" class="poll-field__note" role="status">{{ copy.limitReached }}</p>

      <div v-if="otherPicked" ref="otherInput" class="poll-field__other">
        <Input
          :model-value="answer.otherText"
          :placeholder="copy.otherPlaceholder"
          :aria-label="copy.otherPlaceholder"
          @update:model-value="setOther"
        />
        <p v-if="needsOtherText(question, answer)" class="poll-field__note">{{ copy.otherMissing }}</p>
      </div>
    </template>

    <!-- Cuadrícula como baraja: una afirmación a la vez -->
    <template v-else-if="question.kind === 'grid' && display === 'deck'">
      <div class="poll-deck">
        <div class="poll-deck__dots" role="tablist" :aria-label="copy.deckProgress">
          <button
            v-for="(row, index) in rows"
            :key="row.id"
            type="button"
            role="tab"
            class="poll-deck__dot"
            :class="{ 'is-done': Boolean(answer.grid[row.id]), 'is-current': index === rowIndex }"
            :aria-selected="index === rowIndex"
            :aria-label="`${row.code ?? index + 1}. ${row.label}`"
            @click="goToRow(index)"
          >
            {{ row.code ?? index + 1 }}
          </button>
        </div>

        <div v-if="currentRow" class="poll-deck__stack">
          <span v-if="rows.length - rowIndex > 2" class="poll-deck__ghost poll-deck__ghost--2" aria-hidden="true" />
          <span v-if="rows.length - rowIndex > 1" class="poll-deck__ghost" aria-hidden="true" />
          <article ref="card" :key="currentRow.id" class="poll-deck__card">
            <p class="poll-deck__count">{{ answeredRows }} / {{ rows.length }}</p>
            <h4 class="poll-deck__statement">
              <span v-if="currentRow.code" class="poll-deck__code">{{ currentRow.code }}.</span>
              {{ currentRow.label }}
            </h4>
            <ScaleTrack
              :stops="columns"
              :model-value="cellOf(currentRow.id)"
              :tone="question.tone ?? 'track'"
              :label="currentRow.label"
              @update:model-value="setCell(currentRow.id, $event, false)"
              @committed="setCell(currentRow.id, $event, true)"
            />
          </article>
        </div>
      </div>
    </template>

    <!-- Cuadrícula como tabla -->
    <div
      v-else-if="question.kind === 'grid'"
      class="poll-grid"
      :style="{ '--poll-grid-cols': question.options.length }"
    >
      <div class="poll-grid__head" aria-hidden="true">
        <span />
        <span v-for="option in question.options" :key="option.id">{{ option.label }}</span>
      </div>
      <div
        v-for="row in rows"
        :key="row.id"
        class="poll-grid__row"
        :class="{ 'is-done': Boolean(answer.grid[row.id]) }"
        role="radiogroup"
        :aria-label="row.label"
      >
        <span class="poll-grid__label">
          <strong v-if="row.code">{{ row.code }}.</strong>
          {{ row.label }}
        </span>
        <button
          v-for="option in question.options"
          :key="option.id"
          type="button"
          class="poll-grid__cell"
          :class="{ 'is-picked': cellOf(row.id) === option.id }"
          role="radio"
          :aria-checked="cellOf(row.id) === option.id"
          :aria-label="`${row.label}: ${option.label}`"
          @click="setCell(row.id, option.id, true)"
        >
          <span class="poll-grid__mark" aria-hidden="true" />
          <span class="poll-grid__cell-label">{{ option.label }}</span>
        </button>
      </div>
    </div>

    <!-- Escala -->
    <div v-else-if="question.kind === 'scale'" class="poll-field__scale">
      <ScaleTrack
        :stops="scaleStops"
        :model-value="answer.value === null ? null : String(answer.value)"
        :tone="question.tone ?? 'track'"
        :label="question.prompt"
        @update:model-value="setScale($event, false)"
        @committed="setScale($event, true)"
      />
      <p v-if="question.scaleMinLabel || question.scaleMaxLabel" class="poll-scale__labels">
        <span>{{ question.scaleMinLabel }}</span>
        <span>{{ question.scaleMaxLabel }}</span>
      </p>
    </div>

    <!-- Ordenar -->
    <ol v-else-if="question.kind === 'ranking'" class="poll-rank">
      <li
        v-for="(optionId, index) in answer.ranking"
        :key="optionId"
        class="poll-rank__item"
        :class="{ 'is-dragging': dragging === index }"
        draggable="true"
        @dragstart="dragging = index"
        @dragover.prevent
        @drop.prevent="onDrop(index)"
        @dragend="dragging = null"
      >
        <span class="poll-rank__grip" aria-hidden="true" />
        <span class="poll-rank__pos">{{ index + 1 }}</span>
        <img
          v-if="optionById(optionId)?.imageSrc"
          class="poll-rank__thumb"
          :src="optionById(optionId)?.imageSrc"
          alt=""
          loading="lazy"
        />
        <span class="poll-rank__label">{{ optionById(optionId)?.label }}</span>
        <span class="poll-rank__actions">
          <button
            type="button"
            class="poll-rank__btn"
            :aria-label="`${copy.moveUp}: ${optionById(optionId)?.label}`"
            :disabled="index === 0"
            @click="move(index, index - 1)"
          >
            <span class="poll-rank__arrow poll-rank__arrow--up" aria-hidden="true" />
          </button>
          <button
            type="button"
            class="poll-rank__btn"
            :aria-label="`${copy.moveDown}: ${optionById(optionId)?.label}`"
            :disabled="index === answer.ranking.length - 1"
            @click="move(index, index + 1)"
          >
            <span class="poll-rank__arrow poll-rank__arrow--down" aria-hidden="true" />
          </button>
        </span>
      </li>
    </ol>

    <!-- Texto -->
    <div v-else class="poll-field__text">
      <Textarea
        :model-value="answer.text"
        :placeholder="copy.textPlaceholder"
        :maxlength="POLLS_LIMITS.TEXT_MAX"
        @update:model-value="update({ ...answer, text: $event })"
      />
      <p class="poll-field__note poll-field__note--right">{{ answer.text.length }} / {{ POLLS_LIMITS.TEXT_MAX }}</p>
    </div>
  </div>
</template>

<style scoped>
.poll-field {
  display: grid;
  gap: 12px;
  min-width: 0;
}

.poll-field__counter {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  justify-self: start;
  padding: 4px 12px;
  border-radius: 999px;
  background: rgba(0, 136, 248, 0.12);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--cyan, #48b4fc);
  transition: background 180ms ease;
}
.poll-field__counter.is-full {
  background: var(--blue, #0088f8);
  color: var(--white, #eaf2ff);
}
.poll-field__counter-dots {
  display: inline-flex;
  gap: 4px;
}
.poll-field__counter-dots span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: 1.5px solid currentColor;
  transition: background 180ms ease;
}
.poll-field__counter-dots span.is-on {
  background: currentColor;
}

.poll-field__options {
  display: grid;
  gap: 8px;
}
.poll-field--chips .poll-field__options {
  display: flex;
  flex-wrap: wrap;
}
.poll-field--cards.poll-field--step .poll-field__options {
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 15rem), 1fr));
}

.poll-field__option {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 48px;
  padding: 10px 16px;
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  background: rgba(5, 7, 12, 0.5);
  color: var(--white, #eaf2ff);
  font: 500 14px/1.35 var(--ui, Montserrat, sans-serif);
  text-align: left;
  cursor: pointer;
  transition: border-color 180ms ease, background 180ms ease, box-shadow 180ms ease, transform 120ms ease;
}
.poll-field__option:hover {
  border-color: rgba(72, 180, 252, 0.5);
}
.poll-field__option:active {
  transform: scale(0.98);
}
.poll-field__option:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px rgba(72, 180, 252, 0.35);
}
.poll-field__option.is-picked {
  border-color: var(--cyan, #48b4fc);
  background: rgba(0, 136, 248, 0.16);
  box-shadow: 0 0 18px rgba(72, 180, 252, 0.2);
}
.poll-field__option.is-exclusive {
  border-style: dashed;
}
.poll-field__option.is-shaking {
  animation: poll-shake 400ms ease;
  border-color: #f2b84b;
}
@keyframes poll-shake {
  20%, 60% { transform: translateX(-6px); }
  40%, 80% { transform: translateX(6px); }
}

.poll-field--chips .poll-field__option {
  min-height: 44px;
  padding: 8px 18px;
  border-radius: 999px;
}
.poll-field--chips.poll-field--step .poll-field__option {
  min-height: 52px;
  padding: 10px 22px;
  font-size: 16px;
}
.poll-field--cards.poll-field--step .poll-field__option {
  min-height: 64px;
}

.poll-field--gate .poll-field__options {
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 12rem), 1fr));
  gap: 16px;
}
.poll-field--gate .poll-field__option {
  justify-content: center;
  min-height: 88px;
  font: 600 22px/1 var(--display, Oswald, sans-serif);
  letter-spacing: 0.04em;
  text-transform: uppercase;
}
.poll-field--gate .poll-field__mark {
  display: none;
}

.poll-field__mark {
  flex: none;
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.35);
  border-radius: 50%;
  transition: border-color 160ms ease, box-shadow 160ms ease, background 160ms ease;
}
.poll-field__option.is-multi .poll-field__mark {
  border-radius: 5px;
}
.poll-field__option.is-picked .poll-field__mark {
  border-color: var(--cyan, #48b4fc);
  box-shadow: inset 0 0 0 4px rgba(5, 7, 12, 0.9), inset 0 0 0 10px var(--blue, #0088f8);
}
.poll-field__option.is-multi.is-picked .poll-field__mark {
  background: var(--blue, #0088f8);
  box-shadow: none;
}
.poll-field__label {
  flex: 1;
  min-width: 0;
  overflow-wrap: anywhere;
}
.poll-field__media {
  width: 56px;
  height: 42px;
  border-radius: 6px;
  object-fit: cover;
}
.poll-field__key {
  display: none;
  flex: none;
  min-width: 22px;
  padding: 2px 6px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 6px;
  font-size: 11px;
  text-align: center;
  color: var(--muted, rgba(234, 242, 255, 0.7));
}
@media (hover: hover) {
  .poll-field__key {
    display: inline-block;
  }
}

.poll-field__note {
  margin: 0;
  font-size: 12px;
  color: #f2b84b;
}
.poll-field__note--right {
  text-align: right;
  color: var(--muted, rgba(234, 242, 255, 0.7));
}
.poll-field__other {
  display: grid;
  gap: 4px;
  animation: poll-rise 220ms ease;
}
@keyframes poll-rise {
  from { opacity: 0; transform: translateY(-6px); }
}

.poll-deck {
  display: grid;
  gap: 16px;
}
.poll-deck__dots {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.poll-deck__dot {
  min-width: 32px;
  height: 32px;
  padding: 0 8px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 999px;
  background: none;
  color: var(--muted, rgba(234, 242, 255, 0.7));
  font: 600 12px/1 var(--ui, Montserrat, sans-serif);
  cursor: pointer;
  transition: background 160ms ease, border-color 160ms ease, color 160ms ease;
}
.poll-deck__dot.is-done {
  border-color: var(--blue, #0088f8);
  background: rgba(0, 136, 248, 0.2);
  color: var(--white, #eaf2ff);
}
.poll-deck__dot.is-current {
  border-color: var(--cyan, #48b4fc);
  box-shadow: 0 0 0 2px rgba(72, 180, 252, 0.3);
  color: var(--white, #eaf2ff);
}
.poll-deck__stack {
  position: relative;
  padding-bottom: 12px;
}
.poll-deck__ghost {
  position: absolute;
  inset: 8px 12px 4px;
  border-radius: 16px;
  background: rgba(0, 16, 40, 0.6);
  border: 1px solid rgba(72, 180, 252, 0.12);
}
.poll-deck__ghost--2 {
  inset: 16px 24px -4px;
  opacity: 0.6;
}
.poll-deck__card {
  position: relative;
  display: grid;
  gap: 20px;
  padding: clamp(20px, 4vw, 32px);
  border-radius: 16px;
  border: 1px solid rgba(72, 180, 252, 0.28);
  background: linear-gradient(160deg, #001028 0%, rgba(5, 7, 12, 0.96) 100%);
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.45);
}
.poll-deck__count {
  margin: 0;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: var(--cyan, #48b4fc);
}
.poll-deck__statement {
  margin: 0;
  font: 500 clamp(18px, 2.6vw, 22px) / 1.35 var(--ui, Montserrat, sans-serif);
}
.poll-deck__code {
  font-family: var(--display, Oswald, sans-serif);
  color: var(--cyan, #48b4fc);
}

.poll-field__text :deep(textarea) {
  min-height: 140px;
}
</style>
