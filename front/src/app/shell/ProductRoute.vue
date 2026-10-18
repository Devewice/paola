<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getAppDependencies, inventoryVersion, refreshInventory } from '@app/bootstrap.ts'
import { useAdminEdit } from '@app/shell/adminMode.ts'
import ProductView from '@modules/shop/presentation/ProductView.vue'

const route = useRoute()
const { claveFor } = useAdminEdit()

onMounted(async () => {
  await refreshInventory()
})

const module = computed(() => {
  void inventoryVersion.value
  return getAppDependencies().shop
})

const productId = computed(() => {
  const id = route.params.id
  return Array.isArray(id) ? (id[0] ?? '') : String(id ?? '')
})
</script>

<template>
  <ProductView :module="module" :product-id="productId" :edit-clave="claveFor('tienda')" @changed="refreshInventory" />
</template>
