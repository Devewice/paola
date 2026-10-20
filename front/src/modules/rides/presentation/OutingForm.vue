<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { RidesModule } from '@modules/rides/composition.ts'
import { RIDES_ADMIN_COPY, RIDES_KIND } from '@modules/rides/constants/copy.ts'
import type { MapPoint, Outing, OutingKind } from '@modules/rides/domain/entities/Outing.ts'
import RoutePointField from '@modules/rides/presentation/RoutePointField.vue'
import Button from '@ui/Button.vue'
import Choice from '@ui/Choice.vue'
import Field from '@ui/Field.vue'
import Input from '@ui/Input.vue'
import RouteMap from '@ui/RouteMap.vue'
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
    start: (outing?.route?.start ?? null) as MapPoint | null,
    end: (outing?.route?.end ?? null) as MapPoint | null,
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

/** El trazado guardado solo vale si no se movieron los puntos. */
const previewPath = computed(() => {
  const route = props.outing?.route
  const same = (a?: MapPoint | null, b?: MapPoint) => a?.lat === b?.lat && a?.lng === b?.lng
  return route && same(draft.value.start, route.start) && same(draft.value.end, route.end) ? route.path : []
})

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
    start: value.start,
    end: value.end,
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
    <fieldset class="outing-form__map">
      <legend>{{ copy.mapHeading }}</legend>
      <p class="outing-form__hint">{{ copy.mapHint }}</p>
      <div class="admin-fields">
        <RoutePointField v-model="draft.start" :module="module" :clave="clave" :label="copy.fieldStart" />
        <RoutePointField v-model="draft.end" :module="module" :clave="clave" :label="copy.fieldEnd" />
      </div>
      <div v-if="draft.start || draft.end" class="outing-form__preview">
        <RouteMap :start="draft.start ?? undefined" :end="draft.end ?? undefined" :path="previewPath" />
      </div>
    </fieldset>
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

<style scoped>
.outing-form__map {
  display: grid;
  gap: 12px;
  margin: 0;
  padding: 16px;
  border: 1px solid var(--line);
  border-radius: 10px;
}
.outing-form__map legend {
  padding: 0 8px;
  font-family: 'Oswald', sans-serif;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
.outing-form__hint {
  margin: 0;
  color: var(--muted);
  font-size: 13px;
}
.outing-form__preview {
  height: 220px;
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: 10px;
}
</style>
