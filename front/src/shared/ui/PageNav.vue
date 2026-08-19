<script setup lang="ts">
defineProps<{
  modelValue: number
  pages: number
}>()

const emit = defineEmits<{ 'update:modelValue': [value: number] }>()
</script>

<template>
  <div class="pager">
    <button type="button" :disabled="modelValue <= 1" @click="emit('update:modelValue', modelValue - 1)">‹</button>
    <button
      v-for="page in pages"
      :key="page"
      type="button"
      :class="{ 'is-on': modelValue === page }"
      @click="emit('update:modelValue', page)"
    >{{ page }}</button>
    <button type="button" :disabled="modelValue >= pages" @click="emit('update:modelValue', modelValue + 1)">›</button>
  </div>
</template>
