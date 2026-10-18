<script setup lang="ts">
import { computed, ref } from 'vue'
import type { VoiceModule } from '@modules/voice/composition.ts'
import { VOICE_ADMIN_COPY, VOICE_COPY } from '@modules/voice/constants/copy.ts'
import type { VoiceReport } from '@modules/voice/domain/entities/Report.ts'
import AdminItemTools from '@ui/AdminItemTools.vue'
import AdminSpot from '@ui/AdminSpot.vue'
import DenunciaCard from '@ui/DenunciaCard.vue'
import Empty from '@ui/Empty.vue'
import { showToast } from '@ui/toast.ts'

const props = defineProps<{
  module: VoiceModule
  limit?: number
  /** Sesión de quien modera Tu voz en modo edición; vacía oculta las herramientas. */
  editClave?: string
}>()

const emit = defineEmits<{ changed: [] }>()

const copy = VOICE_COPY
const adminCopy = VOICE_ADMIN_COPY
const reports = computed(() => props.module.getReports())
const shown = computed(() => reports.value.items.slice(0, props.limit))
const busy = ref<string | null>(null)

async function hide(report: VoiceReport): Promise<void> {
  if (!props.editClave) return
  busy.value = report.id
  const result = await props.module.moderateReport(report.id, 'hidden', props.editClave)
  busy.value = null
  if (!result.ok) {
    showToast(result.error.message || adminCopy.reportFail, 'bad')
    return
  }
  showToast(adminCopy.reportOk, 'ok')
  emit('changed')
}
</script>

<template>
  <Empty v-if="!shown.length" :title="copy.publishedEmpty" :copy="reports.emptyCopy" glyph="◎" compact hide-cta />
  <div v-else class="reports-list">
    <AdminSpot v-for="item in shown" :key="item.id" :active="Boolean(editClave)">
      <template #tools>
        <AdminItemTools
          :edit-label="adminCopy.edit"
          :remove-label="adminCopy.reportHide"
          :confirm-label="adminCopy.removeConfirm"
          :editable="false"
          :busy="busy === item.id"
          @remove="hide(item)"
        />
      </template>
      <DenunciaCard
        :title="item.title"
        :meta="`${item.whereText} · ${item.happenedAt}`"
        :status="copy.statusPublished"
      />
    </AdminSpot>
  </div>
</template>

<style scoped>
.reports-list {
  display: grid;
  gap: 12px;
}
</style>
