<script setup lang="ts">
import { defineAsyncComponent, watch } from 'vue'
import { ROUTE_TITLES } from '@app/constants/copy.ts'
import NotFoundView from '@app/shell/NotFoundView.vue'
import { kitUnlocked } from '@app/shell/kitGate.ts'
import { useOperarAccess } from '@app/shell/useOperarAccess.ts'

const KitView = defineAsyncComponent(() => import('@app/shell/KitView.vue'))
const { gate } = useOperarAccess(ROUTE_TITLES.KIT)

watch(gate, (value) => {
  if (value === 'ready') kitUnlocked.value = true
  if (value === 'hidden') kitUnlocked.value = false
})
</script>

<template>
  <NotFoundView v-if="gate === 'hidden'" />
  <KitView v-else-if="gate === 'ready'" />
</template>
