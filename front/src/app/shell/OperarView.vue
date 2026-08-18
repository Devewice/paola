<script setup lang="ts">
import { ref } from 'vue'
import { getAppDependencies } from '@app/bootstrap.ts'
import type { OperatorBoardOuting } from '@modules/rides/domain/ports/RidesApiPort.ts'
import PaolaAlert from '@ui/PaolaAlert.vue'
import PaolaButton from '@ui/PaolaButton.vue'
import PaolaField from '@ui/PaolaField.vue'
import PaolaInput from '@ui/PaolaInput.vue'
import PaolaVoiceBadge from '@ui/PaolaVoiceBadge.vue'

const { rides } = getAppDependencies()

const clave = ref('')
const error = ref('')
const board = ref<readonly OperatorBoardOuting[] | null>(null)
const busy = ref(false)

async function load(): Promise<void> {
  busy.value = true
  error.value = ''
  const result = await rides.listOperatorBoard(clave.value)
  busy.value = false
  if (!result.ok) {
    board.value = null
    error.value = result.error.message
    return
  }
  board.value = result.value
}

async function setStatus(id: string, status: 'cerrado' | 'realizado'): Promise<void> {
  busy.value = true
  error.value = ''
  const result = await rides.setOutingStatus(id, status, clave.value)
  busy.value = false
  if (!result.ok) {
    error.value = result.error.message
    return
  }
  await load()
}
</script>

<template>
  <article class="paola-page">
    <header>
      <p class="paola-empty__kicker">Paola · operadora</p>
      <h1 class="paola-afiche__title type-display">Cupos</h1>
      <p class="paola-afiche__lead">
        Lista de quién se apuntó. Cerrar inscripción o marcar realizada. No es el panel gordo.
      </p>
    </header>

    <form class="operar-clave" @submit.prevent="load">
      <PaolaVoiceBadge voice="loigca" />
      <PaolaField label="Clave">
        <PaolaInput v-model="clave" type="password" placeholder="OPERADOR_CLAVE" />
      </PaolaField>
      <PaolaButton type="submit" :disabled="busy">Ver lista</PaolaButton>
    </form>

    <PaolaAlert v-if="error" tone="bad">{{ error }}</PaolaAlert>

    <p v-if="board && board.length === 0" class="paola-page__copy paola-page__copy--muted">
      No hay salidas en la base. Cuando Paola publique una, aparecen aquí.
    </p>

    <section v-for="outing in board ?? []" :key="outing.id" class="operar-outing">
      <h2 class="paola-page__heading type-display">{{ outing.title }}</h2>
      <p class="paola-page__copy paola-page__copy--muted">
        {{ outing.date }} · {{ outing.status }} · {{ outing.taken }} / {{ outing.capacity }}
      </p>
      <ul v-if="outing.tickets.length" class="operar-list">
        <li v-for="ticket in outing.tickets" :key="ticket.id">
          <strong>{{ ticket.name }}</strong>
          · {{ ticket.whatsapp }}
          <span v-if="ticket.moto"> · {{ ticket.moto }}</span>
        </li>
      </ul>
      <p v-else class="paola-page__copy paola-page__copy--muted">Nadie anotado aún.</p>
      <div class="operar-actions">
        <PaolaButton
          size="sm"
          variant="ghost"
          :disabled="busy || outing.status === 'realizado' || outing.status === 'cerrado'"
          @click="setStatus(outing.id, 'cerrado')"
        >
          Cerrar inscripción
        </PaolaButton>
        <PaolaButton
          size="sm"
          variant="ghost"
          :disabled="busy || outing.status === 'realizado'"
          @click="setStatus(outing.id, 'realizado')"
        >
          Marcar realizada
        </PaolaButton>
      </div>
    </section>
  </article>
</template>

<style scoped>
.operar-clave,
.operar-outing,
.operar-actions {
  display: grid;
  gap: 12px;
}

.operar-outing {
  padding-top: calc(var(--paola-space) * 3);
  border-top: 1px solid var(--paola-line);
}

.operar-list {
  margin: 0;
  padding-left: 1.2rem;
  display: grid;
  gap: 6px;
  color: var(--paola-white);
}

.operar-actions {
  grid-template-columns: 1fr;
}

@media (min-width: 640px) {
  .operar-actions {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
