<script setup lang="ts">
import { computed, ref } from 'vue'
import { getAppDependencies } from '@app/bootstrap.ts'
import { CUENTA_COPY, CUENTA_NAV_COPY, CUENTA_SECTIONS_COPY } from '@app/constants/cuenta.ts'
import OutingThreadBlock from '@app/shell/OutingThreadBlock.vue'
import {
  ticketDateIso,
  ticketOutingId,
  todayIso,
  useCuenta,
  type TicketRow,
} from '@app/shell/cuenta/context.ts'
import { isConfirmOpen, type RideConfirmation } from '@modules/rides/index.ts'
import RideFirm from '@modules/rides/presentation/RideFirm.vue'
import { APP_PATHS, appRodada } from '@shared/http/constants.ts'
import { MASCOT } from '@shared/ui/mascot.ts'
import Button from '@ui/Button.vue'
import Empty from '@ui/Empty.vue'
import './cuenta-card.css'

const copy = CUENTA_COPY
const sections = CUENTA_SECTIONS_COPY
const { panel, rideVotes, reloadPanel } = useCuenta()
const rides = getAppDependencies().rides
const threadId = ref('')
const today = todayIso()

const tickets = computed(() => panel.value?.tickets ?? [])

function pendingPolls(ticket: TicketRow): number {
  return rideVotes.value.get(ticketOutingId(ticket)) ?? 0
}

function firmOpen(ticket: TicketRow): boolean {
  return Boolean(ticketOutingId(ticket)) && isConfirmOpen(ticketDateIso(ticket), ticket.outing_status ?? '', today)
}

function upcoming(ticket: TicketRow): boolean {
  return Boolean(ticketOutingId(ticket)) && ticket.outing_status !== 'realizado' && ticketDateIso(ticket) >= today
}

function confirmationOf(ticket: TicketRow): RideConfirmation {
  return ticket.confirmation === 'firme' ? 'firme' : 'pendiente'
}

function dateOf(ticket: TicketRow): string {
  if (!ticket.outing_date) return ''
  const date = new Date(String(ticket.outing_date))
  return Number.isNaN(date.valueOf())
    ? String(ticket.outing_date).slice(0, 10)
    : date.toLocaleDateString('es-CO', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })
}

function toggleThread(ticket: TicketRow): void {
  const id = ticketOutingId(ticket)
  threadId.value = threadId.value === id ? '' : id
}
</script>

<template>
  <section class="cuenta-card" aria-labelledby="cuenta-rodadas-title" data-reveal>
    <header class="cuenta-card__head">
      <span class="board-kicker">{{ CUENTA_NAV_COPY.ridesNote }}</span>
      <h2 id="cuenta-rodadas-title" class="cuenta-card__title">{{ sections.ridesTitle }}</h2>
      <p class="meta-text">{{ sections.ridesLead }}</p>
    </header>

    <ul v-if="tickets.length" class="cuenta-rows">
      <li v-for="ticket in tickets" :key="ticket.id" class="cuenta-row">
        <div class="cuenta-row__info">
          <strong class="cuenta-row__title">{{ ticket.outing_title ?? ticket.name }}</strong>
          <span v-if="dateOf(ticket)" class="meta-text">{{ dateOf(ticket) }}</span>
          <span v-if="pendingPolls(ticket)" class="cuenta-row__badge">
            {{ pendingPolls(ticket) }}
            {{ pendingPolls(ticket) === 1 ? copy.ticketsPollsOne : copy.ticketsPollsMany }}
          </span>
        </div>
        <div v-if="ticketOutingId(ticket)" class="cuenta-row__actions">
          <Button size="sm" :variant="pendingPolls(ticket) ? 'primary' : 'ghost'" :to="appRodada(ticketOutingId(ticket))">
            {{ pendingPolls(ticket) ? copy.ticketsVote : copy.ticketsRide }}
          </Button>
          <Button size="sm" variant="ghost" @click="toggleThread(ticket)">{{ copy.outingThread }}</Button>
        </div>
        <RideFirm
          v-if="upcoming(ticket)"
          class="cuenta-row__thread"
          :module="rides"
          :outing-id="ticketOutingId(ticket)"
          :confirmation="confirmationOf(ticket)"
          :ask="firmOpen(ticket)"
          compact
          @confirmed="reloadPanel"
          @released="reloadPanel"
        />
        <OutingThreadBlock
          v-if="threadId && threadId === ticketOutingId(ticket)"
          class="cuenta-row__thread"
          :outing-id="threadId"
          compact
        />
      </li>
    </ul>
    <Empty
      v-else
      compact
      hide-cta
      :title="copy.ticketsEmptyTitle"
      :copy="copy.ticketsEmpty"
      :mascot-src="MASCOT.TUMBADA"
    />

    <div class="cuenta-card__actions">
      <Button size="sm" variant="ghost" :to="APP_PATHS.PARCHESE_RODADAS">{{ sections.ridesBrowse }}</Button>
    </div>
  </section>
</template>
