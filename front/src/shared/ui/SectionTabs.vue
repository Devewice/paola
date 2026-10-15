<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

defineProps<{
  label: string
  items: readonly { to: string; tag: string; label: string }[]
}>()

const route = useRoute()
const nav = ref<HTMLElement | null>(null)

/** En celular las pestañas se desplazan de lado: la activa queda a la vista. */
async function centerActive(): Promise<void> {
  await nextTick()
  const el = nav.value
  const active = el?.querySelector<HTMLElement>('.is-on')
  if (!el || !active || el.scrollWidth <= el.clientWidth) return
  el.scrollLeft = active.offsetLeft - (el.clientWidth - active.offsetWidth) / 2
}

onMounted(centerActive)
watch(() => route.path, centerActive)
</script>

<template>
  <nav ref="nav" class="section-tabs filter-pills filter-pills--scroll" :aria-label="label">
    <RouterLink
      v-for="item in items"
      :key="item.to"
      :to="item.to"
      class="filter-pill"
      active-class=""
      exact-active-class="is-on"
    >
      <span class="filter-pill__tag" aria-hidden="true">{{ item.tag }}</span>
      {{ item.label }}
    </RouterLink>
  </nav>
</template>
