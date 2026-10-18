<script setup lang="ts">
import { computed } from 'vue'
import { CUENTA_COPY, CUENTA_FIRM_WINDOW_COPY, CUENTA_NAV_COPY, CUENTA_SECTIONS_COPY } from '@app/constants/cuenta.ts'
import { ticketDateIso, ticketOutingId, todayIso, useCuenta } from '@app/shell/cuenta/context.ts'
import { isConfirmOpen } from '@modules/rides/index.ts'
import { APP_PATHS } from '@shared/http/constants.ts'
import Alert from '@ui/Alert.vue'
import Button from '@ui/Button.vue'
import './cuenta-card.css'

const copy = CUENTA_COPY
const sections = CUENTA_SECTIONS_COPY
const { panel } = useCuenta()
const notes = computed(() => panel.value?.notifications ?? [])
const today = todayIso()

const firmPending = computed(() =>
  (panel.value?.tickets ?? []).filter(
    (ticket) =>
      ticketOutingId(ticket) &&
      ticket.confirmation !== 'firme' &&
      isConfirmOpen(ticketDateIso(ticket), ticket.outing_status ?? '', today),
  ),
)
</script>

<template>
  <section class="cuenta-card" aria-labelledby="cuenta-avisos-title" data-reveal>
    <header class="cuenta-card__head">
      <span class="board-kicker">{{ CUENTA_NAV_COPY.noticesNote }}</span>
      <h2 id="cuenta-avisos-title" class="cuenta-card__title">{{ sections.noticesTitle }}</h2>
      <p class="meta-text">{{ sections.noticesLead }}</p>
    </header>

    <ul v-if="firmPending.length || notes.length" class="cuenta-rows">
      <li v-for="ticket in firmPending" :key="`firme-${ticket.id}`" class="cuenta-row">
        <div class="cuenta-row__info">
          <strong class="cuenta-row__title">
            {{ CUENTA_FIRM_WINDOW_COPY.pendingNotice(ticket.outing_title ?? ticket.name) }}
          </strong>
        </div>
        <div class="cuenta-row__actions">
          <Button size="sm" :to="APP_PATHS.CUENTA_RODADAS">{{ CUENTA_FIRM_WINDOW_COPY.cta }}</Button>
        </div>
      </li>
      <li v-for="note in notes" :key="note.id" class="cuenta-row">
        <span>{{ note.message }}</span>
      </li>
    </ul>
    <p v-else class="meta-text">{{ copy.noticesEmpty }}</p>

    <Alert tone="info">{{ copy.membership }}</Alert>
  </section>
</template>
