<script setup lang="ts">
import { computed } from 'vue'
import { LEGAL_COPY } from '@app/constants/legal.ts'
import type { VoiceModule } from '@modules/voice/composition.ts'
import { VOICE_COPY } from '@modules/voice/constants/copy.ts'
import VoiceItemTools from '@modules/voice/presentation/VoiceItemTools.vue'
import AdminSpot from '@ui/AdminSpot.vue'
import ComparendoGuide from '@ui/ComparendoGuide.vue'
import DisclaimerBox from '@ui/DisclaimerBox.vue'
import Empty from '@ui/Empty.vue'

const props = defineProps<{
  module: VoiceModule
  limit?: number
  /** Sesión de quien opera Tu voz en modo edición; vacía oculta las herramientas. */
  editClave?: string
}>()

const emit = defineEmits<{ changed: [] }>()

const copy = VOICE_COPY
const fines = computed(() => props.module.getFines())
const shown = computed(() => fines.value.items.slice(0, props.limit))
</script>

<template>
  <div class="fines-grid">
    <DisclaimerBox>{{ LEGAL_COPY.finesDisclaimer }}</DisclaimerBox>
    <Empty v-if="!shown.length" :title="copy.finesEmpty" :copy="fines.emptyCopy" glyph="◎" compact hide-cta />
    <div v-else class="board-grid board-grid--numbered">
      <AdminSpot v-for="fine in shown" :key="fine.id" :active="Boolean(editClave)">
        <template #tools>
          <VoiceItemTools :module="module" :clave="editClave ?? ''" :fine="fine" @changed="emit('changed')" />
        </template>
        <ComparendoGuide
          voice="loigca"
          :title="fine.title"
          :copy="fine.guide"
          :official-href="fine.officialHref"
          :official-label="copy.finesOfficial"
          :disclaimer="fine.disclaimer"
        />
      </AdminSpot>
    </div>
  </div>
</template>

<style scoped>
.fines-grid {
  display: grid;
  gap: 16px;
  min-width: 0;
}
</style>
