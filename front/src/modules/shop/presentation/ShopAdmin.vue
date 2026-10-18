<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import type { ShopModule } from '@modules/shop/composition.ts'
import { SHOP_ADMIN_COPY, SHOP_KIND } from '@modules/shop/constants/copy.ts'
import type { ServiceOrder } from '@modules/shop/domain/entities/ServiceOrder.ts'
import { formatProductPrice } from '@modules/shop/presentation/formatPrice.ts'
import MysteryDeckAdmin from '@modules/shop/presentation/MysteryDeckAdmin.vue'
import ProductForm from '@modules/shop/presentation/ProductForm.vue'
import ServiceForm from '@modules/shop/presentation/ServiceForm.vue'
import ShopItemTools from '@modules/shop/presentation/ShopItemTools.vue'
import AdminDrawer from '@ui/AdminDrawer.vue'
import AdminPane from '@ui/AdminPane.vue'
import Button from '@ui/Button.vue'
import Chip from '@ui/Chip.vue'
import FilterPills from '@ui/FilterPills.vue'
import { showToast } from '@ui/toast.ts'

const props = defineProps<{
  module: ShopModule
  clave: string
  /** `producto` o `lavado`: abre ese formulario al entrar. */
  create?: string
  stamp?: number
}>()

const emit = defineEmits<{ published: [] }>()

const copy = SHOP_ADMIN_COPY

function tabFor(create?: string): string {
  if (create === 'producto') return 'productos'
  if (create === 'lavado') return 'lavados'
  return 'pedidos'
}

const tab = ref(tabFor(props.create))
const productOpen = ref(props.create === 'producto')
const serviceOpen = ref(props.create === 'lavado')

watch(
  () => props.create,
  (value) => {
    if (!value) return
    tab.value = tabFor(value)
    productOpen.value = value === 'producto'
    serviceOpen.value = value === 'lavado'
  },
)

const orders = ref<readonly ServiceOrder[]>([])

const products = computed(() => {
  void props.stamp
  const shelves = props.module.getShelves()
  return [...shelves.own, ...shelves.collab]
})
const services = computed(() => {
  void props.stamp
  return props.module.getServices().items
})

const tabs = computed(() => [
  { id: 'pedidos', label: `${copy.tabOrders} · ${orders.value.length}` },
  { id: 'productos', label: `${copy.tabProducts} · ${products.value.length}` },
  { id: 'lavados', label: `${copy.tabServices} · ${services.value.length}` },
  { id: 'mazo', label: copy.tabMystery },
])

function whatsappHref(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  return `https://wa.me/${digits.length === 10 ? `57${digits}` : digits}`
}

async function loadOrders() {
  const result = await props.module.listOperatorOrders(props.clave)
  if (!result.ok) {
    showToast(result.error.message || copy.ordersLoadFail, 'bad')
    return
  }
  orders.value = result.value
}

function onProductSaved() {
  productOpen.value = false
  emit('published')
}

function onServiceSaved() {
  serviceOpen.value = false
  emit('published')
}

onMounted(() => {
  void loadOrders()
})
</script>

<template>
  <div class="admin-stack">
    <FilterPills v-model="tab" :pills="tabs" />

    <AdminPane v-if="tab === 'pedidos'" :title="copy.ordersTitle" :lead="copy.ordersLead" :count="orders.length">
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
    </AdminPane>

    <AdminPane
      v-else-if="tab === 'productos'"
      :title="copy.productsTitle"
      :lead="copy.productsLead"
      :count="products.length"
    >
      <template #actions>
        <Button size="sm" @click="productOpen = true">+ {{ copy.newProduct }}</Button>
      </template>
      <p v-if="!products.length" class="admin-empty">{{ copy.productsEmpty }}</p>
      <ul v-else class="admin-list">
        <li v-for="item in products" :key="item.id" class="admin-list__item admin-list__item--compact">
          <img v-if="item.photoSrc" class="admin-list__thumb" :src="item.photoSrc" :alt="item.title" />
          <div class="admin-list__main">
            <strong>{{ item.title }}</strong>
            <span class="admin-list__meta">
              {{ formatProductPrice(item.priceCop) }}
              <template v-if="item.stock !== null"> · {{ copy.stockLabel(item.stock) }}</template>
            </span>
            <div class="admin-list__chips">
              <Chip :tone="item.kind === SHOP_KIND.OWN ? 'abierto' : 'cerrado'">
                {{ item.kind === SHOP_KIND.OWN ? copy.kindOwn : copy.kindCollab }}
              </Chip>
            </div>
          </div>
          <ShopItemTools :module="module" :clave="clave" :product="item" @changed="emit('published')" />
        </li>
      </ul>
    </AdminPane>

    <AdminPane
      v-else-if="tab === 'lavados'"
      :title="copy.servicesTitle"
      :lead="copy.servicesLead"
      :count="services.length"
    >
      <template #actions>
        <Button size="sm" @click="serviceOpen = true">+ {{ copy.newService }}</Button>
      </template>
      <p v-if="!services.length" class="admin-empty">{{ copy.servicesEmpty }}</p>
      <ul v-else class="admin-list">
        <li v-for="item in services" :key="item.id" class="admin-list__item admin-list__item--compact">
          <div class="admin-list__main">
            <strong>{{ item.title }}</strong>
            <span class="admin-list__meta">
              {{ formatProductPrice(item.priceCop) }} · {{ item.turnaroundText }}
            </span>
          </div>
          <ShopItemTools :module="module" :clave="clave" :service="item" @changed="emit('published')" />
        </li>
      </ul>
    </AdminPane>

    <div v-else class="operar-page__section--narrow">
      <MysteryDeckAdmin :module="module" :clave="clave" />
    </div>

    <AdminDrawer v-model="productOpen" :title="copy.productTitle" :lead="copy.productLead">
      <ProductForm :module="module" :clave="clave" @saved="onProductSaved" @cancel="productOpen = false" />
    </AdminDrawer>
    <AdminDrawer v-model="serviceOpen" :title="copy.serviceTitle" :lead="copy.serviceLead">
      <ServiceForm :module="module" :clave="clave" @saved="onServiceSaved" @cancel="serviceOpen = false" />
    </AdminDrawer>
  </div>
</template>
