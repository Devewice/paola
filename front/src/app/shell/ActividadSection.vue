<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { parseActivityItem, type ActivityItem } from '@app/parseActivityItem.ts'
import { SOCIAL_COPY } from '@app/constants/social.ts'
import { API, APP_PATHS } from '@shared/http/constants.ts'
import { MASCOT } from '@shared/ui/mascot.ts'
import DualChannel from '@ui/DualChannel.vue'
import Empty from '@ui/Empty.vue'
import VoiceBadge from '@ui/VoiceBadge.vue'

const copy = SOCIAL_COPY
const items = ref<readonly ActivityItem[]>([])

onMounted(async () => {
  try {
    const response = await fetch(API.ACTIVITY)
    if (!response.ok) return
    const body = (await response.json()) as Record<string, unknown>
    const raw = Array.isArray(body.items) ? body.items : []
    items.value = raw
      .map((row) => parseActivityItem(row))
      .filter((item): item is ActivityItem => item !== null)
  } catch {
    items.value = []
  }
})

function kindLabel(kind: ActivityItem['kind']): string {
  if (kind === 'outing') return copy.activityOuting
  if (kind === 'memory') return copy.activityMemory
  return copy.activityPost
}

function hrefFor(item: ActivityItem): string {
  return item.kind === 'post' ? APP_PATHS.FEED : APP_PATHS.PARCHESE
}
</script>

<template>
  <section class="actividad" :aria-label="copy.activityHeading">
    <VoiceBadge voice="incauta" />
    <h2 class="paola-page__heading type-display">{{ copy.activityHeading }}</h2>
    <p class="paola-page__copy paola-page__copy--muted">{{ copy.activityLead }}</p>
    <DualChannel />
    <p class="paola-page__copy">
      <router-link class="actividad-link" :to="APP_PATHS.FEED">{{ copy.feedLink }}</router-link>
    </p>
    <ul v-if="items.length" class="actividad-list">
      <li v-for="item in items" :key="`${item.kind}-${item.id}`">
        <span class="paola-empty__kicker">{{ kindLabel(item.kind) }}</span>
        <span v-if="item.highlighted"> · {{ copy.activityHighlighted }}</span>
        <router-link class="actividad-link" :to="hrefFor(item)">{{ item.title }}</router-link>
      </li>
    </ul>
    <Empty
      v-else
      compact
      hide-cta
      :title="copy.activityEmptyTitle"
      :copy="copy.activityEmpty"
      :mascot-src="MASCOT.TUMBADA"
    />
  </section>
</template>

<style scoped>
.actividad,
.actividad-list {
  display: grid;
  gap: 12px;
}
.actividad-list {
  margin: 0;
  padding-left: 1.2rem;
}
.actividad-link {
  color: var(--paola-cyan, #48b4fc);
  text-decoration: underline;
  text-underline-offset: 2px;
}
</style>
