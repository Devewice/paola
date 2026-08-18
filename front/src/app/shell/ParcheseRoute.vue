<script setup lang="ts">
import { getAppDependencies } from '@app/bootstrap.ts'
import ParcheseView from '@modules/club/presentation/ParcheseView.vue'
import AgendaSection from '@modules/rides/presentation/AgendaSection.vue'

const { club, rides } = getAppDependencies()
</script>

<template>
  <ParcheseView :module="club">
    <template #agenda>
      <AgendaSection :module="rides" />
    </template>
  </ParcheseView>
</template>
