<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useTuVoz } from '@app/shell/tu-voz/context.ts'
import type { Poll } from '@modules/polls/index.ts'
import PollsSection from '@modules/polls/presentation/PollsSection.vue'
import { VOICE_COPY, VOICE_FIGURES } from '@modules/voice/constants/copy.ts'
import { usePageReveal } from '@shared/motion/usePageReveal.ts'
import { APP_PATHS } from '@shared/http/constants.ts'
import Button from '@ui/Button.vue'
import HubTile from '@ui/HubTile.vue'
import StatBand from '@ui/StatBand.vue'
import StepsPoster from '@ui/StepsPoster.vue'

const copy = VOICE_COPY
const bindReveal = usePageReveal()
const { deps, whatsapp } = useTuVoz()
const polls = ref<readonly Poll[]>([])
const band = computed(() => [
  { value: polls.value.filter((poll) => poll.isOpen).length, label: copy.bandPollsOpen },
  { value: polls.value.filter((poll) => !poll.isOpen).length, label: copy.bandPollsClosed },
  { value: polls.value.filter((poll) => poll.hasVoted).length, label: copy.bandPollsVoted },
])

watch(
  () => deps.value.polls,
  async (module) => {
    const result = await module.list()
    polls.value = result.ok ? result.value : []
  },
  { immediate: true },
)
</script>

<template>
  <div :ref="bindReveal" class="board">
    <StatBand
      v-if="polls.length"
      tone="blue"
      :kicker="copy.tilePollsKicker"
      :title="copy.bandPollsTitle"
      :items="band"
      :mascot-src="VOICE_FIGURES.POLLS_BAND"
      data-reveal
    />
    <div class="board-split" data-reveal>
      <div class="board-main">
        <PollsSection :module="deps.polls" :account-to="APP_PATHS.ENTRAR" grouped />
      </div>
      <aside class="board-rail">
        <StepsPoster
          tone="navy"
          :kicker="copy.pollsHowKicker"
          :title="copy.pollsHowTitle"
          :steps="copy.pollsHowSteps"
        />
        <HubTile
          size="compact"
          tone="blue"
          :to="copy.pollsRideTo"
          :kicker="copy.pollsRideKicker"
          :title="copy.pollsRideTitle"
          :cta="copy.pollsRideCta"
          :mascot-src="VOICE_FIGURES.POLLS_RIDE"
        />
        <StepsPoster
          tone="armargura"
          :kicker="copy.pollsIdeaKicker"
          :title="copy.pollsIdeaTitle"
          :lead="copy.pollsIdeaLead"
        >
          <Button size="sm" :href="whatsapp.href" target="_blank">{{ whatsapp.label }}</Button>
        </StepsPoster>
      </aside>
    </div>
  </div>
</template>
