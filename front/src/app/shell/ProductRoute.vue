<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { getAppDependencies, refreshInventory } from '@app/bootstrap.ts'
import ProductView from '@modules/shop/presentation/ProductView.vue'

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

const productId = computed(() => {
  const id = route.params.id
  return Array.isArray(id) ? (id[0] ?? '') : String(id ?? '')
})
</script>

<template>
  <ProductView :module="module" :product-id="productId" />
</template>
