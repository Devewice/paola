<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { getAppDependencies, refreshInventory } from '@app/bootstrap.ts'
import ServiceView from '@modules/shop/presentation/ServiceView.vue'

const route = useRoute()
const stamp = ref(0)

onMounted(async () => {
  await refreshInventory()
  stamp.value += 1
})

const module = computed(() => {
  stamp.value
  return getAppDependencies().shop
})

const serviceId = computed(() => String(route.params.id ?? ''))
</script>

<template>
  <ServiceView :module="module" :service-id="serviceId" />
</template>
