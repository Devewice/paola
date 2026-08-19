<script setup lang="ts">
defineProps<{
  title: string
  ticketId?: string
  rows?: readonly { label: string; value: string }[]
  meta?: string
}>()
</script>

<template>
  <article class="ticket-card">
    <div class="ticket-card__head">
      <div>
        <p class="ticket-card__id">{{ ticketId ?? 'Ticket' }}</p>
        <h3 class="ticket-card__title">{{ title }}</h3>
      </div>
      <div class="ticket-card__qr" aria-hidden="true">QR<br />próximo</div>
    </div>
    <div v-if="rows?.length" class="ticket-card__row">
      <span v-for="row in rows" :key="row.label">{{ row.label }}: <strong>{{ row.value }}</strong></span>
    </div>
    <p v-if="meta" class="sm" style="margin: 0; color: var(--muted)">{{ meta }}</p>
    <slot />
  </article>
</template>
