<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import {
  buildPollDraft,
  emptyOption,
  emptyPollForm,
  emptyQuestion,
  type PollForm,
  type QuestionForm,
} from '@modules/polls/application/buildPollDraft.ts'
import type { PollsModule } from '@modules/polls/composition.ts'
import {
  POLLS_ADMIN_COPY,
  POLLS_COPY,
  POLLS_LIMITS,
  POLL_AUDIENCE_LABELS,
  POLL_KIND_LABELS,
  POLL_STATUS_LABELS,
} from '@modules/polls/constants/copy.ts'
import type { PollKind, PollStatus } from '@modules/polls/domain/entities/Poll.ts'
import type { OperatorPoll, PollPatch } from '@modules/polls/domain/ports/PollsPort.ts'
import PollResults from '@modules/polls/presentation/PollResults.vue'
import Button from '@ui/Button.vue'
import Chip from '@ui/Chip.vue'
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
}>()

const emit = defineEmits<{ published: [] }>()

const copy = POLLS_ADMIN_COPY
const form = ref<PollForm>(emptyPollForm())
const polls = ref<readonly OperatorPoll[]>([])
const busy = ref<string | null>(null)
const expanded = ref<string | null>(null)
const confirmDelete = ref<string | null>(null)

const kindOptions = (Object.keys(POLL_KIND_LABELS) as PollKind[]).map((value) => ({
  value,
  label: POLL_KIND_LABELS[value],
}))
const statusOptions = (['open', 'draft'] as PollStatus[]).map((value) => ({ value, label: POLL_STATUS_LABELS[value] }))
const audienceOptions = (['public', 'account'] as const).map((value) => ({ value, label: POLL_AUDIENCE_LABELS[value] }))
const outingOptions = computed(() => [{ value: '', label: copy.outingNone }, ...props.outings])

function hasOptions(question: QuestionForm): boolean {
  return question.kind === 'single' || question.kind === 'multiple' || question.kind === 'ranking'
}

function addQuestion() {
  if (form.value.questions.length >= POLLS_LIMITS.QUESTIONS_MAX) return
  form.value.questions.push(emptyQuestion())
}

function removeQuestion(index: number) {
  form.value.questions.splice(index, 1)
}

