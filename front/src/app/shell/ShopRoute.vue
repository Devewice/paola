<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { getAppDependencies, refreshInventory } from '@app/bootstrap.ts'
import ShopView from '@modules/shop/presentation/ShopView.vue'

const stamp = ref(0)

onMounted(async () => {
  await refreshInventory()
  stamp.value += 1
})

const module = computed(() => {
  stamp.value
  return getAppDependencies().shop
})
</script>

<template>
  <ShopView :module="module" />
</template>
