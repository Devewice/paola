<script setup lang="ts">
import type { RidesModule } from '@modules/rides/index.ts'
import PaolaAgendaItem from '@ui/PaolaAgendaItem.vue'
import PaolaVoiceBadge from '@ui/PaolaVoiceBadge.vue'

const props = defineProps<{
  module: RidesModule
}>()

const agenda = props.module.getAgenda()
</script>

<template>
  <section class="parchese-page__agenda" aria-label="Agenda">
    <PaolaVoiceBadge voice="loigca" />
    <h2 class="parchese-page__heading type-display">Agenda</h2>
    <div v-if="agenda.items.length" class="parchese-page__dates">
      <PaolaAgendaItem
        v-for="item in agenda.items"
        :key="item.id"
        :date="item.date"
        :title="item.title"
        :kind="item.kind"
        :point="item.point"
        :when="item.when"
      />
    </div>
    <p v-else class="parchese-page__empty">{{ agenda.emptyCopy }}</p>
  </section>
</template>

<style scoped>
.parchese-page__agenda {
  display: grid;
  gap: 12px;
}

.parchese-page__heading {
  margin: 0;
  font-size: 22px;
}

.parchese-page__dates {
  display: grid;
  gap: 8px;
}

.parchese-page__empty {
  margin: 0;
  color: var(--paola-muted);
  font-size: 15px;
  line-height: 1.5;
}
</style>
