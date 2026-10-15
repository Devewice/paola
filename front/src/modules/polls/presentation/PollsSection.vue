<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import type { PollsModule } from '@modules/polls/composition.ts'
import { POLLS_COPY } from '@modules/polls/constants/copy.ts'
import type { Poll } from '@modules/polls/domain/entities/Poll.ts'
import PollCard from '@modules/polls/presentation/PollCard.vue'
import Button from '@ui/Button.vue'
import Empty from '@ui/Empty.vue'

const props = withDefaults(
  defineProps<{
    module: PollsModule
    accountTo: string
    outingId?: string
    featured?: boolean
    heading?: string
    lead?: string
    kicker?: string
    /** Sin encuestas, la sección no se pinta (Inicio, rodada). */
    hideEmpty?: boolean
    /** Separa abiertas y cerradas (Tu voz). */
    grouped?: boolean
    moreTo?: string
    moreLabel?: string
    compact?: boolean
    /** Encabezado a un lado y encuestas al otro (Inicio). */
    split?: boolean
  }>(),
  { hideEmpty: false, grouped: false, compact: false, split: false },
)

const copy = POLLS_COPY
const polls = ref<readonly Poll[]>([])
const loaded = ref(false)

const open = computed(() => polls.value.filter((poll) => poll.isOpen))
const closed = computed(() => polls.value.filter((poll) => !poll.isOpen))
const visible = computed(() => !props.hideEmpty || polls.value.length > 0)
async function load() {
  const result = await props.module.list({ outingId: props.outingId, featured: props.featured })
  polls.value = result.ok ? result.value : []
  loaded.value = true
}

function onVoted(poll: Poll) {
  polls.value = polls.value.map((item) => (item.id === poll.id ? poll : item))
}

watch(() => [props.module, props.outingId, props.featured], () => void load())
onMounted(() => void load())
</script>

<template>
  <section
    v-if="loaded && visible"
    class="polls-section"
    :class="{ 'polls-section--compact': compact, 'polls-section--split': split }"
  >
    <header v-if="heading" class="polls-section__head">
      <p v-if="kicker" class="polls-section__kicker">{{ kicker }}</p>
      <h2 class="polls-section__title">{{ heading }}</h2>
      <p v-if="lead" class="polls-section__lead">{{ lead }}</p>
      <div v-if="split && moreTo && moreLabel && polls.length" class="polls-section__more polls-section__more--head">
        <Button :to="moreTo" variant="ghost" size="sm">{{ moreLabel }}</Button>
      </div>
    </header>

    <Empty v-if="!polls.length" compact hide-cta :title="copy.sectionEmptyTitle" :copy="copy.sectionEmpty" />

    <template v-else-if="grouped">
      <div v-if="open.length" class="polls-section__group">
        <h3 class="polls-section__group-title">{{ copy.openHeading }}</h3>
        <div class="polls-section__grid">
          <PollCard
            v-for="poll in open"
            :key="poll.id"
            :module="module"
            :poll="poll"
            :account-to="accountTo"
            @voted="onVoted"
          />
        </div>
      </div>
      <div v-if="closed.length" class="polls-section__group">
        <h3 class="polls-section__group-title">{{ copy.closedHeading }}</h3>
        <div class="polls-section__grid">
          <PollCard
            v-for="poll in closed"
            :key="poll.id"
            :module="module"
            :poll="poll"
            :account-to="accountTo"
          />
        </div>
      </div>
    </template>

    <div v-else class="polls-section__grid">
      <PollCard
        v-for="poll in polls"
        :key="poll.id"
        :module="module"
        :poll="poll"
        :account-to="accountTo"
        :compact="compact"
        @voted="onVoted"
      />
    </div>

    <div
      v-if="moreTo && moreLabel && polls.length"
      class="polls-section__more"
      :class="{ 'polls-section__more--foot': split }"
    >
      <Button :to="moreTo" variant="ghost" size="sm">{{ moreLabel }}</Button>
    </div>
  </section>
</template>
