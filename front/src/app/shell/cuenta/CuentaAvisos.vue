<script setup lang="ts">
import { computed } from 'vue'
import { CUENTA_COPY, CUENTA_NAV_COPY, CUENTA_SECTIONS_COPY } from '@app/constants/cuenta.ts'
import { useCuenta } from '@app/shell/cuenta/context.ts'
import Alert from '@ui/Alert.vue'
import './cuenta-card.css'

const copy = CUENTA_COPY
const sections = CUENTA_SECTIONS_COPY
const { panel } = useCuenta()
const notes = computed(() => panel.value?.notifications ?? [])
</script>

<template>
  <section class="cuenta-card" aria-labelledby="cuenta-avisos-title" data-reveal>
    <header class="cuenta-card__head">
      <span class="board-kicker">{{ CUENTA_NAV_COPY.noticesNote }}</span>
      <h2 id="cuenta-avisos-title" class="cuenta-card__title">{{ sections.noticesTitle }}</h2>
      <p class="meta-text">{{ sections.noticesLead }}</p>
    </header>

    <ul v-if="notes.length" class="cuenta-rows">
      <li v-for="note in notes" :key="note.id" class="cuenta-row">
        <span>{{ note.message }}</span>
      </li>
    </ul>
    <p v-else class="meta-text">{{ copy.noticesEmpty }}</p>

    <Alert tone="info">{{ copy.membership }}</Alert>
  </section>
</template>
