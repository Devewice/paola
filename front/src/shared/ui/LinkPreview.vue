<script setup lang="ts">
defineProps<{
  href?: string
  title?: string
  meta?: string
}>()
</script>

<template>
  <a class="link-preview" :href="href ?? '#comunidad'">
    <strong>{{ title ?? 'Memoria Anapoima' }}</strong>{{ meta ?? '84 km · paola.biker/…' }}
  </a>
</template>
