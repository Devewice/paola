<script setup lang="ts">
defineProps<{
  columns: readonly { title: string; links: readonly { label: string; href: string }[] }[]
}>()
</script>

<template>
  <div class="mega-footer">
    <div v-for="col in columns" :key="col.title">
      <h5>{{ col.title }}</h5>
      <ul>
        <li v-for="link in col.links" :key="link.label"><a :href="link.href">{{ link.label }}</a></li>
      </ul>
    </div>
  </div>
</template>
