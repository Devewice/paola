<script setup lang="ts">
import { ref } from 'vue'
import type { ClubModule } from '@modules/club/index.ts'
import { PARCHESE_TABS } from '@modules/club/constants/copy.ts'
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
</script>

<template>
  <article :ref="bindReveal" class="paola-page">
    <AficheHero kicker="Parchese" title="El club" plate="Parche" data-reveal>
      <template #lead>
        Cuándo hay rodada, cómo unirse, quién apoya el parche y las caras que autorizaron salir.
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
      <h2 class="paola-page__heading type-display">El ciclo</h2>
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
            ? 'Hay recuento publicado. Lo rodado no se evapora.'
            : 'Cuando Paola marque realizada y publique el recuento, la memoria entra aquí.'
        }}
      </p>
    </section>

    <div v-show="tab === 'club'" data-reveal>
      <slot name="memorias" />
    </div>

    <section v-show="tab === 'club'" class="paola-page__block" aria-label="Así va el parche" data-reveal>
      <VoiceBadge voice="incauta" />
      <h2 class="paola-page__heading type-display">Así va el parche</h2>
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
        title="Nadie aún"
        :copy="members.emptyCopy"
        mascot-src="/mascota/en-pie.png"
        hide-cta
      />
    </section>

    <section v-show="tab === 'club'" class="paola-page__block" aria-label="Dónde hablamos" data-reveal>
      <VoiceBadge voice="loigca" />
      <h2 class="paola-page__heading type-display">Dónde hablamos</h2>
      <DualChannel />
      <p class="paola-page__copy">
        <router-link class="parchese-feed" to="/feed">Actividad y comunidades en el feed</router-link>
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
