<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { ShopModule } from '@modules/shop/composition.ts'
import { SHOP_ADMIN_COPY, SHOP_CATEGORY_CHECKS, SHOP_KIND } from '@modules/shop/constants/copy.ts'
import type { ProductKind } from '@modules/shop/domain/entities/Product.ts'
import type { ServiceOrder } from '@modules/shop/domain/entities/ServiceOrder.ts'
import Button from '@ui/Button.vue'
import Chip from '@ui/Chip.vue'
import Field from '@ui/Field.vue'
import Input from '@ui/Input.vue'
import Select from '@ui/Select.vue'
import Textarea from '@ui/Textarea.vue'
import { showToast } from '@ui/toast.ts'

const props = defineProps<{
  module: ShopModule
  clave: string
}>()

const emit = defineEmits<{ published: [] }>()

const copy = SHOP_ADMIN_COPY

const emptyProduct = () => ({
  title: '',
  description: '',
  kind: SHOP_KIND.OWN as ProductKind,
  category: '',
  priceCop: '',
  stock: '',
  photoSrc: '',
})
const product = ref(emptyProduct())

const emptyService = () => ({
  title: '',
  includesText: '',
  handoverText: '',
  turnaroundText: '',
  priceCop: '',
})
const service = ref(emptyService())

const orders = ref<readonly ServiceOrder[]>([])
const busy = ref<string | null>(null)

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

function whatsappHref(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  return `https://wa.me/${digits.length === 10 ? `57${digits}` : digits}`
}

async function publishProduct() {
  busy.value = 'product'
  const draft = product.value
  const result = await props.module.publishProduct(
    {
      title: draft.title.trim(),
      description: draft.description.trim(),
      kind: draft.kind,
      category: draft.category || undefined,
      priceCop: optionalCount(draft.priceCop),
      stock: optionalCount(draft.stock),
      photoSrc: draft.photoSrc.trim() || undefined,
    },
    props.clave,
  )
  busy.value = null
  if (!result.ok) {
    showToast(result.error.message || copy.productFail, 'bad')
    return
  }
  product.value = emptyProduct()
  showToast(copy.productOk, 'ok')
  emit('published')
}

async function publishService() {
  busy.value = 'service'
  const draft = service.value
  const result = await props.module.publishService(
    {
      title: draft.title.trim(),
      includesText: draft.includesText.trim(),
      handoverText: draft.handoverText.trim(),
      turnaroundText: draft.turnaroundText.trim(),
      priceCop: optionalCount(draft.priceCop),
    },
    props.clave,
  )
  busy.value = null
  if (!result.ok) {
    showToast(result.error.message || copy.serviceFail, 'bad')
    return
  }
  service.value = emptyService()
  showToast(copy.serviceOk, 'ok')
  emit('published')
}

async function loadOrders() {
  const result = await props.module.listOperatorOrders(props.clave)
  if (!result.ok) {
    showToast(result.error.message || copy.ordersLoadFail, 'bad')
    return
  }
  orders.value = result.value
}

onMounted(() => {
  void loadOrders()
})
</script>

<template>
  <div class="admin-stack">
    <section class="admin-card">
      <header class="admin-card__head">
        <h3>{{ copy.ordersTitle }}</h3>
        <p>{{ copy.ordersLead }}</p>
      </header>
      <p v-if="!orders.length" class="admin-empty">{{ copy.ordersEmpty }}</p>
      <ul v-else class="admin-list">
        <li v-for="order in orders" :key="order.id" class="admin-list__item">
          <div class="admin-list__main">
            <strong>{{ order.itemTitle }}<template v-if="order.size"> · {{ order.size }}</template></strong>
            <span class="admin-list__meta">
              {{ order.customerName }} · {{ order.customerWhatsapp }} · {{ copy.zoneLabels[order.deliveryZone] }} ·
              {{ order.createdAt }}
            </span>
            <div class="admin-list__chips">
              <Chip :tone="order.status === 'pendiente' ? 'abierto' : 'realizado'">
                {{ copy.statusLabels[order.status] }}
              </Chip>
              <Chip :tone="order.paid ? 'zona-ok' : 'lleno'">{{ order.paid ? copy.orderPaid : copy.orderUnpaid }}</Chip>
            </div>
          </div>
          <div class="admin-list__actions">
            <Button size="sm" variant="ghost" :href="whatsappHref(order.customerWhatsapp)" target="_blank">
              {{ copy.ordersWrite }}
            </Button>
          </div>
        </li>
      </ul>
    </section>

    <div class="admin-grid">
      <form class="admin-card" @submit.prevent="publishProduct">
        <header class="admin-card__head">
          <h3>{{ copy.productTitle }}</h3>
          <p>{{ copy.productLead }}</p>
        </header>
        <Field :label="copy.fieldTitle">
          <Input v-model="product.title" />
        </Field>
        <Field :label="copy.fieldDescription">
          <Textarea v-model="product.description" />
        </Field>
        <div class="admin-fields">
          <Select v-model="product.kind" :label="copy.fieldKind" :options="kindOptions" />
          <Select v-model="product.category" :label="copy.fieldCategory" :options="categoryOptions" />
        </div>
        <div class="admin-fields">
          <Field :label="copy.fieldPrice">
            <Input v-model="product.priceCop" inputmode="numeric" />
          </Field>
          <Field :label="copy.fieldStock">
            <Input v-model="product.stock" type="number" />
          </Field>
        </div>
        <Field :label="copy.fieldPhoto">
          <Input v-model="product.photoSrc" type="url" placeholder="https://" />
        </Field>
        <Button type="submit" size="sm" :disabled="busy === 'product'">{{ copy.productCta }}</Button>
      </form>

      <form class="admin-card" @submit.prevent="publishService">
        <header class="admin-card__head">
          <h3>{{ copy.serviceTitle }}</h3>
          <p>{{ copy.serviceLead }}</p>
        </header>
        <Field :label="copy.fieldServiceTitle">
          <Input v-model="service.title" />
        </Field>
        <Field :label="copy.fieldIncludes">
          <Textarea v-model="service.includesText" />
        </Field>
        <Field :label="copy.fieldHandover">
          <Input v-model="service.handoverText" />
        </Field>
        <div class="admin-fields">
          <Field :label="copy.fieldTurnaround">
            <Input v-model="service.turnaroundText" />
          </Field>
          <Field :label="copy.fieldPrice">
            <Input v-model="service.priceCop" inputmode="numeric" />
          </Field>
        </div>
        <Button type="submit" size="sm" :disabled="busy === 'service'">{{ copy.serviceCta }}</Button>
      </form>
    </div>
  </div>
</template>
