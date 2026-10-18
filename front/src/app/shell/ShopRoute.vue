<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getAppDependencies, inventoryVersion, refreshInventory } from '@app/bootstrap.ts'
import { useAdminEdit } from '@app/shell/adminMode.ts'
import { SHOP_SHELF_QUERY } from '@shared/http/constants.ts'
import ShopView from '@modules/shop/presentation/ShopView.vue'

const route = useRoute()
const { claveFor } = useAdminEdit()

onMounted(async () => {
  await refreshInventory()
})

const module = computed(() => {
  void inventoryVersion.value
  return getAppDependencies().shop
})

const shelf = computed(() => {
  const raw = route.query[SHOP_SHELF_QUERY]
  return typeof raw === 'string' ? raw : undefined
})
</script>

<template>
  <ShopView :module="module" :initial-shelf="shelf" :edit-clave="claveFor('tienda')" @changed="refreshInventory" />
</template>
