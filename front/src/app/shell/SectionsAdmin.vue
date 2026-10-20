<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { SECTIONS_ADMIN_COPY, SITE_SECTIONS, type SiteSectionId } from '@app/constants/sections.ts'
import { loadSiteSections, saveSiteSection, sectionState } from '@app/shell/siteSections.ts'
import AdminPane from '@ui/AdminPane.vue'
import Button from '@ui/Button.vue'
import Choice from '@ui/Choice.vue'
import Chip from '@ui/Chip.vue'
import Input from '@ui/Input.vue'
import { showToast } from '@ui/toast.ts'

const props = defineProps<{ session: string }>()

const copy = SECTIONS_ADMIN_COPY
const drafts = reactive<Record<string, { enabled: boolean; note: string }>>({})
const busy = ref<SiteSectionId | null>(null)

function fill(): void {
  for (const section of SITE_SECTIONS) {
    const state = sectionState(section.id)
    drafts[section.id] = { enabled: state.enabled, note: state.note ?? '' }
  }
}

async function save(id: SiteSectionId): Promise<void> {
  const draft = drafts[id]
  if (!draft) return
  busy.value = id
  const result = await saveSiteSection(id, { enabled: draft.enabled, note: draft.note.trim() || undefined }, props.session)
  busy.value = null
  showToast(result.ok ? copy.saved : result.detail || copy.saveFail, result.ok ? 'ok' : 'bad')
}

fill()
onMounted(async () => {
  await loadSiteSections(true)
  fill()
})
</script>

<template>
  <AdminPane :title="copy.title" :lead="copy.lead" :count="SITE_SECTIONS.length">
    <ul class="admin-list">
      <li v-for="section in SITE_SECTIONS" :key="section.id" class="admin-list__item">
        <div v-if="drafts[section.id]" class="admin-list__main">
          <strong>{{ section.area }} · {{ section.label }}</strong>
          <div class="admin-list__chips">
            <Chip :tone="drafts[section.id]!.enabled ? 'abierto' : 'lleno'">
              {{ drafts[section.id]!.enabled ? copy.on : copy.off }}
            </Chip>
          </div>
          <Choice v-model="drafts[section.id]!.enabled" kind="switch" :label="copy.on" />
          <Input
            v-if="!drafts[section.id]!.enabled"
            v-model="drafts[section.id]!.note"
            :aria-label="copy.noteLabel"
            :placeholder="copy.notePlaceholder"
          />
        </div>
        <div class="admin-list__actions">
          <Button size="sm" :disabled="busy === section.id" @click="save(section.id)">{{ copy.save }}</Button>
        </div>
      </li>
    </ul>
  </AdminPane>
</template>
