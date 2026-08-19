<script setup lang="ts">
defineProps<{
  tags: readonly string[]
}>()

const emit = defineEmits<{
  remove: [tag: string]
}>()
</script>

<template>
  <div class="tag-cloud">
    <span v-for="tag in tags" :key="tag" class="tag">
      {{ tag }}
      <button type="button" aria-label="Quitar" @click="emit('remove', tag)">×</button>
    </span>
  </div>
</template>
