<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getAppDependencies } from '@app/bootstrap.ts'
import { OG_COPY } from '@app/constants/copy.ts'
import { POLLS_COPY, type Poll } from '@modules/polls/index.ts'
import PollCard from '@modules/polls/presentation/PollCard.vue'
import { APP_PATHS, appEncuesta, appEntrarYVolver } from '@shared/http/constants.ts'
import { MASCOT } from '@shared/ui/mascot.ts'
import Button from '@ui/Button.vue'
import Empty from '@ui/Empty.vue'

const copy = POLLS_COPY
const route = useRoute()
const polls = getAppDependencies().polls

const pollId = computed(() => {
  const id = route.params.id
  return Array.isArray(id) ? (id[0] ?? '') : String(id ?? '')
})
const poll = ref<Poll | null>(null)
const state = ref<'loading' | 'ready' | 'missing'>('loading')
const accountTo = computed(() => appEntrarYVolver(appEncuesta(pollId.value)))

watch(
  pollId,
  async (id) => {
    state.value = 'loading'
    const result = await polls.get(id)
    if (id !== pollId.value) return
    poll.value = result.ok ? result.value : null
    state.value = poll.value ? 'ready' : 'missing'
    if (poll.value) document.title = `${poll.value.title} · ${OG_COPY.title}`
  },
  { immediate: true },
)

function onVoted(next: Poll) {
  poll.value = next
}
</script>

<template>
  <main class="wrap poll-page">
    <div class="poll-page__back">
      <Button variant="ghost" size="sm" :to="APP_PATHS.TU_VOZ_ENCUESTAS">{{ copy.pageBack }}</Button>
    </div>

    <PollCard
      v-if="state === 'ready' && poll"
      :key="poll.id"
      :module="polls"
      :poll="poll"
      :account-to="accountTo"
      standalone
      @voted="onVoted"
    />

    <Empty
      v-else-if="state === 'missing'"
      compact
      hide-cta
      :title="copy.pageNotFoundTitle"
      :copy="copy.pageNotFoundCopy"
      :mascot-src="MASCOT.TUMBADA"
    />
  </main>
</template>
