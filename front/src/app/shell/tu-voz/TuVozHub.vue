<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useTuVoz } from '@app/shell/tu-voz/context.ts'
import type { Poll } from '@modules/polls/index.ts'
import { VOICE_COPY, VOICE_TIPS_FIGURE } from '@modules/voice/constants/copy.ts'
import { usePageReveal } from '@shared/motion/usePageReveal.ts'
import { APP_PATHS } from '@shared/http/constants.ts'
import { MASCOT } from '@shared/ui/mascot.ts'
import HubTile from '@ui/HubTile.vue'

const copy = VOICE_COPY
const bindReveal = usePageReveal()
const { deps } = useTuVoz()

const tips = computed(() => deps.value.voice.getTips().items)
const featured = computed(() => tips.value[0] ?? null)
const fines = computed(() => deps.value.voice.getFines().items)
const reports = computed(() => deps.value.voice.getReports().items)

const polls = ref<readonly Poll[]>([])
const openPolls = computed(() => polls.value.filter((poll) => poll.isOpen))

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
    <div class="hub-bento">
      <HubTile
        size="hero"
        index="02"
        voice="loigca"
        :to="APP_PATHS.TU_VOZ_TIPS"
        :mascot-src="VOICE_TIPS_FIGURE"
        :kicker="copy.featuredKicker"
        :title="copy.tipsHeading"
        :cta="copy.tileTipsCta"
        data-reveal
      >
        <p v-if="featured" class="hub-quote">
          <strong>{{ featured.title }}</strong>
          {{ featured.body }}
        </p>
        <p v-else class="hub-meta">{{ copy.featuredEmpty }}</p>
        <span class="hub-stats">
          <span class="hub-stat">
            <strong>{{ tips.length }}</strong>
            <span>{{ copy.tileTipsCount }}</span>
          </span>
        </span>
      </HubTile>

      <HubTile
        index="03"
        voice="loigca"
        :to="APP_PATHS.TU_VOZ_COMPARENDOS"
        :mascot-src="MASCOT.EN_PIE"
        :title="copy.finesHeading"
        :cta="copy.tileFinesCta"
        data-reveal
      >
        <p class="hub-meta">{{ copy.tileFinesLead }}</p>
        <span class="hub-stats">
          <span class="hub-stat">
            <strong>{{ fines.length }}</strong>
            <span>{{ copy.tileFinesCount }}</span>
          </span>
        </span>
      </HubTile>

      <HubTile
        index="04"
        voice="armargura"
        tone="armargura"
        :to="APP_PATHS.TU_VOZ_REPORTES"
        :mascot-src="MASCOT.LENTE"
        :title="copy.navReports"
        :cta="copy.tileReportsCta"
        data-reveal
      >
        <p class="hub-meta">{{ copy.reportsLead }}</p>
        <span class="hub-stats">
          <span class="hub-stat">
            <strong>{{ reports.length }}</strong>
            <span>{{ copy.tileReportsCount }}</span>
          </span>
        </span>
      </HubTile>

      <HubTile
        size="wide"
        tone="blue"
        index="05"
        :to="APP_PATHS.TU_VOZ_ENCUESTAS"
        :mascot-src="MASCOT.X5"
        :kicker="copy.tilePollsKicker"
        :title="openPolls[0]?.title ?? copy.navPolls"
        :cta="copy.tilePollsCta"
        data-reveal
      >
        <span v-if="openPolls.length" class="hub-stats">
          <span class="hub-stat">
            <strong>{{ openPolls.length }}</strong>
            <span>{{ copy.tilePollsOpen }}</span>
          </span>
        </span>
        <p v-else class="hub-meta">{{ copy.tilePollsEmpty }}</p>
      </HubTile>
    </div>
  </div>
</template>
