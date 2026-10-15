<script setup lang="ts">
import { computed, ref } from 'vue'
import type { ClubModule } from '@modules/club/composition.ts'
import { CLUB_ADMIN_COPY } from '@modules/club/constants/copy.ts'
import Button from '@ui/Button.vue'
import Field from '@ui/Field.vue'
import Input from '@ui/Input.vue'
import { showToast } from '@ui/toast.ts'

const props = defineProps<{
  module: ClubModule
  clave: string
  stamp?: number
}>()

const emit = defineEmits<{ published: [] }>()

const copy = CLUB_ADMIN_COPY

const member = ref({ alias: '', moto: '', instagramHref: '' })
const alliance = ref({ name: '', support: '', href: '' })
const busy = ref<string | null>(null)

const members = computed(() => {
  void props.stamp
  return props.module.getMembers().items
})
const alliances = computed(() => {
  void props.stamp
  return props.module.getAlliances().items
})

async function addMember() {
  busy.value = 'member'
  const draft = member.value
  const result = await props.module.createMember(
    {
      alias: draft.alias.trim(),
      moto: draft.moto.trim() || undefined,
      instagramHref: draft.instagramHref.trim() || undefined,
    },
    props.clave,
  )
  busy.value = null
  if (!result.ok) {
    showToast(result.error.message || copy.memberFail, 'bad')
    return
  }
  member.value = { alias: '', moto: '', instagramHref: '' }
  showToast(copy.memberOk, 'ok')
  emit('published')
}

async function addAlliance() {
  busy.value = 'alliance'
  const draft = alliance.value
  const result = await props.module.createAlliance(
    {
      name: draft.name.trim(),
      support: draft.support.trim(),
      href: draft.href.trim() || undefined,
    },
    props.clave,
  )
  busy.value = null
  if (!result.ok) {
    showToast(result.error.message || copy.allianceFail, 'bad')
    return
  }
  alliance.value = { name: '', support: '', href: '' }
  showToast(copy.allianceOk, 'ok')
  emit('published')
}
</script>

<template>
  <div class="admin-grid">
    <form class="admin-card" @submit.prevent="addMember">
      <header class="admin-card__head">
        <h3>{{ copy.memberTitle }}</h3>
        <p>{{ copy.memberLead }}</p>
      </header>
      <Field :label="copy.fieldAlias">
        <Input v-model="member.alias" />
      </Field>
      <div class="admin-fields">
        <Field :label="copy.fieldMoto">
          <Input v-model="member.moto" />
        </Field>
        <Field :label="copy.fieldInstagram">
          <Input v-model="member.instagramHref" type="url" placeholder="https://instagram.com/" />
        </Field>
      </div>
      <Button type="submit" size="sm" :disabled="busy === 'member'">{{ copy.memberCta }}</Button>
      <p class="admin-list__meta">
        {{ copy.currentMembers }}:
        {{ members.length ? members.map((item) => item.alias).join(' · ') : copy.none }}
      </p>
    </form>

    <form class="admin-card" @submit.prevent="addAlliance">
      <header class="admin-card__head">
        <h3>{{ copy.allianceTitle }}</h3>
        <p>{{ copy.allianceLead }}</p>
      </header>
      <Field :label="copy.fieldName">
        <Input v-model="alliance.name" />
      </Field>
      <Field :label="copy.fieldSupport">
        <Input v-model="alliance.support" />
      </Field>
      <Field :label="copy.fieldHref">
        <Input v-model="alliance.href" type="url" placeholder="https://" />
      </Field>
      <Button type="submit" size="sm" :disabled="busy === 'alliance'">{{ copy.allianceCta }}</Button>
      <p class="admin-list__meta">
        {{ copy.currentAlliances }}:
        {{ alliances.length ? alliances.map((item) => item.name).join(' · ') : copy.none }}
      </p>
    </form>
  </div>
</template>
