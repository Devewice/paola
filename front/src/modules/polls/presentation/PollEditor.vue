<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import {
  CONDITION_KINDS,
  buildPollDraft,
  emptyOption,
  emptyPollForm,
  emptyQuestion,
  pollToForm,
  type PollForm,
  type QuestionForm,
} from '@modules/polls/application/buildPollDraft.ts'
import type { PollsModule } from '@modules/polls/composition.ts'
import {
  POLLS_ADMIN_COPY,
  POLLS_LIMITS,
  POLL_AUDIENCE_LABELS,
  POLL_DISPLAY_LABELS,
  POLL_KIND_LABELS,
  POLL_STATUS_LABELS,
  POLL_TONE_LABELS,
} from '@modules/polls/constants/copy.ts'
import type { PollDisplay, PollKind, PollStatus, PollTone } from '@modules/polls/domain/entities/Poll.ts'
import type { OperatorPoll } from '@modules/polls/domain/ports/PollsPort.ts'
import Alert from '@ui/Alert.vue'
import Button from '@ui/Button.vue'
import Choice from '@ui/Choice.vue'
import Field from '@ui/Field.vue'
import Input from '@ui/Input.vue'
import Select from '@ui/Select.vue'
import Textarea from '@ui/Textarea.vue'
import { showToast } from '@ui/toast.ts'

const props = defineProps<{
  module: PollsModule
  clave: string
  outings: readonly { value: string; label: string }[]
  /** Sin encuesta, crea una nueva. */
  poll?: OperatorPoll
}>()

const emit = defineEmits<{ saved: []; cancel: [] }>()

const copy = POLLS_ADMIN_COPY
const form = ref<PollForm>(props.poll ? pollToForm(props.poll) : emptyPollForm())
const busy = ref(false)

watch(
  () => props.poll,
  (poll) => {
    form.value = poll ? pollToForm(poll) : emptyPollForm()
  },
)

const responses = computed(() => props.poll?.results.responses ?? 0)

const kindOptions = (Object.keys(POLL_KIND_LABELS) as PollKind[]).map((value) => ({
  value,
  label: POLL_KIND_LABELS[value],
}))
const statusOptions = computed(() =>
  (props.poll ? (['open', 'draft', 'closed'] as PollStatus[]) : (['open', 'draft'] as PollStatus[])).map((value) => ({
    value,
    label: POLL_STATUS_LABELS[value],
  })),
)
const audienceOptions = (['public', 'account'] as const).map((value) => ({ value, label: POLL_AUDIENCE_LABELS[value] }))
const outingOptions = computed(() => [{ value: '', label: copy.outingNone }, ...props.outings])

const modeOptions = [
  { value: 'any', label: copy.conditionAny },
  { value: 'none', label: copy.conditionNone },
]

const DISPLAYS_BY_KIND: Partial<Record<PollKind, PollDisplay[]>> = {
  single: ['auto', 'chips', 'cards', 'gate'],
  multiple: ['auto', 'chips', 'cards'],
  grid: ['auto', 'deck', 'table'],
}
const toneOptions = (Object.keys(POLL_TONE_LABELS) as PollTone[]).map((value) => ({
  value,
  label: POLL_TONE_LABELS[value],
}))

function displayOptions(question: QuestionForm) {
  return (DISPLAYS_BY_KIND[question.kind] ?? []).map((value) => ({ value, label: POLL_DISPLAY_LABELS[value] }))
}

function hasTone(question: QuestionForm): boolean {
  return question.kind === 'scale' || question.kind === 'grid'
}

function setStatus(value: string) {
  form.value.status = value === 'draft' ? 'draft' : value === 'closed' ? 'closed' : 'open'
}

function setDisplay(question: QuestionForm, value: string) {
  question.display = value as PollDisplay
}

function setTone(question: QuestionForm, value: string) {
  question.tone = value as PollTone
}

function setRowCode(question: QuestionForm, index: number, value: string) {
  const codes = [...(question.rowCodes ?? [])]
  while (codes.length <= index) codes.push('')
  codes[index] = value
  question.rowCodes = codes
}

function hasOptions(question: QuestionForm): boolean {
  return ['single', 'multiple', 'ranking', 'grid'].includes(question.kind)
}

function canDependOn(question: QuestionForm): boolean {
  return CONDITION_KINDS.includes(question.kind)
}

