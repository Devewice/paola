<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { getAppDependencies, refreshInventory } from '@app/bootstrap.ts'
import VoiceView from '@modules/voice/presentation/VoiceView.vue'

const stamp = ref(0)

onMounted(async () => {
  await refreshInventory()
  stamp.value += 1
})

const module = computed(() => {
  stamp.value
  return getAppDependencies().voice
})

const whatsapp = computed(() => getAppDependencies().paola.getPage().contact.whatsapp)
</script>

<template>
  <VoiceView
    :module="module"
    :whatsapp-href="whatsapp.href"
    :whatsapp-label="whatsapp.label"
  />
</template>
