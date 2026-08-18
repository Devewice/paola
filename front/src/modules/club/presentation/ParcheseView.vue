<script setup lang="ts">
import type { ClubModule } from '@modules/club/index.ts'
import PaolaAllianceStrip from '@ui/PaolaAllianceStrip.vue'
import PaolaButton from '@ui/PaolaButton.vue'
import PaolaMemberCard from '@ui/PaolaMemberCard.vue'
import PaolaVoiceBadge from '@ui/PaolaVoiceBadge.vue'
import PaolaWaStrip from '@ui/PaolaWaStrip.vue'

const props = defineProps<{
  module: ClubModule
}>()

const join = props.module.getJoinChannel()
const alliances = props.module.getAlliances()
const members = props.module.getMembers()
</script>

<template>
  <article class="parchese-page">
    <header class="parchese-page__hero">
      <p class="paola-empty__kicker">Parchese</p>
      <h1 class="parchese-page__title type-display">El club</h1>
      <p class="parchese-page__lead">
        Cuándo hay algo, cómo te metes, quién banca y las caras que autorizaron salir.
      </p>
    </header>

    <slot name="agenda" />

    <section class="parchese-page__members" aria-label="Así va el parche">
      <PaolaVoiceBadge voice="incauta" />
      <h2 class="parchese-page__heading type-display">Así va el parche</h2>
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
      <p v-else class="parchese-page__empty">{{ members.emptyCopy }}</p>
    </section>

    <section class="parchese-page__join" aria-label="Únete">
      <PaolaVoiceBadge voice="loigca" />
      <PaolaWaStrip :title="join.title" :copy="join.copy">
        <PaolaButton :href="join.href" target="_blank">{{ join.cta }}</PaolaButton>
      </PaolaWaStrip>
    </section>

    <section class="parchese-page__alliances" aria-label="Alianzas">
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
.parchese-page {
  max-width: 40rem;
  margin: 0 auto;
  padding: calc(var(--paola-space) * 4) calc(var(--paola-space) * 2)
    calc(var(--paola-space) * 8);
  display: grid;
  gap: calc(var(--paola-space) * 5);
}

.parchese-page__hero {
  display: grid;
  gap: 8px;
}

.parchese-page__title {
  margin: 0;
  font-size: 40px;
}

.parchese-page__lead {
  margin: 0;
  color: var(--paola-muted);
  font-size: 16px;
  line-height: 1.5;
}

.parchese-page__join,
.parchese-page__alliances,
.parchese-page__members {
  display: grid;
  gap: 12px;
}

.parchese-page__heading {
  margin: 0;
  font-size: 22px;
}

.parchese-page__roster {
  display: grid;
  gap: 12px;
}

.parchese-page__empty {
  margin: 0;
  color: var(--paola-muted);
  font-size: 15px;
  line-height: 1.5;
}

.parchese-page__alliances :deep(.paola-alliances) {
  border-left-width: 3px;
}
</style>