function conditionTargets(index: number) {
  return [
    { value: '', label: copy.conditionAlways },
    ...form.value.questions
      .slice(0, index)
      .map((question, position) => ({ question, position }))
      .filter(({ question }) => canDependOn(question))
      .map(({ question, position }) => ({ value: String(position), label: `${position + 1}. ${question.prompt || '—'}` })),
  ]
}

function conditionTarget(question: QuestionForm): QuestionForm | undefined {
  const raw = question.showIfQuestion ?? ''
  return raw ? form.value.questions[Number(raw)] : undefined
}

function setConditionQuestion(question: QuestionForm, value: string) {
  question.showIfQuestion = value
  question.showIfOptions = []
}

function toggleConditionOption(question: QuestionForm, option: number, on: boolean) {
  const current = new Set(question.showIfOptions ?? [])
  if (on) current.add(option)
  else current.delete(option)
  question.showIfOptions = [...current].sort((a, b) => a - b)
}

/** Reubica las condiciones cuando cambian las posiciones de las preguntas. */
function remapConditions(map: (position: number) => number | null) {
  for (const question of form.value.questions) {
    const raw = question.showIfQuestion ?? ''
    if (!raw) continue
    const next = map(Number(raw))
    if (next === null) setConditionQuestion(question, '')
    else question.showIfQuestion = String(next)
  }
}

function addQuestion() {
  if (form.value.questions.length >= POLLS_LIMITS.QUESTIONS_MAX) return
  form.value.questions.push(emptyQuestion())
}

function removeQuestion(index: number) {
  form.value.questions.splice(index, 1)
  remapConditions((position) => (position === index ? null : position > index ? position - 1 : position))
}

function moveQuestion(index: number, delta: number) {
  const target = index + delta
  const list = form.value.questions
  if (target < 0 || target >= list.length) return
  const [item] = list.splice(index, 1)
  if (item) list.splice(target, 0, item)
  remapConditions((position) => (position === index ? target : position === target ? index : position))
  list.forEach((question, position) => {
    if (question.showIfQuestion && Number(question.showIfQuestion) >= position) setConditionQuestion(question, '')
  })
}

function addRow(question: QuestionForm) {
  const rows = question.rows ?? []
  if (rows.length >= POLLS_LIMITS.ROWS_MAX) return
  question.rows = [...rows, '']
  question.rowCodes = [...(question.rowCodes ?? []), '']
  question.rowIds = [...(question.rowIds ?? []), '']
}

function removeRow(question: QuestionForm, index: number) {
  question.rows = (question.rows ?? []).filter((_, position) => position !== index)
  question.rowCodes = (question.rowCodes ?? []).filter((_, position) => position !== index)
  question.rowIds = (question.rowIds ?? []).filter((_, position) => position !== index)
}

function setRow(question: QuestionForm, index: number, value: string) {
  question.rows = (question.rows ?? []).map((row, position) => (position === index ? value : row))
}

function setKind(question: QuestionForm, kind: string) {
  question.kind = kind as PollKind
}

function addOption(question: QuestionForm) {
  if (question.options.length >= POLLS_LIMITS.OPTIONS_MAX) return
  question.options.push(emptyOption())
}

function removeOption(question: QuestionForm, index: number) {
  question.options.splice(index, 1)
}

async function save() {
  const draft = buildPollDraft(form.value)
  if (!draft.ok) {
    showToast(draft.error.message, 'warn')
    return
  }
  busy.value = true
  const result = props.poll
    ? await props.module.edit(props.poll.id, draft.value, props.clave)
    : await props.module.create(draft.value, props.clave)
  busy.value = false
  if (!result.ok) {
    showToast(result.error.message || (props.poll ? copy.updateFail : copy.createFail), 'bad')
    return
  }
  showToast(props.poll ? copy.updateOk : copy.createOk, 'ok')
  if (!props.poll) form.value = emptyPollForm()
  emit('saved')
}
</script>

