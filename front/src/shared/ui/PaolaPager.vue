<script setup lang="ts">
defineProps<{
  modelValue: number
  pages: number
}>()

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()
</script>

<template>
  <nav class="paola-pager" aria-label="Páginas">
    <button
      v-for="page in pages"
      :key="page"
      type="button"
      :class="{ 'is-on': modelValue === page }"
      @click="emit('update:modelValue', page)"
    >
      {{ page }}
    </button>
  </nav>
</template>
