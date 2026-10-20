<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { OPERAR_QUERY } from '@app/constants/operar.ts'
import { SECTION_GATE_COPY } from '@app/constants/sections.ts'
import { COMING_SOON_DEFAULT_TITLE } from '@app/constants/copy.ts'
import { loadSiteSections, sectionState } from '@app/shell/siteSections.ts'
import { useOperarAccess } from '@app/shell/useOperarAccess.ts'
import { APP_PATHS } from '@shared/http/constants.ts'
import AppLink from '@ui/AppLink.vue'
import PageVacant from '@ui/PageVacant.vue'

/** Sección apagada: el público ve «en construcción»; quien opera ve el contenido con un aviso. */
const route = useRoute()
const { gate } = useOperarAccess()

const sectionId = computed(() => (typeof route.meta.section === 'string' ? route.meta.section : undefined))
const state = computed(() => sectionState(sectionId.value))
const closed = computed(() => !state.value.enabled)
const preview = computed(() => closed.value && gate.value === 'ready')
const title = computed(() => String(route.meta.title ?? COMING_SOON_DEFAULT_TITLE))
const panelTo = `${APP_PATHS.ADMIN}?${OPERAR_QUERY.SECTION}=secciones`

onMounted(() => {
  void loadSiteSections()
})
</script>

<template>
  <PageVacant v-if="closed && !preview" :title="title" :copy="state.note" />
  <template v-else>
    <div v-if="preview" class="section-gate__banner" role="status">
      <span>{{ SECTION_GATE_COPY.adminBanner }}</span>
      <AppLink :to="panelTo">{{ SECTION_GATE_COPY.adminCta }}</AppLink>
    </div>
    <slot />
  </template>
</template>
