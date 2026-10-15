<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { getAppDependencies, refreshInventory } from '@app/bootstrap.ts'
import { SHOP_SHELF_QUERY } from '@shared/http/constants.ts'
import ShopView from '@modules/shop/presentation/ShopView.vue'

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

const shelf = computed(() => {
  const raw = route.query[SHOP_SHELF_QUERY]
  return typeof raw === 'string' ? raw : undefined
})
</script>

<template>
  <ShopView :module="module" :initial-shelf="shelf" />
</template>
