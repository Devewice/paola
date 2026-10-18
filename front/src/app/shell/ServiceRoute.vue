<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getAppDependencies, inventoryVersion, refreshInventory } from '@app/bootstrap.ts'
import { useAdminEdit } from '@app/shell/adminMode.ts'
import ServiceView from '@modules/shop/presentation/ServiceView.vue'

const route = useRoute()
const { claveFor } = useAdminEdit()

onMounted(async () => {
  await refreshInventory()
})

const module = computed(() => {
  void inventoryVersion.value
  return getAppDependencies().shop
})

const serviceId = computed(() => {
  const id = route.params.id
  return Array.isArray(id) ? (id[0] ?? '') : String(id ?? '')
})
</script>

<template>
  <ServiceView :module="module" :service-id="serviceId" :edit-clave="claveFor('tienda')" @changed="refreshInventory" />
</template>
