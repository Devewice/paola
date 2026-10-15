<script setup lang="ts">
import { computed } from 'vue'
import { PARCHESE_COPY, PARCHESE_FIGURES } from '@app/constants/parchese.ts'
import { useParchese } from '@app/shell/parchese/context.ts'
import { APP_PATHS } from '@shared/http/constants.ts'
import Button from '@ui/Button.vue'
import DualChannel from '@ui/DualChannel.vue'
import GuidelinesList from '@ui/GuidelinesList.vue'

const copy = PARCHESE_COPY
const { deps } = useParchese()
const join = computed(() => deps.value.club.getJoinChannel())
</script>

<template>
  <aside class="board-rail">
    <div class="poster poster--blue has-mascot">
      <img class="poster__mascot" :src="PARCHESE_FIGURES.JOIN" alt="" aria-hidden="true" loading="lazy" />
      <div class="poster__copy">
        <h3 class="type-brush-dry type-brush-dry--xs">{{ copy.railJoinTitle }}</h3>
        <p>{{ join.copy }}</p>
        <Button size="sm" :href="join.href" target="_blank">{{ join.cta }}</Button>
      </div>
    </div>
    <div class="board-panel">
      <h3>{{ copy.railHowTitle }}</h3>
      <GuidelinesList :items="copy.railHowItems" />
    </div>
    <div class="board-panel">
      <h3>{{ copy.railTalkTitle }}</h3>
      <DualChannel>
        <template #wa>
          <p class="meta-text">{{ copy.railTalkWa }}</p>
        </template>
        <template #web>
          <p class="meta-text">{{ copy.railTalkWeb }}</p>
          <Button variant="ghost" size="sm" :to="APP_PATHS.FEED">{{ copy.railFeed }}</Button>
        </template>
      </DualChannel>
    </div>
  </aside>
</template>
