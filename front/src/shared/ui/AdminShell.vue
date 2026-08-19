<script setup lang="ts">
defineProps<{
  bar?: string
  rows: readonly { id: string; title: string; meta?: string; actions?: boolean }[]
}>()
</script>

<template>
  <div class="admin-shell">
    <div v-if="bar" class="admin-shell__bar">{{ bar }}</div>
    <div v-for="row in rows" :key="row.id" class="admin-row">
      <div>
        <strong>{{ row.title }}</strong>
        <p v-if="row.meta" class="meta" style="margin:2px 0 0">{{ row.meta }}</p>
      </div>
      <div v-if="row.actions !== false" class="admin-row__actions">
        <slot :name="row.id" />
      </div>
    </div>
  </div>
</template>
