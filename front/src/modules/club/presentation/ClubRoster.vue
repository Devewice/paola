<script setup lang="ts">
import { computed } from 'vue'
import type { ClubModule } from '@modules/club/composition.ts'
import { CLUB_ROSTER_COPY } from '@modules/club/constants/copy.ts'
import { MASCOT } from '@shared/ui/mascot.ts'
import BoardHead from '@ui/BoardHead.vue'
import Button from '@ui/Button.vue'
import MemberCard from '@ui/MemberCard.vue'
import StepsPoster from '@ui/StepsPoster.vue'

const props = defineProps<{
  module: ClubModule
}>()

const copy = CLUB_ROSTER_COPY
const members = computed(() => props.module.getMembers())
const alliances = computed(() => props.module.getAlliances())
const join = computed(() => props.module.getJoinChannel())
</script>

<template>
  <div class="club-roster">
    <section id="integrantes" class="club-roster__block" :aria-label="copy.rosterHeading">
      <BoardHead voice="incauta" :title="copy.rosterHeading" :lead="copy.rosterLead" />
      <div v-if="members.items.length" class="club-roster__members">
        <MemberCard
          v-for="member in members.items"
          :key="member.id"
          :alias="member.alias"
          :photo-src="member.photoSrc"
          :moto="member.moto"
          :instagram-href="member.instagramHref"
        />
      </div>
      <StepsPoster
        v-else
        tone="navy"
        :kicker="copy.rosterEmptyKicker"
        :title="copy.rosterEmptyTitle"
        :lead="members.emptyCopy"
        :steps="copy.rosterEmptySteps"
        :mascot-src="MASCOT.EN_PIE"
      >
        <Button size="sm" :href="join.href" target="_blank">{{ join.cta }}</Button>
      </StepsPoster>
    </section>

    <section id="alianzas" class="club-roster__block" :aria-label="copy.alliancesHeading">
      <BoardHead voice="armargura" :title="copy.alliancesHeading" :lead="copy.alliancesLead" />
      <div v-if="alliances.items.length" class="club-roster__allies">
        <article
          v-for="(ally, index) in alliances.items"
          :key="ally.id"
          class="poster club-roster__ally"
          :class="index % 2 ? 'poster--blue' : 'poster--navy'"
        >
          <h3 class="type-brush-dry type-brush-dry--xs">{{ ally.name }}</h3>
          <p>{{ ally.support }}</p>
          <Button
            v-if="ally.href"
            variant="ghost"
            size="sm"
            :href="ally.href"
            target="_blank"
          >
            {{ copy.allianceVisit }}
          </Button>
        </article>
      </div>
      <StepsPoster
        v-else
        tone="armargura"
        :kicker="copy.alliancesEmptyKicker"
        :title="copy.alliancesEmptyTitle"
        :lead="copy.alliancesEmptyLead"
      >
        <Button size="sm" variant="ghost" :href="copy.alliancesEmptyHref">{{ copy.alliancesEmptyCta }}</Button>
      </StepsPoster>
    </section>
  </div>
</template>

<style scoped>
.club-roster {
  display: grid;
  gap: 32px;
  align-items: start;
}

.club-roster__block {
  display: grid;
  gap: 16px;
  min-width: 0;
  scroll-margin-top: 96px;
}

.club-roster__members,
.club-roster__allies {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 14rem), 1fr));
}

.club-roster__ally {
  justify-items: start;
}

@media (min-width: 960px) {
  .club-roster {
    grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
  }
}
</style>
