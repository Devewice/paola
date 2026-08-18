<script setup lang="ts">
import { getAppDependencies } from '@app/bootstrap.ts'
import ParcheseView from '@modules/club/presentation/ParcheseView.vue'
import AgendaSection from '@modules/rides/presentation/AgendaSection.vue'
import MemoriasSection from '@modules/rides/presentation/MemoriasSection.vue'

const { club, rides } = getAppDependencies()
const hasMemories = rides.getMemories().items.length > 0
</script>

<template>
  <ParcheseView :module="club" :has-memories="hasMemories">
    <template #agenda>
      <AgendaSection :module="rides" />
    </template>
    <template #memorias>
      <MemoriasSection :module="rides" />
    </template>
  </ParcheseView>
</template>
