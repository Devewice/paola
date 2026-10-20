<script setup lang="ts">
import { computed, ref } from 'vue'
import { RIDES_ADMIN_COPY, RIDES_MEMORIES_COPY } from '@modules/rides/constants/copy.ts'
import type { RidesModule } from '@modules/rides/index.ts'
import MemoryComments from '@modules/rides/presentation/MemoryComments.vue'
import { APP_PATHS } from '@shared/http/constants.ts'
import { MASCOT } from '@shared/ui/mascot.ts'
import AdminItemTools from '@ui/AdminItemTools.vue'
import AdminSpot from '@ui/AdminSpot.vue'
import Button from '@ui/Button.vue'
import Gallery from '@ui/Gallery.vue'
import HubTile from '@ui/HubTile.vue'
import MemoriaHero from '@ui/MemoriaHero.vue'
import StatBand from '@ui/StatBand.vue'
import StepsPoster from '@ui/StepsPoster.vue'
import { showToast } from '@ui/toast.ts'

const props = defineProps<{
  module: RidesModule
  /** Sesión de quien opera rodadas en modo edición; vacía oculta las herramientas. */
  editClave?: string
  /** Sesión de quien modera comunidad en modo edición; vacía = comentarios normales. */
  moderateClave?: string
}>()

const emit = defineEmits<{ changed: [] }>()

const copy = RIDES_MEMORIES_COPY
const adminCopy = RIDES_ADMIN_COPY
const removing = ref(false)

async function removeCurrent(): Promise<void> {
  const memory = current.value
  if (!memory || !props.editClave) return
  removing.value = true
  const result = await props.module.removeMemory(memory.id, props.editClave)
  removing.value = false
  if (!result.ok) {
    showToast(result.error.message || adminCopy.memoryRemoveFail, 'bad')
    return
  }
  showToast(adminCopy.memoryRemoved, 'ok')
  selectedId.value = ''
  emit('changed')
}
const memories = computed(() => props.module.getMemories())
const selectedId = ref('')
const current = computed(
  () => memories.value.items.find((item) => item.id === selectedId.value) ?? memories.value.items[0] ?? null,
)
const archive = computed(() => memories.value.items.filter((item) => item.id !== current.value?.id))
const photoCount = computed(() =>
  memories.value.items.reduce((sum, item) => sum + item.photos.length, 0),
)
const stats = computed(() => [
  { value: String(memories.value.totalKm), label: copy.statKm },
  { value: String(photoCount.value), label: copy.statPhotos },
  { value: String(memories.value.items.length), label: copy.statRides },
])
const layoutEl = ref<HTMLElement | null>(null)

function select(id: string): void {
  selectedId.value = id
  layoutEl.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

</script>

<template>
  <section class="memorias" :aria-label="copy.aria">
    <StatBand
      v-if="memories.items.length"
      tone="blue"
      :title="copy.bandTitle"
      :items="stats"
      :mascot-src="MASCOT.LENTE"
    />
    <div v-if="current" ref="layoutEl" class="memorias__layout">
      <AdminSpot class="memorias__main" :active="Boolean(editClave)">
        <template #tools>
          <AdminItemTools
            :edit-label="adminCopy.edit"
            :remove-label="adminCopy.remove"
            :confirm-label="adminCopy.removeConfirm"
            :editable="false"
            :busy="removing"
            @remove="removeCurrent"
          />
        </template>
        <MemoriaHero
          :title="current.title"
          :meta="`${current.date} · ${current.km} km · ${current.credit}`"
          :photo-src="current.photos[0]?.src"
          :photo-label="current.title"
        />
        <Gallery :photos="current.photos" />
        <p class="paola-page__copy">{{ current.participantsText }}</p>
        <p class="paola-page__copy paola-page__copy--muted">{{ current.closingText }}</p>
        <p v-if="current.instagramHref" class="paola-page__copy paola-page__copy--muted">
          <a :href="current.instagramHref" target="_blank" rel="noopener noreferrer">{{ copy.instagram }}</a>
        </p>
      </AdminSpot>

      <aside class="memorias__rail poster poster--navy">
        <span class="board-kicker">{{ copy.railKicker }}</span>
        <dl class="hub-stats hub-stats--dl memorias__rail-stats">
          <div class="hub-stat">
            <dt><span>{{ copy.railKm }}</span></dt>
            <dd><strong>{{ current.km }}</strong></dd>
          </div>
          <div class="hub-stat">
            <dt><span>{{ copy.railPhotos }}</span></dt>
            <dd><strong>{{ current.photos.length }}</strong></dd>
          </div>
        </dl>
        <h3 class="memorias__rail-title">{{ copy.commentsHeading }}</h3>
        <p class="meta-text">{{ copy.commentsRules }}</p>
        <MemoryComments :module="module" :memory-id="current.id" :moderate-clave="moderateClave" />
      </aside>
    </div>

    <StepsPoster
      v-else
      wide
      tone="blue"
      :kicker="copy.emptyKicker"
      :title="copy.emptyTitle"
      :lead="memories.emptyCopy"
      :steps="copy.emptySteps"
      :mascot-src="MASCOT.LENTE"
    >
      <Button size="sm" :to="APP_PATHS.PARCHESE_RODADAS">{{ copy.emptyCta }}</Button>
    </StepsPoster>

    <div v-if="archive.length" class="memorias__archive">
      <h3 class="memorias__rail-title">{{ copy.archiveHeading }}</h3>
      <div class="memorias__archive-grid">
        <HubTile
          v-for="(item, index) in archive"
          :key="item.id"
          size="compact"
          :tone="index % 2 ? 'blue' : 'navy'"
          :index="String(index + 1).padStart(2, '0')"
          :image-src="item.photos[0]?.src"
          :mascot-src="item.photos[0] ? undefined : MASCOT.LENTE"
          :kicker="`${item.date} · ${item.km} km`"
          :title="item.title"
          :cta="copy.archiveCta"
          @click="select(item.id)"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
.memorias,
.memorias__main,
.memorias__rail,
.memorias__archive {
  display: grid;
  gap: 12px;
  min-width: 0;
}

.memorias {
  gap: 32px;
}

.memorias__layout {
  display: grid;
  gap: 24px 32px;
  align-items: start;
  scroll-margin-top: 96px;
}

.memorias__rail-title {
  margin: 0;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.memorias__archive-grid {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 16rem), 1fr));
}

@media (min-width: 960px) {
  .memorias__layout {
    grid-template-columns: minmax(0, 1.5fr) minmax(260px, 0.8fr);
  }
}
</style>
