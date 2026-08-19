<script setup lang="ts">
import AppLink from '@ui/AppLink.vue'

defineProps<{
  columns: readonly {
    title: string
    links: readonly { label: string; href?: string; to?: string }[]
  }[]
}>()
</script>

<template>
  <div class="mega-footer">
    <div v-for="col in columns" :key="col.title">
      <h5>{{ col.title }}</h5>
      <ul>
        <li v-for="link in col.links" :key="link.label">
          <AppLink :to="link.to" :href="link.href">{{ link.label }}</AppLink>
        </li>
      </ul>
    </div>
  </div>
</template>
