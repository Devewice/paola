<script setup lang="ts">
import { onMounted, ref } from 'vue'
import VoiceView from '@modules/voice/presentation/VoiceView.vue'
import { getAppDependencies, refreshInventory } from '@app/bootstrap.ts'

const module = getAppDependencies().voice
const ready = ref(false)

onMounted(async () => {
  await refreshInventory()
  ready.value = true
})
</script>

<template>
  <VoiceView v-if="ready" :module="module" />
</template>
