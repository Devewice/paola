<script setup lang="ts">
import { ref } from 'vue'
import type { ClubModule } from '@modules/club/index.ts'
import { PARCHESE_COPY, PARCHESE_TABS } from '@modules/club/constants/copy.ts'
import { usePageReveal } from '@shared/motion/usePageReveal.ts'
import AficheHero from '@ui/AficheHero.vue'
import AllianceStrip from '@ui/AllianceStrip.vue'
import Button from '@ui/Button.vue'
import DualChannel from '@ui/DualChannel.vue'
import Empty from '@ui/Empty.vue'
import MemberCard from '@ui/MemberCard.vue'
import Tabs from '@ui/Tabs.vue'
import Timeline from '@ui/Timeline.vue'
import VoiceBadge from '@ui/VoiceBadge.vue'
import WaStrip from '@ui/WaStrip.vue'

const props = defineProps<{
  module: ClubModule
  hasMemories?: boolean
}>()

const join = props.module.getJoinChannel()
const alliances = props.module.getAlliances()
const members = props.module.getMembers()
const bindReveal = usePageReveal()
const tab = ref('club')
const copy = PARCHESE_COPY
</script>

<template>
  <article :ref="bindReveal" class="paola-page">
    <AficheHero :kicker="copy.kicker" :title="copy.title" :plate="copy.plate" data-reveal>
      <template #lead>
        {{ copy.lead }}
      </template>
    </AficheHero>

    <Tabs v-model="tab" :tabs="PARCHESE_TABS" data-reveal />

    <div v-show="tab === 'club'" data-reveal>
      <slot name="agenda" />
    </div>

    <div v-show="tab === 'actividad'" data-reveal>
      <slot name="actividad" />
    </div>

    <section v-show="tab === 'club'" class="paola-page__block" aria-label="Ciclo de rodada" data-reveal>
      <VoiceBadge voice="loigca" />
      <h2 class="paola-page__heading type-display">{{ copy.cycleHeading }}</h2>
      <Timeline
        :steps="[
          { label: 'Creada', done: true },
          { label: 'Cupo', done: true },
          { label: 'Rodar', done: true },
          { label: 'Memoria', done: props.hasMemories },
        ]"
      />
      <p class="paola-page__copy paola-page__copy--muted">
        {{
          props.hasMemories
            ? copy.cycleDone
            : copy.cyclePending
        }}
      </p>
    </section>

    <div v-show="tab === 'club'" data-reveal>
      <slot name="memorias" />
    </div>

    <section v-show="tab === 'club'" class="paola-page__block" aria-label="Así va el parche" data-reveal>
      <VoiceBadge voice="incauta" />
      <h2 class="paola-page__heading type-display">{{ copy.rosterHeading }}</h2>
      <div v-if="members.items.length" class="parchese-page__roster">
        <MemberCard
          v-for="member in members.items"
          :key="member.id"
          :alias="member.alias"
          :photo-src="member.photoSrc"
          :moto="member.moto"
          :instagram-href="member.instagramHref"
        />
      </div>
      <Empty
        v-else
        compact
        :title="copy.rosterEmptyTitle"
        :copy="members.emptyCopy"
        mascot-src="/mascota/en-pie.png"
        hide-cta
      />
    </section>

    <section v-show="tab === 'club'" class="paola-page__block" aria-label="Dónde hablamos" data-reveal>
      <VoiceBadge voice="loigca" />
      <h2 class="paola-page__heading type-display">{{ copy.talkHeading }}</h2>
      <DualChannel />
      <p class="paola-page__copy">
        <router-link class="parchese-feed" to="/feed">{{ copy.feedLink }}</router-link>
      </p>
    </section>

    <section v-show="tab === 'club'" class="paola-page__block" aria-label="Únete" data-reveal>
      <VoiceBadge voice="loigca" />
      <WaStrip :title="join.title" :copy="join.copy">
        <Button variant="hero" :href="join.href" target="_blank">{{ join.cta }}</Button>
      </WaStrip>
    </section>

    <section v-show="tab === 'club'" class="paola-page__block" aria-label="Alianzas" data-reveal>
      <VoiceBadge voice="loigca" />
      <AllianceStrip
        :kicker="copy.alliancesKicker"
        :title="copy.alliancesTitle"
        :alliances="alliances"
      />
    </section>
  </article>
</template>

<style scoped>
.parchese-page__roster {
  display: grid;
  gap: 12px;
}

@media (min-width: 640px) {
  .parchese-page__roster {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 1100px) {
  .parchese-page__roster {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

.paola-page__block :deep(.paola-alliances) {
  border-left-width: 3px;
}

.parchese-feed {
  color: var(--paola-cyan, #48b4fc);
  text-decoration: underline;
  text-underline-offset: 2px;
}
</style>
