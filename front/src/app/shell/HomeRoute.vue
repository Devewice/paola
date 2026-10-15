<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { getAppDependencies, refreshInventory } from '@app/bootstrap.ts'
import HomeView from '@modules/home/presentation/HomeView.vue'
import { POLLS_COPY } from '@modules/polls/index.ts'
import { POLLS_HOME_FIGURE } from '@modules/polls/constants/copy.ts'
import PollsSection from '@modules/polls/presentation/PollsSection.vue'
import { APP_PATHS } from '@shared/http/constants.ts'
import Button from '@ui/Button.vue'
import StepsPoster from '@ui/StepsPoster.vue'

const stamp = ref(0)
const hasPolls = ref(false)

onMounted(async () => {
  await refreshInventory()
  stamp.value += 1
})

const deps = computed(() => {
  stamp.value
  return getAppDependencies()
})

watch(
  () => deps.value.polls,
  async (module) => {
    const result = await module.list({ featured: true })
    hasPolls.value = result.ok && result.value.length > 0
  },
  { immediate: true },
)
</script>

<template>
  <HomeView :module="deps.home">
    <template v-if="hasPolls" #polls>
      <div class="home-polls-split">
        <StepsPoster
          class="poster--mascot-top home-polls-split__intro"
          tone="blue"
          :kicker="POLLS_COPY.homeKicker"
          :title="POLLS_COPY.sectionHeading"
          :lead="POLLS_COPY.sectionLead"
          :steps="POLLS_COPY.homeSteps"
          :mascot-src="POLLS_HOME_FIGURE"
        >
          <Button variant="ghost" size="sm" :to="APP_PATHS.TU_VOZ_ENCUESTAS">{{ POLLS_COPY.homeCta }}</Button>
        </StepsPoster>
        <PollsSection :module="deps.polls" :account-to="APP_PATHS.ENTRAR" featured hide-empty />
      </div>
    </template>
  </HomeView>
</template>

<style scoped>
.home-polls-split {
  display: grid;
  gap: 24px;
  align-items: start;
}

.home-polls-split :deep(.polls-section__grid) {
  grid-template-columns: minmax(0, 1fr);
}

.home-polls-split__intro :deep(.poster__mascot) {
  max-width: 34%;
  max-height: 120px;
}

@media (min-width: 960px) {
  .home-polls-split {
    grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
    gap: 32px;
  }

  .home-polls-split__intro {
    position: sticky;
    top: 96px;
  }
}
</style>
