<script setup lang="ts">
defineProps<{
  count?: number
  sortModel?: string
}>()

defineEmits<{
  'update:sortModel': [value: string]
}>()
</script>

<template>
  <div class="comment-toolbar">
    <span><strong>{{ count ?? 6 }}</strong> comentarios · moderación del parche</span>
    <div class="comment-sort">
      <button type="button" :class="{ 'is-on': sortModel === 'recientes' }" @click="$emit('update:sortModel', 'recientes')">Recientes</button>
      <button type="button" :class="{ 'is-on': sortModel === 'utiles' }" @click="$emit('update:sortModel', 'utiles')">Útiles</button>
    </div>
  </div>
</template>
