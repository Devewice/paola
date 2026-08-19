<script setup lang="ts">
defineProps<{
  modelValue: string
  pills: readonly { id: string; label: string }[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <div class="filter-pills" role="group">
    <button
      v-for="pill in pills"
      :key="pill.id"
      type="button"
      class="filter-pill"
      :class="{ 'is-on': modelValue === pill.id }"
      @click="emit('update:modelValue', pill.id)"
    >
      {{ pill.label }}
    </button>
  </div>
</template>
