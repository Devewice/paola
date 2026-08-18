<script setup lang="ts">
import type { ClubModule } from '@modules/club/index.ts'
import { usePageReveal } from '@shared/motion/usePageReveal.ts'
import PaolaAficheHero from '@ui/PaolaAficheHero.vue'
import PaolaAllianceStrip from '@ui/PaolaAllianceStrip.vue'
import PaolaButton from '@ui/PaolaButton.vue'
import PaolaEmpty from '@ui/PaolaEmpty.vue'
import PaolaMemberCard from '@ui/PaolaMemberCard.vue'
import PaolaTimeline from '@ui/PaolaTimeline.vue'
import PaolaVoiceBadge from '@ui/PaolaVoiceBadge.vue'
import PaolaWaStrip from '@ui/PaolaWaStrip.vue'

const props = defineProps<{
  module: ClubModule
}>()

const join = props.module.getJoinChannel()
const alliances = props.module.getAlliances()
const members = props.module.getMembers()
const bindReveal = usePageReveal()
</script>

<template>
  <article :ref="bindReveal" class="paola-page">
    <PaolaAficheHero kicker="Parchese" title="El club" plate="Parche" data-reveal>
      <template #lead>
        Cuándo hay algo, cómo te metes, quién banca y las caras que autorizaron salir.
      </template>
    </PaolaAficheHero>

    <div data-reveal>
      <slot name="agenda" />
    </div>

    <section class="paola-page__block" aria-label="Ciclo de rodada" data-reveal>
      <PaolaVoiceBadge voice="loigca" />
      <h2 class="paola-page__heading type-display">El ciclo</h2>
      <PaolaTimeline
        :steps="[
          { label: 'Creada', done: false },
          { label: 'Cupo' },
          { label: 'Rodar' },
          { label: 'Memoria' },
        ]"
      />
      <p class="paola-page__copy paola-page__copy--muted">
        La entidad de salida ya existe. Cupo, rodada y memoria entran en las fases que siguen.
      </p>
    </section>

    <section class="paola-page__block" aria-label="Así va el parche" data-reveal>
      <PaolaVoiceBadge voice="incauta" />
      <h2 class="paola-page__heading type-display">Así va el parche</h2>
      <div v-if="members.items.length" class="parchese-page__roster">
        <PaolaMemberCard
          v-for="member in members.items"
          :key="member.id"
          :alias="member.alias"
          :photo-src="member.photoSrc"
          :moto="member.moto"
          :instagram-href="member.instagramHref"
        />
      </div>
      <PaolaEmpty
        v-else
        compact
        title="Nadie aún"
        :copy="members.emptyCopy"
        mascot-src="/mascota/en-pie.png"
        hide-cta
      />
    </section>

    <section class="paola-page__block" aria-label="Únete" data-reveal>
      <PaolaVoiceBadge voice="loigca" />
      <PaolaWaStrip :title="join.title" :copy="join.copy">
        <PaolaButton variant="hero" :href="join.href" target="_blank">{{ join.cta }}</PaolaButton>
      </PaolaWaStrip>
    </section>

    <section class="paola-page__block" aria-label="Alianzas" data-reveal>
      <PaolaVoiceBadge voice="loigca" />
      <PaolaAllianceStrip
        kicker="Alianzas"
        title="Quienes apoyan"
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
    grid-template-columns: 1fr 1fr;
  }
}

.paola-page__block :deep(.paola-alliances) {
  border-left-width: 3px;
}
</style>
