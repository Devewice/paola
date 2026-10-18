<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { ClubModule } from '@modules/club/composition.ts'
import { CLUB_ADMIN_COPY } from '@modules/club/constants/copy.ts'
import AllianceForm from '@modules/club/presentation/AllianceForm.vue'
import ClubItemTools from '@modules/club/presentation/ClubItemTools.vue'
import MemberForm from '@modules/club/presentation/MemberForm.vue'
import AdminDrawer from '@ui/AdminDrawer.vue'
import AdminPane from '@ui/AdminPane.vue'
import Button from '@ui/Button.vue'
import FilterPills from '@ui/FilterPills.vue'

const props = defineProps<{
  module: ClubModule
  clave: string
  /** `integrante` o `alianza`: abre ese formulario al entrar. */
  create?: string
  stamp?: number
}>()

const emit = defineEmits<{ published: [] }>()

const copy = CLUB_ADMIN_COPY

const tab = ref(props.create === 'alianza' ? 'alianzas' : 'integrantes')
const memberOpen = ref(props.create === 'integrante')
const allianceOpen = ref(props.create === 'alianza')

watch(
  () => props.create,
  (value) => {
    if (!value) return
    tab.value = value === 'alianza' ? 'alianzas' : 'integrantes'
    memberOpen.value = value === 'integrante'
    allianceOpen.value = value === 'alianza'
  },
)

const members = computed(() => {
  void props.stamp
  return props.module.getMembers().items
})
const alliances = computed(() => {
  void props.stamp
  return props.module.getAlliances().items
})

const tabs = computed(() => [
  { id: 'integrantes', label: `${copy.tabMembers} · ${members.value.length}` },
  { id: 'alianzas', label: `${copy.tabAlliances} · ${alliances.value.length}` },
])

function onMemberSaved() {
  memberOpen.value = false
  emit('published')
}

function onAllianceSaved() {
  allianceOpen.value = false
  emit('published')
}
</script>

<template>
  <div class="admin-stack">
    <FilterPills v-model="tab" :pills="tabs" />

    <AdminPane
      v-if="tab === 'integrantes'"
      :title="copy.currentMembers"
      :lead="copy.membersLead"
      :count="members.length"
    >
      <template #actions>
        <Button size="sm" @click="memberOpen = true">+ {{ copy.newMember }}</Button>
      </template>
      <p v-if="!members.length" class="admin-empty">{{ copy.none }}</p>
      <ul v-else class="admin-list">
        <li v-for="member in members" :key="member.id" class="admin-list__item admin-list__item--compact">
          <div class="admin-list__main">
            <strong>{{ member.alias }}</strong>
            <span v-if="member.moto || member.instagramHref" class="admin-list__meta">
              {{ [member.moto, member.instagramHref].filter(Boolean).join(' · ') }}
            </span>
          </div>
          <ClubItemTools :module="module" :clave="clave" :member="member" @changed="emit('published')" />
        </li>
      </ul>
    </AdminPane>

    <AdminPane v-else :title="copy.currentAlliances" :lead="copy.alliancesLead" :count="alliances.length">
      <template #actions>
        <Button size="sm" @click="allianceOpen = true">+ {{ copy.newAlliance }}</Button>
      </template>
      <p v-if="!alliances.length" class="admin-empty">{{ copy.none }}</p>
      <ul v-else class="admin-list">
        <li v-for="ally in alliances" :key="ally.id" class="admin-list__item admin-list__item--compact">
          <div class="admin-list__main">
            <strong>{{ ally.name }}</strong>
            <span class="admin-list__meta">{{ ally.support }}</span>
          </div>
          <ClubItemTools :module="module" :clave="clave" :alliance="ally" @changed="emit('published')" />
        </li>
      </ul>
    </AdminPane>

    <AdminDrawer v-model="memberOpen" :title="copy.memberTitle" :lead="copy.memberLead">
      <MemberForm :module="module" :clave="clave" @saved="onMemberSaved" @cancel="memberOpen = false" />
    </AdminDrawer>
    <AdminDrawer v-model="allianceOpen" :title="copy.allianceTitle" :lead="copy.allianceLead">
      <AllianceForm :module="module" :clave="clave" @saved="onAllianceSaved" @cancel="allianceOpen = false" />
    </AdminDrawer>
  </div>
</template>
