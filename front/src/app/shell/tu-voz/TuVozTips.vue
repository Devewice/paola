<script setup lang="ts">
import { useTuVoz } from '@app/shell/tu-voz/context.ts'
import { VOICE_COPY, VOICE_FIGURES } from '@modules/voice/constants/copy.ts'
import TipsGrid from '@modules/voice/presentation/TipsGrid.vue'
import { usePageReveal } from '@shared/motion/usePageReveal.ts'
import Button from '@ui/Button.vue'
import DualChannel from '@ui/DualChannel.vue'
import GuidelinesList from '@ui/GuidelinesList.vue'

const copy = VOICE_COPY
const bindReveal = usePageReveal()
const { deps, whatsapp } = useTuVoz()
</script>

<template>
  <div :ref="bindReveal" class="board">
    <div class="board-split" data-reveal>
      <div class="board-main">
        <TipsGrid :module="deps.voice" featured />
      </div>
      <aside class="board-rail">
        <div class="poster poster--blue poster--mascot-top has-mascot">
          <img class="poster__mascot" :src="VOICE_FIGURES.TIPS_RAIL" alt="" aria-hidden="true" loading="lazy" />
          <h3 class="poster__copy type-brush-dry type-brush-dry--xs">{{ copy.tipsRailTitle }}</h3>
          <GuidelinesList :items="copy.tipsRailItems" />
        </div>
        <div class="board-panel">
          <h3>{{ copy.dualTitle }}</h3>
          <DualChannel>
            <template #wa>
              <p class="meta-text">{{ copy.dualWa }}</p>
              <Button size="sm" :href="whatsapp.href" target="_blank">{{ whatsapp.label }}</Button>
            </template>
            <template #web>
              <p class="meta-text">{{ copy.dualWeb }}</p>
            </template>
          </DualChannel>
        </div>
      </aside>
    </div>
  </div>
</template>
