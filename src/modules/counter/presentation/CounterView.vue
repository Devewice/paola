<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { CounterModule } from '../composition.ts'

const props = defineProps<{
  counter: CounterModule
}>()

const value = ref(0)
const message = ref('')
const loading = ref(false)

const applyResult = async (
  run: () => ReturnType<CounterModule['getCounter']>,
) => {
  loading.value = true
  const result = await run()
  loading.value = false

  if (result.ok) {
    value.value = result.value.value
    message.value = ''
    return
  }

  message.value = result.error.message
}

onMounted(() => {
  void applyResult(() => props.counter.getCounter())
})

const increment = () => {
  void applyResult(() => props.counter.incrementCounter())
}

const reset = () => {
  void applyResult(() => props.counter.resetCounter())
}
</script>

<template>
  <v-card variant="outlined" rounded="lg">
    <v-card-text>
      <p class="text-overline text-medium-emphasis mb-1">Módulo de ejemplo</p>
      <h2 class="text-h5 mb-4">Contador</h2>

      <p class="text-h2 font-weight-bold mb-6" aria-live="polite">
        {{ value }}
      </p>

      <div class="d-flex flex-wrap ga-3 mb-4">
        <v-btn color="primary" :loading="loading" @click="increment">
          Incrementar
        </v-btn>
        <v-btn variant="outlined" :disabled="loading" @click="reset">
          Reiniciar
        </v-btn>
      </div>

      <v-alert v-if="message" type="error" variant="tonal" density="compact">
        {{ message }}
      </v-alert>
      <p v-else class="text-body-2 text-medium-emphasis mb-0">
        El dominio no conoce Vuetify ni el almacenamiento.
      </p>
    </v-card-text>
  </v-card>
</template>
