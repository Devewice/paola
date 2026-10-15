<script setup lang="ts">
import { LEGAL_COPY } from '@app/constants/legal.ts'
import { useTuVoz } from '@app/shell/tu-voz/context.ts'
import { VOICE_COPY } from '@modules/voice/constants/copy.ts'
import ReportForm from '@modules/voice/presentation/ReportForm.vue'
import ReportsList from '@modules/voice/presentation/ReportsList.vue'
import { usePageReveal } from '@shared/motion/usePageReveal.ts'
import BoardHead from '@ui/BoardHead.vue'
import DisclaimerBox from '@ui/DisclaimerBox.vue'

const copy = VOICE_COPY
const legal = LEGAL_COPY
const bindReveal = usePageReveal()
const { deps } = useTuVoz()
</script>

<template>
  <div :ref="bindReveal" class="board">
    <div class="board-section" data-reveal>
      <DisclaimerBox>{{ legal.reportsDisclaimer }}</DisclaimerBox>
      <DisclaimerBox tone="info">{{ legal.moderationShort }}</DisclaimerBox>
      <div class="board-split reports-split">
        <div class="board-main">
          <BoardHead voice="armargura" :title="copy.publishedHeading" />
          <ReportsList :module="deps.voice" />
        </div>
        <ReportForm :module="deps.voice" />
      </div>
    </div>
  </div>
</template>

<style scoped>
@media (min-width: 960px) {
  .reports-split {
    grid-template-columns: minmax(0, 1fr) minmax(300px, 24rem);
  }
}
</style>
