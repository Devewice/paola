<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { ShopModule } from '@modules/shop/composition.ts'
import { SHOP_ADMIN_COPY, SHOP_CATEGORY_CHECKS, SHOP_KIND } from '@modules/shop/constants/copy.ts'
import type { Product, ProductKind } from '@modules/shop/domain/entities/Product.ts'
import Button from '@ui/Button.vue'
import Field from '@ui/Field.vue'
import Input from '@ui/Input.vue'
import Select from '@ui/Select.vue'
import Textarea from '@ui/Textarea.vue'
import { showToast } from '@ui/toast.ts'

const props = defineProps<{
  module: ShopModule
  clave: string
  product?: Product | null
}>()

const emit = defineEmits<{ saved: [product: Product]; cancel: [] }>()

const copy = SHOP_ADMIN_COPY
const editing = computed(() => Boolean(props.product))

function fromProduct(product?: Product | null) {
  return {
    title: product?.title ?? '',
    description: product?.description ?? '',
    kind: (product?.kind ?? SHOP_KIND.OWN) as ProductKind,
    category: product?.category ?? '',
    priceCop: product?.priceCop === null || product?.priceCop === undefined ? '' : String(product.priceCop),
    stock: product?.stock === null || product?.stock === undefined ? '' : String(product.stock),
    photoSrc: product?.photoSrc ?? '',
  }
}

const draft = ref(fromProduct(props.product))
const busy = ref(false)

watch(
  () => props.product,
  (product) => {
    draft.value = fromProduct(product)
  },
)

const kindOptions = [
  { value: SHOP_KIND.OWN, label: copy.kindOwn },
  { value: SHOP_KIND.COLLAB, label: copy.kindCollab },
]
const categoryOptions = [{ value: '', label: copy.categoryNone }, ...SHOP_CATEGORY_CHECKS]

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
    description: value.description.trim(),
    kind: value.kind,
    category: value.category || undefined,
    priceCop: optionalCount(value.priceCop),
    stock: optionalCount(value.stock),
    photoSrc: value.photoSrc.trim() || undefined,
  }
  const result = props.product
    ? await props.module.updateProduct(props.product.id, payload, props.clave)
    : await props.module.publishProduct(payload, props.clave)
  busy.value = false
  if (!result.ok) {
    showToast(result.error.message || copy.productFail, 'bad')
    return
  }
  showToast(editing.value ? copy.productSaved : copy.productOk, 'ok')
  if (!editing.value) draft.value = fromProduct(null)
  emit('saved', result.value)
}
</script>

<template>
  <form class="admin-form" @submit.prevent="submit">
    <Field :label="copy.fieldTitle">
      <Input v-model="draft.title" />
    </Field>
    <Field :label="copy.fieldDescription">
      <Textarea v-model="draft.description" />
    </Field>
    <div class="admin-fields">
      <Select v-model="draft.kind" :label="copy.fieldKind" :options="kindOptions" />
      <Select v-model="draft.category" :label="copy.fieldCategory" :options="categoryOptions" />
    </div>
    <div class="admin-fields">
      <Field :label="copy.fieldPrice">
        <Input v-model="draft.priceCop" inputmode="numeric" />
      </Field>
      <Field :label="copy.fieldStock">
        <Input v-model="draft.stock" type="number" />
      </Field>
    </div>
    <Field :label="copy.fieldPhoto">
      <Input v-model="draft.photoSrc" type="url" placeholder="https://" />
    </Field>
    <div class="admin-form__actions">
      <Button type="submit" :disabled="busy">{{ editing ? copy.save : copy.productCta }}</Button>
      <Button type="button" variant="ghost" @click="emit('cancel')">{{ copy.cancel }}</Button>
    </div>
  </form>
</template>
