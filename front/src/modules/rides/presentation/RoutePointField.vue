<script setup lang="ts">
import { ref } from 'vue'
import type { RidesModule } from '@modules/rides/composition.ts'
import { RIDES_ADMIN_COPY } from '@modules/rides/constants/copy.ts'
import type { MapPoint, PlaceResult } from '@modules/rides/domain/entities/Outing.ts'
import Button from '@ui/Button.vue'
import Field from '@ui/Field.vue'
import Input from '@ui/Input.vue'

const props = defineProps<{
  module: RidesModule
  clave: string
  label: string
  modelValue: MapPoint | null
}>()

const emit = defineEmits<{ 'update:modelValue': [value: MapPoint | null] }>()

const copy = RIDES_ADMIN_COPY
const query = ref('')
const results = ref<readonly PlaceResult[]>([])
const busy = ref(false)
const message = ref('')

async function search(): Promise<void> {
  const text = query.value.trim()
  if (!text) return
  busy.value = true
  message.value = ''
  const result = await props.module.searchPlaces(text, props.clave)
  busy.value = false
  if (!result.ok) {
    results.value = []
    message.value = result.error.message || copy.placeFail
    return
  }
  results.value = result.value
  if (!result.value.length) message.value = copy.placeNone
}

function pick(place: PlaceResult): void {
  emit('update:modelValue', { label: place.label, lat: place.lat, lng: place.lng })
  results.value = []
  query.value = ''
  message.value = ''
}

function rename(label: string): void {
  if (props.modelValue) emit('update:modelValue', { ...props.modelValue, label })
}
</script>

<template>
  <div class="route-point">
    <Field v-if="modelValue" :label="`${label} · ${copy.placeLabel}`">
      <div class="route-point__chosen">
        <Input :model-value="modelValue.label" @update:model-value="rename" />
        <Button size="sm" variant="ghost" @click="emit('update:modelValue', null)">{{ copy.placeChange }}</Button>
      </div>
      <small class="route-point__coords">{{ modelValue.lat }}, {{ modelValue.lng }}</small>
    </Field>
    <Field v-else :label="label">
      <div class="route-point__search">
        <Input v-model="query" :placeholder="copy.placePlaceholder" @keydown.enter.prevent="search" />
        <Button size="sm" variant="dark" :disabled="busy || !query.trim()" @click="search">
          {{ busy ? copy.placeSearching : copy.placeSearch }}
        </Button>
      </div>
      <ul v-if="results.length" class="route-point__results">
        <li v-for="place in results" :key="`${place.lat},${place.lng}`">
          <button type="button" @click="pick(place)">
            <strong>{{ place.label }}</strong>
            <small>{{ place.detail }}</small>
          </button>
        </li>
      </ul>
      <small v-if="message" class="route-point__message">{{ message }}</small>
    </Field>
  </div>
</template>

<style scoped>
.route-point__chosen,
.route-point__search {
  display: flex;
  gap: 8px;
  align-items: center;
}
.route-point__chosen > :first-child,
.route-point__search > :first-child {
  flex: 1;
  min-width: 0;
}
.route-point__coords,
.route-point__message {
  display: block;
  margin-top: 4px;
  color: var(--muted);
  font-size: 12px;
}
.route-point__results {
  display: grid;
  gap: 4px;
  margin: 8px 0 0;
  padding: 0;
  list-style: none;
}
.route-point__results button {
  display: grid;
  width: 100%;
  gap: 2px;
  padding: 8px 12px;
  border: 1px solid var(--line);
  border-radius: 10px;
  background: var(--surface);
  color: inherit;
  text-align: left;
  cursor: pointer;
}
.route-point__results button:hover,
.route-point__results button:focus-visible {
  border-color: #48b4fc;
}
.route-point__results small {
  color: var(--muted);
  font-size: 12px;
}
</style>
