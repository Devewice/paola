<script setup lang="ts">
import { computed } from 'vue'
import type { VoiceModule } from '@modules/voice/composition.ts'
import { VOICE_COPY } from '@modules/voice/constants/copy.ts'
import DenunciaCard from '@ui/DenunciaCard.vue'
import Empty from '@ui/Empty.vue'

const props = defineProps<{
  module: VoiceModule
  limit?: number
}>()

const copy = VOICE_COPY
const reports = computed(() => props.module.getReports())
const shown = computed(() => reports.value.items.slice(0, props.limit))
</script>

<template>
  <Empty v-if="!shown.length" :title="copy.publishedEmpty" :copy="reports.emptyCopy" glyph="◎" compact hide-cta />
  <div v-else class="reports-list">
    <DenunciaCard
      v-for="item in shown"
      :key="item.id"
      :title="item.title"
      :meta="`${item.whereText} · ${item.happenedAt}`"
      :status="copy.statusPublished"
    />
  </div>
</template>

<style scoped>
.reports-list {
  display: grid;
  gap: 12px;
}
</style>
