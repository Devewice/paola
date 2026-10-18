<script setup lang="ts">
import { LEGAL_COPY } from '@app/constants/legal.ts'
import { refreshInventory } from '@app/bootstrap.ts'
import { useAdminEdit } from '@app/shell/adminMode.ts'
import { useTuVoz } from '@app/shell/tu-voz/context.ts'
import { VOICE_COPY } from '@modules/voice/constants/copy.ts'
import FinesGrid from '@modules/voice/presentation/FinesGrid.vue'
import { usePageReveal } from '@shared/motion/usePageReveal.ts'
import { APP_PATHS } from '@shared/http/constants.ts'
import Button from '@ui/Button.vue'
import DisclaimerBox from '@ui/DisclaimerBox.vue'

const copy = VOICE_COPY
const legal = LEGAL_COPY
const bindReveal = usePageReveal()
const { deps } = useTuVoz()
const { claveFor } = useAdminEdit()
</script>

<template>
  <div :ref="bindReveal" class="board">
    <div class="board-split" data-reveal>
      <div class="board-main">
        <FinesGrid :module="deps.voice" :edit-clave="claveFor('voz')" @changed="refreshInventory" />
      </div>
      <aside class="board-rail">
        <div class="poster poster--navy">
          <h3 class="type-brush-dry type-brush-dry--xs">{{ copy.finesRailTitle }}</h3>
          <DisclaimerBox tone="info">{{ legal.notLegalAdvice }}</DisclaimerBox>
          <Button variant="ghost" size="sm" :to="APP_PATHS.PRIVACIDAD">{{ legal.voiceLink }}</Button>
        </div>
      </aside>
    </div>
  </div>
</template>
