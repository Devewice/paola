<script setup lang="ts">
import { computed } from 'vue'
import type { ClubModule } from '@modules/club/composition.ts'
import { CLUB_ROSTER_COPY } from '@modules/club/constants/copy.ts'
import { MASCOT } from '@shared/ui/mascot.ts'
import Button from '@ui/Button.vue'
import Empty from '@ui/Empty.vue'
import MemberCard from '@ui/MemberCard.vue'
import VoiceBadge from '@ui/VoiceBadge.vue'

const props = defineProps<{
  module: ClubModule
}>()

const copy = CLUB_ROSTER_COPY
const members = computed(() => props.module.getMembers())
const alliances = computed(() => props.module.getAlliances())
</script>

<template>
  <div class="club-roster">
    <section id="integrantes" class="club-roster__block" :aria-label="copy.rosterHeading">
      <header class="club-roster__head">
        <VoiceBadge voice="incauta" />
        <div>
          <h2 class="paola-page__heading type-display">{{ copy.rosterHeading }}</h2>
          <p class="paola-page__copy paola-page__copy--muted">{{ copy.rosterLead }}</p>
        </div>
      </header>
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
      <Empty
        v-else
        compact
        hide-cta
        :title="copy.rosterEmptyTitle"
        :copy="members.emptyCopy"
        :mascot-src="MASCOT.EN_PIE"
      />
    </section>

    <section id="alianzas" class="club-roster__block" :aria-label="copy.alliancesHeading">
      <header class="club-roster__head">
        <div>
          <h2 class="paola-page__heading type-display">{{ copy.alliancesHeading }}</h2>
          <p class="paola-page__copy paola-page__copy--muted">{{ copy.alliancesLead }}</p>
        </div>
      </header>
      <div v-if="alliances.items.length" class="club-roster__allies">
        <article v-for="ally in alliances.items" :key="ally.id" class="club-roster__ally">
          <h3>{{ ally.name }}</h3>
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
      <Empty
        v-else
        compact
        hide-cta
        glyph="◎"
        :title="copy.alliancesEmptyTitle"
        :copy="alliances.emptyCopy"
      />
    </section>
  </div>
</template>

<style scoped>
.club-roster {
  display: grid;
  gap: 24px 32px;
  align-items: start;
}

.club-roster__block {
  display: grid;
  gap: 16px;
  min-width: 0;
  scroll-margin-top: 96px;
}

.club-roster__head {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 12px 16px;
}

.club-roster__members {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 14rem), 1fr));
}

.club-roster__allies {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 14rem), 1fr));
}

.club-roster__ally {
  display: grid;
  gap: 8px;
  align-content: start;
  padding: 16px;
  border: 1px solid rgba(26, 42, 64, 0.95);
  border-radius: 10px;
  background: rgba(5, 7, 12, 0.55);
}

.club-roster__ally h3 {
  margin: 0;
  font-size: 16px;
}

.club-roster__ally p {
  margin: 0;
  color: var(--paola-muted, #9aa3b2);
  font-size: 14px;
  line-height: 1.45;
}

@media (min-width: 960px) {
  .club-roster {
    grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
  }
}
</style>