function moveQuestion(index: number, delta: number) {
  const target = index + delta
  const list = form.value.questions
  if (target < 0 || target >= list.length) return
  const [item] = list.splice(index, 1)
  if (item) list.splice(target, 0, item)
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

async function load() {
  const result = await props.module.listOperator(props.clave)
  if (!result.ok) {
    showToast(result.error.message || copy.loadFail, 'bad')
    return
  }
  polls.value = result.value
}

async function save() {
  const draft = buildPollDraft(form.value)
  if (!draft.ok) {
    showToast(draft.error.message, 'warn')
    return
  }
  busy.value = 'create'
  const result = await props.module.create(draft.value, props.clave)
  busy.value = null
  if (!result.ok) {
    showToast(result.error.message || copy.createFail, 'bad')
    return
  }
  form.value = emptyPollForm()
  showToast(copy.createOk, 'ok')
  emit('published')
  await load()
}

async function patch(poll: OperatorPoll, change: PollPatch) {
  busy.value = poll.id
  const result = await props.module.update(poll.id, change, props.clave)
  busy.value = null
  if (!result.ok) {
    showToast(result.error.message || copy.updateFail, 'bad')
    return
  }
  showToast(copy.updateOk, 'ok')
  emit('published')
  await load()
}

async function remove(poll: OperatorPoll) {
  if (confirmDelete.value !== poll.id) {
    confirmDelete.value = poll.id
    return
  }
  confirmDelete.value = null
  busy.value = poll.id
  const result = await props.module.remove(poll.id, props.clave)
  busy.value = null
  if (!result.ok) {
    showToast(result.error.message || copy.deleteFail, 'bad')
    return
  }
  showToast(copy.deleteOk, 'ok')
  emit('published')
  await load()
}

function statusTone(status: PollStatus): 'abierto' | 'cerrado' | 'realizado' {
  if (status === 'open') return 'abierto'
  return status === 'closed' ? 'cerrado' : 'realizado'
}

function votesLabel(poll: OperatorPoll): string {
  return poll.results.responses === 1 ? POLLS_COPY.responsesOne : `${poll.results.responses} ${POLLS_COPY.responsesMany}`
}

onMounted(() => void load())
</script>

<template>
  <div class="admin-stack">
    <form class="admin-card poll-editor" @submit.prevent="save">
      <header class="admin-card__head">
        <h3>{{ copy.formTitle }}</h3>
        <p>{{ copy.formLead }}</p>
      </header>

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
        <Select
          :model-value="form.status"
          :label="copy.fieldStatus"
          :options="statusOptions"
          @update:model-value="form.status = $event === 'draft' ? 'draft' : 'open'"
        />
      </div>
      <div class="admin-fields">
        <Select v-model="form.outingId" :label="copy.fieldOuting" :options="outingOptions" />
        <Field :label="copy.fieldClosesAt">
          <Input v-model="form.closesAt" type="datetime-local" />
        </Field>
      </div>
      <Choice v-model="form.featured" kind="switch" :label="copy.fieldFeatured" />

      <section class="poll-editor__questions">
        <h4 class="poll-editor__title">{{ copy.questionsTitle }}</h4>

        <div v-for="(question, qIndex) in form.questions" :key="qIndex" class="poll-editor__q">
          <header class="poll-editor__q-head">
            <span class="poll-editor__q-num">{{ qIndex + 1 }}</span>
            <Select
              :model-value="question.kind"
              :options="kindOptions"
              @update:model-value="setKind(question, $event)"
            />
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
              <Button
                size="sm"
                variant="ghost"
                :disabled="form.questions.length === 1"
                @click="removeQuestion(qIndex)"
              >
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

          <div v-if="hasOptions(question)" class="poll-editor__options">
            <p class="poll-editor__subtitle">{{ copy.optionsTitle }}</p>
            <div v-for="(option, oIndex) in question.options" :key="oIndex" class="poll-editor__option">
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
        </div>

        <Button
          variant="ghost"
          size="sm"
          :disabled="form.questions.length >= POLLS_LIMITS.QUESTIONS_MAX"
          @click="addQuestion"
        >
          {{ copy.addQuestion }}
        </Button>
      </section>

      <Button type="submit" :disabled="busy === 'create'">{{ copy.createCta }}</Button>
    </form>

    <section class="admin-card">
      <header class="admin-card__head">
        <h3>{{ copy.listTitle }}</h3>
        <p>{{ copy.listLead }}</p>
      </header>
      <p v-if="!polls.length" class="admin-empty">{{ copy.listEmpty }}</p>
      <ul v-else class="admin-list">
        <li v-for="poll in polls" :key="poll.id" class="admin-list__item">
          <div class="admin-list__main">
            <strong>{{ poll.title }}</strong>
            <span class="admin-list__meta">
              {{ POLL_AUDIENCE_LABELS[poll.audience] }} · {{ votesLabel(poll) }}
              <template v-if="poll.outingTitle"> · {{ POLLS_COPY.linkedRide }} {{ poll.outingTitle }}</template>
            </span>
            <div class="admin-list__chips">
              <Chip :tone="statusTone(poll.status)">{{ POLL_STATUS_LABELS[poll.status] }}</Chip>
              <Chip v-if="poll.featured" tone="zona-ok">{{ copy.featuredChip }}</Chip>
            </div>
          </div>
          <div class="admin-list__actions">
            <Button
              v-if="poll.status !== 'open'"
              size="sm"
              :disabled="busy === poll.id"
              @click="patch(poll, { status: 'open' })"
            >
              {{ copy.openCta }}
            </Button>
            <Button
              v-else
              size="sm"
              variant="ghost"
              :disabled="busy === poll.id"
              @click="patch(poll, { status: 'closed' })"
            >
              {{ copy.closeCta }}
            </Button>
            <Button size="sm" variant="ghost" :disabled="busy === poll.id" @click="patch(poll, { featured: !poll.featured })">
              {{ poll.featured ? copy.unfeatureCta : copy.featureCta }}
            </Button>
            <Button size="sm" variant="ghost" @click="expanded = expanded === poll.id ? null : poll.id">
              {{ expanded === poll.id ? copy.hideResults : copy.showResults }}
            </Button>
            <Button size="sm" variant="danger" :disabled="busy === poll.id" @click="remove(poll)">
              {{ confirmDelete === poll.id ? copy.deleteConfirm : copy.deleteCta }}
            </Button>
          </div>
          <PollResults
            v-if="expanded === poll.id"
            class="admin-list__results"
            :questions="poll.questions"
            :results="poll.results"
            show-texts
          />
        </li>
      </ul>
    </section>
  </div>
</template>
