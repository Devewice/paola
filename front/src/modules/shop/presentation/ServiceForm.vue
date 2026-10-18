<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { ShopModule } from '@modules/shop/composition.ts'
import { SHOP_ADMIN_COPY } from '@modules/shop/constants/copy.ts'
import type { ShopService } from '@modules/shop/domain/entities/ShopService.ts'
import Button from '@ui/Button.vue'
import Field from '@ui/Field.vue'
import Input from '@ui/Input.vue'
import Textarea from '@ui/Textarea.vue'
import { showToast } from '@ui/toast.ts'

const props = defineProps<{
  module: ShopModule
  clave: string
  service?: ShopService | null
}>()

const emit = defineEmits<{ saved: [service: ShopService]; cancel: [] }>()

const copy = SHOP_ADMIN_COPY
const editing = computed(() => Boolean(props.service))

function fromService(service?: ShopService | null) {
  return {
    title: service?.title ?? '',
    includesText: service?.includesText ?? '',
    handoverText: service?.handoverText ?? '',
    turnaroundText: service?.turnaroundText ?? '',
    priceCop: service?.priceCop === null || service?.priceCop === undefined ? '' : String(service.priceCop),
  }
}

const draft = ref(fromService(props.service))
const busy = ref(false)

watch(
  () => props.service,
  (service) => {
    draft.value = fromService(service)
  },
)

function optionalCount(raw: string): number | null {
  const value = raw.trim()
  if (!value) return null
  const parsed = Number(value.replace(/\D/g, ''))
  return Number.isFinite(parsed) ? parsed : null
}

async function submit() {
  busy.value = true
  const value = draft.value
  const payload = {
    title: value.title.trim(),
    includesText: value.includesText.trim(),
    handoverText: value.handoverText.trim(),
    turnaroundText: value.turnaroundText.trim(),
    priceCop: optionalCount(value.priceCop),
  }
  const result = props.service
    ? await props.module.updateService(props.service.id, payload, props.clave)
    : await props.module.publishService(payload, props.clave)
  busy.value = false
  if (!result.ok) {
    showToast(result.error.message || copy.serviceFail, 'bad')
    return
  }
  showToast(editing.value ? copy.serviceSaved : copy.serviceOk, 'ok')
  if (!editing.value) draft.value = fromService(null)
  emit('saved', result.value)
}
</script>

<template>
  <form class="admin-form" @submit.prevent="submit">
    <Field :label="copy.fieldServiceTitle">
      <Input v-model="draft.title" />
    </Field>
    <Field :label="copy.fieldIncludes">
      <Textarea v-model="draft.includesText" />
    </Field>
    <Field :label="copy.fieldHandover">
      <Input v-model="draft.handoverText" />
    </Field>
    <div class="admin-fields">
      <Field :label="copy.fieldTurnaround">
        <Input v-model="draft.turnaroundText" />
      </Field>
      <Field :label="copy.fieldPrice">
        <Input v-model="draft.priceCop" inputmode="numeric" />
      </Field>
    </div>
    <div class="admin-form__actions">
      <Button type="submit" :disabled="busy">{{ editing ? copy.save : copy.serviceCta }}</Button>
      <Button type="button" variant="ghost" @click="emit('cancel')">{{ copy.cancel }}</Button>
    </div>
  </form>
</template>