<template>
  <form class="admin-form poll-editor" @submit.prevent="save">
    <Alert v-if="responses > 0" tone="warn">{{ copy.editWarn(responses) }}</Alert>

    <section class="poll-editor__block">
      <Field :label="copy.fieldTitle">
        <Input v-model="form.title" />
      </Field>
      <Field :label="copy.fieldDescription">
        <Textarea v-model="form.description" />
      </Field>
      <div class="admin-fields">
        <Select
          :model-value="form.audience"
          :label="copy.fieldAudience"
          :options="audienceOptions"
          @update:model-value="form.audience = $event === 'account' ? 'account' : 'public'"
        />
        <Select :model-value="form.status" :label="copy.fieldStatus" :options="statusOptions" @update:model-value="setStatus" />
      </div>
      <div class="admin-fields">
        <Select v-model="form.outingId" :label="copy.fieldOuting" :options="outingOptions" />
        <Field :label="copy.fieldClosesAt">
          <Input v-model="form.closesAt" type="datetime-local" />
        </Field>
      </div>
      <div class="poll-editor__switches">
        <Choice v-model="form.featured" kind="switch" :label="copy.fieldFeatured" />
        <Choice v-model="form.showResults" kind="switch" :label="copy.fieldShowResults" />
      </div>
    </section>

    <section class="poll-editor__questions">
      <h4 class="poll-editor__title">{{ copy.questionsTitle }}</h4>

      <div v-for="(question, qIndex) in form.questions" :key="question.id ?? `new-${qIndex}`" class="poll-editor__q">
        <header class="poll-editor__q-head">
          <span class="poll-editor__q-num">{{ qIndex + 1 }}</span>
          <Select :model-value="question.kind" :options="kindOptions" @update:model-value="setKind(question, $event)" />
          <div class="poll-editor__q-actions">
            <Button size="sm" variant="ghost" :disabled="qIndex === 0" @click="moveQuestion(qIndex, -1)">
              {{ copy.moveUp }}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              :disabled="qIndex === form.questions.length - 1"
              @click="moveQuestion(qIndex, 1)"
            >
              {{ copy.moveDown }}
            </Button>
            <Button size="sm" variant="ghost" :disabled="form.questions.length === 1" @click="removeQuestion(qIndex)">
              {{ copy.removeQuestion }}
            </Button>
          </div>
        </header>

        <Field :label="copy.fieldPrompt">
          <Input v-model="question.prompt" />
        </Field>
        <Field :label="copy.fieldHelp">
          <Input v-model="question.help" />
        </Field>
        <div class="admin-fields">
          <Field :label="copy.fieldSection">
            <Input :model-value="question.section ?? ''" @update:model-value="question.section = $event" />
          </Field>
          <Field :label="copy.fieldCode">
            <Input :model-value="question.code ?? ''" @update:model-value="question.code = $event" />
          </Field>
        </div>
        <div v-if="displayOptions(question).length || hasTone(question)" class="admin-fields">
          <Field v-if="displayOptions(question).length" :label="copy.fieldDisplay">
            <Select
              :model-value="question.display ?? 'auto'"
              :options="displayOptions(question)"
              @update:model-value="setDisplay(question, $event)"
            />
          </Field>
          <Field v-if="hasTone(question)" :label="copy.fieldTone">
            <Select :model-value="question.tone ?? 'plain'" :options="toneOptions" @update:model-value="setTone(question, $event)" />
          </Field>
        </div>
        <Choice v-model="question.required" :label="copy.fieldRequired" />

        <Field v-if="question.kind === 'multiple'" :label="copy.fieldMaxChoices">
          <Input v-model="question.maxChoices" type="number" />
        </Field>

        <div v-if="question.kind === 'scale'" class="admin-fields">
          <Field :label="copy.fieldScaleMin">
            <Input v-model="question.scaleMin" type="number" />
          </Field>
          <Field :label="copy.fieldScaleMax">
            <Input v-model="question.scaleMax" type="number" />
          </Field>
          <Field :label="copy.fieldScaleMinLabel">
            <Input v-model="question.scaleMinLabel" />
          </Field>
          <Field :label="copy.fieldScaleMaxLabel">
            <Input v-model="question.scaleMaxLabel" />
          </Field>
        </div>

        <div v-if="question.kind === 'grid'" class="poll-editor__options">
          <p class="poll-editor__subtitle">{{ copy.rowsTitle }}</p>
          <div v-for="(row, rIndex) in question.rows ?? []" :key="rIndex" class="poll-editor__row">
            <Field :label="copy.rowCode" class="poll-editor__code">
              <Input :model-value="question.rowCodes?.[rIndex] ?? ''" @update:model-value="setRowCode(question, rIndex, $event)" />
            </Field>
            <Field :label="`${copy.rowLabel} ${rIndex + 1}`">
              <Input :model-value="row" @update:model-value="setRow(question, rIndex, $event)" />
            </Field>
            <Button
              size="sm"
              variant="ghost"
              :disabled="(question.rows ?? []).length <= POLLS_LIMITS.ROWS_MIN"
              @click="removeRow(question, rIndex)"
            >
              {{ copy.removeOption }}
            </Button>
          </div>
          <Button
            size="sm"
            variant="ghost"
            :disabled="(question.rows ?? []).length >= POLLS_LIMITS.ROWS_MAX"
            @click="addRow(question)"
          >
            {{ copy.addRow }}
          </Button>
        </div>

        <div v-if="hasOptions(question)" class="poll-editor__options">
          <p class="poll-editor__subtitle">{{ question.kind === 'grid' ? copy.columnsTitle : copy.optionsTitle }}</p>
          <div v-for="(option, oIndex) in question.options" :key="option.id ?? `new-${oIndex}`" class="poll-editor__option">
            <span class="poll-editor__thumb" :class="{ 'is-empty': !option.imageSrc.trim() }">
              <img v-if="option.imageSrc.trim()" :src="option.imageSrc.trim()" alt="" />
            </span>
            <Field :label="`${copy.optionLabel} ${oIndex + 1}`">
              <Input v-model="option.label" />
            </Field>
            <Field :label="copy.optionImage">
              <Input v-model="option.imageSrc" type="url" placeholder="https://" />
            </Field>
            <Button
              size="sm"
              variant="ghost"
              :disabled="question.options.length <= POLLS_LIMITS.OPTIONS_MIN"
              @click="removeOption(question, oIndex)"
            >
              {{ copy.removeOption }}
            </Button>
            <div v-if="canDependOn(question)" class="poll-editor__flags">
              <Choice :model-value="option.isOther ?? false" :label="copy.optionOther" @update:model-value="option.isOther = $event" />
              <Choice
                v-if="question.kind === 'multiple'"
                :model-value="option.exclusive ?? false"
                :label="copy.optionExclusive"
                @update:model-value="option.exclusive = $event"
              />
            </div>
          </div>
          <Button
            size="sm"
            variant="ghost"
            :disabled="question.options.length >= POLLS_LIMITS.OPTIONS_MAX"
            @click="addOption(question)"
          >
            {{ copy.addOption }}
          </Button>
        </div>

        <div v-if="qIndex > 0" class="poll-editor__options">
          <p class="poll-editor__subtitle">{{ copy.conditionTitle }}</p>
          <div class="admin-fields">
            <Select
              :model-value="question.showIfQuestion ?? ''"
              :label="copy.conditionQuestion"
              :options="conditionTargets(qIndex)"
              @update:model-value="setConditionQuestion(question, $event)"
            />
            <Select
              v-if="conditionTarget(question)"
              :model-value="question.showIfMode ?? 'any'"
              :label="copy.conditionMode"
              :options="modeOptions"
              @update:model-value="question.showIfMode = $event === 'none' ? 'none' : 'any'"
            />
          </div>
          <div v-if="conditionTarget(question)" class="poll-editor__flags">
            <Choice
              v-for="(option, oIndex) in conditionTarget(question)?.options ?? []"
              :key="oIndex"
              :model-value="(question.showIfOptions ?? []).includes(oIndex)"
              :label="option.label || `${copy.optionLabel} ${oIndex + 1}`"
              @update:model-value="toggleConditionOption(question, oIndex, $event)"
            />
          </div>
        </div>
      </div>

      <Button variant="ghost" size="sm" :disabled="form.questions.length >= POLLS_LIMITS.QUESTIONS_MAX" @click="addQuestion">
        {{ copy.addQuestion }}
      </Button>
    </section>

    <footer class="admin-form__actions poll-editor__foot">
      <Button type="submit" :disabled="busy">{{ poll ? copy.saveCta : copy.createCta }}</Button>
      <Button variant="ghost" :disabled="busy" @click="emit('cancel')">{{ copy.cancelCta }}</Button>
    </footer>
  </form>
</template>
