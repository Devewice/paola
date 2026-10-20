<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { RidesModule } from '@modules/rides/composition.ts'
import { RIDES_ADMIN_COPY, RIDES_KIND } from '@modules/rides/constants/copy.ts'
import type { Outing, OutingKind } from '@modules/rides/domain/entities/Outing.ts'
import Button from '@ui/Button.vue'
import Choice from '@ui/Choice.vue'
import Field from '@ui/Field.vue'
import Input from '@ui/Input.vue'
import Select from '@ui/Select.vue'
import Textarea from '@ui/Textarea.vue'
import { showToast } from '@ui/toast.ts'

const props = defineProps<{
  module: RidesModule
  clave: string
  /** Con salida se edita; sin ella se publica una nueva. */
  outing?: Outing | null
}>()

const emit = defineEmits<{ saved: [outing: Outing]; cancel: [] }>()

const copy = RIDES_ADMIN_COPY
const editing = computed(() => Boolean(props.outing))

function fromOuting(outing?: Outing | null) {
  return {
    title: outing?.title ?? '',
    date: outing?.date ?? '',
    kind: (outing?.kind ?? RIDES_KIND.RODADA) as OutingKind,
    meetingPoint: outing?.meetingPoint ?? '',
    routeText: outing?.routeText ?? '',
    whatToBring: outing?.whatToBring ?? '',
    capacity: String(outing?.capacity ?? 20),
    paid: outing?.paid ?? false,
  }
}

const draft = ref(fromOuting(props.outing))
const busy = ref(false)

watch(
  () => props.outing,
  (outing) => {
    draft.value = fromOuting(outing)
  },
)

const kindOptions = [
  { value: RIDES_KIND.RODADA, label: copy.kindRodada },
  { value: RIDES_KIND.ACTIVIDAD, label: copy.kindActividad },
  { value: RIDES_KIND.TINTADA, label: copy.kindTintada },
]

async function submit() {
  busy.value = true
  const value = draft.value
  const payload = {
    title: value.title.trim(),
    date: value.date,
    kind: value.kind,
    meetingPoint: value.meetingPoint.trim(),
    routeText: value.routeText.trim(),
    whatToBring: value.whatToBring.trim(),
    capacity: Number(value.capacity),
    paid: value.paid,
  }
  const result = props.outing
    ? await props.module.updateOuting(props.outing.id, payload, props.clave)
    : await props.module.publishOuting(payload, props.clave)
  busy.value = false
  if (!result.ok) {
    showToast(result.error.message || (editing.value ? copy.outingSaveFail : copy.outingFail), 'bad')
    return
  }
  showToast(editing.value ? copy.outingSaved : copy.outingOk, 'ok')
  if (!editing.value) draft.value = fromOuting(null)
  emit('saved', result.value)
}
</script>

<template>
  <form class="admin-form" @submit.prevent="submit">
    <Field :label="copy.fieldTitle">
      <Input v-model="draft.title" />
    </Field>
    <div class="admin-fields">
      <Field :label="copy.fieldDate">
        <Input v-model="draft.date" type="date" />
      </Field>
      <Select v-model="draft.kind" :label="copy.fieldKind" :options="kindOptions" />
    </div>
    <Field :label="copy.fieldMeeting">
      <Input v-model="draft.meetingPoint" />
    </Field>
    <Field :label="copy.fieldRoute">
      <Textarea v-model="draft.routeText" />
    </Field>
    <div class="admin-fields">
      <Field :label="copy.fieldBring">
        <Input v-model="draft.whatToBring" />
      </Field>
      <Field :label="copy.fieldCapacity">
        <Input v-model="draft.capacity" type="number" />
      </Field>
    </div>
    <Choice v-model="draft.paid" :label="copy.fieldPaid" />
    <div class="admin-form__actions">
      <Button type="submit" :disabled="busy">{{ editing ? copy.outingSave : copy.outingCta }}</Button>
      <Button type="button" variant="ghost" @click="emit('cancel')">{{ copy.cancel }}</Button>
    </div>
  </form>
</template>
