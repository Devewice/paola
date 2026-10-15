<script setup lang="ts">
import { computed } from 'vue'
import type { VoiceModule } from '@modules/voice/composition.ts'
import { VOICE_COPY } from '@modules/voice/constants/copy.ts'
import Empty from '@ui/Empty.vue'

const props = defineProps<{
  module: VoiceModule
  limit?: number
  featured?: boolean
}>()

const copy = VOICE_COPY
const tips = computed(() => props.module.getTips())
const shown = computed(() => tips.value.items.slice(0, props.limit))
</script>

<template>
  <Empty v-if="!shown.length" :title="copy.tipsEmpty" :copy="tips.emptyCopy" glyph="◎" compact hide-cta />
  <div v-else class="board-grid" :class="{ 'board-grid--feature': featured }">
    <article v-for="tip in shown" :key="tip.id" class="board-card">
      <h3>{{ tip.title }}</h3>
      <p>{{ tip.body }}</p>
      <a
        v-if="tip.officialHref"
        class="board-card__link"
        :href="tip.officialHref"
        target="_blank"
        rel="noopener noreferrer"
      >
        {{ copy.tipOfficial }}
      </a>
    </article>
  </div>
</template>
