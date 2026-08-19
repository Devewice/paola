<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { getAppDependencies, refreshInventory } from '@app/bootstrap.ts'
import ActividadSection from '@app/shell/ActividadSection.vue'
import OutingThreadBlock from '@app/shell/OutingThreadBlock.vue'
import ParcheseView from '@modules/club/presentation/ParcheseView.vue'
import AgendaSection from '@modules/rides/presentation/AgendaSection.vue'
import MemoriasSection from '@modules/rides/presentation/MemoriasSection.vue'

const stamp = ref(0)

onMounted(async () => {
  await refreshInventory()
  stamp.value += 1
})

const deps = computed(() => {
  stamp.value
  return getAppDependencies()
})

const hasMemories = computed(() => deps.value.rides.getMemories().items.length > 0)
</script>

<template>
  <ParcheseView :module="deps.club" :has-memories="hasMemories">
    <template #agenda>
      <AgendaSection :module="deps.rides">
        <template #hilo="{ outing }">
          <OutingThreadBlock :outing-id="outing.id" compact />
        </template>
      </AgendaSection>
    </template>
    <template #actividad>
      <ActividadSection />
    </template>
    <template #memorias>
      <MemoriasSection :module="deps.rides" />
    </template>
  </ParcheseView>
</template>
