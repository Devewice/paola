<script setup lang="ts">
import { ref } from 'vue'
import type { ShopModule } from '@modules/shop/composition.ts'
import { SHOP_ADMIN_COPY } from '@modules/shop/constants/copy.ts'
import type { Product } from '@modules/shop/domain/entities/Product.ts'
import type { ShopService } from '@modules/shop/domain/entities/ShopService.ts'
import ProductForm from '@modules/shop/presentation/ProductForm.vue'
import ServiceForm from '@modules/shop/presentation/ServiceForm.vue'
import AdminDrawer from '@ui/AdminDrawer.vue'
import AdminItemTools from '@ui/AdminItemTools.vue'
import { showToast } from '@ui/toast.ts'

/** Editar o borrar un producto o un lavado desde donde se vea. */
const props = defineProps<{
  module: ShopModule
  clave: string
  product?: Product
  service?: ShopService
}>()

const emit = defineEmits<{ changed: [] }>()

const copy = SHOP_ADMIN_COPY
const open = ref(false)
const busy = ref(false)

async function remove() {
  busy.value = true
  const result = props.product
    ? await props.module.removeProduct(props.product.id, props.clave)
    : props.service
      ? await props.module.removeService(props.service.id, props.clave)
      : null
  busy.value = false
  if (!result) return
  if (!result.ok) {
    showToast(result.error.message || (props.product ? copy.productRemoveFail : copy.serviceRemoveFail), 'bad')
    return
  }
  showToast(props.product ? copy.productRemoved : copy.serviceRemoved, 'ok')
  emit('changed')
}

function onSaved() {
  open.value = false
  emit('changed')
}
</script>

<template>
  <AdminItemTools
    :edit-label="copy.edit"
    :remove-label="copy.remove"
    :confirm-label="copy.removeConfirm"
    :busy="busy"
    @edit="open = true"
    @remove="remove"
  />
  <AdminDrawer v-model="open" :title="product ? copy.editProductTitle : copy.editServiceTitle">
    <ProductForm
      v-if="product"
      :module="module"
      :clave="clave"
      :product="product"
      @saved="onSaved"
      @cancel="open = false"
    />
    <ServiceForm
      v-else-if="service"
      :module="module"
      :clave="clave"
      :service="service"
      @saved="onSaved"
      @cancel="open = false"
    />
  </AdminDrawer>
</template>
